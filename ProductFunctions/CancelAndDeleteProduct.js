/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
// ENV imports
import dotenv from "dotenv"; //imports environment variables
dotenv.config(); //loads the variables into this process's .env

import axios from "axios"; //For better HTTP requests (to printify)

import { pool } from "../Database/Database.js"; //Postgres DB connection pool
/*---------------------------------------------------------------------------------------------
                                    Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken; //Our secret key
const SHOP_ID = process.env.printifyShopID; //Unique to our shop within printify
const BASE_URL = "https://api.printify.com/v1"; //To printifys api

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
                                    Delete Product Function
----------------------------------------------------------------------------------------------*/
// NOTE: Now also removes the product row from Postgres (and cascades to related tables)
export const cancelAndDeleteProduct = async (productId, reason = "Cancelled by user") => {
	//Check if argument provided
	if (!productId) {
		throw new Error("productId is required to cancel and delete a product");
	}

	try {
		//Mark publish as failed (unlocks it on printify so we can delete it)
		await ShopifyAPI.post(
			`/shops/${SHOP_ID}/products/${productId}/publishing_failed.json`,
			{ reason },
			{ headers: { "User-Agent": "MyNodeServer/1.0" } }
		);

		//Delete the product in Printify
		const { status, data } = await ShopifyAPI.delete(`/shops/${SHOP_ID}/products/${productId}.json`);

		//Delete from Postgres (will cascade to the two related tables)
		const deleteQuery = `DELETE FROM products WHERE product_id = $1`;
		await pool.query(deleteQuery, [productId]);

		// Return whatever Printify sent back (if needed elsewhere in the future)
		return data;
	} catch (err) {
		console.error(`Error deleting product ${productId}:`, err.response?.data || err.message);
		throw err;
	}
};
