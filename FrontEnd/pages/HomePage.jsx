/** @format */

/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

//Component Imports
import NavigationBar from "../Components/NavigationBar.jsx";

//Global Context Import
import { GlobalContext } from "../GlobalContext.jsx";
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const HomePage = () => {
	const { products, loading, isDayMode } = useContext(GlobalContext);

	// filter based on current mode
	const visibleProducts =
		!loading && Array.isArray(products)
			? products.filter(
					(p) =>
						isDayMode
							? p.is_night_clothing === false // daytime: show only day clothing
							: p.is_night_clothing === true // night mode: show only night clothing
			  )
			: [];

	return (
		<div id="home-page">
			<NavigationBar />
			<div id="header-banner">
				<img src="/images/HorizontalLogo.png" />
			</div>
			<>
				{loading ? (
					<div id="home-page-loading">
						<p>Loading clothing now</p>
					</div>
				) : (
					<div id="first-line">
						{isDayMode && (
							<>
								<div className="summer-header">
									<h1>Summer Arrivals Collection</h1>
									<h2>Mens Swim Shorts</h2>
								</div>
								<div className="products-container">
									{visibleProducts.map((p) => {
										if (p.is_swim_short) {
											return <ProductCard key={p.id} product={p} />;
										}
										return null; // ensure something is returned for every item
									})}
								</div>
							</>
						)}
						<div className="summer-header">
							<h1>Summer Arrivals Collection</h1>
							<h2>Oversized DJ Tee's</h2>
						</div>
						<div className="products-container">
							{visibleProducts.map((p) => {
								if (p.is_dj_oversized) {
									return <ProductCard key={p.id} product={p} />;
								}
							})}
						</div>
						<div className="summer-header">
							<h1>Summer Arrivals Collection</h1>
							<h2>Boxy Oversized Tee's</h2>
						</div>
						<div className="products-container">
							{visibleProducts.map((p) => {
								if (p.is_boxy_oversized) {
									return <ProductCard key={p.id} product={p} />;
								}
							})}
						</div>
						<div className="summer-header">
							<h1>Summer Arrivals Collection</h1>
							<h2>Mens Hoodies</h2>
						</div>
						<div className="products-container">
							{visibleProducts.map((p) => {
								if (p.is_hoodie) {
									return <ProductCard key={p.id} product={p} />;
								}
							})}
						</div>
					</div>
				)}
			</>
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
									Product Component
----------------------------------------------------------------------------------------------*/
function ProductCard({ product }) {
	const router = useRouter();

	// pick a “large” variant (unchanged)
	const largeVariant = product.variants.find((v) => /(^|\W)L($|\W)/i.test(v.title));

	// find front/back objects (they now have `.path` instead of `.src`)
	const frontObj = product.images.find((img) => !img.is_back) || null;
	const backObj = product.images.find((img) => img.is_back) || null;

	// use the static file path directly—no base64 prefix
	const frontUrl = frontObj ? frontObj.path : null;
	const backUrl = backObj ? backObj.path : null;

	const handleClick = () => {
		router.push(`/ViewProductPage/${product.id}`);
	};

	return (
		<div className="product-card" onClick={handleClick}>
			{!product.is_swim_short && (
				<div className="image-swapper">
					{backUrl && <img className="primary" src={backUrl} alt={product.title} />}
					{frontUrl && <img className="secondary" src={frontUrl} alt={product.title} />}
				</div>
			)}
			{product.is_swim_short && (
				<div className="image-swapper">
					{frontUrl && <img className="primary" src={frontUrl} alt={product.title} />}
					{backUrl && <img className="secondary" src={backUrl} alt={product.title} />}
				</div>
			)}
			<ul className="price-section">
				{largeVariant && <li key={largeVariant.id}>${largeVariant.price.toFixed(2)}</li>}
			</ul>
		</div>
	);
}

export default HomePage;
