/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../Database/Database.js"; //Postgres DB connection pool

/*---------------------------------------------------------------------------------------------
                       				 Mark a product As....
----------------------------------------------------------------------------------------------*/
export async function markAsNightClothing(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET is_night_clothing = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markAsNightClothing: set is_night_clothing for ${productId}`);
	} catch (err) {
		console.error(`[❌] markAsNightClothing error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
