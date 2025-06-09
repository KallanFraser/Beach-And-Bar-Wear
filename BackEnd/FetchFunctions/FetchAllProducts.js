/** @format */
/*---------------------------------------------------------------------------------------------
	                                       Imports
---------------------------------------------------------------------------------------------*/
import { pool } from "../Database/Database.js"; //Postgres DB connection pool
/*---------------------------------------------------------------------------------------------
	                                    Main Function
---------------------------------------------------------------------------------------------*/
export async function fetchAllProducts(req, res) {
	let client;
	try {
		client = await pool.connect();
		//Extracting client data (IP, browser type, etc) ---------------------------------------
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

		await client.query(
			`INSERT INTO product_fetch_logs
       	 	(client_ip, user_agent, accept_language, referer, host, origin, received_at)
      		VALUES ($1, $2, $3, $4, $5, $6, $7);`,
			[clientIp, userAgent, acceptLanguage, referer, host, origin, receivedAt]
		);

		//Actual Product & Its Variants Fetch ----------------------------------------------------
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
		//Stringify & send data to client
		//Note express actually stringifys under the hood but if we need to debug fetch times this is useful
		const jsonString = JSON.stringify(products);
		res.setHeader("Content-Type", "application/json");
		res.send(jsonString);

		console.log("Successfully Fetch ALL Products for: ", clientIp);
	} catch (err) {
		console.error("Fetch All Products From Database Error: ", err);
		res.status(500).json({ error: "Server Side Error: Failed to fetch products" });
	} finally {
		if (client) client.release();
	}
}
