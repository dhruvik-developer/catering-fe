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

export const isPlatformAdminHost = () => {
  const hostname = getRuntimeHostname();
  // Support both production (admin.trayza.in) and local (admin.localhost)
  return hostname === "admin.localhost" || hostname.startsWith("admin.");
};

// Bare localhost or the apex production domain (e.g. trayza.in / www.trayza.in)
// renders the public marketing website instead of the SaaS app shell. Anything
// with a leading subdomain (admin., tenant1., etc.) falls through to the
// existing admin/tenant flow.
export const isPublicMarketingHost = () => {
  const hostname = getRuntimeHostname();
  if (isPlatformAdminHost()) return false;
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.startsWith("www.")) return true;
  // Apex domain with no subdomain (one dot or none): trayza.in -> public.
  // Subdomains like tenant1.trayza.in stay in the SaaS app.
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length <= 2 && !hostname.endsWith(".localhost")) return true;
  return false;
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
