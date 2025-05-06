/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Imported Libraries
import express from "express";

//Imported Functions
import { getAllProductData } from "../PrintifyAPIController/MainMethods.js";

/*---------------------------------------------------------------------------------------------
									Routes and Router
----------------------------------------------------------------------------------------------*/
//Creation and reference to express' router object
const expressRouter = express.Router();

//All Routes (in expected use order)
expressRouter.get("/getAllShopProductData", getAllProductData);

export default expressRouter;
