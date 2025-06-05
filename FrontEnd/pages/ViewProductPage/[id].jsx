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

	// find front/back objects (they now have `.path` instead of `.src`)
	const frontObj = product.images.find((img) => !img.is_back) || null;
	const backObj = product.images.find((img) => img.is_back) || null;

	// use the static file path directly—no base64 prefix
	const frontUrl = frontObj ? frontObj.path : null;
	const backUrl = backObj ? backObj.path : null;

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
				<div id="top-logo">
					<img src="/images/LogoHorizontal.png" id="top-level-logo" />
				</div>
				<h1>{product.title}</h1>
				<ButtonAndCartSection productId={product.id} productVariantData={product.variants} />
				<div id="socials-area">
					<h2>Interested in What you see?</h2>
					<h3>Check Us Out On These Platforms For More</h3>
					<div id="social-links">
						<a
							href="https://www.instagram.com/beachandbarco/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="/images/InstagramLogo.png"
								alt="Instagram"
								style={{ width: 32, height: 32, cursor: "pointer" }}
							/>
						</a>

						<a
							href="https://www.tiktok.com/@thebeachandbarcompany"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="/images/TikTokLogo.png"
								alt="TikTok"
								style={{ width: 32, height: 32, cursor: "pointer" }}
							/>
						</a>
					</div>
				</div>
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
