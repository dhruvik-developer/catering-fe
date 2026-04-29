const trimSlashes = (value = "") => String(value).replace(/\/+$/, "");

export const getRuntimeHostname = () => {
  if (typeof window === "undefined") return "localhost";
  return window.location.hostname.toLowerCase();
};

export const hasRuntimeSubdomain = (hostname = getRuntimeHostname()) => {
  if (hostname.endsWith(".localhost")) return true;
  const parts = hostname.split(".").filter(Boolean);
  return parts.length > 2;
};

export const getTenantScopedStorageKey = (key) => {
  return `${key}:${getRuntimeHostname()}`;
};

export const getApiBaseUrl = () => {
  const explicitBaseUrl = trimSlashes(import.meta.env.VITE_API_BASE_URL || "");
  const forceStaticBaseUrl =
    String(import.meta.env.VITE_API_FORCE_STATIC_BASE_URL || "").toLowerCase() ===
    "true";

  if (explicitBaseUrl && (forceStaticBaseUrl || !hasRuntimeSubdomain())) {
    return explicitBaseUrl;
  }

  if (typeof window === "undefined") {
    return explicitBaseUrl || "/api";
  }

  let explicitUrl = null;
  try {
    explicitUrl = explicitBaseUrl ? new URL(explicitBaseUrl) : null;
  } catch {
    explicitUrl = null;
  }

  const protocol =
    import.meta.env.VITE_API_PROTOCOL ||
    explicitUrl?.protocol?.replace(":", "") ||
    window.location.protocol.replace(":", "") ||
    "http";
  const hostname = getRuntimeHostname();
  const configuredPort = import.meta.env.VITE_API_PORT;
  const port =
    configuredPort === undefined || configuredPort === null
      ? explicitUrl?.port || ""
      : String(configuredPort).trim();
  const portSuffix = port ? `:${port}` : "";

  return `${protocol}://${hostname}${portSuffix}/api`;
};
