/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Imported Libraries
import express from "express";

//Imported Functions
import { fetchAllProducts } from "../PrintifyAPIController/FetchingProducts/FetchAllProducts.js";
import { checkoutHandler } from "../CheckOutHandler/CheckOut.js";

/*---------------------------------------------------------------------------------------------
									Routes and Router
----------------------------------------------------------------------------------------------*/
//Creation and reference to express' router object
const expressRouter = express.Router();

//All Routes (in expected use order)
expressRouter.get("/fetchAllProducts", fetchAllProducts);

expressRouter.post("/checkout", checkoutHandler);

expressRouter.get("/", (request, response) => {
	response.sendFile(path.join(__dirname, "../../FrontEnd/dist", "index.html"));
});

export default expressRouter;
