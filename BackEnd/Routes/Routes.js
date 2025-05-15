/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Imported Libraries
import express from "express";

//Imported Functions
import { fetchAllProducts } from "../PrintifyAPIController/FetchAllProducts.js";
/*---------------------------------------------------------------------------------------------
									Routes and Router
----------------------------------------------------------------------------------------------*/
//Creation and reference to express' router object
const expressRouter = express.Router();

//All Routes (in expected use order)
expressRouter.get("/fetchAllProducts", fetchAllProducts);

expressRouter.get("/", (request, response) => {
	response.sendFile(path.join(__dirname, "../../FrontEnd/dist", "index.html"));
});

export default expressRouter;
