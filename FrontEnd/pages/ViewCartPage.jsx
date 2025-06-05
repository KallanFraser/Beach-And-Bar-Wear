/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import { useContext, useMemo } from "react";
import { useRouter } from "next/router";

//Context import
import { GlobalContext } from "../GlobalContext.jsx";

//Component Imports
import NavigationBar from "../Components/NavigationBar.jsx";
/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const ViewCartPage = () => {
	const { cart, products } = useContext(GlobalContext);

	const router = useRouter();

	const handleClick = () => {
		router.push(`/PaymentPage`);
	};

	// Function to combine cart items with product details
	// Such that we can display each product in the cart with its details
	// Can maybe change in future to mark global context products as in cart?
	const cartWithDetails = useMemo(() => {
		return cart
			.map((cartItem) => {
				// Find matching product by ID
				const product = products.find((product) => String(product.id) === String(cartItem.productId));

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
							<CartItemComponent
								key={`${item.productId}-${item.sku}`}
								quantity={item.quantity}
								title={item.title}
								images={item.images}
								variant={item.variant}
							/>
						))
					)}
					{cartWithDetails.length > 0 ? (
						<div id="checkout-section">
							<button onClick={handleClick}>Check Out</button>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};

/*---------------------------------------------------------------------------------------------
                        Cart Item Widget Component
----------------------------------------------------------------------------------------------*/
const CartItemComponent = ({ quantity, title, images, variant }) => {
	// find front/back objects (they now have `.path` instead of `.src`)
	console.log("Cart Images?", images);
	const frontObj = images.find((img) => !img.is_back) || null;
	const backObj = images.find((img) => img.is_back) || null;

	// use the static file path directly—no base64 prefix
	const frontUrl = frontObj ? frontObj.path : null;
	const backUrl = backObj ? backObj.path : null;

	return (
		<div id="cart-page-cart-item-widget">
			<img src={backUrl} alt={title} className="cart-page-cart-item-thumb" />
			<div className="cart-page-cart-item-info">
				<h2>{title}</h2>
				<p>Quantity: {quantity}</p>
				<p>Price: ${variant.price?.toFixed(2) * quantity || "N/A"}</p>
				<p>Size: {variant.title}</p>
			</div>
		</div>
	);
};

export default ViewCartPage;
