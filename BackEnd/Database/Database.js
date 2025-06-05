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
//Instead of waiting for each query to finish we have a pool of connections to work with
const connUrl =
	`postgresql://${process.env.supaBaseUser}` +
	`:${encodeURIComponent(process.env.supaBaseDatabasePassword)}` +
	`@${process.env.supaBaseHost}` +
	`:${process.env.supaBasePort}` +
	`/${process.env.supaBaseDatabase}` +
	`?sslmode=require`;

const pool = new Pool({
	connectionString: connUrl,
	ssl: {
		rejectUnauthorized: false,
	},
});

export { pool };
