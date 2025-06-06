/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
import { pool } from "../Database/Database.js";

/*---------------------------------------------------------------------------------------------
                                  Main Function
----------------------------------------------------------------------------------------------*/
export async function giveProductFeaturedStatus(product_id, featured) {
	//Note this function is not in use yet
	//But once we have tonnes of images, this will represent the "featured" home page products
	//So instead of the user loading all the products, they load just the "featured" ones

	const client = await pool.connect();
	try {
		const result = await client.query(
			`UPDATE public.products
			 SET featured = $1
			 WHERE product_id = $2`,
			[featured, product_id]
		);

		if (result.rowCount === 0) {
			console.log("Product not found for give featured status");
			return;
		}

		console.log(`[✅] Updated featured=${featured} for product ${product_id}`);
	} catch (err) {
		console.error("[❌] updateFeaturedStatus error:", err.message);
	} finally {
		client.release();
	}
}
