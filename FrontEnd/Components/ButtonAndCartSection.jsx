/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
//Library Imports
import { useEffect, useState, useContext } from "react";

//Global Context import
import { GlobalContext } from "../GlobalContext.jsx";

/*---------------------------------------------------------------------------------------------
                            Right Column / Variant Listings
----------------------------------------------------------------------------------------------*/
const ButtonAndCartSection = ({ productId, productVariantData }) => {
	const { cart, setCart } = useContext(GlobalContext);
	const [selectedSKU, setSelectedSKU] = useState("");
	const [quantity, setQuantity] = useState(1);

	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("success");

	//Handle select for when a button representing a size is clicked
	const handleSelect = (variant) => {
		if (variant.in_stock) {
			setSelectedSKU(variant.sku);
			setQuantity(1);
		}
	};

	//Handler to ensure > 0 quantity and < 10 and is a number
	const changeQty = (newQty) => {
		if (isNaN(newQty) || newQty < 1) newQty = 1;
		else if (newQty > 10) newQty = 10;
		setQuantity(newQty);
	};

	//Handler to ensure:
	//	There is a SKU selected before we add to cart
	//	Product is not already in cart
	//		If it is, we just append the additional quantity
	const addToCart = () => {
		if (!selectedSKU) {
			setMessage("Please select a variant before adding to cart");
			setMessageType("error");
			return;
		}

		try {
			const existing = cart.find((item) => item.productId === productId && item.sku === selectedSKU);

			if (existing) {
				setCart(
					cart.map((item) =>
						item.productId === productId && item.sku === selectedSKU
							? { ...item, quantity: item.quantity + quantity }
							: item
					)
				);
			} else {
				setCart([...cart, { productId, sku: selectedSKU, quantity }]);
			}

			setMessage(`${quantity} Item${quantity !== 1 ? "s" : ""} Added To Your Cart`);
			setMessageType("success");
		} catch (err) {
			setMessage("Failed To Add Items To Your Cart");
			setMessageType("error");
		}
	};

	// code to auto-dismiss message for cart success || failure after 10s
	useEffect(() => {
		if (!message) return;
		const t = setTimeout(() => setMessage(""), 10000);
		return () => clearTimeout(t);
	}, [message]);

	return (
		<>
			{/*---------------- Size Buttons Section -------------------*/}
			<div id="variant-listings">
				{/*For each varient of a product... */}
				{productVariantData.map((variant) => {
					//Is the current size "variant" selected button wise?
					const isSelected = variant.sku === selectedSKU;

					//Is the current size in or out of stock?
					const baseClass = variant.in_stock ? "in-stock-button" : "not-in-stock-button";

					// Assign CSS classes based on these two factors
					const classes = variant.in_stock
						? `${baseClass}${isSelected ? " in-stock-selected" : ""}`
						: baseClass;

					return (
						<button
							key={variant.sku}
							className={classes}
							onClick={() => handleSelect(variant)}
							disabled={!variant.in_stock}
						>
							{variant.title}
						</button>
					);
				})}
			</div>
			{/*---------------- Quantity + Add to Cart Section -------------------*/}
			<div id="cart-section">
				<div className="qty-controls">
					{/*Decrement quantity button*/}
					<button
						className="quantity-change-button"
						onClick={() => changeQty(quantity - 1)}
						disabled={quantity <= 1}
					>
						−
					</button>
					{/*Text entry value entry if no like button entry*/}
					<input
						type="number"
						min="1"
						max="10"
						value={quantity}
						onChange={(e) => changeQty(+e.target.value)}
					/>
					{/*Increment quantity button*/}
					<button
						className="quantity-change-button"
						onClick={() => changeQty(quantity + 1)}
						disabled={quantity >= 10}
					>
						+
					</button>
				</div>
				{/*Add selected size + quantity to cart button*/}
				<button
					id="cart-button"
					onClick={addToCart}
					disabled={!selectedSKU}
					className={selectedSKU ? "add-to-cart-enabled" : "add-to-cart-disabled"}
				>
					Add to Cart
				</button>
			</div>
			{/*Section for where the alert message shall be placed*/}
			{/*I.E successfully added to cart! or error!*/}
			<div className={`alert ${messageType}`}> {message} </div>{" "}
		</>
	);
};

export default ButtonAndCartSection;
