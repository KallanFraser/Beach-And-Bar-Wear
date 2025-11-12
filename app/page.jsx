/** @format */
/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import Link from "next/link";

//Style imports
import "../styles/LandingPage.css";

/*---------------------------------------------------------------------------------------------
                                Main Component
----------------------------------------------------------------------------------------------*/
const LandingPage = () => {
	return (
		<div id="landing-page">
			<div id="logo-section">
				<img src="/images/LogoScratched.png" id="first" />
			</div>

			<div id="button-section">
				<Link href="/home" className="button gotoshop-btn" aria-label="Go to shop">
					<img src="/images/GoToShop.png" alt="" className="btn-img" />
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;
