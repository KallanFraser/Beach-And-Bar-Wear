/** @format */
"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import NavigationBar from "../../components/NavigationBar.jsx";
import { GlobalContext } from "../../components/GlobalContext";

import "../../styles/PaymentPage.css";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);

// ---- zones + helpers ----
const EUROPE = new Set([
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
const USA = new Set(["US", "PR", "VI", "GU", "AS", "MP"]);
const CAN = new Set(["CA"]);
const AUS = new Set(["AU", "NZ"]);
const zoneFor = (cc) => (USA.has(cc) ? "usa" : CAN.has(cc) ? "canada" : AUS.has(cc) ? "australia" : EUROPE.has(cc) ? "europe" : "other");

const COUNTRY_OPTIONS = Object.entries(countries.getNames("en", { select: "official" })).sort((a, b) => a[1].localeCompare(b[1]));

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ---------------- Page ----------------
export default function CheckoutPage() {
	return (
		<div id="payment-page">
			<NavigationBar />
			<Elements stripe={stripePromise}>
				<CheckoutForm />
			</Elements>
		</div>
	);
}

// --------------- Form -----------------
function CheckoutForm() {
	const { cart, setCart } = useContext(GlobalContext);

	const stripe = useStripe();
	const elements = useElements();

	// load products.json (source of truth)
	const [products, setProducts] = useState([]);
	const [loadingProducts, setLoadingProducts] = useState(true);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				const res = await fetch("/data/products.json", { cache: "no-store" });
				if (!res.ok) throw new Error(`products.json ${res.status}`);
				const data = await res.json();
				if (!ignore) setProducts(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error("Failed to load /data/products.json:", e);
				if (!ignore) setProducts([]);
			} finally {
				if (!ignore) setLoadingProducts(false);
			}
		})();
		return () => {
			ignore = true;
		};
	}, []);

	// normalize & join cart to products
	const cartWithDetails = useMemo(() => {
		if (!Array.isArray(products) || !Array.isArray(cart)) return [];
		return cart
			.map((item) => {
				const prod = products.find((p) => String(p.id) === String(item.productId));
				if (!prod) return null;

				const variants = Array.isArray(prod.variants)
					? prod.variants.map((v) => ({
							sku: v.variant_sku ?? v.sku ?? "",
							title: v.variant_title ?? v.title ?? "",
							price: typeof v.variant_price === "number" ? v.variant_price : v.price,
							in_stock: typeof v.in_stock === "boolean" ? v.in_stock : Boolean(v.variant_availability),
					  }))
					: [];

				const variant = variants.find((v) => v.sku === item.sku) || {};

				const t = String(prod.title || "").toLowerCase();
				const typeKey = /hoodie/.test(t)
					? "hoodie"
					: /swim/.test(t)
					? "swimShorts"
					: /\bdj\b/.test(t) || /dj oversized/.test(t)
					? "DJTShirt"
					: /boxy/.test(t)
					? "BoxyOversizedTee"
					: null;

				return {
					...item,
					title: prod.title,
					images: prod.images || [],
					variant,
					typeKey,
				};
			})
			.filter(Boolean);
	}, [cart, products]);

	// shipping rates (same as server)
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

	// shipping info
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
	const handleShippingChange = (e) => setShippingInfo((s) => ({ ...s, [e.target.name]: e.target.value }));

	// totals (client display only; server recomputes)
	const merchandiseTotal = useMemo(() => {
		return cartWithDetails.reduce((sum, item) => {
			const price = Number(item.variant?.price ?? 0);
			return sum + price * Number(item.quantity ?? 0);
		}, 0);
	}, [cartWithDetails]);

	const shippingCost = useMemo(() => {
		if (cartWithDetails.length === 0) return 0;
		const zone = zoneFor(String(shippingInfo.country).toUpperCase());
		const countsByType = cartWithDetails.reduce((acc, { typeKey, quantity }) => {
			if (!typeKey) return acc;
			acc[typeKey] = (acc[typeKey] || 0) + Number(quantity || 0);
			return acc;
		}, {});
		let total = 0;
		for (const [typeKey, qty] of Object.entries(countsByType)) {
			const rate = shippingRates[typeKey]?.[zone] ?? shippingRates[typeKey]?.other;
			if (!rate) continue;
			total += rate.first + Math.max(qty - 1, 0) * rate.additional;
		}
		return total;
	}, [cartWithDetails, shippingInfo.country]);

	const tax = 5;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	// NEW: success modal state
	const [success, setSuccess] = useState({
		open: false,
		orderId: "",
		paymentIntentId: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setIsSubmitting(true);
		setError("");

		// 1) Create PaymentIntent (server recomputes)
		const piRes = await fetch("/api/checkout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			cache: "no-store",
			body: JSON.stringify({
				cart: cartWithDetails.map(({ productId, sku, quantity }) => ({ productId, sku, quantity })),
				shippingInfo,
			}),
		});

		if (!piRes.ok) {
			const t = await piRes.text().catch(() => "");
			setError(t || "Failed to create payment.");
			setIsSubmitting(false);
			return;
		}

		const { clientSecret } = await piRes.json();

		// 2) Confirm card payment
		const card = elements.getElement(CardElement);
		const { error: confirmErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card,
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
			},
		});

		if (confirmErr) {
			setError(confirmErr.message || "Payment failed.");
			setIsSubmitting(false);
			return;
		}

		// 3) Create Printify order now that payment succeeded
		const orderRes = await fetch("/api/printify/order", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			cache: "no-store",
			body: JSON.stringify({
				paymentIntentId: paymentIntent.id,
				cart: cartWithDetails.map(({ sku, quantity }) => ({ sku, quantity })),
				shippingInfo,
			}),
		});

		if (!orderRes.ok) {
			setError("Payment captured, but order submission failed. We’ll email you shortly.");
			setIsSubmitting(false);
			return;
		}

		const { orderId: printifyOrderId } = await orderRes.json();

		// ✅ SUCCESS: show modal instead of redirect
		setSuccess({
			open: true,
			orderId: printifyOrderId,
			paymentIntentId: paymentIntent.id,
		});

		// clear cart + card input
		try {
			setCart([]);
			card?.clear();
		} catch {}

		setIsSubmitting(false);
	};

	return (
		<>
			<form id="payment-box" onSubmit={handleSubmit}>
				<div id="payment-list">
					{/* Left: Cart */}
					<div id="payment-left-column">
						<h3>My Cart</h3>
						{loadingProducts ? (
							<p>Loading…</p>
						) : cartWithDetails.length === 0 ? (
							<div className="empty-cart-note">
								<p>Your cart is empty.</p>
							</div>
						) : (
							cartWithDetails.map((item) => (
								<CartItemMiniWidget
									key={`${item.sku}`}
									quantity={item.quantity}
									title={item.title}
									images={item.images}
									variant={item.variant}
								/>
							))
						)}
						<div className="checkout-summary" style={{ marginTop: "1rem" }}>
							<span className="checkout-label">Merch</span>
							<span className="checkout-value">${merchandiseTotal.toFixed(2)}</span>
						</div>
						<div className="checkout-summary" style={{ marginTop: "0.5rem" }}>
							<span className="checkout-label">Shipping</span>
							<span className="checkout-value">${shippingCost.toFixed(2)}</span>
						</div>
						<div className="checkout-summary" style={{ marginTop: "0.5rem" }}>
							<span className="checkout-label">Tax</span>
							<span className="checkout-value">${tax.toFixed(2)}</span>
						</div>
					</div>

					{/* Right: Payment & Shipping */}
					<div id="payment-right-column">
						<h3>Payment & Shipping</h3>

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
								<select name="country" value={shippingInfo.country} onChange={handleShippingChange} required>
									{COUNTRY_OPTIONS.map(([code, name]) => (
										<option key={code} value={code}>
											{name}
										</option>
									))}
								</select>
							</label>
						</section>

						<section className="form-section">
							<h4>Payment</h4>
							<CardElement options={{ style: { base: { fontSize: "16px" } } }} />
						</section>

						{error && <p className="error-text">{error}</p>}
						<button type="submit" disabled={isSubmitting || !stripe}>
							{isSubmitting ? "Placing Order…" : "Place Order"}
						</button>
					</div>
				</div>
			</form>

			{/* ✅ Success Modal */}
			{success.open && (
				<SuccessModal
					orderId={success.orderId}
					paymentIntentId={success.paymentIntentId}
					onClose={() => setSuccess((s) => ({ ...s, open: false }))}
				/>
			)}
		</>
	);
}

