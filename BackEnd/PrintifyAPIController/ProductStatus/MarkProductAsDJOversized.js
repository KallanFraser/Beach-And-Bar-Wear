/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../../Database/Database.js"; // adjust path as needed

/*---------------------------------------------------------------------------------------------
                        Mark a product as “night clothing”
----------------------------------------------------------------------------------------------*/
export async function markAsDJOversized(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET dj_oversized = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markAsDJOversized: dj_oversized for ${productId}`);
	} catch (err) {
		console.error(`[❌] markAsDJOversized error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
