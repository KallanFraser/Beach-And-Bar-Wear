/** @format */
/*---------------------------------------------------------------------------------------------
										Imports
----------------------------------------------------------------------------------------------*/
import axios from "axios";

/*---------------------------------------------------------------------------------------------
									Fetch Function
----------------------------------------------------------------------------------------------*/
const fetchProducts = async () => {
	try {
		let serverResponse = await axios.get(`http://localhost:3000/fetchAllProducts`);

		console.log(serverResponse.data);
		return serverResponse.data;
	} catch (error) {
		console.error("Error fetching all product data");
	}
};

export default fetchProducts;
