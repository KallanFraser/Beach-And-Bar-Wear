/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
//ENV imports
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

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
/**
 * Cancel a still‐publishing product and remove it completely.
 *
 * @param {string} productId   – Printify product_id that’s mid-publish
 * @param {string} [reason]    – Why we’re cancelling (shown in Printify UI)
 * @returns {Promise<void>}
 */
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

		// 2. Delete the product entirely
		console.log(`🗑  deleting product ${productId}…`);
		const { status, data } = await ShopifyAPI.delete(`/shops/${SHOP_ID}/products/${productId}.json`);
		console.log(`✅ product ${productId} deleted (HTTP ${status})`);
		return data;
	} catch (err) {
		console.error(
			`❌ Error cancelling/deleting product ${productId}:`,
			err.response?.data || err.message
		);
		throw err;
	}
};
