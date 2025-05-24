/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import axios from "axios";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

//Environment Variables Import
import dotenv from "dotenv";
dotenv.config();

//Database import
import { pool } from "../Database/Database.js";

/*---------------------------------------------------------------------------------------------
										Globals
----------------------------------------------------------------------------------------------*/
const stripe = new Stripe(process.env.stripeSecretKey);
const PRINTIFY_TOKEN = process.env.printifyAccessToken;
const SHOP_ID = process.env.printifyShopID;

const BASE_URL = "https://api.printify.com/v1";

/*---------------------------------------------------------------------------------------------
									Main Method
----------------------------------------------------------------------------------------------*/
/* Security Questions That Need to be tested*/
//Do we check if the stripe received the payment
//Do we check if the payment stripe received is the amount we received
//Does everything add up?

export async function checkoutHandler(req, res) {
	const { cart, shippingInfo, shippingCost, tax, paymentMethodId } = req.body;

	try {
		// Calculate total from DB to ensure request matches price of product
		let totalAmount = 0;
		for (const item of cart) {
			const { rows } = await pool.query(
				"SELECT variant_price FROM product_variants WHERE variant_sku = $1 LIMIT 1",
				[item.sku]
			);
			if (!rows.length) {
				return res.status(400).json({ error: `Invalid SKU: ${item.sku}` });
			}
			totalAmount += rows[0].variant_price * item.quantity;
		}

		totalAmount += 4.5; //Tax added

		totalAmount += 10; //Shipping added

		const amountCents = Math.round(totalAmount * 100);

		// The information for payment sent to stripe
		// amount = in cents
		// payment method = the unique id for the customers payment details
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

		//FRIENDLY VERSION ------------------------------------------
		//CHARGES 0.50$ ONLY FOR TESTING PURPOSES
		/*
		const paymentIntent = await stripe.paymentIntents.create({
			amount: 50, // $1.00 in cents
			currency: "usd",
			payment_method: paymentMethodId,
			confirm: true,
			receipt_email: shippingInfo.email,

			automatic_payment_methods: {
				enabled: true,
				allow_redirects: "never",
			},
		});
		*/

		//return_url: "https://beachandbarwear.com/"

		// 3) Build Printify order
		const line_items = cart.map((item) => ({
			sku: item.sku,
			quantity: item.quantity,
		}));

		const [first_name, ...rest] = shippingInfo.fullName.trim().split(/\s+/);
		const last_name = rest.join(" ");

		//uuidv4() = method to randomly generate a 128 bit number
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
				email: shippingInfo.email,
				phone: shippingInfo.phone,
				country: shippingInfo.country,
				region: shippingInfo.state,
				address1: shippingInfo.address1,
				address2: shippingInfo.address2,
				city: shippingInfo.city,
				zip: shippingInfo.zip,
			},
		};

		//Sending the order to printify
		const printifyRes = await axios.post(`${BASE_URL}/shops/${SHOP_ID}/orders.json`, printifyBody, {
			headers: {
				Authorization: `Bearer ${PRINTIFY_TOKEN}`,
				"User-Agent": "MyNodeServer/1.0",
				"Content-Type": "application/json",
			},
		});

		// Sending resposne back to client to indiciate success
		// Attaching paymentIntentID, orderID, and the response from printify
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
