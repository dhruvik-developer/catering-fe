const TOKEN_STORAGE_KEY = "accessToken";
const USERNAME_STORAGE_KEY = "username";
const USER_TYPE_STORAGE_KEY = "userType";
export const USER_ROLE_ADMIN = "admin";

let accessToken =
  typeof window !== "undefined"
    ? window.localStorage.getItem(TOKEN_STORAGE_KEY)
    : null;

const tokenService = {
  getToken: () => accessToken,
  getUsername: () =>
    typeof window !== "undefined"
      ? window.localStorage.getItem(USERNAME_STORAGE_KEY)
      : null,
  getUserType: () =>
    typeof window !== "undefined"
      ? window.localStorage.getItem(USER_TYPE_STORAGE_KEY)
      : null,
  setToken: (token) => {
    accessToken = token;

    if (typeof window === "undefined") return;

    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
  setUsername: (username) => {
    if (typeof window === "undefined") return;

    if (username) {
      window.localStorage.setItem(USERNAME_STORAGE_KEY, username);
      return;
    }

    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
  },
  setUserType: (userType) => {
    if (typeof window === "undefined") return;

    if (userType) {
      window.localStorage.setItem(USER_TYPE_STORAGE_KEY, userType);
      return;
    }

    window.localStorage.removeItem(USER_TYPE_STORAGE_KEY);
  },
  clearAuth: () => {
    accessToken = null;

    if (typeof window === "undefined") return;

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    window.localStorage.removeItem(USER_TYPE_STORAGE_KEY);
  },
};

export default tokenService;
