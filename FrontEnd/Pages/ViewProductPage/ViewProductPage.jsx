/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";

//Component Imports
import NavigationBar from "../../NavigationBar/NavigationBar.jsx";
import ButtonAndCartSection from "./Components/ButtonAndCartSection.jsx";

//CSS Import
import "./ViewProductPage.css";

//Global Context import
import { GlobalContext } from "../../GlobalContext";
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const ViewProductPage = () => {
	const { id } = useParams(); //The Product ID

	//Retrieves all products from our global context storage container
	const { products, loading } = useContext(GlobalContext);

	//Finds the product from our global context storage container
	const product = products.find((p) => String(p.id) === id);

	return (
		<div id="view-product">
			<NavigationBar />
			{product ? <ProductCard product={product} /> : <Loading />}
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
								Product Card
----------------------------------------------------------------------------------------------*/
const ProductCard = ({ product }) => {
	// Code to select only the first two images
	const first = product.imageUrls?.[0];
	const second = product.imageUrls?.[1];

	const [modalSrc, setModalSrc] = useState(null);

	return (
		<div id="product-card">
			<div id="left-column">
				{first && (
					<div className="image-container" onClick={() => setModalSrc(first)}>
						<img src={first} alt={`${product.title} 1`} />
					</div>
				)}
				{second && (
					<div className="image-container" onClick={() => setModalSrc(second)}>
						<img src={second} alt={`${product.title} 2`} />
					</div>
				)}
			</div>
			<div id="right-column">
				<h1>{product.title}</h1>
				<ButtonAndCartSection productId={product.id} productVariantData={product.variants} />
			</div>
			{modalSrc && <ImageModal src={modalSrc} onClose={() => setModalSrc(null)} />}
		</div>
	);
};
/*---------------------------------------------------------------------------------------------
                                Image Modal Component
----------------------------------------------------------------------------------------------*/
// Code for when you click on an image to fullscreen it
const ImageModal = ({ src, onClose }) => {
	return (
		<div className="image-modal-overlay" onClick={onClose}>
			<img className="image-modal-image" src={src} alt="Enlarged view" />
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
								Loading Display
----------------------------------------------------------------------------------------------*/
const Loading = () => {
	return (
		<div id="loading">
			<h1>Loading Clothing Item Now...</h1>
		</div>
	);
};

export default ViewProductPage;
