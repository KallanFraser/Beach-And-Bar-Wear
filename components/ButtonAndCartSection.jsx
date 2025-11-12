/** @format */
"use client";

/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { useEffect, useMemo, useState, useContext } from "react";
// If this file lives in /components, this is the correct relative path:
import { GlobalContext } from "./GlobalContext.jsx";

/*---------------------------------------------------------------------------------------------
                              Right Column / Variant Listings
----------------------------------------------------------------------------------------------*/
const ButtonAndCartSection = ({ productId, productVariantData = [] }) => {
	const { cart, setCart } = useContext(GlobalContext);
	const [selectedSKU, setSelectedSKU] = useState("");
	const [quantity, setQuantity] = useState(1);

	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("success");

	// Normalize variant fields from products.json writer
	const variants = useMemo(() => {
		return (Array.isArray(productVariantData) ? productVariantData : []).map((v) => {
			const sku = v.variant_sku ?? v.sku ?? "";
			const title = v.variant_title ?? v.title ?? "";
			const inStock = typeof v.in_stock === "boolean" ? v.in_stock : Boolean(v.variant_availability);
			const price = typeof v.variant_price === "number" ? v.variant_price : v.price;

			return { sku, title, in_stock: inStock, price };
		});
	}, [productVariantData]);

	// Select a size
	const handleSelect = (variant) => {
		if (variant.in_stock) {
			setSelectedSKU(variant.sku);
			setQuantity(1);
		}
	};

	// Clamp qty 1..10, numeric only
	const changeQty = (newQty) => {
		let q = Number(newQty);
		if (!Number.isFinite(q)) q = 1;
		if (q < 1) q = 1;
		if (q > 10) q = 10;
		setQuantity(q);
	};

	// Add to cart (merge if same productId+sku)
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
						item.productId === productId && item.sku === selectedSKU ? { ...item, quantity: item.quantity + quantity } : item
					)
				);
			} else {
				setCart([...cart, { productId, sku: selectedSKU, quantity }]);
			}

			setMessage(`${quantity} Item${quantity !== 1 ? "s" : ""} Added To Your Cart`);
			setMessageType("success");
		} catch {
			setMessage("Failed To Add Items To Your Cart");
			setMessageType("error");
		}
	};

	// auto-dismiss alert after 10s
	useEffect(() => {
		if (!message) return;
		const t = setTimeout(() => setMessage(""), 10000);
		return () => clearTimeout(t);
	}, [message]);

	return (
		<>
			{/*---------------- Size Buttons Section -------------------*/}
			<div id="variant-listings">
				{variants.map((variant) => {
					const isSelected = variant.sku === selectedSKU;
					const baseClass = variant.in_stock ? "in-stock-button" : "not-in-stock-button";
					const classes = variant.in_stock ? `${baseClass}${isSelected ? " in-stock-selected" : ""}` : baseClass;

					return (
						<button key={variant.sku} className={classes} onClick={() => handleSelect(variant)} disabled={!variant.in_stock}>
							{variant.title}
						</button>
					);
				})}
			</div>

			{/*---------------- Quantity + Add to Cart Section -------------------*/}
			<div id="cart-section">
				<div className="qty-controls">
					<button className="quantity-change-button" onClick={() => changeQty(quantity - 1)} disabled={quantity <= 1}>
						−
					</button>

					<input type="number" min="1" max="10" value={quantity} onChange={(e) => changeQty(e.target.value)} />

					<button className="quantity-change-button" onClick={() => changeQty(quantity + 1)} disabled={quantity >= 10}>
						+
					</button>
				</div>

				<button
					id="cart-button"
					onClick={addToCart}
					disabled={!selectedSKU}
					className={selectedSKU ? "add-to-cart-enabled" : "add-to-cart-disabled"}
				>
					Add to Cart
				</button>
			</div>

			{/* Alert */}
			{message ? <div className={`alert ${messageType}`}>{message}</div> : null}
		</>
	);
};

export default ButtonAndCartSection;
