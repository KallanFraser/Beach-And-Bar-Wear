/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

//Context import
import { GlobalContext } from "../GlobalContext.jsx";

//Component Imports
import NavigationBar from "../NavigationBar/NavigationBar.jsx";

//CSS Import
import "./ViewCartPage.css";
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const ViewCartPage = () => {
	const { cart, products } = useContext(GlobalContext);

	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/PaymentPage`);
	};

	// Function to combine cart items with product details
	const cartWithDetails = useMemo(() => {
		return cart
			.map((cartItem) => {
				// Find matching product by ID
				const product = products.find((product) => String(product.id) === String(cartItem.productId));

				//For now we will return null but later we will:
				//Add to array
				//Bulk fetch
				if (!product) return null;

				return {
					productId: cartItem.productId,
					sku: cartItem.sku,
					quantity: cartItem.quantity,
					title: product.title,
					images: product.images,
					variant: product.variants.find((v) => v.sku === cartItem.sku) || {},
				};
			})
			.filter(Boolean);
	}, [cart, products]);

	useEffect(() => {
		console.log("Cart with details:", cartWithDetails);
	}, [cartWithDetails]);

	return (
		<div id="view-cart-page">
			<NavigationBar />
			<div id="cart-list-section">
				<div id="cart-list">
					{cartWithDetails.length === 0 ? (
						<div id="empty-cart-display">
							<p>Your cart is empty.</p>
						</div>
					) : (
						cartWithDetails.map((item) => (
							<CartItemWidget
								key={`${item.productId}-${item.sku}`}
								productID={item.productId}
								sku={item.sku}
								quantity={item.quantity}
								title={item.title}
								images={item.images}
								variant={item.variant}
							/>
						))
					)}
					<div id="checkout-section">
						<button onClick={handleClick}>Check Out</button>
					</div>
				</div>
			</div>
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
                        Cart Item Widget Component
----------------------------------------------------------------------------------------------*/
const CartItemWidget = ({ productID, sku, quantity, title, images, variant }) => {
	const thumbnail =
		images && images.length > 0
			? typeof images[0] === "string"
				? images[0]
				: `data:image/jpeg;base64,${btoa(String.fromCharCode(...images[0].data))}`
			: "";

	return (
		<div id="cart-item-widget">
			<img src={thumbnail} alt={title} className="cart-item-thumb" />
			<div className="cart-item-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${variant.price?.toFixed(2) * quantity || "N/A"}</p>
			</div>
		</div>
	);
};

export default ViewCartPage;
