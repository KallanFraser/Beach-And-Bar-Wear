/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
// Library Imports
import axios from "axios";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

// Environment Variables Import
import dotenv from "dotenv";
dotenv.config();

// Database import
import { pool } from "../Database/Database.js";

/*---------------------------------------------------------------------------------------------
										Globals
----------------------------------------------------------------------------------------------*/
const stripe = new Stripe(process.env.stripeSecretKey);
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;

const BASE_URL = "https://api.printify.com/v1";

/*---------------------------------------------------------------------------------------------
                          Server-side Shipping Logic Helpers
----------------------------------------------------------------------------------------------*/
// These sets match the front-end’s zoneFor(...) logic:
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

// Shipping rates must exactly match the front-end rates:
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

function zoneFor(countryCode) {
	const cc = countryCode.toUpperCase();
	if (USA_CODES.has(cc)) return "usa";
	if (CANADA_CODES.has(cc)) return "canada";
	if (AUSTRALIA_CODES.has(cc)) return "australia";
	if (EUROPE_CODES.has(cc)) return "europe";
	return "other";
}

// For each SKU, look up price and type flags. Assumes product_variants → products join.
async function lookupVariantAndTypeFlags(sku) {
	const { rows } = await pool.query(
		`
		SELECT 
			pv.variant_price,
			p.is_hoodie,
			p.is_swim_short,
			p.is_dj_oversized,
			p.is_boxy_oversized
		FROM product_variants AS pv
		JOIN products AS p
		  ON p.id = pv.product_id
		WHERE pv.variant_sku = $1
		LIMIT 1
		`,
		[sku]
	);
	return rows.length ? rows[0] : null;
}

/*---------------------------------------------------------------------------------------------
									Main Method
----------------------------------------------------------------------------------------------*/
export async function checkoutHandler(req, res) {
	// Extract request data
	const {
		cart,
		shippingInfo,
		shippingCost: clientShippingCost,
		tax: clientTax,
		paymentMethodId,
	} = req.body;

	try {
		// --- 1) Validate & recompute item totals + gather counts by type ---
		let totalAmount = 0;
		const countsByType = {
			hoodie: 0,
			swimShorts: 0,
			DJTShirt: 0,
			BoxyOversizedTee: 0,
		};

		for (const item of cart) {
			// Validate quantity
			if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1) {
				return res.status(400).json({ error: `Invalid quantity for SKU ${item.sku}` });
			}

			// Lookup variant price & flags
			const variantRow = await lookupVariantAndTypeFlags(item.sku);
			if (!variantRow) {
				return res.status(400).json({ error: `Invalid SKU: ${item.sku}` });
			}
			const { variant_price, is_hoodie, is_swim_short, is_dj_oversized, is_boxy_oversized } =
				variantRow;

			// Add to total amount
			totalAmount += variant_price * item.quantity;

			// Tally shipping counts
			if (is_hoodie) {
				countsByType.hoodie += item.quantity;
			} else if (is_swim_short) {
				countsByType.swimShorts += item.quantity;
			} else if (is_dj_oversized) {
				countsByType.DJTShirt += item.quantity;
			} else if (is_boxy_oversized) {
				countsByType.BoxyOversizedTee += item.quantity;
			} else {
				// Skip shipping for untyped items
				console.warn(`SKU ${item.sku} has no type flag; skipping its shipping charge.`);
			}
		}

		// --- 2) Validate & add tax ---
		const serverTax = parseFloat(clientTax) || 0;
		if (serverTax < 2 || serverTax > 10) {
			return res.status(400).json({ error: "Tax is incorrect" });
		}
		totalAmount += serverTax;

		// --- 3) Compute shipping based on country + countsByType ---
		const countryCode = shippingInfo.country.trim().toUpperCase();
		const zone = zoneFor(countryCode);
		let computedShipping = 0;

		for (const [typeKey, qty] of Object.entries(countsByType)) {
			if (qty <= 0) continue;
			const rateBlock = shippingRates[typeKey]?.[zone] ?? shippingRates[typeKey]?.other;
			if (!rateBlock) {
				console.error(`Missing shipping rate for type "${typeKey}", zone "${zone}"`);
				return res
					.status(500)
					.json({ error: `Unable to compute shipping for product type "${typeKey}".` });
			}
			const { first, additional } = rateBlock;
			computedShipping += first + additional * (qty - 1);
		}

		if (computedShipping < 0) {
			console.error(`Computed shipping is negative: ${computedShipping}`);
			return res.status(500).json({ error: "Internal error in shipping calculation." });
		}

		// --- 4) Verify client-supplied shippingCost matches server ---
		const clientShip = parseFloat(clientShippingCost) || 0;
		if (Math.abs(clientShip - computedShipping) > 0.009) {
			console.error(
				`Shipping mismatch: client=${clientShip.toFixed(2)}, server=${computedShipping.toFixed(2)}`
			);
			return res.status(400).json({ error: "Shipping cost mismatch; please refresh and try again." });
		}
		totalAmount += computedShipping;

		// --- 5) Convert total to cents and create Stripe PaymentIntent ---
		const amountCents = Math.round(totalAmount * 100);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountCents,
			currency: "usd",
			payment_method: paymentMethodId,
			confirm: true,
			receipt_email: shippingInfo.email,

			automatic_payment_methods: {
				enabled: true,
				allow_redirects: "never",
			},
		});

		if (paymentIntent.status !== "succeeded") {
			return res.status(400).json({ error: `Payment failed: ${paymentIntent.status}` });
		}
		if (paymentIntent.amount !== amountCents) {
			console.error(`Stripe amount mismatch: expected ${amountCents}, got ${paymentIntent.amount}`);
			return res.status(500).json({ error: "Payment amount mismatch detected." });
		}

		// --- 6) Build Printify order payload ---
		const line_items = cart.map((item) => ({
			sku: item.sku,
			quantity: item.quantity,
		}));

		// Split fullName into first/last
		const [first_name, ...restNameParts] = shippingInfo.fullName.trim().split(/\s+/);
		const last_name = restNameParts.join(" ");

		const printifyBody = {
			external_id: uuidv4(),
			label: paymentIntent.id,
			line_items,
			shipping_method: 1,
			is_printify_express: false,
			is_economy_shipping: true,
			send_shipping_notification: true,
			address_to: {
				first_name,
				last_name,
				email: shippingInfo.email.trim(),
				phone: (shippingInfo.phone || "").trim(),
				country: countryCode,
				region: (shippingInfo.state || "").trim(),
				address1: shippingInfo.address1.trim(),
				address2: (shippingInfo.address2 || "").trim(),
				city: shippingInfo.city.trim(),
				zip: shippingInfo.zip.trim(),
			},
		};

		// --- 7) Send order to Printify ---
		const printifyRes = await axios.post(`${BASE_URL}/shops/${SHOP_ID}/orders.json`, printifyBody, {
			headers: {
				Authorization: `Bearer ${PRINTIFY_TOKEN}`,
				"User-Agent": "MyNodeServer/1.0",
				"Content-Type": "application/json",
			},
		});

		if (!printifyRes.data?.id) {
			console.error("Printify returned no order ID:", printifyRes.data);
			return res.status(502).json({ error: "Printify order creation failed." });
		}

		// --- 8) Respond success to client ---
		res.json({
			success: true,
			paymentIntentId: paymentIntent.id,
			orderId: printifyRes.data.id,
			printifyResponse: printifyRes.data,
		});
	} catch (error) {
		console.error("Checkout Error:", error);
		if (error.type === "StripeCardError") {
			return res.status(402).json({ error: error.message });
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
}
