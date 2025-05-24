/** @format */
/*---------------------------------------------------------------------------------------------
									Imports
----------------------------------------------------------------------------------------------*/
import { useRouter } from "next/router";
import NavigationBar from "../Components/NavigationBar";

/*---------------------------------------------------------------------------------------------
								Main Component
----------------------------------------------------------------------------------------------*/
const OrderConfirmationPage = () => {
	const router = useRouter();
	const { orderId, paymentIntentId } = router.query;

	if (!orderId) {
		return (
			<div className="confirmation-container">
				<NavigationBar />
				<div className="order-confirmation">
					<h2>No order data found.</h2>
					<button onClick={() => router.push("/")}>Return Home</button>
				</div>
			</div>
		);
	}

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
				<button onClick={() => router.push("/")}>Continue Shopping</button>
			</div>
		</div>
	);
};

export default OrderConfirmationPage;
