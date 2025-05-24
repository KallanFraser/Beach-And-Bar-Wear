/** @format */
/*---------------------------------------------------------------------------------------------
                              Imports
----------------------------------------------------------------------------------------------*/
import { useState, useContext, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";

// Component Imports
import NavigationBar from "../Components/NavigationBar.jsx";

// Global Context Import
import { GlobalContext } from "../GlobalContext.jsx";

// React-Stripe Elements hooks (Elements provider still comes from react-stripe-js)
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

/*---------------------------------------------------------------------------------------------
                      ElementsLoader: wraps children in Stripe Elements
----------------------------------------------------------------------------------------------*/
function ElementsLoader({ children }) {
	const [stripe, setStripe] = useState(null);

	useEffect(() => {
		if (typeof window !== "undefined" && window.Stripe) {
			// Initialize Stripe from the script loaded in _app.jsx
			const s = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
			setStripe(s);
		}
	}, []);

	if (!stripe) {
		return <p>Loading payment form…</p>;
	}

	return <Elements stripe={stripe}>{children}</Elements>;
}

/*---------------------------------------------------------------------------------------------
                        PaymentForm Component (client-only)
----------------------------------------------------------------------------------------------*/
function PaymentForm() {
	//Loading cart items and all products
	const { cart, products } = useContext(GlobalContext);

	//Loading stripe
	const stripe = useStripe();
	const elements = useElements();

	//Loading next js router element
	const router = useRouter();

	// Combining cart items with details found in products
	const cartWithDetails = useMemo(
		() =>
			cart
				.map((item) => {
					const prod = products.find((p) => String(p.id) === String(item.productId));
					if (!prod) return null;
					return {
						...item,
						title: prod.title,
						imageUrls: prod.imageUrls,
						variant: prod.variants.find((v) => v.sku === item.sku) || {},
					};
				})
				.filter(Boolean),
		[cart, products]
	);

	//Creating Shipping Info Data Array
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

	//Presetting Shipping Cost & Tax (Backend double checks these values)
	const shippingCost = 10;
	const tax = 4.5;

	//Form Submissions handlers
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	//Function to handle any input change to any field in shipping
	const handleShippingChange = (e) => {
		const { name, value } = e.target;
		setShippingInfo((prev) => ({ ...prev, [name]: value }));
	};

	//Function to handle submit button click
	const handleSubmit = async (e) => {
		e.preventDefault(); //Prevents page refresh

		setIsSubmitting(true);
		setError(null);

		//Has stripe loaded yet?
		if (!stripe || !elements) {
			setError("Stripe.js has not loaded yet.");
			setIsSubmitting(false);
			return;
		}

		//Extracting card details & forwarding to stripe
		const cardElement = elements.getElement(CardElement);
		const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: cardElement,
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

		//Stripe error?
		if (stripeError) {
			setError(stripeError.message);
			setIsSubmitting(false);
			return;
		}

		//Else no stripe error, forward to backend
		//Backend should confirm stripe payment went through + other security checks
		try {
			const res = await axios.post("/checkout", {
				cart: cartWithDetails.map((i) => ({ sku: i.sku, quantity: i.quantity })),
				shippingInfo,
				shippingCost,
				tax,
				paymentMethodId: paymentMethod.id,
			});
			const { orderId, paymentIntentId } = res.data;
			router.push({ pathname: "/OrderConfirmationPage", query: { orderId, paymentIntentId } });
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			setIsSubmitting(false);
		}
	};

	//Finally the HTML JSX section
	return (
		<form id="payment-box" onSubmit={handleSubmit}>
			<div id="payment-list">
				{/* Cart Display column (Left)*/}
				<div id="payment-left-column">
					<h3>My Cart</h3>
					{cartWithDetails.length === 0 ? (
						<p>Your cart is empty.</p>
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
						<CardElement options={{ style: { base: { fontSize: "16px" } } }} />
					</section>

					{/* Error Section */}
					{error && <p className="error-text">{error}</p>}
					<button type="submit" disabled={isSubmitting || !stripe}>
						{isSubmitting ? "Placing Order…" : "Place Order"}
					</button>
				</div>
			</div>
		</form>
	);
}

/*---------------------------------------------------------------------------------------------
                        PaymentPageWrapper (client-only)
----------------------------------------------------------------------------------------------*/
function PaymentPageWrapper() {
	return (
		<div id="payment-page">
			<NavigationBar />
			<ElementsLoader>
				<PaymentForm />
			</ElementsLoader>
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
		<div className="cart-item-mini-widget">
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

// Export as client-only (disable SSR)
export default dynamic(() => Promise.resolve(PaymentPageWrapper), { ssr: false });
