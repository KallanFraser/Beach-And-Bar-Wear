/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../Database/Database.js"; //Postgres DB connection pool

/*---------------------------------------------------------------------------------------------
                       				 Mark a product As....
----------------------------------------------------------------------------------------------*/
export async function markAsHeavyTank(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET heavy_tank = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markAsHeavyTank: heavy_tank for ${productId}`);
	} catch (err) {
		console.error(`[❌] markAsHeavyTank error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
