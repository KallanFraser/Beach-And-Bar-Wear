/** @format */
/*---------------------------------------------------------------------------------------------
                                        Imports
----------------------------------------------------------------------------------------------*/
// Global CSS
import "../Styles/globals.css";
import "../Styles/LandingPage.css";
import "../Styles/HomePage.css";
import "../Styles/ViewProductPage.css";
import "../Styles/ViewCartPage.css";
import "../Styles/PaymentPage.css";
import "../Styles/OrderConfirmationPage.css";
import "../Styles/ButtonAndCartSection.css";
import "../Styles/NavigationBar.css";
import "../Styles/ProductCard.css";

import Script from "next/script";

// Global Context
import { GlobalProvider } from "../GlobalContext";

/*---------------------------------------------------------------------------------------------
                                        Main App
----------------------------------------------------------------------------------------------*/
export default function App({ Component, pageProps }) {
	return (
		<>
			<Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
			<GlobalProvider>
				<Component {...pageProps} />
			</GlobalProvider>
		</>
	);
}

//<Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
