/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import axios from "axios"; //For easier GETs

/*---------------------------------------------------------------------------------------------
									Fetch Function
----------------------------------------------------------------------------------------------*/
//Fetchs the products but also converts images from bytea to BLOB URLs
//Set products = useState setter function for all products
const fetchProducts = async (setProducts) => {
	try {
		//For Production Builds
		const { data } = await axios.get("https://beachandbarwear.com/fetchAllProducts");

		//For Development Builds
		//const { productData } = await axios.get("http://localhost:3000/fetchAllProducts");

		//console.log("Dev Check: ", data);
		const productDataWithImages = data.map((product) => {
			//Safely checks if product.images exists and is also an array
			//Prevents runtime errors if images are null or not formatted properly

			//Then the map part assumes the images are base 64 encoded image strings and
			//converts it to a understandable version for the browser to decode and display
			//The entire data is still in the URL but in browser format
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

		setProducts(productDataWithImages);
		return productDataWithImages;
	} catch (error) {
		console.error("Error fetching all product data", error);
	}
};

export default fetchProducts;
