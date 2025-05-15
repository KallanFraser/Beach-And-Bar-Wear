/** @format */

import { pool } from "../Database/Database.js";

export async function updateFeaturedStatus(req, res) {
	console.log("[🔧] POST /updateFeaturedStatus");

	const { product_id, featured } = req.body;

	if (typeof product_id !== "string" || typeof featured !== "boolean") {
		return res.status(400).json({ error: "Invalid product_id or featured value" });
	}

	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
			 SET featured = $1
			 WHERE product_id = $2`,
			[featured, product_id]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		console.log(`[✅] Updated featured=${featured} for product ${product_id}`);
		res.json({ success: true, product_id, featured });
	} catch (err) {
		console.error("[❌] updateFeaturedStatus error:", err.message);
		res.status(500).json({ error: "Failed to update featured status" });
	} finally {
		client.release();
	}
}
