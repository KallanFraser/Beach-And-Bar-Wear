/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";

import "./main.css";

import LandingPage from "./LandingPage/LandingPage";
import HomePage from "./HomePage/HomePage";
import ViewProduct from "./ViewProduct/ViewProduct";
/*---------------------------------------------------------------------------------------------
										Entry Point
----------------------------------------------------------------------------------------------*/
createRoot(document.getElementById("root")).render(
	<Router>
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/HomePage" element={<HomePage />} />
			<Route path="/ViewProduct" element={<ViewProduct />} />
		</Routes>
	</Router>
);

//add back strict mode if errors
//	<StrictMode>
//	</StrictMode>
