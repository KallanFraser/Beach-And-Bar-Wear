/** @format */
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
import { GlobalProvider } from "../GlobalContext";

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Beach & Bar Wear | Coastal Clothing for Endless Summers</title>
				<meta
					name="description"
					content="Shop Beach & Bar Wear — premium coastal clothing inspired by sun, sand, and seaside nights. Find breezy shirts, resort sets, and accessories that capture the summer lifestyle."
				/>
				<meta
					name="keywords"
					content="beachwear, resort wear, summer clothing, vacation outfits, coastal fashion, beach shirts, bar attire, linen sets, tropical wear"
				/>
				<meta name="author" content="Kallan Fraser" />
				<meta name="robots" content="index, follow" />

				{/* Open Graph (for Facebook, LinkedIn, etc.) */}
				<meta property="og:title" content="Beach & Bar Wear | Coastal Clothing for Endless Summers" />
				<meta
					property="og:description"
					content="Effortless coastal fashion. Premium resort wear for days on the beach and nights at the bar."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://beachandbarwear.com" />
				<meta property="og:site_name" content="Beach & Bar Wear" />
				<meta property="og:image" content="/images/LogoType.png" />

				{/* Twitter Card */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Beach & Bar Wear | Coastal Clothing for Endless Summers"
				/>
				<meta
					name="twitter:description"
					content="Discover relaxed, resort-inspired apparel perfect for beaches, bars, and beyond."
				/>
				<meta name="twitter:image" content="/images/LogoType.png" />

				{/* Favicon */}
				<link rel="icon" type="image/png" href="/images/LogoType.png" />
			</Head>

			{/* Google + Stripe Scripts */}
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