// -------- Success Modal --------
function SuccessModal({ orderId, paymentIntentId, onClose }) {
	return (
		<div className="oc-modal-backdrop" role="dialog" aria-modal="true">
			<div className="oc-modal">
				<h2>Thank you! 🎉</h2>
				<p>Your payment was successful and we’re processing your order.</p>
				<div className="order-info">
					<p>
						<strong>Order ID:</strong> {orderId}
					</p>
					<p>
						<strong>Payment Intent:</strong> {paymentIntentId}
					</p>
				</div>
				<div className="oc-actions">
					<button className="oc-btn" onClick={onClose}>
						Close
					</button>
					<a className="oc-btn link" href="/">
						Continue Shopping
					</a>
				</div>
				<p className="small-print">You’ll get an email with tracking once it ships.</p>
			</div>
		</div>
	);
}

function CartItemMiniWidget({ quantity, title, images, variant }) {
	const frontObj = Array.isArray(images) ? images.find((img) => !img.is_back) : null;
	const backObj = Array.isArray(images) ? images.find((img) => img.is_back) : null;
	const frontUrl = frontObj?.path ?? null;
	const backUrl = backObj?.path ?? null;

	const price = Number(variant?.price ?? 0);
	return (
		<div className="cart-item-mini-widget">
			<img src={backUrl || frontUrl || "/images/LogoScratched.png"} alt={title} className="cart-item-mini-thumb" />
			<div className="cart-item-mini-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${(price * Number(quantity ?? 0)).toFixed(2)}</p>
				<p>Size: {variant?.title || "—"}</p>
			</div>
		</div>
	);
}
