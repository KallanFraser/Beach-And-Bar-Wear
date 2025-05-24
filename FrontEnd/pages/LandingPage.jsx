/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import { useRouter } from "next/router";
import React from "react";

/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const LandingPage = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push("/HomePage");
	};

	return (
		<div id="landing-page">
			<div id="logo-section">
				<img src="/images/LogoScratched.png" id="first" />
			</div>
			<div id="button-section">
				<button onClick={handleClick}>
					{" "}
					<img src="/images/Shop.png" alt="Shop" />
				</button>
			</div>
		</div>
	);
};

export default LandingPage;
