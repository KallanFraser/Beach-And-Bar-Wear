/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";

//CSS Import
import "./main.css";

//Global Context Import
import { GlobalProvider } from "./GlobalContext";

//Component Imports
import LandingPage from "./LandingPage/LandingPage";
import HomePage from "./HomePage/HomePage";
import ViewProduct from "./ViewProduct/ViewProduct";
/*---------------------------------------------------------------------------------------------
										Entry Point
----------------------------------------------------------------------------------------------*/
createRoot(document.getElementById("root")).render(
	<GlobalProvider>
		<Router>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/HomePage" element={<HomePage />} />
				<Route path="/ViewProduct/:id" element={<ViewProduct />} />
			</Routes>
		</Router>
	</GlobalProvider>
);

//add back strict mode if errors
//	<StrictMode>
//	</StrictMode>
