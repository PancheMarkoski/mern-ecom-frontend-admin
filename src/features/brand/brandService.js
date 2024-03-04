import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getBrands = async () => {
  try {
    const response = await axios.get(`${base_url}brand/`);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to fetch products data. Please try again.";

    throw new Error(errorMessage);
  }
};

const createBrand = async (brand) => {
  try {
    const response = await axios.post(`${base_url}brand/`, brand, config);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Something went wrong";

    throw new Error(errorMessage);
  }
};

const getBrand = async (id) => {
  try {
    const response = await axios.get(`${base_url}brand/${id}`, config);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Something went wrong";

    throw new Error(errorMessage);
  }
};

const updateBrand = async (brand) => {
  console.log("brand-service", brand);
  try {
    const response = await axios.put(
      `${base_url}brand/${brand.id}`,
      { title: brand.title },
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

const deleteBrand = async (id) => {
  const response = await axios.delete(`${base_url}brand/${id}`, config);

  return response.data;
};

const brandService = {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;
