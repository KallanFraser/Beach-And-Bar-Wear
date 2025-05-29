/** @format */
/*---------------------------------------------------------------------------------------------
                                 Imports
----------------------------------------------------------------------------------------------*/
// Library import
import { useEffect, useContext } from "react";
import Link from "next/link"; // ← Next.js Link

// Global Context Import
import { GlobalContext } from "../GlobalContext.jsx";

/*---------------------------------------------------------------------------------------------
                             Navigation Component
----------------------------------------------------------------------------------------------*/
const NavigationBar = () => {
	// Pull from global context:
	const { isDayMode, setIsDayMode } = useContext(GlobalContext);

	// Derive local flag for convenience:
	const isNight = !isDayMode;

	useEffect(() => {
		// 1) toggle theme class on both <body> and <html>
		document.body.classList.toggle("night-mode", isNight);
		document.documentElement.classList.toggle("night-mode", isNight);

		// 2) create & style the full-screen overlay
		const overlay = document.createElement("div");
		overlay.className = "mode-overlay";
		document.body.appendChild(overlay);

		// 3) trigger the fade out on next frame
		requestAnimationFrame(() => {
			overlay.style.opacity = "0";
		});

		// 4) clean up when the fade finishes
		const cleanup = () => {
			overlay.removeEventListener("transitionend", cleanup);
			if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
		};
		overlay.addEventListener("transitionend", cleanup);

		// in case the component unmounts mid-fade
		return () => {
			overlay.removeEventListener("transitionend", cleanup);
			if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
		};
	}, [isNight]);

	return (
		<div id="navigation-bar">
			<Link href="/HomePage" className="page-icon">
				<img src="/images/HomePage.png" alt="Home" />
			</Link>

			<div id="theme-controller">
				{/* Day button sets isDayMode = true */}
				<button className="theme-button" onClick={() => setIsDayMode(true)}>
					<Link href="/HomePage">
						<img src="/images/DayWear.png" alt="Day Mode" className="theme-icon" />
					</Link>
				</button>
			</div>

			<div id="navigation-bar-center-content">
				<Link href="/">
					<img src="/images/LogoScratched.png" alt="Logo" />
				</Link>
			</div>

			<div id="theme-controller">
				{/* Night button sets isDayMode = false */}
				<button className="theme-button" onClick={() => setIsDayMode(false)}>
					<Link href="/HomePage">
						<img src="/images/NightWear.png" alt="Night Mode" className="theme-icon" />
					</Link>
				</button>
			</div>

			<Link href="/ViewCartPage" className="page-icon">
				<img src="/images/Cart.png" alt="Cart" />
			</Link>
		</div>
	);
};

export default NavigationBar;
