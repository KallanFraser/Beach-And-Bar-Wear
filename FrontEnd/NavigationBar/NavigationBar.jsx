/** @format */
/*---------------------------------------------------------------------------------------------
								    Imports
----------------------------------------------------------------------------------------------*/
//Libary import
import React from "react";
import { Link } from "react-router-dom";

//CSS import
import "./NavigationBar.css";

/*---------------------------------------------------------------------------------------------
								Navigation Component
----------------------------------------------------------------------------------------------*/
const NavigationBar = () => {
	return (
		<div id="navigation-bar">
			<Link to="/">
				<img src="/Images/UserIcon.png" alt="Logo"></img>
			</Link>
			<div id="navigation-bar-center-content">
				<img src="/Images/LogoScratched.png" alt="Logo"></img>
			</div>
			<Link to="/">
				<img src="/Images/Cart.png" alt="Logo"></img>
			</Link>
		</div>
	);
};

export default NavigationBar;
