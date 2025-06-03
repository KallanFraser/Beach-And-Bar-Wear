/** @format */
/*---------------------------------------------------------------------------------------------
                              Imports
----------------------------------------------------------------------------------------------*/
import { useState, useContext, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";

// Country names & ISO-3166 codes
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);

// Component Imports
import NavigationBar from "../Components/NavigationBar.jsx";

// Global Context Import
import { GlobalContext } from "../GlobalContext.jsx";

// React-Stripe Elements hooks
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

/*---------------------------------------------------------------------------------------------
                             Constant helpers
----------------------------------------------------------------------------------------------*/
// Country->zone mapping sets
const EUROPE_CODES = new Set([
	"AL",
	"AD",
	"AT",
	"BY",
	"BE",
	"BA",
	"BG",
	"HR",
	"CY",
	"CZ",
	"DK",
	"EE",
	"FI",
	"FR",
	"DE",
	"GI",
	"GR",
	"HU",
	"IS",
	"IE",
	"IT",
	"LV",
	"LI",
	"LT",
	"LU",
	"MT",
	"MD",
	"MC",
	"ME",
	"NL",
	"MK",
	"NO",
	"PL",
	"PT",
	"RO",
	"RU",
	"SM",
	"RS",
	"SK",
	"SI",
	"ES",
	"SE",
	"CH",
	"UA",
	"GB",
	"XK",
]);
const USA_CODES = new Set(["US", "PR", "VI", "GU", "AS", "MP"]);
const CANADA_CODES = new Set(["CA"]);
const AUSTRALIA_CODES = new Set(["AU", "NZ"]);

function zoneFor(countryCode) {
	if (USA_CODES.has(countryCode)) return "usa";
	if (CANADA_CODES.has(countryCode)) return "canada";
	if (AUSTRALIA_CODES.has(countryCode)) return "australia";
	if (EUROPE_CODES.has(countryCode)) return "europe";
	return "other";
}

// Reusable list of ISO country names (sorted A->Z)
const COUNTRY_OPTIONS = Object.entries(countries.getNames("en", { select: "official" })).sort((a, b) =>
	a[1].localeCompare(b[1])
);

/*---------------------------------------------------------------------------------------------
                      ElementsLoader: wraps children in Stripe Elements
----------------------------------------------------------------------------------------------*/
function ElementsLoader({ children }) {
	const [stripe, setStripe] = useState(null);

	useEffect(() => {
		if (typeof window !== "undefined" && window.Stripe) {
			const s = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
			setStripe(s);
		}
	}, []);

	if (!stripe) return <p>Loading payment form…</p>;
	return <Elements stripe={stripe}>{children}</Elements>;
}

