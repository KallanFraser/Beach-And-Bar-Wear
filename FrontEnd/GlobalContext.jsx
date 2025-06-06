/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import { createContext, useState, useEffect } from "react";

import fetchProducts from "./FetchFunctions/FetchProducts.js";
/*---------------------------------------------------------------------------------------------
									Global Context
----------------------------------------------------------------------------------------------*/
//Allows us to share state across multipel components without having to pass them through
//every layer of our component tree (i.e prop drilling - sucks dick)
//Essentially it is just global state that can be accessed from any nested component

//Creates a new context object and exports it to be used in our React / Next.js App
//Note that this basically just works by wrapping our entire App in this
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [products, setProducts] = useState([]); //stores all our product data
	const [loading, setLoading] = useState(true); //bool variable for if we are still waiting on fetch

	const [cart, setCart] = useState([]); //represents items in the cart (modified product objects)

	const [isDayMode, setIsDayMode] = useState(true); //For the theme controller across the app

	//Also this is where we actually fetch our product data rather than in app.jsx
	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true);
			await fetchProducts(setProducts);
			setLoading(false);
		};
		loadProducts();
	}, []);

	return (
		<GlobalContext.Provider
			value={{ products, setProducts, cart, setCart, loading, isDayMode, setIsDayMode }}
		>
			{children}
		</GlobalContext.Provider>
	);
};
