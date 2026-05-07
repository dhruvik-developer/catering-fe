import { getTenantScopedStorageKey } from "./tenantRuntime";

const TOKEN_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";
const USERNAME_STORAGE_KEY = "username";
const USER_TYPE_STORAGE_KEY = "userType";
const PERMISSIONS_STORAGE_KEY = "permissions";
const ENABLED_MODULES_STORAGE_KEY = "enabledModules";
const TENANT_STORAGE_KEY = "tenant";
const BRANCH_PROFILE_STORAGE_KEY = "branchProfile";
// Bag of branch-role flags returned by /api/login/. Stored as one JSON blob
// so we don't fan out into 3 separate keys.
//   { branch_role, is_main_tenant_admin, is_branch_admin }
const BRANCH_ROLE_STORAGE_KEY = "branchRoleFlags";
export const USER_ROLE_ADMIN = "admin";

// Decode the payload of a JWT without verifying the signature. We can't verify
// the signature on the client (we don't have the secret), but reading `exp`
// lets us drop expired/garbled tokens before the first API call. Returns null
// if the token isn't a well-formed JWT.
const decodeJwtPayload = (token) => {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isJwtExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    // No exp claim or unparseable token — treat as invalid so the caller can
    // clear it. (A legitimate access token should always carry exp.)
    return true;
  }
  // 30s clock skew so we don't bounce a user whose token is about to expire.
  return Date.now() >= (payload.exp - 30) * 1000;
};

const readStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(getTenantScopedStorageKey(TOKEN_STORAGE_KEY));
};

const readStoredRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(
    getTenantScopedStorageKey(REFRESH_TOKEN_STORAGE_KEY),
  );
};

// Drop a stale/tampered access token at boot. We keep the refresh token —
// the axios interceptor can use it to mint a fresh access token on the next
// request, and if it's also dead the interceptor will redirect to /login.
let accessToken = readStoredAccessToken();
if (accessToken && isJwtExpired(accessToken)) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(getTenantScopedStorageKey(TOKEN_STORAGE_KEY));
  }
  accessToken = null;
}

let refreshToken = readStoredRefreshToken();

const storage = {
  get: (key) =>
    typeof window !== "undefined"
      ? window.localStorage.getItem(getTenantScopedStorageKey(key))
      : null,
  set: (key, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(getTenantScopedStorageKey(key), value);
  },
  remove: (key) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(getTenantScopedStorageKey(key));
  },
};

