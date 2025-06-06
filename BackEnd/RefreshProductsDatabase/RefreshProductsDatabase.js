/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
import dotenv from "dotenv"; //imports environment variables
dotenv.config(); //loads the variables into this process's .env

import fs from "fs"; //Node.js' in built file system module (for saving images)
import path from "path"; //Handles file paths safely across OS's
import axios from "axios"; //For better HTTP requests (to printify)
import { pool } from "../Database/Database.js"; //Postgres DB connection pool

/*---------------------------------------------------------------------------------------------
                                    Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken; //Our secret key
const SHOP_ID = process.env.printifyShopID; //Unique to our shop within printify
const BASE_URL = "https://api.printify.com/v1"; //To printifys api
const IMAGES_DIR = path.resolve(process.cwd(), "public/images"); //For where we save our product images

//Just a nice debugging tool for devs to let us know if they forgot one of the environment variables
if (!PRINTIFY_TOKEN || !SHOP_ID) {
	console.error("⚠️ Missing PRINTIFY_TOKEN or PRINTIFY_SHOP_ID");
}

//Preconfigures the headers for axios for when it makes an API call to printify
//It is setup for what printify API expects us to send in the headers
const ShopifyAPI = axios.create({
	baseURL: BASE_URL,
	headers: {
		Authorization: `Bearer ${PRINTIFY_TOKEN}`,
		"Content-Type": "application/json",
	},
});

/*---------------------------------------------------------------------------------------------
                                  Main Function
----------------------------------------------------------------------------------------------*/
const refreshProductsDatabase = async () => {
	try {
		//Fetches all our product data which comes back in a json file
		const { data } = await ShopifyAPI.get(`/shops/${SHOP_ID}/products.json`);

		//Parses each products data into a nice organized array of objects
		const parsedProducts = parseAndUpdateEssentialProductData(data.data);

		//For each product data in said object, inserts or updates it in the DB
		for (const product of parsedProducts) {
			await upsertProductIntoDatabase(product);
		}
	} catch (error) {
		console.error("Printify fetch error:", error.response?.data || error.message);
	}
};

/*---------------------------------------------------------------------------------------------
                              Parsing Function
----------------------------------------------------------------------------------------------*/
function parseAndUpdateEssentialProductData(data) {
	//Ensures that it is of the data type array
	if (!Array.isArray(data)) {
		console.warn("Fetched Data For Products JSON File does not contain array for us to parse!");
		return [];
	}

	//Each Product Should only have had the S M L XL sizes set but some dont by accident
	//Since these are the only sizes we sell we ensure we only store these sizes in our database
	const allowedSizes = new Set(["S", "M", "L", "XL"]);

	//id, title, variants, images, and visible are all fields in each products array of info
	return data.map(({ id, title, variants = [], images = [], visible }) => {
		const filteredVariants = variants
			.filter((v) => v.is_enabled) //Ensures that it is enabled in the store
			.map((v) => {
				//for each varient of a product (S, M, L, XL and various colors)
				const variantTitle = extractSize(v.title); //Extract its title (Black - Small ==> S)
				//SKU = a variants unique ID (primary key)
				//variant_ID = relative to the product itself (not a primary key)
				return {
					variant_sku: v.sku,
					variant_ID: v.id,
					variant_price: v.price / 100,
					variant_cost: v.cost / 100,
					variant_title: variantTitle,
					variant_availability: Boolean(v.is_available),
				};
			})
			.filter((v) => allowedSizes.has(v.variant_title)); //Ensures we only extract the sizes we want

		//enabled variant ids = the colors & size variants of said product we are selling
		//i.e only doing the white color of a t shirt and from S to XL not the green L for instance
		const enabledVariantIds = new Set(filteredVariants.map((v) => v.variant_ID));

		//Getting a refernece to the images for which we have enabled variants for
		//No point getting images of products we are not selling
		const matchedImages = images
			.filter((img) => img.variant_ids.some((vid) => enabledVariantIds.has(vid)))
			.map((img) => {
				//we only want the front and back no model included images
				//therefore applying this regular expression to find just those images
				const is_selected = /[?&]camera_label=(?:front|back)(?=$|&)/.test(img.src);
				//using another regeular expression to separate the back image from the front
				const is_back = /[?&]camera_label=back(?=$|&)/.test(img.src);
				//img src because the raw data for the image needs to be pulled from another API endpoint
				return { src: img.src, is_selected, is_back };
			});

		//id = the products ID
		//title = its name, i.e Beach And Bar Wear - Oversized Black T-shirt - pattern xyz
		//visible = is it enabled in the store?
		//variants = its sizes and colors
		//images = the image urls not the raw data
		return {
			id,
			title,
			visible,
			variants: filteredVariants,
			images: matchedImages,
		};
	});
}

