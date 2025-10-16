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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beachandbarwear.com";
// ❌ removed: const OG_IMAGE = `${SITE_URL}/images/og-hero.jpg`;

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				{/* Canonical + basic meta */}
				<link rel="canonical" href={SITE_URL} />
				<meta name="robots" content="index,follow" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta charSet="utf-8" />

				{/* Favicons */}
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<meta name="theme-color" content="#0b0b0b" />

				{/* Open Graph defaults */}
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Beach & Bar Wear" />
				<meta property="og:url" content={SITE_URL} />
				{/* ❌ removed: <meta property="og:image" content={OG_IMAGE} /> */}

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				{/* ❌ removed: <meta name="twitter:image" content={OG_IMAGE} /> */}

				{/* Organization / Website JSON-LD */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Beach & Bar Wear",
							url: SITE_URL,
							logo: `${SITE_URL}/images/LogoType.png`,
							sameAs: [],
						}),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							url: SITE_URL,
							name: "Beach & Bar Wear",
							potentialAction: {
								"@type": "SearchAction",
								target: `${SITE_URL}/search?q={query}`,
								"query-input": "required name=query",
							},
						}),
					}}
				/>
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
