/**
 * FetchAllProducts.js *
 *
 * @format
 */

import { pool } from "../Database/Database.js";

/**
 * Express route handler: fetch every product + its variants + its images,
 * then send it all back as JSON.
 */
export async function fetchAllProducts(req, res) {
	console.log("[🚀] GET /fetchAllProducts");

	const client = await pool.connect();
	try {
		// 1. load products
		console.log("[🔍] querying products");
		const { rows: products } = await client.query(`
      SELECT
        product_id   AS id,
        product_title AS title,
        is_visible    AS visible
      FROM public.products
    `);
		console.log(`[🔍] found ${products.length} products`);

		// 2. for each, load variants + images
		for (const prod of products) {
			console.log(`  ↪️  loading variants for ${prod.id}`);
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
			console.log(`    • ${variants.length} variants`);

			console.log(`  ↪️  loading images for ${prod.id}`);
			const { rows: imgs } = await client.query(
				`SELECT image_src FROM public.product_images WHERE product_id = $1`,
				[prod.id]
			);
			// image_src comes back as Buffer (bytea)
			prod.images = imgs.map((r) => r.image_src);
			console.log(`    • ${prod.images.length} images`);
		}

		// 3. send the JSON response
		console.log(`[✔️] returning ${products.length} products`);
		res.json(products);
	} catch (err) {
		console.error("[❌] fetchAllProducts error:", err);
		res.status(500).json({ error: "Failed to load products" });
	} finally {
		client.release();
		console.log("[🔍] DB client released");
	}
}
