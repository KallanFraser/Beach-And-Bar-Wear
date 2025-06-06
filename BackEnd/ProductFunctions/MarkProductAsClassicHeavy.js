/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../Database/Database.js"; //Postgres DB connection pool

/*---------------------------------------------------------------------------------------------
                       				 Mark a product As....
----------------------------------------------------------------------------------------------*/
export async function markAsClassicHeavy(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET classic_heavy = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markAsClassicHeavy: classic_heavy for ${productId}`);
	} catch (err) {
		console.error(`[❌] markAsClassicHeavy error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
