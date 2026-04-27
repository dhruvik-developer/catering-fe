import { createContext, useState } from "react";
import tokenService from "../services/tokenService";
import { normalizeAccessList } from "../utils/accessControl";

// Create UserContext
const UserContext = createContext();

// UserProvider Component
// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => tokenService.getToken());
  const [username, setUsername] = useState(() => tokenService.getUsername());
  const [userType, setUserType] = useState(() => tokenService.getUserType());
  const [permissions, setPermissions] = useState(() =>
    tokenService.getPermissions()
  );
  const [enabledModules, setEnabledModules] = useState(() =>
    tokenService.getEnabledModules()
  );
  const [tenant, setTenant] = useState(() => tokenService.getTenant());

  // Function to log in and store the token
  const login = (
    accessToken,
    username,
    nextUserType,
    userPermissions = [],
    nextEnabledModules = [],
    nextTenant = null
  ) => {
    const normalizedPermissions = normalizeAccessList(userPermissions);
    const normalizedEnabledModules = normalizeAccessList(nextEnabledModules);

    tokenService.setToken(accessToken);
    tokenService.setUsername(username);
    tokenService.setUserType(nextUserType);
    tokenService.setPermissions(normalizedPermissions);
    tokenService.setEnabledModules(normalizedEnabledModules);
    tokenService.setTenant(nextTenant);
    setToken(accessToken);
    setUsername(username);
    setUserType(nextUserType);
    setPermissions(normalizedPermissions);
    setEnabledModules(normalizedEnabledModules);
    setTenant(nextTenant);
  };

  // Function to log out and clear stored token
  const logout = () => {
    tokenService.clearAuth();
    setToken(null);
    setUsername(null);
    setUserType(null);
    setPermissions([]);
    setEnabledModules([]);
    setTenant(null);
  };

  return (
    <UserContext.Provider
      value={{
        token,
        username,
        userType,
        permissions,
        enabledModules,
        tenant,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
