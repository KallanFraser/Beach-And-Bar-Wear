/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//ENV imports
import dotenv from "dotenv";
dotenv.config();

//Library imports
import axios from "axios";

//Database imports
import { pool } from "../Database/Database.js";

/*---------------------------------------------------------------------------------------------
									Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;
const BASE_URL = "https://api.printify.com/v1";

if (!PRINTIFY_TOKEN || !SHOP_ID) {
	console.error("⚠️ Missing PRINTIFY_TOKEN or PRINTIFY_SHOP_ID in .env");
}

/*---------------------------------------------------------------------------------------------
                            Printify Axios Instance & Endpoints
----------------------------------------------------------------------------------------------*/
const ShopifyAPI = axios.create({
	baseURL: BASE_URL,
	headers: {
		Authorization: `Bearer ${PRINTIFY_TOKEN}`,
		"Content-Type": "application/json",
	},
});

const updateProductData = async () => {
	try {
		const { data } = await ShopifyAPI.get(`/shops/${SHOP_ID}/products.json`);

		const parsedProducts = parseAndUpdateEssentialProductData(data.data);

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
	if (!Array.isArray(data)) {
		console.error("Invalid input: expected an array of product objects.");
		return [];
	}

	return data.map(({ id, title, variants = [], images = [], visible }) => {
		// 1. Collect only enabled variants, and project into objects
		//filter =  returns a new array with only elements that test true.
		//no side effects = does not modify the original array.
		//so it will not accidentally fuck with the original array.
		//map = returns a new array of the SAME LENGTH but each element is modified.
		//will only pick out the fields mentioned below.
		const filteredVariants = variants
			.filter((v) => v.is_enabled)
			.map((v) => ({
				variant_sku: v.sku,
				variant_ID: v.id,
				variant_price: v.price / 100,
				variant_cost: v.cost / 100,
				variant_title: v.title,
				variant_availability: v.is_available ? true : false,
			}));

		// 2. Build a Set of those enabled variant IDs for image checks
		const enabledVariantIds = new Set(filteredVariants.map((v) => v.variant_ID));

		// 3. Pick only images tied to at least one enabled variant
		const matchedImages = images
			.filter((img) => img.variant_ids.some((vid) => enabledVariantIds.has(vid)))
			.map((img) => img.src);

		// 4. (Optional) Single consolidated log per product
		//console.log(`[Product] id= ${id} title= "${title}" amount of variants= ${filteredVariants.length} amount of images= ${matchedImages.length}`);

		//returns the following as an object:
		//product_id
		//product_title
		//is_visible
		//variants
		//	variant_id
		//	variant_sku
		//	variant_price
		//	variant_cost
		//	variant_title
		//	in_stock
		//images
		//	image_src

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
								Download Image Function
----------------------------------------------------------------------------------------------*/
const downloadImage = async (imageURL) => {
	try {
		const { data } = await axios.get(imageURL, { responseType: "arraybuffer" });
		return Buffer.from(data);
	} catch (error) {
		console.error("Error downloading image:", imageURL, error.message);
		return null;
	}
};

/*---------------------------------------------------------------------------------------------
                  Upsert Product, Variants, and Images into Postgres
----------------------------------------------------------------------------------------------*/
const upsertProductIntoDatabase = async (product) => {
	const { id, title, visible, variants, images } = product;

	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		/* --- products ----------------------------------------------------------- */
		await client.query(
			`INSERT INTO products (product_id, product_title, is_visible)
		 	VALUES ($1, $2, $3)
		 	ON CONFLICT (product_id)
		 	DO UPDATE SET
			product_title = EXCLUDED.product_title,
			is_visible = EXCLUDED.is_visible;`,
			[id, title, visible]
		);

		/* --- variants ----------------------------------------------------------- */
		// build bulk VALUES list
		const variantValues = [];
		const params = [];
		variants.forEach((v, idx) => {
			//builds parameter placeholders for a bulk insert
			//instead of inserting variant at a time
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

		if (variantValues.length) {
			await client.query(
				`INSERT INTO product_variants
				(variant_id, product_id, variant_sku, variant_price, variant_cost, variant_title, in_stock)
				VALUES ${variantValues.join(",")}
				ON CONFLICT (variant_id, product_id)
				DO UPDATE SET
				variant_price = EXCLUDED.variant_price,
				variant_cost  = EXCLUDED.variant_cost,
				variant_title = EXCLUDED.variant_title,
				in_stock      = EXCLUDED.in_stock;`,
				params
			);
		}

		/* --- images ------------------------------------------------------------- */
		// download & insert each image
		for (const imgURL of images) {
			const bytes = await downloadImage(imgURL);
			if (!bytes) continue;

			await client.query(
				`INSERT INTO product_images (product_id, image_src)
		   		VALUES ($1, $2)
		   		ON CONFLICT DO NOTHING;`,
				[id, bytes]
			);
		}

		await client.query("COMMIT");
		console.log("Successful Insert / Update for: ", title);
	} catch (err) {
		await client.query("ROLLBACK");
		console.error(`DB upsert failed for product ${id}:`, err.message);
	} finally {
		client.release();
	}
};

export { updateProductData };