/*---------------------------------------------------------------------------------------------
                        PaymentForm Component (client-only)
----------------------------------------------------------------------------------------------*/
function PaymentForm() {
	const { cart, products } = useContext(GlobalContext);
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();

	// --- Shipping zones & rates (with "germany" key removed) ---
	const shippingRates = {
		hoodie: {
			usa: { first: 8.5, additional: 2.1 },
			canada: { first: 13, additional: 7 },
			australia: { first: 22, additional: 10 },
			europe: { first: 15, additional: 10 },
			other: { first: 15, additional: 10 },
		},
		swimShorts: {
			usa: { first: 11.5, additional: 11 },
			canada: { first: 20, additional: 19 },
			europe: { first: 11.5, additional: 10.6 },
			australia: { first: 12, additional: 11 },
			other: { first: 18, additional: 16.5 },
		},
		DJTShirt: {
			// Removed the "germany" key—Germany will use the "europe" rate
			europe: { first: 8, additional: 1.5 },
			canada: { first: 13, additional: 7 },
			australia: { first: 13, additional: 7 },
			other: { first: 10, additional: 9 },
		},
		BoxyOversizedTee: {
			usa: { first: 5, additional: 2.5 },
			canada: { first: 10, additional: 5 },
			australia: { first: 12.5, additional: 5 },
			europe: { first: 10, additional: 4 },
			other: { first: 10, additional: 4 },
		},
	};

	// --- Helpers ---
	function detectTypeKey(prod) {
		if (prod.is_hoodie) return "hoodie";
		if (prod.is_swim_short) return "swimShorts";
		if (prod.is_dj_oversized) return "DJTShirt";
		if (prod.is_boxy_oversized) return "BoxyOversizedTee";
		console.warn(`detectTypeKey: no matching flag for product ID ${prod.id}`);
		return null;
	}

	// --- Cart with product details (added console.error for missing product/variant) ---
	const cartWithDetails = useMemo(
		() =>
			cart
				.map((item) => {
					const prod = products.find((p) => String(p.id) === String(item.productId));
					if (!prod) {
						console.error(`No product found for productId ${item.productId}`);
						return null;
					}

					const typeKey = detectTypeKey(prod);

					// Attempt to find matching variant by SKU
					const foundVariant = prod.variants.find((v) => v.sku === item.sku);
					if (!foundVariant) {
						console.error(`No variant found for SKU ${item.sku} in product ${prod.id}`);
					}

					return {
						...item,
						title: prod.title,
						images: prod.images,
						variant: foundVariant || {}, // fallback after logging
						typeKey,
					};
				})
				.filter(Boolean),
		[cart, products]
	);

	// --- Shipping form state ---
	const [shippingInfo, setShippingInfo] = useState({
		fullName: "",
		email: "",
		phone: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		country: "US", // default
	});

	// --- Shipping cost calculator ---
	const shippingCost = useMemo(() => {
		if (cartWithDetails.length === 0) return 0;
		const zone = zoneFor(shippingInfo.country);
		let total = 0;

		const countsByType = cartWithDetails.reduce((acc, { typeKey, quantity }) => {
			if (!typeKey) return acc;
			acc[typeKey] = (acc[typeKey] || 0) + quantity;
			return acc;
		}, {});

		Object.entries(countsByType).forEach(([typeKey, qty]) => {
			const rate = shippingRates[typeKey]?.[zone] ?? shippingRates[typeKey]?.other;
			if (!rate) return;
			const { first, additional } = rate;
			total += first + Math.max(qty - 1, 0) * additional;
		});
		return total;
	}, [cartWithDetails, shippingInfo.country]);

	const tax = 4.5;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleShippingChange = (e) =>
		setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	// --- Submit handler (added country validation) ---
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		// Validate that the country is a real ISO code
		if (!COUNTRY_OPTIONS.some(([code]) => code === shippingInfo.country)) {
			setError("Please select a valid country.");
			setIsSubmitting(false);
			return;
		}

		if (!stripe || !elements) {
			setError("Stripe.js has not loaded yet.");
			setIsSubmitting(false);
			return;
		}

		const cardElement = elements.getElement(CardElement);

		// 1. Create PaymentMethod in Stripe (needs ISO country)
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
					country: shippingInfo.country, // ISO-3166 code
				},
			},
		});

		if (stripeError) {
			setError(stripeError.message);
			setIsSubmitting(false);
			return;
		}

		// 2. Forward to backend (backend will map country→zone again & call Printify)
		try {
			const res = await axios.post("/checkout", {
				cart: cartWithDetails.map(({ sku, quantity }) => ({ sku, quantity })),
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

	/*-------------------------------------------------------------------------------------------
                                      JSX
    -------------------------------------------------------------------------------------------*/
	return (
		<form id="payment-box" onSubmit={handleSubmit}>
			<div id="payment-list">
				{/* Cart (Left) */}
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
								images={item.images}
								variant={item.variant}
							/>
						))
					)}
				</div>

				{/* Payment & Shipping (Right) */}
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
								required
							>
								{COUNTRY_OPTIONS.map(([code, name]) => (
									<option key={code} value={code}>
										{name}
									</option>
								))}
							</select>
						</label>
					</section>

					{/* Shipping Method */}
					<section className="form-section">
						<h4>Shipping Method</h4>
						<p>
							Standard (5–7 days) — <strong>${shippingCost.toFixed(2)}</strong>
						</p>
					</section>

					{/* Tax */}
					<section className="form-section">
						<h4>Tax</h4>
						<p>
							Tax applied — <strong>${tax.toFixed(2)}</strong>
						</p>
					</section>

					{/* Payment */}
					<section className="form-section">
						<h4>Payment Information</h4>
						<CardElement options={{ style: { base: { fontSize: "16px" } } }} />
					</section>

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
                            Cart Item mini-widget
----------------------------------------------------------------------------------------------*/
function CartItemMiniWidget({ quantity, title, images, variant }) {
	const frontObj = images.find((img) => img.is_back === false) || null;
	const backObj = images.find((img) => img.is_back === true) || null;

	const frontUrl = frontObj ? `data:image/jpeg;base64,${frontObj.src}` : null;
	const backUrl = backObj ? `data:image/jpeg;base64,${backObj.src}` : null;
	return (
		<div className="cart-item-mini-widget">
			<img src={backUrl} alt={title} className="cart-item-mini-thumb" />
			<div className="cart-item-mini-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${((variant.price || 0) * quantity).toFixed(2)}</p>
				<p>Size: {variant.title}</p>
			</div>
		</div>
	);
}

// Export client-only (no SSR)
export default dynamic(() => Promise.resolve(PaymentPageWrapper), { ssr: false });
