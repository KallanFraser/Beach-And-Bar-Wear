/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../../Database/Database.js"; // adjust path as needed

/*---------------------------------------------------------------------------------------------
                        Mark a product as “night clothing”
----------------------------------------------------------------------------------------------*/
export async function markAsSwimShorts(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET swim_short = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markasSwimShorts: swim_short for ${productId}`);
	} catch (err) {
		console.error(`[❌] markasSwimShorts error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
