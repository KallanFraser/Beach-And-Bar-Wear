/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../Database/Database.js"; //Postgres DB connection pool

/*---------------------------------------------------------------------------------------------
                       				 Mark a product As....
----------------------------------------------------------------------------------------------*/
export async function markAsBoxyOversized(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET boxy_oversized = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markAsBoxyOversized: boxy_oversized for ${productId}`);
	} catch (err) {
		console.error(`[❌] markAsBoxyOversized error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
