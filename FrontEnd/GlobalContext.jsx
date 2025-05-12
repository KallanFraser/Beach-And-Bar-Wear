/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import React, { createContext, useState, useEffect } from "react";

//Fetch Imports
import fetchProducts from "./FetchFunctions/FetchProducts.js";
/*---------------------------------------------------------------------------------------------
									Global Context
----------------------------------------------------------------------------------------------*/
/*
Allows us to store data globally, not just in one component.
Can access and update that data from anywhere in our component tree.
Its state will persist across different pages and routes.
In other words, it will not be lost on navigation via routes.
Perfect for:
 - Logged in user info
 - Shopping cart contents
 - Preferences
*/

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	const [cart, setCart] = useState([]);

	useEffect(() => {
		fetchProducts(setProducts);
		setLoading(false);
	}, []);

	return (
		<GlobalContext.Provider value={{ products, setProducts, cart, setCart, loading }}>
			{children}
		</GlobalContext.Provider>
	);
};
