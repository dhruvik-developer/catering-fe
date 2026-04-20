import axios from "axios";
import tokenService from "./tokenService";

const ApiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const inFlightGetRequests = new Map();

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
      window.location.replace("/login");
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
