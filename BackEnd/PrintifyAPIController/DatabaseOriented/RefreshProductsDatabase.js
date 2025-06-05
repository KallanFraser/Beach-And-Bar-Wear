/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import axios from "axios";
import { pool } from "../../Database/Database.js";

/*---------------------------------------------------------------------------------------------
                                    Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;
const BASE_URL = "https://api.printify.com/v1";
const IMAGES_DIR = path.resolve(process.cwd(), "public/images");

if (!PRINTIFY_TOKEN || !SHOP_ID) {
	console.error("⚠️ Missing PRINTIFY_TOKEN or PRINTIFY_SHOP_ID");
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
	if (!Array.isArray(data)) return [];

	const allowedSizes = new Set(["S", "M", "L", "XL"]);
	return data.map(({ id, title, variants = [], images = [], visible }) => {
		const filteredVariants = variants
			.filter((v) => v.is_enabled)
			.map((v) => {
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

		const enabledVariantIds = new Set(filteredVariants.map((v) => v.variant_ID));
		const matchedImages = images
			.filter((img) => img.variant_ids.some((vid) => enabledVariantIds.has(vid)))
			.map((img) => {
				const is_selected = /[?&]camera_label=(?:front|back)(?=$|&)/.test(img.src);
				const is_back = /[?&]camera_label=back(?=$|&)/.test(img.src);
				return { src: img.src, is_selected, is_back };
			});

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
const downloadAndSaveImage = async (imageURL, productId, index) => {
	try {
		const { data } = await axios.get(imageURL, { responseType: "arraybuffer" });
		const ext = path.extname(new URL(imageURL).pathname).split("?")[0] || ".jpg";
		const filename = `${productId}_${index}${ext}`;
		const filepath = path.join(IMAGES_DIR, filename);

		fs.writeFileSync(filepath, Buffer.from(data));
		return `/images/${filename}`;
	} catch (error) {
		console.error("Error downloading/saving image:", imageURL, error.message);
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
          is_visible   = EXCLUDED.is_visible;`,
			[id, title, visible]
		);

		/* --- variants ----------------------------------------------------------- */
		if (variants.length) {
			const variantValues = [];
			const params = [];
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

		/* --- images: download locally & insert path ---------------------------- */
		for (let i = 0; i < images.length; i++) {
			const { src: imgURL, is_selected, is_back } = images[i];
			const imagePath = await downloadAndSaveImage(imgURL, id, i);
			if (!imagePath) continue;

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
