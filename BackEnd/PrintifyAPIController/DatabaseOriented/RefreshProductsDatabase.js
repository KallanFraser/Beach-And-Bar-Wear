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
import { pool } from "../../Database/Database.js";

/*---------------------------------------------------------------------------------------------
									Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;
const BASE_URL = "https://api.printify.com/v1";

if (!PRINTIFY_TOKEN || !SHOP_ID) {
	console.error("⚠️⚠️⚠️ Missing PRINTIFY_TOKEN or PRINTIFY_SHOP_ID in .env");
}

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
		//Fetching our product data from the shopify API
		const { data } = await ShopifyAPI.get(`/shops/${SHOP_ID}/products.json`);

		//Extract each products data from the returned json file
		const parsedProducts = parseAndUpdateEssentialProductData(data.data);

		//For each product, update or insert into the database
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

	//These are the sizes we offer so only inserting these sizes
	const allowedSizes = new Set(["S", "M", "L", "XL"]);

	return data.map(({ id, title, variants = [], images = [], visible }) => {
		// Collect only enabled variants
		// Project each variant into a object
		const filteredVariants = variants
			.filter((v) => v.is_enabled)
			.map((v) => {
				//Uses regexs to get "S" "M" "L" "XL"
				const variantTitle = extractSize(v.title);

				return {
					variant_sku: v.sku,
					variant_ID: v.id,
					variant_price: v.price / 100,
					variant_cost: v.cost / 100,
					variant_title: variantTitle,
					variant_availability: Boolean(v.is_available),
				};
			})
			.filter((v) => allowedSizes.has(v.variant_title));

		// For each enabled variant, create a set for them
		const enabledVariantIds = new Set(filteredVariants.map((v) => v.variant_ID));

		// Pick images tied to at least one enabled variant
		const matchedImages = images
			.filter((img) => img.variant_ids.some((vid) => enabledVariantIds.has(vid)))
			.map((img) => img.src);

		//console.log(`[Product] id= ${id} title= "${title}" amount of variants= ${filteredVariants.length} amount of images= ${matchedImages.length}`);

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
			`INSERT INTO products (product_id, product_title, is_visible, featured)
			 VALUES ($1, $2, $3, false)
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
			//instead of inserting one variant at a time
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

/*---------------------------------------------------------------------------------------------
                             Helpers
----------------------------------------------------------------------------------------------*/
/**
 * Look for a size token in the string and return it;
 * if none is found, fall back to returning the original title.
 */
function extractSize(title) {
	// Match longest tokens first
	const sizePattern = /\b(?:5XL|4XL|3XL|2XL|XL|XS|L|M|S)\b/;
	const match = title.match(sizePattern);
	return match ? match[0] : title;
}

export { refreshProductsDatabase };
