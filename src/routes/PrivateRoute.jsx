import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AccessDenied from "./AccessDenied";
import {
  canAccessRoute,
  getDefaultRouteForAccess,
} from "../utils/accessControl";

const PrivateRoute = () => {
  const { token, permissions, enabledModules } = useContext(UserContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRoute(location.pathname, permissions, enabledModules)) {
    const fallbackRoute = getDefaultRouteForAccess(permissions, enabledModules);

    if (fallbackRoute && fallbackRoute !== location.pathname) {
      return <Navigate to={fallbackRoute} replace />;
    }

    return <AccessDenied />;
  }

  return <Outlet />;
};

export default PrivateRoute;
