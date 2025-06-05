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
const pool = new Pool({
	user: process.env.supaBaseUser,
	host: process.env.supaBaseHost, // “db.orodbtnkhvmgfyslyjxj.supabase.co”
	database: process.env.supaBaseDatabase,
	password: process.env.supaBaseDatabasePassword,
	port: parseInt(process.env.supaBasePort, 10),
	ssl: {
		rejectUnauthorized: false,
	},
});

export { pool };
