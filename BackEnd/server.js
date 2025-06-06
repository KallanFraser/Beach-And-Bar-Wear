/** @format */
/*---------------------------------------------------------------------------------------------
										Notes
----------------------------------------------------------------------------------------------*/
//Essentially just an Next.js application running inside of an Express application
//Express is the main server (the host)
//Next.js app is started and we get a request handler (handle into it as an app)
//Essentially any route sent to express that it does not handle is passed over to Next.js
//i.e if there is no /HomePage in the express router, it is handed over to Next.js

//Express handles custom API routes, applies middleware, and serves static files
//It also manages any custom server logic or authentication layers

//Next.js renders our react frontend
//Manages our routing for our pages
//Serves FrontEnd Assets
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Server Critical Imports ---------------------------------------------------------------------
import express from "express"; //The core web server framework. Handles routing, middleware, request / response
import routes from "./Routes/Routes.js"; //All our express routes definitions
import next from "next"; //Boots the next.js frontend inside our server. Used for server side rendering

import path from "path"; //Node's built in utility to handle and transform file paths across platforms
import { fileURLToPath } from "url"; //Converts a module URL into a file path. For resolving paths

import cors from "cors"; //Allows our server to accept requests from different domains (Our FrontEnd)
import axios from "axios"; //HTTP client for making requests to other API's (GET, POST, etc.)
import rateLimit from "express-rate-limit"; //Middleware that helps prevent abuse by limiting requests

import { pool } from "./Database/Database.js"; //Our Postgres connection pool to run queries

//Printify Product Related Functions ------------------------------------------------------------
import { refreshProductsDatabase } from "./RefreshProductsDatabase/RefreshProductsDatabase.js";

import markProductPublishingSucceeded from "./ProductFunctions/PublishProduct.js";
import { cancelAndDeleteProduct } from "./ProductFunctions/CancelAndDeleteProduct.js";
import { markAsNightClothing } from "./ProductFunctions/MarkProductAsNightClothing.js";
import { markAsSwimShorts } from "./ProductFunctions/MarkProductAsSwimShorts.js";
import { markAsClassicHeavy } from "./ProductFunctions/MarkProductAsClassicHeavy.js";
import { markAsBoxyOversized } from "./ProductFunctions/MarkProductAsBoxyOversized.js";
import { markAsDJOversized } from "./ProductFunctions/MarkProductAsDJOversized.js";
import { markAsHoodie } from "./ProductFunctions/MarkProductAsHoodie.js";
import { markAsHeavyTank } from "./ProductFunctions/MarkProductAsHeavyTank.js";
/*---------------------------------------------------------------------------------------------
										Globals
----------------------------------------------------------------------------------------------*/
//File system variables
const currentFile = fileURLToPath(import.meta.url); //Used for the variable below
const currentDirectory = path.dirname(currentFile); //Defines our current path (used for absolute paths)

//Timing & port
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const PORT = 3000;

//Next.js flags
const dev = process.env.NODE_ENV !== "production"; //bool variable to indiciate if we are in prod build or dev

//Initialization / Next Start up
//This creates a Next.js instance pointing to our React App in the FrontEnd folder
//The dev flag lets express know if it is a development build or a production build
const nextApp = next({
	dev,
	dir: path.join(currentDirectory, "../FrontEnd"),
});

//This gives us a universal route handler for ALL next.js pages and assets
//Matches requests to Next.js pages
const handle = nextApp.getRequestHandler();
/*---------------------------------------------------------------------------------------------
                                        Bootstrap Next + Express
----------------------------------------------------------------------------------------------*/
//This prepares the app (compiles the pages) and waits for it to be ready to serve
//The .then is the waiting part before it starts the Express App
nextApp.prepare().then(() => {
	//Creates the Express application once the Next App is compiled and ready to serve
	const application = express();

	//Apply cors & JSON
	//.json() parses incoming JSON bodies
	//cors() allows requests from other origins
	application.use(express.json());
	application.use(cors());

	//Global rate limiter for all endpoints
	//Turned off for now because each image is currently a request and is like 80 requests on load
	/*
	const globalLimiter = rateLimit({
		windowMs: 1 * 60 * 1000, // 1 minute
		max: 20, // limit each IP to 20 requests per minute
	});
	*/
	//application.use(globalLimiter);

	// Mounts existing API routes from routes.js
	application.use(routes);

	//Lets users access images stored in the BackEnds /public/images via URL
	//Like localhost:3000/images/logo.png
	//application.use("/images", express.static(path.join(process.cwd(), "public/images")));

	//Should implement cloudfare at some point
	//Same as above but with caching enabled such that the images stay on the persons browser for 1 year
	application.use(
		"/images",
		express.static(path.join(process.cwd(), "public/images"), {
			maxAge: "1y",
			immutable: true,
		})
	);

	//Essentially says "If express has not matched the request with an API route in routes.js...
	//Then the request is handed off to Next.js for it to try and match it to a route it has / page
	//I.E = User calls /HomePage. Express does not recognize this is an API route.
	//handle() gets called and Next.js renders the page or fetches the pre rendered one
	application.all(/.*/, (req, res) => {
		return handle(req, res);
	});

	/*---------------------------------------------------------------------------------------------
                                        Tests & Recurring Jobs
  	----------------------------------------------------------------------------------------------*/
	// Database connection test
	(async () => {
		try {
			const { rows } = await pool.query("SELECT NOW()");
			console.log("[✅] Connected via Transaction Pooler – now():", rows[0]);
		} catch (err) {
			console.error("[❌] DB connect error:", err);
		}
	})();

	//Code to Refresh Our Products Database every 5 minutes and on start
	refreshProductsDatabase();
	setInterval(() => {
		refreshProductsDatabase();
	}, FIVE_MINUTES_MS);

	/*---------------------------------------------------------------------------------------------
                                        Server Start
  	----------------------------------------------------------------------------------------------*/
	//Binds our Express Application to a port to listen on for requests
	application.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
});
