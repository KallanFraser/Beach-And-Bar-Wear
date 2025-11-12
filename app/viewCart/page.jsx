/** @format */
"use client";

/*---------------------------------------------------------------------------------------------
                                    Imports
----------------------------------------------------------------------------------------------*/
import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { GlobalContext } from "../../components/GlobalContext";
import NavigationBar from "../../components/NavigationBar";

import "../../styles/ViewCartPage.css";

/*---------------------------------------------------------------------------------------------
                                Main Component
----------------------------------------------------------------------------------------------*/
const ViewCartPage = () => {
	const { cart } = useContext(GlobalContext);
	const router = useRouter();

	// load products.json (we don't keep products in context)
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				const res = await fetch("/data/products.json", { cache: "no-store" });
				if (!res.ok) throw new Error(`products.json ${res.status}`);
				const data = await res.json();
				if (!ignore) setProducts(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error("Failed to load /data/products.json:", e?.message || e);
				if (!ignore) setProducts([]);
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => {
			ignore = true;
		};
	}, []);

	const handleClick = () => router.push(`/checkout`);

	// Join cart with product details
	const cartWithDetails = useMemo(() => {
		if (!Array.isArray(products) || !Array.isArray(cart)) return [];
		return cart
			.map((cartItem) => {
				const product = products.find((p) => String(p.id) === String(cartItem.productId));
				if (!product) return null;

				// normalize variants
				const variants = Array.isArray(product.variants)
					? product.variants.map((v) => ({
							sku: v.variant_sku ?? v.sku ?? "",
							title: v.variant_title ?? v.title ?? "",
							price: typeof v.variant_price === "number" ? v.variant_price : v.price,
							in_stock: typeof v.in_stock === "boolean" ? v.in_stock : Boolean(v.variant_availability),
					  }))
					: [];

				const variant = variants.find((v) => v.sku === cartItem.sku) || {};

				return {
					productId: cartItem.productId,
					sku: cartItem.sku,
					quantity: cartItem.quantity,
					title: product.title,
					images: product.images || [],
					variant,
				};
			})
			.filter(Boolean);
	}, [cart, products]);

	const subtotal = useMemo(() => {
		return cartWithDetails.reduce((sum, item) => {
			const price = Number(item.variant?.price ?? 0);
			return sum + price * Number(item.quantity ?? 0);
		}, 0);
	}, [cartWithDetails]);

	return (
		<div id="view-cart-page">
			<NavigationBar />

			<div id="cart-list-section">
				<div id="cart-list">
					{loading ? (
						<div id="empty-cart-display">
							<p>Loading your cart…</p>
						</div>
					) : cartWithDetails.length === 0 ? (
						<div id="empty-cart-display">
							<p>Your cart is empty.</p>
						</div>
					) : (
						cartWithDetails.map((item) => (
							<CartItemComponent
								key={`${item.productId}-${item.sku}`}
								quantity={item.quantity}
								title={item.title}
								images={item.images}
								variant={item.variant}
							/>
						))
					)}

					{!loading && cartWithDetails.length > 0 ? (
						<div id="checkout-section">
							<div className="checkout-summary">
								<span className="checkout-label">Subtotal</span>
								<span className="checkout-value">${subtotal.toFixed(2)}</span>
							</div>
							<button onClick={handleClick}>Check Out</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
                        Cart Item Widget Component
----------------------------------------------------------------------------------------------*/
const CartItemComponent = ({ quantity, title, images, variant }) => {
	const frontObj = Array.isArray(images) ? images.find((img) => !img.is_back) : null;
	const backObj = Array.isArray(images) ? images.find((img) => img.is_back) : null;

	const frontUrl = frontObj?.path ?? null;
	const backUrl = backObj?.path ?? null;

	const price = Number(variant?.price ?? 0);
	const lineTotal = price * Number(quantity ?? 0);

	return (
		<div id="cart-page-cart-item-widget">
			<img src={backUrl || frontUrl || "/images/LogoScratched.png"} alt={title} className="cart-page-cart-item-thumb" />
			<div className="cart-page-cart-item-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${price.toFixed(2)}</p>
				<p>Total: ${lineTotal.toFixed(2)}</p>
				<p>Size: {variant?.title || "—"}</p>
			</div>
		</div>
	);
};

export default ViewCartPage;
