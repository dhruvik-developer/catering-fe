const TOKEN_STORAGE_KEY = "accessToken";
const USERNAME_STORAGE_KEY = "username";
const USER_TYPE_STORAGE_KEY = "userType";
const PERMISSIONS_STORAGE_KEY = "permissions";
const ENABLED_MODULES_STORAGE_KEY = "enabledModules";
const TENANT_STORAGE_KEY = "tenant";
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
  getPermissions: () => {
    if (typeof window === "undefined") return [];
    const permissions = window.localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    try {
      return permissions ? JSON.parse(permissions) : [];
    } catch (e) {
      console.error("Error parsing permissions from localStorage", e);
      return [];
    }
  },
  getEnabledModules: () => {
    if (typeof window === "undefined") return [];
    const enabledModules = window.localStorage.getItem(
      ENABLED_MODULES_STORAGE_KEY
    );
    try {
      return enabledModules ? JSON.parse(enabledModules) : [];
    } catch (e) {
      console.error("Error parsing enabled modules from localStorage", e);
      return [];
    }
  },
  getTenant: () => {
    if (typeof window === "undefined") return null;
    const tenant = window.localStorage.getItem(TENANT_STORAGE_KEY);
    try {
      return tenant ? JSON.parse(tenant) : null;
    } catch (e) {
      console.error("Error parsing tenant from localStorage", e);
      return null;
    }
  },
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
  setPermissions: (permissions) => {
    if (typeof window === "undefined") return;

    if (permissions && Array.isArray(permissions)) {
      window.localStorage.setItem(
        PERMISSIONS_STORAGE_KEY,
        JSON.stringify(permissions)
      );
      return;
    }

    window.localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
  },
  setEnabledModules: (enabledModules) => {
    if (typeof window === "undefined") return;

    if (enabledModules && Array.isArray(enabledModules)) {
      window.localStorage.setItem(
        ENABLED_MODULES_STORAGE_KEY,
        JSON.stringify(enabledModules)
      );
      return;
    }

    window.localStorage.removeItem(ENABLED_MODULES_STORAGE_KEY);
  },
  setTenant: (tenant) => {
    if (typeof window === "undefined") return;

    if (tenant && typeof tenant === "object") {
      window.localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));
      return;
    }

    window.localStorage.removeItem(TENANT_STORAGE_KEY);
  },
  clearAuth: () => {
    accessToken = null;

    if (typeof window === "undefined") return;

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    window.localStorage.removeItem(USER_TYPE_STORAGE_KEY);
    window.localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
    window.localStorage.removeItem(ENABLED_MODULES_STORAGE_KEY);
    window.localStorage.removeItem(TENANT_STORAGE_KEY);
  },
};

export default tokenService;
