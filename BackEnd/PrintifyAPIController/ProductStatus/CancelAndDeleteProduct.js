/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
// ENV imports
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

import { pool } from "../../Database/Database.js"; // <-- make sure this points to where you export your `pool` instance

/*---------------------------------------------------------------------------------------------
                                    Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;
const BASE_URL = "https://api.printify.com/v1";

if (!PRINTIFY_TOKEN || !SHOP_ID) {
	console.error("⚠️ Missing PRINTIFY_TOKEN or PRINTIFY_SHOP_ID in .env");
}

const ShopifyAPI = axios.create({
	baseURL: BASE_URL,
	headers: {
		Authorization: `Bearer ${PRINTIFY_TOKEN}`,
		"Content-Type": "application/json",
	},
});

/*---------------------------------------------------------------------------------------------
                                    Delete Product Function
----------------------------------------------------------------------------------------------*/

// NOTE: Now also removes the product row from Postgres (and cascades to related tables)
export const cancelAndDeleteProduct = async (productId, reason = "Cancelled by user") => {
	if (!productId) {
		throw new Error("productId is required to cancel and delete a product");
	}

	try {
		// 1. Mark publish as failed (unlocks it)
		console.log(`🔄 cancelling publish for ${productId}…`);
		await ShopifyAPI.post(
			`/shops/${SHOP_ID}/products/${productId}/publishing_failed.json`,
			{ reason },
			{ headers: { "User-Agent": "MyNodeServer/1.0" } }
		);
		console.log(`✅ publishing_failed sent for ${productId}`);

		// 2. Delete the product in Printify
		console.log(`🗑  deleting product ${productId} from Printify…`);
		const { status, data } = await ShopifyAPI.delete(`/shops/${SHOP_ID}/products/${productId}.json`);
		console.log(`✅ product ${productId} deleted on Printify (HTTP ${status})`);

		// 3. Delete from Postgres (will cascade to the two related tables)
		console.log(`🗑  deleting product ${productId} from local database…`);
		const deleteQuery = `DELETE FROM products WHERE product_id = $1`;
		await pool.query(deleteQuery, [productId]);
		console.log(`✅ product ${productId} deleted from DB (and cascaded to related tables)`);

		// Return whatever Printify sent back (if you need it elsewhere)
		return data;
	} catch (err) {
		console.error(
			`❌ Error cancelling/deleting product ${productId}:`,
			err.response?.data || err.message
		);
		throw err;
	}
};