const tokenService = {
  getToken: () => accessToken,
  getRefreshToken: () => refreshToken,
  getUsername: () =>
    storage.get(USERNAME_STORAGE_KEY),
  getUserType: () =>
    storage.get(USER_TYPE_STORAGE_KEY),
  getPermissions: () => {
    if (typeof window === "undefined") return [];
    const permissions = storage.get(PERMISSIONS_STORAGE_KEY);
    try {
      return permissions ? JSON.parse(permissions) : [];
    } catch (e) {
      console.error("Error parsing permissions from localStorage", e);
      return [];
    }
  },
  getEnabledModules: () => {
    if (typeof window === "undefined") return [];
    const enabledModules = storage.get(ENABLED_MODULES_STORAGE_KEY);
    try {
      return enabledModules ? JSON.parse(enabledModules) : [];
    } catch (e) {
      console.error("Error parsing enabled modules from localStorage", e);
      return [];
    }
  },
  getTenant: () => {
    if (typeof window === "undefined") return null;
    const tenant = storage.get(TENANT_STORAGE_KEY);
    try {
      return tenant ? JSON.parse(tenant) : null;
    } catch (e) {
      console.error("Error parsing tenant from localStorage", e);
      return null;
    }
  },
  getBranchProfile: () => {
    if (typeof window === "undefined") return null;
    const branchProfile = storage.get(BRANCH_PROFILE_STORAGE_KEY);
    try {
      return branchProfile ? JSON.parse(branchProfile) : null;
    } catch (e) {
      console.error("Error parsing branch profile from localStorage", e);
      return null;
    }
  },
  getBranchRoleFlags: () => {
    if (typeof window === "undefined")
      return {
        branch_role: null,
        is_main_tenant_admin: false,
        is_branch_admin: false,
      };
    const raw = storage.get(BRANCH_ROLE_STORAGE_KEY);
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        branch_role: parsed?.branch_role ?? null,
        is_main_tenant_admin: Boolean(parsed?.is_main_tenant_admin),
        is_branch_admin: Boolean(parsed?.is_branch_admin),
      };
    } catch (e) {
      console.error("Error parsing branch role flags from localStorage", e);
      return {
        branch_role: null,
        is_main_tenant_admin: false,
        is_branch_admin: false,
      };
    }
  },
  setToken: (token) => {
    accessToken = token;

    if (typeof window === "undefined") return;

    if (token) {
      storage.set(TOKEN_STORAGE_KEY, token);
      return;
    }

    storage.remove(TOKEN_STORAGE_KEY);
  },
  setRefreshToken: (token) => {
    refreshToken = token;

    if (typeof window === "undefined") return;

    if (token) {
      storage.set(REFRESH_TOKEN_STORAGE_KEY, token);
      return;
    }

    storage.remove(REFRESH_TOKEN_STORAGE_KEY);
  },
  setUsername: (username) => {
    if (typeof window === "undefined") return;

    if (username) {
      storage.set(USERNAME_STORAGE_KEY, username);
      return;
    }

    storage.remove(USERNAME_STORAGE_KEY);
  },
  setUserType: (userType) => {
    if (typeof window === "undefined") return;

    if (userType) {
      storage.set(USER_TYPE_STORAGE_KEY, userType);
      return;
    }

    storage.remove(USER_TYPE_STORAGE_KEY);
  },
  setPermissions: (permissions) => {
    if (typeof window === "undefined") return;

    if (permissions && Array.isArray(permissions)) {
      storage.set(
        PERMISSIONS_STORAGE_KEY,
        JSON.stringify(permissions)
      );
      return;
    }

    storage.remove(PERMISSIONS_STORAGE_KEY);
  },
  setEnabledModules: (enabledModules) => {
    if (typeof window === "undefined") return;

    if (enabledModules && Array.isArray(enabledModules)) {
      storage.set(
        ENABLED_MODULES_STORAGE_KEY,
        JSON.stringify(enabledModules)
      );
      return;
    }

    storage.remove(ENABLED_MODULES_STORAGE_KEY);
  },
  setTenant: (tenant) => {
    if (typeof window === "undefined") return;

    if (tenant && typeof tenant === "object") {
      storage.set(TENANT_STORAGE_KEY, JSON.stringify(tenant));
      return;
    }

    storage.remove(TENANT_STORAGE_KEY);
  },
  setBranchProfile: (branchProfile) => {
    if (typeof window === "undefined") return;

    if (branchProfile && typeof branchProfile === "object") {
      storage.set(
        BRANCH_PROFILE_STORAGE_KEY,
        JSON.stringify(branchProfile)
      );
      return;
    }

    storage.remove(BRANCH_PROFILE_STORAGE_KEY);
  },
  setBranchRoleFlags: (flags) => {
    if (typeof window === "undefined") return;
    if (flags && typeof flags === "object") {
      storage.set(
        BRANCH_ROLE_STORAGE_KEY,
        JSON.stringify({
          branch_role: flags.branch_role ?? null,
          is_main_tenant_admin: Boolean(flags.is_main_tenant_admin),
          is_branch_admin: Boolean(flags.is_branch_admin),
        })
      );
      return;
    }
    storage.remove(BRANCH_ROLE_STORAGE_KEY);
  },
  clearAuth: () => {
    accessToken = null;
    refreshToken = null;

    if (typeof window === "undefined") return;

    storage.remove(TOKEN_STORAGE_KEY);
    storage.remove(REFRESH_TOKEN_STORAGE_KEY);
    storage.remove(USERNAME_STORAGE_KEY);
    storage.remove(USER_TYPE_STORAGE_KEY);
    storage.remove(PERMISSIONS_STORAGE_KEY);
    storage.remove(ENABLED_MODULES_STORAGE_KEY);
    storage.remove(TENANT_STORAGE_KEY);
    storage.remove(BRANCH_PROFILE_STORAGE_KEY);
    storage.remove(BRANCH_ROLE_STORAGE_KEY);
  },
};

export default tokenService;
