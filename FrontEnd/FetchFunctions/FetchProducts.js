/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import axios from "axios";

/*---------------------------------------------------------------------------------------------
									Fetch Function
----------------------------------------------------------------------------------------------*/
//Fetchs the products but also converts images from bytea to BLOB URLs
//Set products = useState setter function for all products
const fetchProducts = async (setProducts) => {
	try {
		const { data } = await axios.get(`http://localhost:3000/fetchAllProducts`);

		// transform each product:
		const ready = data.map((product) => {
			// convert each Buffer-like object → Blob URL
			const imageUrls = product.images.map((bufObj) => {
				const u8 = new Uint8Array(bufObj.data);
				const blob = new Blob([u8], { type: "image/png" });
				return URL.createObjectURL(blob);
			});

			return {
				...product,
				imageUrls,
			};
		});
		setProducts(ready); //sets the state
		return ready; //but also returns the value
	} catch (error) {
		console.error("Error fetching all product data", error);
	}
};

export default fetchProducts;
