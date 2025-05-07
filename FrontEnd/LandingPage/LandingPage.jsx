/** @format */

/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState } from "react";

//Component Imports
import NavigationBar from "../NavigationBar/NavigationBar.jsx";

//CSS Import
import "./LandingPage.css";
import "./ProductCard.css";

//Fetch Imports
import fetchProducts from "../FetchFunctions/FetchProducts.js";
/*---------------------------------------------------------------------------------------------
									Product Component
----------------------------------------------------------------------------------------------*/
// A little component to show one product
function ProductCard({ product }) {
	const largeVariant = product.variants.find((v) => /\bL\b/.test(v.title));
	const [first, second] = product.imageUrls; // grab the first two

	return (
		<div className="product-card">
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
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const LandingPage = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		// pass in the setter so fetchProducts can populate state
		fetchProducts(setProducts);
	}, []); // ← run only once

	return (
		<div id="landing-page">
			<NavigationBar />
			<div id="products-container">
				<div className="product-list">
					{products.length === 0 ? (
						<p>Loading…</p>
					) : (
						products.map((p) => <ProductCard key={p.id} product={p} />)
					)}
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
