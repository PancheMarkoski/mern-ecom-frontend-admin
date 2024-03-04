export const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  } catch (error) {
    console.error("Error fetching token from localStorage:", error);
    return undefined; // Or handle the error as you see fit
  }
};
