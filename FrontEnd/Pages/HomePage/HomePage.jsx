/** @format */

/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Component Imports
import NavigationBar from "../../NavigationBar/NavigationBar.jsx";

//CSS Import
import "./HomePage.css";
import "./ProductCard.css";

//Global Context Import
import { GlobalContext } from "../../GlobalContext.jsx";
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const HomePage = () => {
	const { products, loading, isDayMode } = useContext(GlobalContext);

	//Debugging purposes
	useEffect(() => {
		if (!loading && Array.isArray(products)) {
			products.forEach((p) =>
				console.log(`Product ${p.id} → is_night_clothing = ${p.is_night_clothing}`)
			);
		}
	}, [loading, products]);

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
			<div className="products-container">
				{loading ? (
					<p>Loading…</p>
				) : (
					visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)
				)}
			</div>
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
									Product Component
----------------------------------------------------------------------------------------------*/
function ProductCard({ product }) {
	const { id, title, variants = [], imageUrls = [], images = [] } = product;

	const navigate = useNavigate();

	//Grabs the first two images of a known size always available for display
	const largeVariant = product.variants.find((v) => /(^|\W)L($|\W)/i.test(v.title));

	const first = product.imageUrls?.[0];
	const second = product.imageUrls?.[1];

	const handleClick = () => {
		navigate(`/ViewProduct/${product.id}`);
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
