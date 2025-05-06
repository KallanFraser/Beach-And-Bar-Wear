/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Node Library imports
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

const getAllProductData = async (request, response) => {
	try {
		const { data } = await ShopifyAPI.get(`/shops/${SHOP_ID}/products.json`);
		//console.log("👉 Raw Printify response data:", data);

		const parsedData = parseEssentialProductData(data.data);
		console.log("👉 Printify products data parsed", parsedData);
		response.json(parsedData);
	} catch (error) {
		console.error("❌ Printify fetch error:", error.response?.data || error.message);
		response.status(500).json({ error: "Could not fetch products from Printify" });
	}
};

/*---------------------------------------------------------------------------------------------
										Parsing Function
----------------------------------------------------------------------------------------------*/
export function parseEssentialProductData(data) {
	if (!Array.isArray(data)) {
		console.error("Invalid input: expected an array of product objects.");
		return [];
	}

	return data.map((product) => {
		const { id, title, tags = [], options = [], variants = [], images = [], visible } = product;

		return {
			id,
			title,
			tags,
			options,
			variants,
			images,
			visible,
		};
	});
}

export { getAllProductData };
