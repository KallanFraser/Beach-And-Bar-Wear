/* @format */
import { pool } from "../../Database/Database.js";

export async function fetchAllProducts(req, res) {
	const client = await pool.connect();
	try {
		//Note that Postgres turns each blob into a plain text Base64 string.
		//blob = binary large object
		//since jsonb = json data in binary format
		//JSONB (JSON blob) --> Base64 String
		const { rows: products } = await client.query(`
		SELECT
			p.product_id           AS id,
			p.product_title        AS title,
			p.is_visible           AS visible,
			p.is_night_clothing    AS is_night_clothing,
			COALESCE(
			JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
				'id',        v.variant_id,
				'sku',       v.variant_sku,
				'price',     v.variant_price,
				'cost',      v.variant_cost,
				'title',     v.variant_title,
				'in_stock',  v.in_stock
			)) FILTER (WHERE v.variant_id IS NOT NULL),
			'[]'
			) AS variants,
			COALESCE(
			JSONB_AGG(DISTINCT ENCODE(pi.image_src, 'base64')) FILTER (WHERE pi.image_src IS NOT NULL),
			'[]'::jsonb
			) AS images
		FROM products p
		LEFT JOIN product_variants v
			ON p.product_id = v.product_id
		LEFT JOIN product_images pi
			ON p.product_id = pi.product_id
			AND pi.is_selected = true
		GROUP BY p.product_id
    `);

		res.json(products);
	} catch (err) {
		console.error("[❌] fetchAllProducts error:", err);
		res.status(500).json({ error: "Failed to load products" });
	} finally {
		client.release();
		console.log("[🔍] DB client released");
	}
}
