/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//Component Imports
import NavigationBar from "../NavigationBar/NavigationBar";

//CSS Import
import "./ViewProduct.css";

//Fetch Imports
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const ViewProduct = () => {
	const { state } = useLocation();
	const product = state?.product;
	const navigate = useNavigate();

	console.log("123123", product);

	if (!product) {
		return (
			<div id="view-product">
				<NavigationBar />
				<p>No product data—go back to shop:</p>
				<button onClick={() => navigate(-1)}>Back</button>
			</div>
		);
	}

	return (
		<div id="view-product">
			<NavigationBar />
			<h1>{product.title}</h1>
		</div>
	);
};

export default ViewProduct;
