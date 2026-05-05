// Centralized error logging.
//
// Two reasons this exists rather than calling console.error directly:
//
// 1. Production noise + leakage. An axios error object carries the full
//    request `config` (URL, headers including Authorization, body) and the
//    full `response.data`. Dumping that to the prod console means anyone
//    who opens DevTools sees backend payloads, partial stack traces, and
//    sometimes the user's own bearer token. We only log in dev.
//
// 2. Consistent shape. Callers were doing `console.error("X API Error:", error)`
//    everywhere — same pattern, different label. This collapses it to one call
//    that always strips the sensitive fields.

const isDev = !!import.meta.env.DEV;

const summarizeError = (error) => {
  if (!error) return "(no error)";
  if (typeof error === "string") return error;
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    "Unknown error";
  return status ? `[${status}] ${message}` : message;
};

export const logError = (label, error) => {
  if (!isDev) return;
   
  console.error(label, summarizeError(error));
};

export const logWarn = (label, detail) => {
  if (!isDev) return;
   
  console.warn(label, typeof detail === "string" ? detail : summarizeError(detail));
};
