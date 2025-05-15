/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";

//Context import
import { GlobalContext } from "../GlobalContext.jsx";

//Component Imports
import NavigationBar from "../NavigationBar/NavigationBar.jsx";

//CSS Import
import "./ViewProductPage.css";

//Fetch Imports
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const ViewProductPage = () => {
	const { id } = useParams();
	console.log("Product ID from URL:", id);

	const { products, loading } = useContext(GlobalContext);

	const product = products.find((p) => String(p.id) === id); // match id safely

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
	//console.log("Product Data: ", product);

	// Function to convert each Buffer-like object to a Base64 data-URL
	const imageUrls = useMemo(() => {
		return product.images.map((img) => {
			// if it’s already a string URL, just return it:
			if (typeof img === "string") return img;
			// else it’s JSON-serialized Buffer { data: [...] }
			const bytes = img.data;
			let binary = "";
			for (let i = 0; i < bytes.length; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			return `data:image/jpeg;base64,${btoa(binary)}`;
		});
	}, [product.images]);

	// Only using the first two images
	const [first, second] = imageUrls;
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
				<Variants productId={product.id} productVariantData={product.variants} />
			</div>
			{modalSrc && <ImageModal src={modalSrc} onClose={() => setModalSrc(null)} />}
		</div>
	);
};
/*---------------------------------------------------------------------------------------------
                                Image Modal Component
----------------------------------------------------------------------------------------------*/
// ImageModal.jsx (or inline in your file)
const ImageModal = ({ src, onClose }) => {
	return (
		<div className="image-modal-overlay" onClick={onClose}>
			<img className="image-modal-image" src={src} alt="Enlarged view" />
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
							Right Column / Variant Listings
----------------------------------------------------------------------------------------------*/
const Variants = ({ productId, productVariantData }) => {
	//console.log("Product variants data: ", productVariantData);

	const { cart, setCart } = useContext(GlobalContext);
	const [selectedSKU, setSelectedSKU] = useState("");
	const [quantity, setQuantity] = useState(1);

	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("success");

	const handleSelect = (variant) => {
		if (variant.in_stock) {
			setSelectedSKU(variant.sku);
			setQuantity(1); // reset quantity when switching variant
		}
	};

	const changeQty = (newQty) => {
		if (isNaN(newQty) || newQty < 1) newQty = 1;
		else if (newQty > 10) newQty = 10;
		setQuantity(newQty);
	};

	const addToCart = () => {
		if (!selectedSKU) {
			setMessage("Please select a variant before adding to cart");
			setMessageType("error");
			return;
		}

		try {
			const existing = cart.find((item) => item.productId === productId && item.sku === selectedSKU);

			if (existing) {
				setCart(
					cart.map((item) =>
						item.productId === productId && item.sku === selectedSKU
							? { ...item, quantity: item.quantity + quantity }
							: item
					)
				);
			} else {
				setCart([...cart, { productId, sku: selectedSKU, quantity }]);
			}

			setMessage(`${quantity} item${quantity !== 1 ? "s" : ""} successfully added to cart`);
			setMessageType("success");
		} catch (err) {
			setMessage("Failed to add items to cart");
			setMessageType("error");
		}
	};

	// auto-dismiss toast after 3s
	useEffect(() => {
		if (!message) return;
		const t = setTimeout(() => setMessage(""), 10000);
		return () => clearTimeout(t);
	}, [message]);

	return (
		<>
			<div id="variant-listings">
				{productVariantData.map((variant) => {
					const isSelected = variant.sku === selectedSKU;

					// base class for in-stock vs out-of-stock
					const baseClass = variant.in_stock ? "in-stock-button" : "not-in-stock-button";

					// if in-stock & clicked, also add selected class
					const classes = variant.in_stock
						? `${baseClass}${isSelected ? " in-stock-selected" : ""}`
						: baseClass;

					return (
						<button
							key={variant.sku}
							className={classes}
							onClick={() => handleSelect(variant)}
							disabled={!variant.in_stock}
						>
							{variant.title}
							<br />${variant.price}
						</button>
					);
				})}
			</div>
			<div id="cart-section">
				<div className="qty-controls">
					<button onClick={() => changeQty(quantity - 1)} disabled={quantity <= 1}>
						−
					</button>
					<input
						type="number"
						min="1"
						max="10"
						value={quantity}
						onChange={(e) => changeQty(+e.target.value)}
					/>
					<button onClick={() => changeQty(quantity + 1)} disabled={quantity >= 10}>
						+
					</button>
				</div>

				<button
					onClick={addToCart}
					disabled={!selectedSKU}
					className={selectedSKU ? "add-to-cart-enabled" : "add-to-cart-disabled"}
				>
					Add to Cart
				</button>
			</div>
			<div className={`alert ${messageType}`}> {message} </div>{" "}
		</>
	);
};
/*---------------------------------------------------------------------------------------------
								Loading Display
----------------------------------------------------------------------------------------------*/
const Loading = () => {
	return (
		<div id="loading">
			<h1>Loading Clothing Item...</h1>
		</div>
	);
};

export default ViewProductPage;
