/** @format */
"use client";

/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "next/navigation";

import NavigationBar from "../../../components/NavigationBar.jsx";
import ButtonAndCartSection from "../../../components/ButtonAndCartSection.jsx";
import { GlobalContext } from "../../../components/GlobalContext";

import "../../../styles/ButtonAndCartSection.css";
import "../../../styles/ViewProductPage.css";

/*---------------------------------------------------------------------------------------------
                                Main Component
----------------------------------------------------------------------------------------------*/
const ViewProductPage = () => {
	const { productID } = useParams(); // /viewProduct/[productID]
	const {
		/* cart context is available if ButtonAndCartSection uses it */
	} = useContext(GlobalContext);

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	// Load products.json (same source as HomePage)
	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				const res = await fetch("/data/products.json", { cache: "no-store" });
				if (!res.ok) throw new Error(`products.json ${res.status}`);
				const data = await res.json();
				if (!ignore) setProducts(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error("Failed to load /data/products.json:", e?.message || e);
				if (!ignore) setProducts([]);
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => {
			ignore = true;
		};
	}, []);

	// Find product by id (ids from Printify are strings)
	const product = useMemo(() => {
		if (!Array.isArray(products)) return null;
		return products.find((p) => String(p.id) === String(productID)) || null;
	}, [products, productID]);

	return (
		<div id="view-product">
			<NavigationBar />
			{loading ? <Loading /> : product ? <ProductCard product={product} /> : <NotFound />}
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
                                Product Card
----------------------------------------------------------------------------------------------*/
const ProductCard = ({ product }) => {
	const [modalSrc, setModalSrc] = useState(null);

	// prefer explicit front/back if present
	const frontObj = Array.isArray(product.images) ? product.images.find((img) => !img.is_back) : null;
	const backObj = Array.isArray(product.images) ? product.images.find((img) => img.is_back) : null;

	const frontUrl = frontObj ? frontObj.path : null;
	const backUrl = backObj ? backObj.path : null;

	return (
		<div id="product-card">
			<div id="left-column">
				{backUrl && (
					<div className="image-container" onClick={() => setModalSrc(backUrl)}>
						<img src={backUrl} alt={`${product.title} back`} />
					</div>
				)}
				{frontUrl && (
					<div className="image-container" onClick={() => setModalSrc(frontUrl)}>
						<img src={frontUrl} alt={`${product.title} front`} />
					</div>
				)}
			</div>

			<div id="right-column">
				<div id="top-logo">
					<img src="/images/LogoHorizontal.png" id="top-level-logo" alt="Brand" />
				</div>

				<h1>{product.title}</h1>

				{/* Variants come from products.json */}
				<ButtonAndCartSection productId={product.id} productVariantData={Array.isArray(product.variants) ? product.variants : []} />

				<div id="socials-area">
					<h2>Interested in What you see?</h2>
					<h3>Check Us Out On These Platforms For More</h3>
					<div id="social-links">
						<a href="https://www.instagram.com/beachandbarco/" target="_blank" rel="noopener noreferrer">
							<img src="/images/InstagramLogo.png" alt="Instagram" style={{ width: 32, height: 32, cursor: "pointer" }} />
						</a>
						<a href="https://www.tiktok.com/@thebeachandbarcompany" target="_blank" rel="noopener noreferrer">
							<img src="/images/TikTokLogo.png" alt="TikTok" style={{ width: 32, height: 32, cursor: "pointer" }} />
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
const ImageModal = ({ src, onClose }) => {
	return (
		<div className="image-modal-overlay" onClick={onClose}>
			<img className="image-modal-image" src={src} alt="Enlarged view" />
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
                                Loading / Not Found
----------------------------------------------------------------------------------------------*/
const Loading = () => (
	<div id="loading-clothing-item">
		<h1>Loading Clothing Item Now...</h1>
	</div>
);

const NotFound = () => (
	<div id="loading-clothing-item">
		<h1>Item not found.</h1>
	</div>
);

export default ViewProductPage;
