/** @format */

/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Component Imports
import NavigationBar from "../NavigationBar/NavigationBar.jsx";

//CSS Import
import "./HomePage.css";
import "./ProductCard.css";

//Fetch Imports
import fetchProducts from "../FetchFunctions/FetchProducts.js";
/*---------------------------------------------------------------------------------------------
									Product Component
----------------------------------------------------------------------------------------------*/
// A little component to show one product
function ProductCard({ product }) {
	const largeVariant = product.variants.find((v) => /(^|\W)L($|\W)/i.test(v.title));
	const [first, second] = product.imageUrls; // grab the first two

	const navigate = useNavigate();

	const handleClick = () => {
		// navigate to /ViewProduct and pass the product in state
		navigate("/ViewProduct", { state: { product } });
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
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const HomePage = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetchProducts(setProducts);
	}, []);

	return (
		<div id="home-page">
			<NavigationBar />
			<div className="products-container">
				{products.length === 0 ? (
					<p>Loading…</p>
				) : (
					products.map((p) => <ProductCard key={p.id} product={p} />)
				)}
			</div>
		</div>
	);
};

export default HomePage;
