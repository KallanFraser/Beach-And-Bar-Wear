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
		//const { data } = await axios.get("https://beachandbarwear.com/fetchAllProducts");

		const { data } = await axios.get("http://localhost:3000/fetchAllProducts");

		const ready = data.map((product) => {
			//Checks if product.images is actually an array
			//If so... for each base 64 string, turns it into a usable image
			//If not an array, then transforms it into an empty array
			const imageUrls = Array.isArray(product.images)
				? product.images.map((b64) => {
						return `data:image/jpeg;base64,${b64}`;
				  })
				: [];

			return {
				...product,
				imageUrls,
			};
		});

		setProducts(ready);
		return ready;
	} catch (error) {
		console.error("Error fetching all product data", error);
	}
};

export default fetchProducts;
