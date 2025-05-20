/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Component Imports
import NavigationBar from "../../NavigationBar/NavigationBar.jsx";

//Global context import
import { GlobalContext } from "../../GlobalContext.jsx";

//Stripe imports
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

//CSS Imports
import "./PaymentPage.css";

/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
export default function PaymentPage() {
	const { cart, products } = useContext(GlobalContext);
	const navigate = useNavigate();
	const stripe = useStripe();
	const elements = useElements();

	// Constructing each cart item with its product details
	const cartWithDetails = useMemo(() => {
		//for each cart item...
		return cart
			.map((cartItem) => {
				//Find the product data for said cart item
				const product = products.find((p) => String(p.id) === String(cartItem.productId));

				if (!product) {
					console.warn(`⚠️ Product with ID ${cartItem.productId} not found in product list.`);
				}

				//If product data for cart item does exist...
				return {
					productId: cartItem.productId,
					sku: cartItem.sku,
					quantity: cartItem.quantity,
					title: product.title,
					imageUrls: product.imageUrls,
					variant: product.variants.find((v) => v.sku === cartItem.sku) || {},
				};
			})
			.filter(Boolean);
	}, [cart, products]);

	// Shipping form state
	// Note that country must be as ISO code
	// Default = US
	const [shippingInfo, setShippingInfo] = useState({
		fullName: "",
		email: "",
		phone: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		country: "US",
	});

	//Fixed the shipping cost for now too
	const shippingCost = 10;

	//Also fixed the tax for now as well
	const tax = 4.5;

	// Submission state
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	// Handlers for any change in a shipping information value
	// Will ensure that name value pair is auto updated on any change
	const handleShippingChange = (e) => {
		const { name, value } = e.target;
		// will add or change name whilst preserving other values
		// ...prev copies all existing key value pairs stored in prev.
		// This way we simply merge or update the new object into the prev data.
		setShippingInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevents page refresh default behavior

		setIsSubmitting(true);
		setError(null);

		//Has stripe and its elements loaded yet?
		if (!stripe || !elements) {
			setError("Stripe.js has not loaded yet.");
			setIsSubmitting(false);
			return;
		}

		// Tokenizing the card to forward to stripe
		const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardElement),
			billing_details: {
				name: shippingInfo.fullName,
				email: shippingInfo.email,
				phone: shippingInfo.phone,
				address: {
					line1: shippingInfo.address1,
					line2: shippingInfo.address2,
					city: shippingInfo.city,
					state: shippingInfo.state,
					postal_code: shippingInfo.zip,
					country: shippingInfo.country,
				},
			},
		});

		//Error with payment being sent to stripe?
		if (stripeError) {
			setError(stripeError.message);
			setIsSubmitting(false);
			return;
		}

		// Assuming all is good, now building the payload to POST to backend
		// Note: need to add tax in here
		const payload = {
			cart: cartWithDetails.map((item) => ({
				sku: item.sku,
				quantity: item.quantity,
			})),
			shippingInfo,
			shippingCost,
			tax,
			paymentMethodId: paymentMethod.id,
		};

		// Sending payload to backend server endpoint
		// Note need to change from local host to beachandbarwear.com
		try {
			const res = await axios.post("https://beachandbarwear.com/checkout", payload);
			navigate("/OrderConfirmation", { state: { order: res.data } });
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			setIsSubmitting(false);
		}
	};

	/*---------------------------------------------------------------------------------------------
								JSX Section
	----------------------------------------------------------------------------------------------*/
	return (
		<div id="payment-page">
			<NavigationBar />
			<form id="payment-box" onSubmit={handleSubmit}>
				<div id="payment-list">
					{/* Cart Display column (Left)*/}
					<div id="payment-left-column">
						<h3>My Cart</h3>
						{cartWithDetails.length === 0 ? (
							<div id="empty-cart-display">
								<p>Your cart is empty.</p>
							</div>
						) : (
							cartWithDetails.map((item) => (
								<CartItemMiniWidget
									key={item.sku}
									quantity={item.quantity}
									title={item.title}
									imageUrls={item.imageUrls}
									variant={item.variant}
								/>
							))
						)}
					</div>

					{/* Payment & Shipping column (Right) */}
					<div id="payment-right-column">
						<h3>Payment & Shipping</h3>

						{/* Shipping Information */}
						<section className="form-section">
							<h4>Shipping Information</h4>
							{[
								{ label: "Full Name", name: "fullName", type: "text", req: true },
								{ label: "Email", name: "email", type: "email", req: true },
								{ label: "Phone", name: "phone", type: "tel", req: false },
								{ label: "Address Line 1", name: "address1", type: "text", req: true },
								{ label: "Address Line 2", name: "address2", type: "text", req: false },
								{ label: "City", name: "city", type: "text", req: true },
								{ label: "State/Region", name: "state", type: "text", req: true },
								{ label: "ZIP/Postal Code", name: "zip", type: "text", req: true },
							].map(({ label, name, type, req }) => (
								<label key={name}>
									{label}
									<input
										type={type}
										name={name}
										value={shippingInfo[name]}
										onChange={handleShippingChange}
										required={req}
									/>
								</label>
							))}
							<label>
								Country
								<select
									name="country"
									value={shippingInfo.country}
									onChange={handleShippingChange}
								>
									{/*ISO code options, map for other places?*/}
									<option value="US">United States</option>
									<option value="CA">Canada</option>
									<option value="GB">United Kingdom</option>
								</select>
							</label>
						</section>

						{/* Shipping Method */}
						{/* Fixed for now*/}
						<section className="form-section">
							<h4>Shipping Method</h4>
							<p>
								Standard (5–7 days) — <strong>$10.00</strong>
							</p>
						</section>

						<section className="form-section">
							<h4>Tax</h4>
							<p>
								Tax applied — <strong>$4.50</strong>
							</p>
						</section>

						{/* Payment Section */}
						<section className="form-section">
							<h4>Payment Information</h4>
							<CardElement
								options={{
									style: {
										base: { fontSize: "16px", color: "#424770" },
										invalid: { color: "#9e2146" },
									},
								}}
							/>
						</section>

						{error && <p className="error">{error}</p>}
						<button type="submit" disabled={isSubmitting || !stripe}>
							{isSubmitting ? "Placing Order..." : "Place Order"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
/*---------------------------------------------------------------------------------------------
							Cart Item Display Component
----------------------------------------------------------------------------------------------*/
// Mini widget for each cart item
function CartItemMiniWidget({ quantity, title, imageUrls, variant }) {
	//Code to render image, need to check if this is even neccessary
	const thumbnail = imageUrls?.[0];

	return (
		<div id="cart-item-mini-widget">
			<img src={thumbnail} alt={title} className="cart-item-mini-thumb" />
			<div className="cart-item-mini-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${((variant.price || 0) * quantity).toFixed(2)}</p>
				<p>Size: {variant.title}</p>
			</div>
		</div>
	);
}
