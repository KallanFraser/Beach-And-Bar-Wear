/** @format */

import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { GlobalContext } from "../GlobalContext.jsx";
import NavigationBar from "../NavigationBar/NavigationBar.jsx";
import "./PaymentPage.css";

const PaymentPage = () => {
	const { cart, products } = useContext(GlobalContext);
	const navigate = useNavigate();

	const cartWithDetails = useMemo(() => {
		return cart
			.map((cartItem) => {
				const product = products.find((p) => String(p.id) === String(cartItem.productId));
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

	// Shipping state
	const [shippingInfo, setShippingInfo] = useState({
		fullName: "",
		email: "",
		phone: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		country: "United States",
	});
	const [shippingMethod, setShippingMethod] = useState("standard");

	// Payment state
	const [paymentInfo, setPaymentInfo] = useState({
		cardName: "",
		cardNumber: "",
		expiry: "",
		cvv: "",
		billingSameAsShipping: true,
		billingAddress: {
			address1: "",
			address2: "",
			city: "",
			state: "",
			zip: "",
			country: "United States",
		},
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleShippingChange = (e) => {
		const { name, value } = e.target;
		setShippingInfo((prev) => ({ ...prev, [name]: value }));
	};

	const handlePaymentChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (name === "billingSameAsShipping") {
			setPaymentInfo((prev) => ({ ...prev, billingSameAsShipping: checked }));
		} else {
			setPaymentInfo((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleBillingChange = (e) => {
		const { name, value } = e.target;
		setPaymentInfo((prev) => ({
			...prev,
			billingAddress: { ...prev.billingAddress, [name]: value },
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const payload = {
			cart: cartWithDetails,
			shippingInfo,
			shippingMethod,
			paymentInfo: {
				cardName: paymentInfo.cardName,
				cardNumber: paymentInfo.cardNumber,
				expiry: paymentInfo.expiry,
				cvv: paymentInfo.cvv,
				billingAddress: paymentInfo.billingSameAsShipping ? shippingInfo : paymentInfo.billingAddress,
			},
		};

		try {
			const res = await fetch("/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error("Network response was not ok");
			const data = await res.json();
			navigate("/order-confirmation", { state: { order: data } });
		} catch (err) {
			setError(err.message);
			setIsSubmitting(false);
		}
	};

	return (
		<div id="payment-page">
			<NavigationBar />
			<form id="payment-box" onSubmit={handleSubmit}>
				<div id="payment-list">
					<div id="left-column">
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
									images={item.images}
									variant={item.variant}
								/>
							))
						)}
					</div>

					<div id="right-column">
						<h3>Payment & Shipping</h3>

						{/* Shipping Section */}
						<section className="form-section">
							<h4>Shipping Information</h4>
							<label>
								Full Name
								<input
									type="text"
									name="fullName"
									value={shippingInfo.fullName}
									onChange={handleShippingChange}
									required
								/>
							</label>
							<label>
								Email
								<input
									type="email"
									name="email"
									value={shippingInfo.email}
									onChange={handleShippingChange}
									required
								/>
							</label>
							<label>
								Phone
								<input
									type="tel"
									name="phone"
									value={shippingInfo.phone}
									onChange={handleShippingChange}
								/>
							</label>
							<label>
								Address Line 1
								<input
									type="text"
									name="address1"
									value={shippingInfo.address1}
									onChange={handleShippingChange}
									required
								/>
							</label>
							<label>
								Address Line 2
								<input
									type="text"
									name="address2"
									value={shippingInfo.address2}
									onChange={handleShippingChange}
								/>
							</label>
							<label>
								City
								<input
									type="text"
									name="city"
									value={shippingInfo.city}
									onChange={handleShippingChange}
									required
								/>
							</label>
							<label>
								State/Region
								<input
									type="text"
									name="state"
									value={shippingInfo.state}
									onChange={handleShippingChange}
									required
								/>
							</label>
							<label>
								ZIP/Postal Code
								<input
									type="text"
									name="zip"
									value={shippingInfo.zip}
									onChange={handleShippingChange}
									required
								/>
							</label>
							<label>
								Country
								<select
									name="country"
									value={shippingInfo.country}
									onChange={handleShippingChange}
								>
									<option>United States</option>
									<option>Canada</option>
									<option>United Kingdom</option>
									{/* add more as needed */}
								</select>
							</label>
						</section>

						{/* Shipping Method */}
						<section className="form-section">
							<h4>Shipping Method</h4>
							<select
								value={shippingMethod}
								onChange={(e) => setShippingMethod(e.target.value)}
							>
								<option value="standard">Standard (5-7 days) - $5.00</option>
								<option value="express">Express (2-3 days) - $15.00</option>
								<option value="overnight">Overnight (1 day) - $25.00</option>
							</select>
						</section>

						{/* Payment Section */}
						<section className="form-section">
							<h4>Payment Information</h4>
							<label>
								Cardholder Name
								<input
									type="text"
									name="cardName"
									value={paymentInfo.cardName}
									onChange={handlePaymentChange}
									required
								/>
							</label>
							<label>
								Card Number
								<input
									type="text"
									name="cardNumber"
									value={paymentInfo.cardNumber}
									onChange={handlePaymentChange}
									required
									maxLength={19}
								/>
							</label>
							<label>
								Expiry Date (MM/YY)
								<input
									type="text"
									name="expiry"
									placeholder="MM/YY"
									value={paymentInfo.expiry}
									onChange={handlePaymentChange}
									required
									maxLength={5}
								/>
							</label>
							<label>
								CVV
								<input
									type="text"
									name="cvv"
									value={paymentInfo.cvv}
									onChange={handlePaymentChange}
									required
									maxLength={4}
								/>
							</label>

							<label className="checkbox-label">
								<input
									type="checkbox"
									name="billingSameAsShipping"
									checked={paymentInfo.billingSameAsShipping}
									onChange={handlePaymentChange}
								/>
								Billing address same as shipping
							</label>

							{!paymentInfo.billingSameAsShipping && (
								<div className="billing-address">
									<h5>Billing Address</h5>
									<label>
										Address Line 1
										<input
											type="text"
											name="address1"
											value={paymentInfo.billingAddress.address1}
											onChange={handleBillingChange}
											required
										/>
									</label>
									<label>
										Address Line 2
										<input
											type="text"
											name="address2"
											value={paymentInfo.billingAddress.address2}
											onChange={handleBillingChange}
										/>
									</label>
									<label>
										City
										<input
											type="text"
											name="city"
											value={paymentInfo.billingAddress.city}
											onChange={handleBillingChange}
											required
										/>
									</label>
									<label>
										State/Region
										<input
											type="text"
											name="state"
											value={paymentInfo.billingAddress.state}
											onChange={handleBillingChange}
											required
										/>
									</label>
									<label>
										ZIP/Postal Code
										<input
											type="text"
											name="zip"
											value={paymentInfo.billingAddress.zip}
											onChange={handleBillingChange}
											required
										/>
									</label>
									<label>
										Country
										<select
											name="country"
											value={paymentInfo.billingAddress.country}
											onChange={handleBillingChange}
										>
											<option>United States</option>
											<option>Canada</option>
											<option>United Kingdom</option>
										</select>
									</label>
								</div>
							)}
						</section>

						{error && <p className="error">{error}</p>}
						<button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Placing Order..." : "Place Order"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

const CartItemMiniWidget = ({ quantity, title, images, variant }) => {
	const thumbnail =
		images && images.length > 0
			? typeof images[0] === "string"
				? images[0]
				: `data:image/jpeg;base64,${btoa(String.fromCharCode(...images[0].data))}`
			: "";

	return (
		<div id="cart-item-mini-widget">
			<img src={thumbnail} alt={title} className="cart-item-mini-thumb" />
			<div className="cart-item-mini-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${(variant.price?.toFixed(2) * quantity).toFixed(2) || "N/A"}</p>
			</div>
		</div>
	);
};

export default PaymentPage;
