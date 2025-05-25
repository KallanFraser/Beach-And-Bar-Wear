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
import rateLimit from "express-rate-limit";

//Next import
import next from "next";

//Local static file imports
import { pool } from "./Database/Database.js";
import routes from "./Routes/Routes.js";

//Server / Database Update Functions
import { refreshProductsDatabase } from "./PrintifyAPIController/DatabaseOriented/RefreshProductsDatabase.js";
import { markAsNightClothing } from "./PrintifyAPIController/ProductStatus/MarkProductAsNightClothing.js";
import markProductPublishingSucceeded from "./PrintifyAPIController/ProductStatus/PublishProduct.js";

//Testing / Other

/*---------------------------------------------------------------------------------------------
										Globals
----------------------------------------------------------------------------------------------*/
// File system variables
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Timing & port
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const PORT = 3000;

// Next.js flags
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({
	dev,
	dir: path.join(currentDirectory, "../FrontEnd"),
});

const handle = nextApp.getRequestHandler();

/*---------------------------------------------------------------------------------------------
                                        Bootstrap Next + Express
----------------------------------------------------------------------------------------------*/
nextApp.prepare().then(() => {
	//Create the application
	const application = express();

	//Apply cors & JSON
	application.use(express.json());
	application.use(cors());

	// Global rate limiter for all endpoints
	const globalLimiter = rateLimit({
		windowMs: 1 * 60 * 1000, // 1 minute
		max: 20, // limit each IP to 20 requests per minute
	});
	application.use(globalLimiter);

	// Mounts existing API routes from routes.js
	application.use(routes);

	// Mount all next js routes
	application.all(/.*/, (req, res) => {
		return handle(req, res);
	});

	/*---------------------------------------------------------------------------------------------
                                        Tests & Recurring Jobs
  	----------------------------------------------------------------------------------------------*/
	// Database connection test
	pool.query("SELECT NOW()", (err) => {
		console.log(err ? "[❌] DB connect error:" + err : "[✅] Connected to the Database");
	});

	//Refresh DB products
	refreshProductsDatabase();
	setInterval(() => {
		refreshProductsDatabase();
	}, FIVE_MINUTES_MS);

	markProductPublishingSucceeded(
		"681bf654a55bae26fe09749d",
		"681bf654a55bae26fe09749d",
		"https://beachandbarwear.com/ViewProductPage/681bf654a55bae26fe09749d"
	);
	// markAsNightClothing("681c021da55bae26fe097788");

	/*---------------------------------------------------------------------------------------------
                                        Server Start
  	----------------------------------------------------------------------------------------------*/
	application.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
});
