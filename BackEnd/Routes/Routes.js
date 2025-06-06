/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Imported Libraries
import express from "express";

//Imported Functions
import { fetchAllProducts } from "../FetchFunctions/FetchAllProducts.js";
import { checkoutHandler } from "../CheckOutHandler/CheckOut.js";

/*---------------------------------------------------------------------------------------------
									Routes and Router
----------------------------------------------------------------------------------------------*/
//Creation and reference to express' router object
const expressRouter = express.Router();

//All Routes (in expected use order)
expressRouter.get("/fetchAllProducts", fetchAllProducts);

expressRouter.post("/checkout", checkoutHandler);

export default expressRouter;
