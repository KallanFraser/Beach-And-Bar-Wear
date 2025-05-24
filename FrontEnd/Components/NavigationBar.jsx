/** @format */
/*---------------------------------------------------------------------------------------------
								    Imports
----------------------------------------------------------------------------------------------*/
//Libary import
import { useEffect, useContext } from "react";
import Link from "next/link"; // ← Next.js Link

//Global Context Import
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
		// 1) toggle your theme
		document.body.classList.toggle("night-mode", isNight);

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
			<Link href="/HomePage">
				<img src="/images/HomePage.png" alt="Home" />
			</Link>

			<div id="clothing-categories">
				<h2>Mens</h2>
				<h2>Womens</h2>
			</div>

			<div id="navigation-bar-center-content">
				<Link href="/">
					<img src="/images/LogoScratched.png" alt="Logo" />
				</Link>
			</div>

			<div id="theme-controller">
				{/* Day button sets isDayMode = true */}
				<button className="theme-button" onClick={() => setIsDayMode(true)}>
					<img src="/images/SunIcon.png" alt="Day Mode" className="theme-icon" />
				</button>
				{/* Night button sets isDayMode = false */}
				<button className="theme-button" onClick={() => setIsDayMode(false)}>
					<img src="/images/MoonIcon.png" alt="Night Mode" className="theme-icon" />
				</button>
			</div>

			<Link href="/ViewCartPage">
				<img src="/images/Cart.png" alt="Cart" />
			</Link>
		</div>
	);
};

export default NavigationBar;
