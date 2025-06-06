/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
// ENV imports
import dotenv from "dotenv"; //imports environment variables
dotenv.config(); //loads the variables into this process's .env

import axios from "axios"; //For better HTTP requests (to printify)
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
/*---------------------------------------------------------------------------------------------
                                Publish‑Succeeded Helper
----------------------------------------------------------------------------------------------*/
const markProductPublishingSucceeded = async (productId) => {
	const externalId = productId; //we call it product ID they call it external ID

	//URL to where our product is being published on our store (Printify asks for it)
	const handleUrl = "https://beachandbarwear.com/ViewProductPage/" + productId;
	if (!productId || !externalId || !handleUrl) {
		throw new Error("productId, externalId, and handleUrl are all required for publishing_succeeded.");
	}

	try {
		//Sending a POST to printify that we want product ID published
		const response = await axios.post(
			`${BASE_URL}/shops/${SHOP_ID}/products/${productId}/publishing_succeeded.json`,
			{
				external: {
					id: externalId,
					handle: handleUrl,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${PRINTIFY_TOKEN}`,
					"User-Agent": "MyNodeServer/1.0",
					"Content-Type": "application/json",
				},
			}
		);

		console.log(`Successfully published ${productId} (HTTP ${response.status})`);
		return response.data;
	} catch (error) {
		console.error("Printify publish failed:", error.response?.data || error.message);
		throw error;
	}
};

export default markProductPublishingSucceeded;
