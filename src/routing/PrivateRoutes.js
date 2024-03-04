import { Navigate } from "react-router-dom";
import { getToken } from "../utils/helperFunctions/getToken";

export const PrivateRoutes = ({ children }) => {
  const token = getToken();

  return token !== undefined ? children : <Navigate to="/" replace={true} />;
};
