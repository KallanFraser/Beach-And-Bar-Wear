/** @format */
/* =============================================================================
   NavigationBar.jsx
   - Keeps Home / Logo / Cart image links
   - Day/Night toggles now text buttons (new font), same functionality
   - Uses overlay fade + toggles html/body .night-mode (unchanged behavior)
============================================================================= */

import { useEffect, useContext } from "react";
import Link from "next/link";
import { GlobalContext } from "../GlobalContext.jsx";

const NavigationBar = () => {
	const { isDayMode, setIsDayMode } = useContext(GlobalContext);
	const isNight = !isDayMode;

	useEffect(() => {
		// Toggle theme classes on <body> and <html> (your wallpaper depends on html.night-mode)
		document.body.classList.toggle("night-mode", isNight);
		document.documentElement.classList.toggle("night-mode", isNight);

		// Fade overlay during mode switch (same behavior, cleaner cleanup)
		const overlay = document.createElement("div");
		overlay.className = "mode-overlay";
		document.body.appendChild(overlay);
		requestAnimationFrame(() => {
			overlay.style.opacity = "0";
		});

		const cleanup = () => {
			overlay.removeEventListener("transitionend", cleanup);
			overlay.remove();
		};
		overlay.addEventListener("transitionend", cleanup);

		return () => {
			overlay.removeEventListener("transitionend", cleanup);
			if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
		};
	}, [isNight]);

	return (
		<div id="navigation-bar">
			{/* Left: Home */}
			<Link href="/HomePage" className="page-icon" aria-label="Home">
				<img src="/images/HomePage.png" alt="Home" />
			</Link>

			{/* Left Center: Day Mode */}
			<div id="theme-controller">
				<Link href="/HomePage" className="mode-link" aria-label="Switch to Day Mode">
					<button
						className={`theme-button ${isDayMode ? "is-active" : ""}`}
						data-theme="day"
						onClick={() => setIsDayMode(true)}
					>
						Beachwear
					</button>
				</Link>
			</div>

			{/* Center: Logo */}
			<div id="navigation-bar-center-content">
				<Link href="/" aria-label="Go to landing page">
					<img src="/images/LogoScratched.png" alt="Logo" />
				</Link>
			</div>

			{/* Right Center: Night Mode */}
			<div id="theme-controller">
				<Link href="/HomePage" className="mode-link" aria-label="Switch to Night Mode">
					<button
						className={`theme-button ${!isDayMode ? "is-active" : ""}`}
						data-theme="night"
						onClick={() => setIsDayMode(false)}
					>
						Barwear
					</button>
				</Link>
			</div>

			{/* Right: Cart */}
			<Link href="/ViewCartPage" className="page-icon" aria-label="View Cart">
				<img src="/images/Cart.png" alt="Cart" />
			</Link>
		</div>
	);
};

export default NavigationBar;
