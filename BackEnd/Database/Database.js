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
	user: "postgres",
	host: "localhost",
	host: process.env.databaseHost,
	database: process.env.databaseName,
	password: process.env.databasePassword,
	port: process.env.databasePort,
});

export { pool };
