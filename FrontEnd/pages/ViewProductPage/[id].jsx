/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import { useState, useContext } from "react";

//Component Imports
import NavigationBar from "../../Components/NavigationBar.jsx";
import ButtonAndCartSection from "../../Components/ButtonAndCartSection.jsx";

//Global Context import
import { GlobalContext } from "../../GlobalContext.jsx";

//Router Import for Param
import { useRouter } from "next/router";
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const ViewProductPage = () => {
	const router = useRouter();
	const { id } = router.query;

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

	const frontObj = product.images.find((img) => img.is_back === false) || null;
	const backObj = product.images.find((img) => img.is_back === true) || null;

	const frontUrl = frontObj ? `data:image/jpeg;base64,${frontObj.src}` : null;
	const backUrl = backObj ? `data:image/jpeg;base64,${backObj.src}` : null;

	return (
		<div id="product-card">
			<div id="left-column">
				{backUrl && (
					<div className="image-container" onClick={() => setModalSrc(backUrl)}>
						<img src={backUrl} alt={`${product.title} 1`} />
					</div>
				)}
				{frontUrl && (
					<div className="image-container" onClick={() => setModalSrc(frontUrl)}>
						<img src={frontUrl} alt={`${product.title} 2`} />
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
		<div id="loading-clothing-item">
			<h1>Loading Clothing Item Now...</h1>
		</div>
	);
};

export default ViewProductPage;
