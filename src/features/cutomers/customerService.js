import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getUsers = async () => {
  try {
    const response = await axios.get(`${base_url}user/all-users`);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to fetch user data. Please try again.";

    throw new Error(errorMessage);
  }
};

const customerService = {
  getUsers,
};

export default customerService;
