/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Node Library imports
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import axios from "axios";

//Local static file imports
import { pool } from "./Database/Database.js";
import routes from "./Routes/Routes.js";

//Server / Database Update Functions
import { updateProductData } from "./PrintifyAPIController/RefreshProducts.js";

//Testing / Other
import { cancelAndDeleteProduct } from "./PrintifyAPIController/cancelAndDeleteProduct.js";

/*---------------------------------------------------------------------------------------------
										Globals
----------------------------------------------------------------------------------------------*/
//File system variables
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

/*---------------------------------------------------------------------------------------------
										Setup
----------------------------------------------------------------------------------------------*/
//Express App Setup
const app = express();
app.use(express.json());
app.use(cors()); //Must be called before routes are defined
app.use(express.static(path.join(currentDirectory, "../FrontEnd/dist")));
app.use(routes); //Routes defined here
const PORT = 3000;

/*---------------------------------------------------------------------------------------------
										Tests
----------------------------------------------------------------------------------------------*/
//Database connection test
pool.query("SELECT NOW()", (error, response) => {
	if (error) {
		console.error("Error occured whilst connecting to the database", error);
	} else {
		console.log("Connected to the Database");
	}
});

/*---------------------------------------------------------------------------------------------
										Server
----------------------------------------------------------------------------------------------*/
//Server start point
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	//updateProductData();
});
