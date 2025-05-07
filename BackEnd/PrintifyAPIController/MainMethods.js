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

		parseAndUpdateEssentialProductData(data.data);
		//console.log("👉 Printify products data parsed", parsedData);
		//response.json(parsedData);
	} catch (error) {
		console.error("❌ Printify fetch error:", error.response?.data || error.message);
		response.status(500).json({ error: "Could not fetch products from Printify" });
	}
};

/*---------------------------------------------------------------------------------------------
										Parsing Function
----------------------------------------------------------------------------------------------*/
export function parseAndUpdateEssentialProductData(data) {
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
				sku: v.sku,
				variantId: v.id,
				price: v.price,
				cost: v.cost,
				title: v.title,
				availability: v.is_available ? "In Stock" : "Not In Stock",
			}));

		// 2. Build a Set of those enabled variant IDs for image checks
		const enabledVariantIds = new Set(filteredVariants.map((v) => v.variantId));

		// 3. Pick only images tied to at least one enabled variant
		const matchedImages = images
			.filter((img) => img.variant_ids.some((vid) => enabledVariantIds.has(vid)))
			.map((img) => img.src);

		// 4. (Optional) Single consolidated log per product
		console.log(
			`[Product] id= ${id} title= "${title}" amount of variants= ${filteredVariants.length} amount of images= ${matchedImages.length}`
		);

		//Update database

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
                                Publish‑Succeeded Helper
----------------------------------------------------------------------------------------------*/
/**
 * Unlock a newly‑published Printify product so you can keep editing it.
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

export { getAllProductData, markProductPublishingSucceeded };
