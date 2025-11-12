import React from "react";
import "../styles/globals.css";
import { GlobalProvider } from "../components/GlobalContext";

import BackgroundVideo from "../components/BackgroundVideo";

export const metadata = { title: "Beach & Bar Wear" };

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="preload" as="video" href="/videos/Landing_bg_loop.mp4" type="video/mp4" />
			</head>
			<body>
				<BackgroundVideo speed={0.85} />
				<GlobalProvider>{children}</GlobalProvider>
			</body>
		</html>
	);
}
