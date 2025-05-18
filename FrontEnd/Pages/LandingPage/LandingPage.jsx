/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Image imports
import BeachAndBarWearLogo from "../../Images/LogoScratched.png";
import GoToShopButtonImage from "../../Images/Shop.png";

//CSS Import
import "./LandingPage.css";

/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const LandingPage = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/HomePage");
	};

	return (
		<div id="landing-page">
			<div id="logo-section">
				<img src={BeachAndBarWearLogo} id="first" />
			</div>
			<div id="button-section">
				<button onClick={handleClick}>
					{" "}
					<img src={GoToShopButtonImage} alt="Shop" />
				</button>
			</div>
		</div>
	);
};

export default LandingPage;
