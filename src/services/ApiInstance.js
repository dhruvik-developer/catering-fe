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

ApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access, please login again.");
      tokenService.clearAuth();

      const loginPath = buildAppPath("/login");
      const requestPath = normalizeApiPath(error.config?.url);
      const currentPath = window.location.pathname.replace(/\/+$/, "");
      const isLoginRequest = requestPath === "/login";
      const alreadyOnLogin = currentPath === loginPath;

      if (!isLoginRequest && !alreadyOnLogin) {
        window.location.replace(loginPath);
      }
    }
    return Promise.reject(error);
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
