import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getProductCategories = async () => {
  try {
    const response = await axios.get(`${base_url}prodcategory/`);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to fetch products data. Please try again.";

    throw new Error(errorMessage);
  }
};

const createProductCategory = async (productCategory) => {
  try {
    const response = await axios.post(
      `${base_url}prodcategory/`,
      productCategory,
      config
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Something went wrong";

    throw new Error(errorMessage);
  }
};

const getProductCategory = async (id) => {
  const response = await axios.get(`${base_url}prodcategory/${id}`, config);

  return response.data;
};

const deleteProductCategory = async (id) => {
  const response = await axios.delete(`${base_url}prodcategory/${id}`, config);

  return response.data;
};
const updateProductCategory = async (category) => {
  console.log(category);
  const response = await axios.put(
    `${base_url}prodcategory/${category.id}`,
    { title: category.title },
    config
  );

  return response.data;
};

const pCategoryService = {
  getProductCategories,
  createProductCategory,
  getProductCategory,
  deleteProductCategory,
  updateProductCategory,
};

export default pCategoryService;
