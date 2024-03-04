import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getProducts = async () => {
  try {
    const response = await axios.get(`${base_url}product/`);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to fetch products data. Please try again.";

    throw new Error(errorMessage);
  }
};

const createProduct = async (product) => {
  try {
    const response = await axios.post(`${base_url}product/`, product, config);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Something went wrong";

    throw new Error(errorMessage);
  }
};

const getProduct = async (id) => {
  try {
    const response = await axios.get(`${base_url}product/${id}`, config);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Something went wrong";

    throw new Error(errorMessage);
  }
};

const updateProduct = async (product) => {
  console.log("product", product);
  const response = await axios.put(
    `${base_url}product/${product.id}`,
    {
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category: product.category,
      tags: product.tags,
      color: product.color,
      quantity: product.quantity,
      images: product.images,
    },
    config
  );

  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${base_url}product/${id}`, config);

  return response.data;
};

const productService = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
