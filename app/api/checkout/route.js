// /app/api/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

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

const detectTypeKey = (title) => {
	const t = String(title || "").toLowerCase();
	if (/hoodie/.test(t)) return "hoodie";
	if (/swim/.test(t)) return "swimShorts";
	if (/\bdj\b/.test(t) || /dj oversized/.test(t)) return "DJTShirt";
	if (/boxy/.test(t)) return "BoxyOversizedTee";
	return null;
};

export async function POST(req) {
	try {
		const { cart, shippingInfo } = await req.json();
		if (!Array.isArray(cart) || !shippingInfo?.country) {
			return new NextResponse("Invalid payload", { status: 400 });
		}

		// load products.json
		const DATA_FILE = path.join(process.cwd(), "public", "data", "products.json");
		const raw = fs.readFileSync(DATA_FILE, "utf8");
		const products = JSON.parse(raw);

		const skuPrice = new Map();
		const productType = new Map();
		for (const p of products) {
			const typeKey = detectTypeKey(p.title);
			for (const v of p.variants || []) {
				const sku = v.variant_sku ?? v.sku;
				const price = typeof v.variant_price === "number" ? v.variant_price : v.price;
				if (sku) skuPrice.set(String(sku), Number(price || 0));
			}
			if (p?.id) productType.set(String(p.id), typeKey);
		}

		let merch = 0;
		const countsByType = {};
		for (const { sku, quantity, productId } of cart) {
			const price = Number(skuPrice.get(String(sku)) || 0);
			merch += price * Number(quantity || 0);
			const tkey = productType.get(String(productId)) || null;
			if (tkey) countsByType[tkey] = (countsByType[tkey] || 0) + Number(quantity || 0);
		}

		const zone = zoneFor(String(shippingInfo.country).toUpperCase());
		let shipping = 0;
		for (const [typeKey, qty] of Object.entries(countsByType)) {
			const rate = shippingRates[typeKey]?.[zone] ?? shippingRates[typeKey]?.other;
			if (!rate) continue;
			shipping += rate.first + Math.max(qty - 1, 0) * rate.additional;
		}

		const tax = 2.5;
		const total = merch + shipping + tax;
		const amount = Math.round(total * 100);

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "usd",
			automatic_payment_methods: { enabled: true },
			metadata: {
				cart: JSON.stringify(cart.slice(0, 20)),
				shipping_country: String(shippingInfo.country).toUpperCase(),
			},
		});

		const orderId = `ord_${paymentIntent.id}`;
		return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId });
	} catch (e) {
		console.error("checkout error", e);
		return new NextResponse("Checkout failed", { status: 500 });
	}
}
