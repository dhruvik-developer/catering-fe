import { useQuery } from "@tanstack/react-query";
import ApiInstance from "../services/ApiInstance";
import { logError } from "../utils/logger";

// ────────────────────────────────────────────────────────────────────────────
// useGlobalGodownStock
//
// Fetches *cross-event* available godown stock for a single ingredient — i.e.
// total in-house stock minus what other open events have already committed to
// it via a saved allocation. This stops two events from claiming the same
// 60 KG of tomatoes.
//
// Phase 2 frontend ships against a documented contract; the backend endpoint
// is the missing piece. The expected contract is:
//
//   GET /api/godown-stock/?item=<itemName>
//   →  200 OK
//      {
//        "status": true,
//        "data": {
//          "item": "Tomato",
//          "unit": "KG",
//          "total": 200,
//          "committed_elsewhere": 140,   // sum of saved allocations on
//                                        // other events with status != done
//          "available": 60               // total - committed_elsewhere
//        }
//      }
//
// FEATURE FLAG: This hook is GATED on `VITE_GLOBAL_GODOWN_STOCK_ENABLED=true`
// so it does not hit the backend until the endpoint above is actually
// shipped. Until then, the hook returns `{ status: "idle", data: undefined }`
// and consumers (the allocation modal) gracefully fall back to the per-event
// godown_quantity already on the order response. Set the env var to `true`
// in `.env` once the backend lands the endpoint to switch this on.
// ────────────────────────────────────────────────────────────────────────────

// Read once at module load — env vars don't change at runtime.
const FEATURE_ENABLED =
  String(import.meta.env.VITE_GLOBAL_GODOWN_STOCK_ENABLED || "").toLowerCase() ===
  "true";

const STOCK_STALE_TIME = 30 * 1000; // 30s — stock changes more often than vendors

const fetchGlobalStock = async (itemName) => {
  try {
    const response = await ApiInstance.get("/godown-stock/", {
      params: { item: itemName },
    });
    if (!response?.data?.status) return null;
    const d = response.data.data || {};
    return {
      item: d.item ?? itemName,
      unit: d.unit ?? "",
      total: Number(d.total ?? 0),
      committed_elsewhere: Number(d.committed_elsewhere ?? 0),
      available: Number(d.available ?? 0),
    };
  } catch (error) {
    // 404/501/etc. just means the backend hasn't shipped this endpoint yet —
    // log at debug level and let the caller fall back to per-event godown_qty.
    if (error?.response?.status !== 404) {
      logError("Global godown stock lookup failed:", error);
    }
    throw error;
  }
};

export const getGlobalGodownStockQueryKey = (itemName) => [
  "godown-stock",
  String(itemName || ""),
];

export const useGlobalGodownStock = (itemName, options = {}) => {
  // Pull `enabled` out of options so we can AND it with the feature flag
  // *after* the spread — otherwise `...rest` would happily spread an inner
  // `enabled` and clobber our flag-gating, sending the request anyway.
  const { enabled: callerEnabled, ...rest } = options;
  return useQuery({
    queryKey: getGlobalGodownStockQueryKey(itemName),
    queryFn: () => fetchGlobalStock(itemName),
    staleTime: STOCK_STALE_TIME,
    // Don't spam the console with retries when the endpoint just doesn't
    // exist yet.
    retry: (failureCount, error) =>
      error?.response?.status !== 404 && failureCount < 1,
    ...rest,
    // Hard-gate on the feature flag so the frontend doesn't fire requests
    // for an endpoint the backend hasn't shipped yet. When the backend lands
    // the endpoint, set VITE_GLOBAL_GODOWN_STOCK_ENABLED=true in .env.
    // Must come AFTER the spread so callers can't override it.
    enabled:
      FEATURE_ENABLED && Boolean(itemName) && (callerEnabled ?? true),
  });
};

export default useGlobalGodownStock;
