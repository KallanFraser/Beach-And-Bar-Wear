/**
 * ---------------------------------------------------------------------------------------------
 *                                         Imports
 * ----------------------------------------------------------------------------------------------
 *
 * @format
 */

import { pool } from "../../Database/Database.js";

export async function fetchAllProducts(req, res) {
	console.time("fetchAllProducts_total");
	console.log("[/fetchAllProducts] → Handler invoked at", new Date().toISOString());

	const clientStart = Date.now();
	const client = await pool.connect();
	console.log(`[/fetchAllProducts] ← Acquired DB client in ${Date.now() - clientStart} ms`);

	try {
		// 1) Log request info (IP, UA, etc.) as before…
		let rawIp = "";
		if (req.headers["x-forwarded-for"]) {
			rawIp = req.headers["x-forwarded-for"].split(",")[0].trim();
		} else if (req.ip) {
			rawIp = req.ip;
		} else if (req.connection && req.connection.remoteAddress) {
			rawIp = req.connection.remoteAddress;
		}
		if (rawIp.startsWith("::ffff:")) rawIp = rawIp.substring(7);

		const clientIp = rawIp;
		const userAgent = req.get("User-Agent");
		const acceptLanguage = req.get("Accept-Language");
		const referer = req.get("Referer");
		const host = req.get("Host");
		const origin = req.get("Origin") || "";
		const receivedAt = new Date().toISOString();

		console.time("insert_product_fetch_log");
		await client.query(
			`
      INSERT INTO product_fetch_logs
        (client_ip, user_agent, accept_language, referer, host, origin, received_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
			[clientIp, userAgent, acceptLanguage, referer, host, origin, receivedAt]
		);
		console.timeEnd("insert_product_fetch_log");

		// 2) Fetch products + variants + image_path (no base64)
		console.time("db_select_products");
		const { rows: products } = await client.query(`
      SELECT
        p.product_id        AS id,
        p.product_title     AS title,
        p.is_visible        AS visible,
        p.is_night_clothing AS is_night_clothing,
        p.swim_short        AS is_swim_short,
        p.dj_oversized      AS is_dj_oversized,
        p.hoodie            AS is_hoodie,
        p.boxy_oversized    AS is_boxy_oversized,
        p.classic_heavy     AS is_classic_heavy,
        p.heavy_tank        AS is_heavy_tank,
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
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'path',     pi.image_path,
              'is_back',  pi.is_back
            )
          ) FILTER (WHERE pi.image_path IS NOT NULL),
          '[]'
        ) AS images
      FROM products p
      LEFT JOIN product_variants v
        ON p.product_id = v.product_id
      LEFT JOIN product_images pi
        ON p.product_id = pi.product_id
        AND pi.is_selected = TRUE
      GROUP BY p.product_id;
    `);
		console.timeEnd("db_select_products");
		console.log(`[/fetchAllProducts] ← Retrieved ${products.length} products`);

		// 3) Stringify & send
		console.time("json_stringify");
		const jsonString = JSON.stringify(products);
		console.timeEnd("json_stringify");

		const payloadBytes = Buffer.byteLength(jsonString, "utf8");
		console.log(`[/fetchAllProducts] → Payload size ≈ ${Math.round(payloadBytes / 1024)} KB`);

		console.time("res_send");
		res.setHeader("Content-Type", "application/json");
		res.send(jsonString);
		console.timeEnd("res_send");
		console.log("[/fetchAllProducts] ← Response sent to client");
	} catch (err) {
		console.error("[/fetchAllProducts] ❌ ERROR:", err);
		res.status(500).json({ error: "Failed to load products" });
	} finally {
		client.release();
		console.log("[/fetchAllProducts] → Released DB client");
		console.timeEnd("fetchAllProducts_total");
		console.log("[/fetchAllProducts] ← Handler complete");
	}
}
