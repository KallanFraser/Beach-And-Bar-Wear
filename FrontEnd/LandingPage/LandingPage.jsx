/** @format */

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
										Imports
   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//Library Imports
import React, { useEffect } from "react";

//Component Imports

//CSS Import
import "./LandingPage.css";

//Fetch Imports
import fetchProducts from "../FetchFunctions/FetchProducts.js";
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
									 Main Component
   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const LandingPage = () => {
	useEffect(() => {
		fetchProducts();
	});

	return (
		<div id="landing-page">
			<h1>Hello world</h1>
		</div>
	);
};

export default LandingPage;
