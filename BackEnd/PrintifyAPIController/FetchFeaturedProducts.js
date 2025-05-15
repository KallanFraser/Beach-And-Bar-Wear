/** @format */

import { pool } from "../Database/Database.js";

export async function fetchFeaturedProducts(req, res) {
	console.log("[🌟] GET /fetchFeaturedProducts");

	const client = await pool.connect();
	try {
		const { rows: products } = await client.query(`
      SELECT
        product_id   AS id,
        product_title AS title,
        is_visible    AS visible
      FROM public.products
      WHERE featured = true
    `);
		console.log(`[🌟] found ${products.length} featured products`);

		for (const prod of products) {
			const { rows: variants } = await client.query(
				`SELECT
           variant_id    AS id,
           variant_sku   AS sku,
           variant_price AS price,
           variant_cost  AS cost,
           variant_title AS title,
           in_stock
         FROM public.product_variants
         WHERE product_id = $1`,
				[prod.id]
			);
			prod.variants = variants;

			const { rows: imgs } = await client.query(
				`SELECT image_src FROM public.product_images WHERE product_id = $1`,
				[prod.id]
			);
			prod.images = imgs.map((r) => r.image_src);
		}

		res.json(products);
	} catch (err) {
		console.error("[❌] fetchFeaturedProducts error:", err.message);
		res.status(500).json({ error: "Failed to fetch featured products" });
	} finally {
		client.release();
		console.log("[🌟] DB client released");
	}
}
