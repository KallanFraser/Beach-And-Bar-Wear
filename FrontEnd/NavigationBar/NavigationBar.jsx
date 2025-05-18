/** @format */
/*---------------------------------------------------------------------------------------------
								    Imports
----------------------------------------------------------------------------------------------*/
//Libary import
import React from "react";
import { Link } from "react-router-dom";

//Image Imports
import userIcon from "../Images/UserIcon.png";
import mainLogo from "../Images/LogoScratched.png";
import cartIcon from "../Images/Cart.png";
import homeButton from "../Images/HomePage.png";

//CSS import
import "./NavigationBar.css";

/*---------------------------------------------------------------------------------------------
								Navigation Component
----------------------------------------------------------------------------------------------*/
const NavigationBar = () => {
	return (
		<div id="navigation-bar">
			<Link to="/HomePage">
				<img src={homeButton} alt="Logo"></img>
			</Link>
			<div id="navigation-bar-center-content">
				<Link to="/">
					<img src={mainLogo} alt="Logo"></img>
				</Link>
			</div>
			<Link to="/ViewCart">
				<img src={cartIcon} alt="Logo"></img>
			</Link>
		</div>
	);
};

export default NavigationBar;
