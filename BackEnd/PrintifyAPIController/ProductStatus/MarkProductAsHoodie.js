/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../../Database/Database.js"; // adjust path as needed

/*---------------------------------------------------------------------------------------------
                        Mark a product as “night clothing”
----------------------------------------------------------------------------------------------*/
export async function markAsHoodie(productId) {
	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
            SET hoodie = TRUE
            WHERE product_id = $1`,
			[productId]
		);

		if (result.rowCount === 0) {
			throw new Error(`No product found with id "${productId}"`);
		}

		console.log(`[✅] markAsHoodie: hoodie for ${productId}`);
	} catch (err) {
		console.error(`[❌] markAsHoodie error:`, err);
		throw err;
	} finally {
		client.release();
	}
}
