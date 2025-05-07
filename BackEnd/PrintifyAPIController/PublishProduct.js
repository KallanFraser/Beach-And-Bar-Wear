/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
//ENV imports
import dotenv from "dotenv";
dotenv.config();

//Library imports
//import axios from "axios";

//Database imports
//import { pool } from "../Database/Database.js";

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
                                Publish‑Succeeded Helper
----------------------------------------------------------------------------------------------*/
/**
 * Unlocks a newly‑published Printify product so we can keep editing it.
 *
 * @param {string|number} productId   – Printify product_id that got locked
 * @param {string|number} externalId  – Listing ID your sales channel returned
 * Think of it as the foreign‑key that ties the Printify product to the record that lives in your storefront.
 * it is our store‑side ID
 * external.id – “Here’s the internal number my store uses for this product.”
 * Think of it like the SKU in your cash register.
 * @param {string}        handleUrl   – Public product URL (e.g. https://mystore.com/p/awesome‑tee)
 * And here’s the public web page where people can buy it.”
 * Think of it like the street address you put on a postcard.
 * @returns {Promise<object>}         – Raw Printify response payload
 */
const markProductPublishingSucceeded = async (productId, externalId, handleUrl) => {
	if (!productId || !externalId || !handleUrl) {
		throw new Error("productId, externalId and handleUrl are all required for publishing_succeeded.");
	}

	try {
		const { status, data } = await ShopifyAPI.post(
			`/shops/${SHOP_ID}/products/${productId}/publishing_succeeded.json`,
			{
				external: {
					id: externalId,
					handle: handleUrl,
				},
			},
			{
				// Printify insists on a User‑Agent header even when using an Axios instance
				headers: { "User-Agent": "MyNodeServer/1.0" },
			}
		);

		console.log(`✅ publishing_succeeded sent for product ${productId} (HTTP ${status})`);
		return data; // useful if you want to log or assert anything
	} catch (error) {
		console.error("❌ Printify publish_succeeded error:", error.response?.data || error.message);
		throw error;
	}
};
