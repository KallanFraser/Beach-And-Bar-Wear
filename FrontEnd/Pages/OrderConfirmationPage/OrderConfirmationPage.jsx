/** @format */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "../../NavigationBar/NavigationBar.jsx";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
	const { state } = useLocation();
	const navigate = useNavigate();
	const order = state?.order;

	if (!order) {
		return (
			<div className="confirmation-container">
				<NavigationBar />
				<div className="order-confirmation">
					<h2>No order data found.</h2>
					<button onClick={() => navigate("/")}>Return Home</button>
				</div>
			</div>
		);
	}

	const { paymentIntentId, orderId } = order;

	return (
		<div id="order-confirmation-page">
			<NavigationBar />
			<div id="order-confirmation-container">
				<h2>Thank you for your order!</h2>
				<p>Your payment was successful.</p>
				<div className="order-info">
					<p>
						<strong>Order ID:</strong> {orderId}
					</p>
				</div>
				<button onClick={() => navigate("/")}>Continue Shopping</button>
			</div>
		</div>
	);
};

export default OrderConfirmationPage;
