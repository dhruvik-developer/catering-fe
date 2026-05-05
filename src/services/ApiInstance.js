import axios from "axios";
import tokenService from "./tokenService";
import { BASE_PATH } from "../utils/Config";
import { getApiBaseUrl } from "./tenantRuntime";

const ApiInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

const inFlightGetRequests = new Map();

const buildAppPath = (path) => {
  const base = BASE_PATH.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
};

const normalizeApiPath = (path = "") =>
  String(path).split("?")[0].replace(/\/+$/, "") || "/";

const stableSerialize = (value) => {
  if (value === null || value === undefined) return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableSerialize(v)).join(",")}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${k}:${stableSerialize(value[k])}`).join(",")}}`;
  }
  return String(value);
};

ApiInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Refresh-token flow ---
//
// On a 401, we try to swap the expired access token for a fresh one using the
// stored refresh token, then retry the original request. If multiple requests
// 401 at once, we only fire one /refresh-token/ call and let the rest wait on
// the same promise — otherwise concurrent retries would burn through several
// rotated refresh tokens.
//
// If the refresh itself fails (refresh token expired / invalid), we clear
// auth and bounce the user to /login.

let refreshInFlight = null;

const redirectToLogin = (originalConfig) => {
  const loginPath = buildAppPath("/login");
  const requestPath = normalizeApiPath(originalConfig?.url);
  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const isLoginRequest = requestPath === "/login";
  const alreadyOnLogin = currentPath === loginPath;
  if (!isLoginRequest && !alreadyOnLogin) {
    window.location.replace(loginPath);
  }
};

const performRefresh = async () => {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  // Bare axios call (NOT ApiInstance) so we don't recurse into our own
  // interceptor when the refresh request itself returns 401.
  const response = await axios.post(
    `${getApiBaseUrl()}/refresh-token/`,
    { refresh: refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  const newAccess = response?.data?.access;
  const newRefresh = response?.data?.refresh;
  if (!newAccess) throw new Error("Refresh response missing access token");

  tokenService.setToken(newAccess);
  // simplejwt rotates the refresh token by default; persist the new one so
  // the next refresh works.
  if (newRefresh) tokenService.setRefreshToken(newRefresh);
  return newAccess;
};

ApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config || {};
    const status = error.response?.status;

    // Don't try to refresh if: not a 401, the failing request *is* the refresh
    // call itself, or we've already retried this request once.
    const requestPath = normalizeApiPath(originalConfig?.url);
    const isAuthEndpoint =
      requestPath === "/login" || requestPath === "/refresh-token";

    if (status !== 401 || isAuthEndpoint || originalConfig._retried) {
      if (status === 401 && !originalConfig._retried) {
        tokenService.clearAuth();
        redirectToLogin(originalConfig);
      }
      return Promise.reject(error);
    }

    if (!tokenService.getRefreshToken()) {
      tokenService.clearAuth();
      redirectToLogin(originalConfig);
      return Promise.reject(error);
    }

    try {
      // Coalesce concurrent refreshes onto a single in-flight promise.
      if (!refreshInFlight) {
        refreshInFlight = performRefresh().finally(() => {
          refreshInFlight = null;
        });
      }
      const newAccess = await refreshInFlight;

      originalConfig._retried = true;
      originalConfig.headers = originalConfig.headers || {};
      originalConfig.headers["Authorization"] = `Bearer ${newAccess}`;
      return ApiInstance(originalConfig);
    } catch (refreshError) {
      // Refresh failed — refresh token expired or revoked. Force re-login.
      tokenService.clearAuth();
      redirectToLogin(originalConfig);
      return Promise.reject(refreshError);
    }
  }
);

const originalGet = ApiInstance.get.bind(ApiInstance);

ApiInstance.get = (url, config = {}) => {
  // Allow callers to opt out: ApiInstance.get(url, { dedupe: false })
  const shouldDedupe = config?.dedupe !== false && !config?.signal;
  if (!shouldDedupe) {
    return originalGet(url, config);
  }

  const key = `GET:${url}|params:${stableSerialize(config?.params || {})}`;
  const existingRequest = inFlightGetRequests.get(key);
  if (existingRequest) {
    return existingRequest;
  }

  const request = originalGet(url, config).finally(() => {
    inFlightGetRequests.delete(key);
  });

  inFlightGetRequests.set(key, request);
  return request;
};

export default ApiInstance;
