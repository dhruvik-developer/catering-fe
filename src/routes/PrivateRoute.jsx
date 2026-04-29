import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AccessDenied from "./AccessDenied";
import {
  canAccessRoute,
  getDefaultRouteForAccess,
} from "../utils/accessControl";
import { isPlatformAdminHost } from "../services/tenantRuntime";

const PrivateRoute = () => {
  const { token, permissions, enabledModules, tenant, logout } =
    useContext(UserContext);
  const location = useLocation();

  // Defense in depth against stale tokens loaded on the wrong host.
  // The backend rejects mismatched JWTs anyway (schema_name claim check),
  // but this avoids a flash of admin/tenant UI before the first 401 lands.
  const isAdminHost = isPlatformAdminHost();
  const tokenIsForAdmin = tenant === null;
  const hostTokenMismatch =
    !!token && (isAdminHost ? !tokenIsForAdmin : tokenIsForAdmin);

  useEffect(() => {
    if (hostTokenMismatch) {
      logout();
    }
  }, [hostTokenMismatch, logout]);

  if (!token || hostTokenMismatch) {
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