/*---------------------------------------------------------------------------------------------
                              Download & Save Image
----------------------------------------------------------------------------------------------*/
//Since the raw data for each image is stored else where but we have its URL we need a function
//to to download the raw data for each image
const downloadAndSaveImage = async (imageURL, productId, index) => {
	try {
		//downloads the image using the URL and store it into an array buffer
		const { data } = await axios.get(imageURL, { responseType: "arraybuffer" });
		//creating the extension name for the image (.jpg)
		const ext = path.extname(new URL(imageURL).pathname).split("?")[0] || ".jpg";
		//creating the filename
		const filename = `${productId}_${index}${ext}`;
		//getting a direct absolute path to the image directory
		const filepath = path.join(IMAGES_DIR, filename);

		//writing the image straight to the directory (will overwrite previous)
		fs.writeFileSync(filepath, Buffer.from(data));
		return `/images/${filename}`;
	} catch (error) {
		console.error("Error downloading/saving image:", imageURL, error.message);
		return null;
	}
};

/*---------------------------------------------------------------------------------------------
                  Upsert Product, Variants, and Images into Postgres DB
----------------------------------------------------------------------------------------------*/
const upsertProductIntoDatabase = async (product) => {
	//destructs the product object into its children
	const { id, title, visible, variants, images } = product;
	//awaiting creating a connection to our database
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		//product table insert --------------------------------------------------------
		await client.query(
			`INSERT INTO products (product_id, product_title, is_visible, featured)
        	VALUES ($1, $2, $3, false)
        	ON CONFLICT (product_id)
        	DO UPDATE SET
         	product_title = EXCLUDED.product_title,
          	is_visible   = EXCLUDED.is_visible;`,
			[id, title, visible]
		);

		//variant for each product insert --------------------------------------------
		if (variants.length) {
			const variantValues = [];
			const params = [];

			//essentially an easier way to insert
			//we gather all 7 parts for each variant and batch insert it
			//Instead inserting each piece one by one (inefficient)
			variants.forEach((v, idx) => {
				const base = idx * 7;
				variantValues.push(
					`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${
						base + 7
					})`
				);
				params.push(
					v.variant_ID,
					id,
					v.variant_sku,
					v.variant_price,
					v.variant_cost,
					v.variant_title,
					v.variant_availability
				);
			});

			//The actual insert into the DB for each variant
			await client.query(
				`INSERT INTO product_variants
          		(variant_id, product_id, variant_sku, variant_price, variant_cost, variant_title, in_stock)
          		VALUES ${variantValues.join(",")}
         		ON CONFLICT (variant_id, product_id)
          		DO UPDATE SET
           	 	variant_price  = EXCLUDED.variant_price,
           		variant_cost   = EXCLUDED.variant_cost,
           		variant_title  = EXCLUDED.variant_title,
            	in_stock       = EXCLUDED.in_stock;`,
				params
			);
		}

		// image inserts ----------------------------------------------------------
		for (let i = 0; i < images.length; i++) {
			//destructures the image object into its URL source and other two keys
			const { src: imgURL, is_selected, is_back } = images[i];

			//Downloads the image and saves it to /public/images on the BackEnd
			const imagePath = await downloadAndSaveImage(imgURL, id, i);

			//Safety check before DB insert
			if (!imagePath) continue;

			//DB Insert to link a product to its images & if it is selected & back piece
			//Is selected = only the front and back photos with no model
			await client.query(
				`INSERT INTO product_images
          		(product_id, image_path, is_selected, is_back)
         		VALUES ($1, $2, $3, $4)
        		ON CONFLICT (product_id, image_path)
         		DO UPDATE SET
          		is_selected = EXCLUDED.is_selected,
          		is_back     = EXCLUDED.is_back;`,
				[id, imagePath, is_selected, is_back]
			);
		}

		await client.query("COMMIT");

		console.log("Upsert successful for product:", title);
	} catch (err) {
		await client.query("ROLLBACK");
		console.error(`DB upsert failed for product ${id}:`, err.message);
	} finally {
		client.release();
	}
};

/*---------------------------------------------------------------------------------------------
                             Helpers
----------------------------------------------------------------------------------------------*/
function extractSize(title) {
	const sizePattern = /\b(?:5XL|4XL|3XL|2XL|XL|XS|L|M|S)\b/;
	const match = title.match(sizePattern);
	return match ? match[0] : title;
}

export { refreshProductsDatabase };
