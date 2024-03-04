import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";
const login = async (user) => {
  try {
    const response = await axios.post(`${base_url}user/login-admin`, user);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Login failed. Please try again.";
    throw new Error(errorMessage);
  }
};

const getOrders = async () => {
  try {
    const response = await axios.get(`${base_url}user/get-all-orders`, config);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "getOrders failed. Please try again.";
    throw new Error(errorMessage);
  }
};

const getOrder = async (id) => {
  const response = await axios.get(
    `${base_url}user/getorderbyuser/${id}`,
    config
  );

  return response.data;
};

const updateOrder = async (order) => {
  const response = await axios.put(
    `${base_url}user/update-order-status`,
    { status: order.status, orderId: order.orderId },
    config
  );

  return response.data;
};

const forgotPasswordEmailSend = async (email) => {
  try {
    const response = await axios.post(
      `${base_url}user/forgot-password-token`,
      email,
      config
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to fetch blog data. Please try again.";
    throw new Error(errorMessage);
  }
};

const authService = {
  login,
  getOrders,
  getOrder,
  updateOrder,
  forgotPasswordEmailSend,
};

export default authService;
