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
import Head from "next/head";

// Global Context
import { GlobalProvider } from "../GlobalContext";

/*---------------------------------------------------------------------------------------------
                                        Main App
----------------------------------------------------------------------------------------------*/
export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<link rel="icon" type="image/png" href="/images/LogoType.png" />
			</Head>
			<Script
				strategy="afterInteractive"
				src="https://www.googletagmanager.com/gtag/js?id=AW-17120768042"
			/>
			<Script
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17120768042');
          `,
				}}
			/>
			<Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
			<GlobalProvider>
				<Component {...pageProps} />
			</GlobalProvider>
		</>
	);
}

//<Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
