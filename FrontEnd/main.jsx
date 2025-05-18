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
import LandingPage from "./Pages/LandingPage/LandingPage";
import HomePage from "./Pages/HomePage/HomePage";
import ViewProductPage from "./Pages/ViewProductPage/ViewProductPage";
import ViewCartPage from "./Pages/ViewCartPage/ViewCartPage";
import PaymentPage from "./Pages/PaymentPage/PaymentPage";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage/OrderConfirmationPage";

//Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
/*---------------------------------------------------------------------------------------------
										Entry Point
----------------------------------------------------------------------------------------------*/
createRoot(document.getElementById("root")).render(
	<Elements stripe={stripePromise}>
		<GlobalProvider>
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/HomePage" element={<HomePage />} />
					<Route path="/ViewProduct/:id" element={<ViewProductPage />} />
					<Route path="/ViewCart" element={<ViewCartPage />} />
					<Route path="/PaymentPage" element={<PaymentPage />} />
					<Route path="/OrderConfirmation" element={<OrderConfirmationPage />} />
				</Routes>
			</Router>
		</GlobalProvider>
	</Elements>
);

//add back strict mode if errors
//	<StrictMode>
//	</StrictMode>
