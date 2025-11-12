/** @format */
"use client";
import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [cart, setCart] = useState([]); // session cart (resets on full reload)
	const [isDayMode, setIsDayMode] = useState(true); // theme toggle (session only)

	return <GlobalContext.Provider value={{ cart, setCart, isDayMode, setIsDayMode }}>{children}</GlobalContext.Provider>;
};
