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
			<>
				{loading ? (
					<div id="home-page-loading">
						<p>Loading clothing now</p>
					</div>
				) : (
					<div id="first-line">
						<h1>Summer Arrivals Collection</h1>
						<div className="products-container">
							{visibleProducts.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
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
	const { id, title, variants = [], imageUrls = [], images = [] } = product;

	const router = useRouter();

	//Grabs the first two images of a known size always available for display
	const largeVariant = product.variants.find((v) => /(^|\W)L($|\W)/i.test(v.title));

	const first = product.imageUrls?.[0];
	const second = product.imageUrls?.[1];

	const handleClick = () => {
		router.push(`/ViewProductPage/${product.id}`);
	};

	return (
		<div className="product-card" onClick={handleClick}>
			<div className="image-swapper">
				{first && <img className="primary" src={first} alt={product.title} />}
				{second && <img className="secondary" src={second} alt={product.title} />}
			</div>
			<ul className="price-section">
				{largeVariant && <li key={largeVariant.id}> ${largeVariant.price.toFixed(2)}</li>}
			</ul>
		</div>
	);
}

export default HomePage;
