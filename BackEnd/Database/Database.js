/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import pkg from "pg";
import "dotenv/config"; // Load environment variables

/*---------------------------------------------------------------------------------------------
										Database
----------------------------------------------------------------------------------------------*/
const { Pool } = pkg;

//Pool = multiple connections to the database.
const pool = new Pool({
	connectionString: process.env.TRANSACTION_POOL_URL,
	ssl: {
		// Supabase still requires SSL, so allow their certificate without local CA verification
		rejectUnauthorized: false,
	},
});

export { pool };
