/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

/*---------------------------------------------------------------------------------------------
                                    Globals
----------------------------------------------------------------------------------------------*/
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;
const BASE_URL = "https://api.printify.com/v1";

if (!PRINTIFY_TOKEN || !SHOP_ID) {
	console.error("⚠️ Missing printifyAccessToken or printifyShopID in .env");
}

/*---------------------------------------------------------------------------------------------
                                Publish‑Succeeded Helper
----------------------------------------------------------------------------------------------*/
const markProductPublishingSucceeded = async (productId) => {
	const externalId = productId;
	const handleUrl = "https://beachandbarwear.com/ViewProductPage/" + productId;
	if (!productId || !externalId || !handleUrl) {
		throw new Error("productId, externalId, and handleUrl are all required for publishing_succeeded.");
	}

	try {
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

		console.log(`✅ publishing_succeeded sent for product ${productId} (HTTP ${response.status})`);
		return response.data;
	} catch (error) {
		console.error("❌ Printify publish_succeeded error:", error.response?.data || error.message);
		throw error;
	}
};

export default markProductPublishingSucceeded;
