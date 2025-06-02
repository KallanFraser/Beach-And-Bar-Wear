/* @format */
import { pool } from "../../Database/Database.js";

export async function fetchAllProducts(req, res) {
	const client = await pool.connect();
	try {
		//blob = binary large object
		//since jsonb = json data in binary format
		//JSONB (JSON blob) --> Base64 String
		const t0 = Date.now();
		const { rows: products } = await client.query(`
      	SELECT
        p.product_id           AS id,
        p.product_title        AS title,
        p.is_visible           AS visible,
        p.is_night_clothing    AS is_night_clothing,
        p.swim_short           AS is_swim_short,
        p.dj_oversized         AS is_dj_oversized,
        p.hoodie               AS is_hoodie,
        p.boxy_oversized       AS is_boxy_oversized,
        p.classic_heavy        AS is_classic_heavy,
        p.heavy_tank           AS is_heavy_tank,
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
        AND pi.is_selected = TRUE
      GROUP BY p.product_id
    `);
		const t1 = Date.now();
		console.log(`[⏱️] DB query returned ${products.length} products in ${t1 - t0} ms`);

		const t2 = Date.now();
		// Turn the rows into a JSON string manually so we can measure how long it takes
		//	Usually express would do this for us
		const jsonString = JSON.stringify(products);
		const t3 = Date.now();
		console.log(`[⏱️] JSON.stringify of ${products.length} rows took ${t3 - t2} ms`);
		console.log(`[📦] Payload size: ${Buffer.byteLength(jsonString)} bytes`);

		const t4 = Date.now();
		// We already have a string; use res.send so that Express doesn’t re-stringify
		res.setHeader("Content-Type", "application/json");
		res.send(jsonString);
		const t5 = Date.now();
		console.log(`[⏱️] res.send took ${t5 - t4} ms (from string to network)`);
	} catch (err) {
		console.error("[❌] fetchAllProducts error:", err);
		res.status(500).json({ error: "Failed to load products" });
	} finally {
		client.release();
		console.log("[🔍] DB client released");
	}
}
