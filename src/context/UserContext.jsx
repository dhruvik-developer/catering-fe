import { createContext, useState } from "react";
import tokenService from "../services/tokenService";

// Create UserContext
const UserContext = createContext();

// UserProvider Component
// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => tokenService.getToken());
  const [username, setUsername] = useState(() => tokenService.getUsername());
  const [userType, setUserType] = useState(() => tokenService.getUserType());

  // Function to log in and store the token
  const login = (accessToken, username, nextUserType) => {
    tokenService.setToken(accessToken);
    tokenService.setUsername(username);
    tokenService.setUserType(nextUserType);
    setToken(accessToken);
    setUsername(username);
    setUserType(nextUserType);
  };

  // Function to log out and clear stored token
  const logout = () => {
    tokenService.clearAuth();
    setToken(null);
    setUsername(null);
    setUserType(null);
  };

  return (
    <UserContext.Provider value={{ token, username, userType, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
