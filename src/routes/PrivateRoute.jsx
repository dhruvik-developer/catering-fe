import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { USER_ROLE_ADMIN } from "../services/tokenService";

const PrivateRoute = () => {
  const { token, userType } = useContext(UserContext);

  return token && userType === USER_ROLE_ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
