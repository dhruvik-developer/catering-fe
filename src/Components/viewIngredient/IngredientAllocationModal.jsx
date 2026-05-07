/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import FormModal from "../common/FormModal";
import { useVendors } from "../../hooks/useVendors";
import { useGlobalGodownStock } from "../../hooks/useGlobalGodownStock";

// ────────────────────────────────────────────────────────────────────────────
// IngredientAllocationModal (Phase 2)
//
// Manual split allocation editor for a single ingredient on a single session.
// Supports:
//   - Source toggle: Godown / Vendor / Both
//   - Multiple vendors per item, each with their own quantity
//   - Live global godown stock display (when the backend provides it)
//
// Persisted contract on `session.ingredients_required[itemName]`:
//   allocation = {
//     source: "godown" | "vendor" | "both",
//     godown_qty: number,
//     vendor_qty: number,                  // sum of all vendors' qty
//     vendors: [{ id, name, mobile_no, qty }, …],   // Phase 2 multi-vendor
//     vendor: { id, name, mobile_no } | null,        // Phase 1 backcompat
//                                                     // (mirrors first entry)
//   }
// ────────────────────────────────────────────────────────────────────────────

const SOURCES = [
  { id: "godown", label: "Godown only", hint: "Use in-house stock" },
  { id: "vendor", label: "Vendor only", hint: "Buy from a vendor" },
  { id: "both", label: "Split", hint: "Partly godown, rest vendor" },
];

const toNum = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const round = (n) => Math.round(n * 1000) / 1000;

const blankVendorRow = () => ({
  // Use a stable client-side id so React keys are stable across renders
  // even before the user picks an actual vendor.
  rowId: Math.random().toString(36).slice(2, 9),
  vendorId: "",
  qtyInput: "",
});

// Build initial vendor rows from a saved allocation, falling back to a single
// blank row when nothing has been saved yet.
const seedVendorRows = (allocation, fallbackVendor) => {
  if (allocation?.vendors && Array.isArray(allocation.vendors) && allocation.vendors.length > 0) {
    return allocation.vendors.map((v) => ({
      rowId: Math.random().toString(36).slice(2, 9),
      vendorId: v.id ? String(v.id) : "",
      qtyInput: String(v.qty ?? ""),
    }));
  }
  if (allocation?.vendor) {
    return [
      {
        rowId: Math.random().toString(36).slice(2, 9),
        vendorId: allocation.vendor.id ? String(allocation.vendor.id) : "",
        qtyInput: String(allocation.vendor_qty ?? 0),
      },
    ];
  }
  return [
    {
      rowId: Math.random().toString(36).slice(2, 9),
      vendorId: fallbackVendor?.id ? String(fallbackVendor.id) : "",
      qtyInput: "",
    },
  ];
};

function IngredientAllocationModal({
  isOpen,
  onClose,
  onSave,
  itemName,
  categoryName,
  requiredQty,
  requiredUnit,
  godownAvailable,
  currentAllocation,
  currentVendor,
}) {
  const { data: allVendors = [] } = useVendors();
  // Live cross-event stock check. Falls through to per-event godown when the
  // endpoint is absent or returns an error — see useGlobalGodownStock for the
  // expected backend contract.
  const { data: globalStock, status: globalStockStatus } = useGlobalGodownStock(
    itemName,
    { enabled: isOpen }
  );

  const vendorsForCategory = useMemo(() => {
    const target = (categoryName || "").trim().toLowerCase();
    if (!target) return allVendors;
    return allVendors.filter((vendor) => {
      if (Array.isArray(vendor.vendor_categories)) {
        return vendor.vendor_categories.some(
          (vc) => (vc.category_name || "").trim().toLowerCase() === target
        );
      }
      const single = (vendor.category || vendor.category_name || "")
        .trim()
        .toLowerCase();
      return single === target;
    });
  }, [allVendors, categoryName]);

  const [source, setSource] = useState("vendor");
  const [godownQtyInput, setGodownQtyInput] = useState("");
  const [vendorRows, setVendorRows] = useState(() => seedVendorRows(null, null));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const required = round(requiredQty || 0);
    const godownCap = round(Math.min(godownAvailable || 0, required));

    if (currentAllocation) {
      setSource(currentAllocation.source || "vendor");
      setGodownQtyInput(String(currentAllocation.godown_qty ?? 0));
      setVendorRows(seedVendorRows(currentAllocation, currentVendor));
    } else {
      // Seed from auto-derive defaults.
      const fromVendor = round(Math.max(0, required - godownCap));
      if (godownCap > 0 && fromVendor > 0) {
        setSource("both");
        setGodownQtyInput(String(godownCap));
        setVendorRows([
          {
            rowId: Math.random().toString(36).slice(2, 9),
            vendorId: currentVendor?.id ? String(currentVendor.id) : "",
            qtyInput: String(fromVendor),
          },
        ]);
      } else if (godownCap > 0) {
        setSource("godown");
        setGodownQtyInput(String(godownCap));
        setVendorRows([
          {
            rowId: Math.random().toString(36).slice(2, 9),
            vendorId: currentVendor?.id ? String(currentVendor.id) : "",
            qtyInput: "0",
          },
        ]);
      } else {
        setSource("vendor");
        setGodownQtyInput("0");
        setVendorRows([
          {
            rowId: Math.random().toString(36).slice(2, 9),
            vendorId: currentVendor?.id ? String(currentVendor.id) : "",
            qtyInput: String(required),
          },
        ]);
      }
    }
    setError("");
  }, [isOpen, currentAllocation, currentVendor, godownAvailable, requiredQty]);

  const godownQty = toNum(godownQtyInput);
  const vendorTotal = vendorRows.reduce((sum, r) => sum + toNum(r.qtyInput), 0);
  const total = round(godownQty + vendorTotal);
  const required = round(requiredQty || 0);
  const sumMismatch = Math.abs(total - required) > 1e-6;
  const overGodown = godownQty > (godownAvailable || 0) + 1e-6;

  // The "live available" number we surface in the header. Prefer the global
  // (cross-event) stock if the backend exposes it; otherwise fall back to the
  // per-event godown qty already loaded with the order.
  const liveAvailable =
    globalStockStatus === "success" && globalStock?.available != null
      ? globalStock.available
      : godownAvailable || 0;
  const overGlobalStock =
    globalStockStatus === "success" &&
    globalStock?.available != null &&
    godownQty > globalStock.available + 1e-6;

  const handleSourceChange = (next) => {
    setSource(next);
    setError("");
    const godownCap = round(Math.min(godownAvailable || 0, required));

    if (next === "godown") {
      setGodownQtyInput(String(required));
      setVendorRows((prev) =>
        prev.map((r) => ({ ...r, qtyInput: "0" }))
      );
    } else if (next === "vendor") {
      setGodownQtyInput("0");
      setVendorRows((prev) => {
        // Put the full required qty on the first row, zero the rest.
        if (prev.length === 0) {
          return [
            {
              rowId: Math.random().toString(36).slice(2, 9),
              vendorId: "",
              qtyInput: String(required),
            },
          ];
        }
        return prev.map((r, i) => ({
          ...r,
          qtyInput: i === 0 ? String(required) : "0",
        }));
      });
    } else {
      // both: leave existing rows alone but make sure godown takes up to its
      // cap and the first vendor row covers the remainder.
      const fromVendor = round(Math.max(0, required - godownCap));
      setGodownQtyInput(String(godownCap));
      setVendorRows((prev) => {
        if (prev.length === 0) {
          return [
            {
              rowId: Math.random().toString(36).slice(2, 9),
              vendorId: "",
              qtyInput: String(fromVendor),
            },
          ];
        }
        return prev.map((r, i) => ({
          ...r,
          qtyInput: i === 0 ? String(fromVendor) : "0",
        }));
      });
    }
  };

  const updateVendorRow = (rowId, patch) => {
    setVendorRows((prev) =>
      prev.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r))
    );
    setError("");
  };

  const addVendorRow = () => {
    setVendorRows((prev) => [...prev, blankVendorRow()]);
  };

  const removeVendorRow = (rowId) => {
    setVendorRows((prev) =>
      prev.length === 1 ? prev : prev.filter((r) => r.rowId !== rowId)
    );
  };

  const handleSubmit = () => {
    if (overGodown) {
      setError(
        `Godown stock available is only ${round(godownAvailable || 0)} ${requiredUnit || ""}.`
      );
      return;
    }
    if (overGlobalStock) {
      setError(
        `Only ${globalStock.available} ${requiredUnit || ""} is uncommitted across all events.`
      );
      return;
    }
    if (sumMismatch) {
      setError(
        `Godown + Vendors must equal ${required} ${requiredUnit || ""}. Current total: ${total}.`
      );
      return;
    }

    // Resolve each vendor row (only those with qty > 0) to the full vendor
    // object, validating that a vendor was picked.
    const resolvedVendors = [];
    for (const row of vendorRows) {
      const qty = toNum(row.qtyInput);
      if (qty <= 0) continue;
      if (!row.vendorId) {
        setError("Pick a vendor for every non-zero vendor row, or remove the row.");
        return;
      }
      const v = vendorsForCategory.find(
        (x) => String(x.id) === String(row.vendorId)
      );
      if (!v) {
        setError("Selected vendor was not found in the list.");
        return;
      }
      resolvedVendors.push({
        id: v.id,
        name: v.name || v.vendor_name || v.company_name || "",
        mobile_no: v.mobile_no || v.mobile || v.phone || "",
        qty,
      });
    }

    // Disallow the same vendor twice — they should consolidate the qty.
    const seen = new Set();
    for (const v of resolvedVendors) {
      if (seen.has(String(v.id))) {
        setError(
          "The same vendor appears twice. Combine them into a single row instead."
        );
        return;
      }
      seen.add(String(v.id));
    }

    if (
      (source === "vendor" || source === "both") &&
      vendorTotal > 0 &&
      resolvedVendors.length === 0
    ) {
      setError("Please pick at least one vendor for the vendor portion.");
      return;
    }

    onSave({
      source,
      godown_qty: godownQty,
      vendor_qty: round(vendorTotal),
      vendors: source === "godown" ? [] : resolvedVendors,
    });
  };

  const showVendorRows = source !== "godown";

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Allocation"
      subtitle={itemName}
      widthClass="max-w-xl"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
          >
            Save Allocation
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Stock summary strip */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Required
            </div>
            <div className="mt-0.5 text-base font-bold text-gray-900">
              {required} {requiredUnit}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Godown available
              </div>
              {globalStockStatus === "success" && globalStock?.available != null && (
                <span className="text-[10px] font-semibold text-emerald-700">
                  live
                </span>
              )}
              {globalStockStatus === "loading" && (
                <span className="text-[10px] text-emerald-600">…</span>
              )}
            </div>
            <div className="mt-0.5 text-base font-bold text-emerald-800">
              {round(liveAvailable)} {requiredUnit}
            </div>
            {globalStockStatus === "success" &&
              globalStock?.committed_elsewhere != null &&
              globalStock.committed_elsewhere > 0 && (
                <div className="mt-0.5 text-[11px] text-emerald-700">
                  ({round(globalStock.committed_elsewhere)} already committed
                  to other events)
                </div>
              )}
          </div>
        </div>

        {/* Source toggle */}
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-600">
            Source
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SOURCES.map((s) => {
              const active = source === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSourceChange(s.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-text)]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="mt-0.5 text-[11px] text-gray-500">
                    {s.hint}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Godown qty */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Godown quantity ({requiredUnit})
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={godownQtyInput}
            onChange={(e) => {
              setGodownQtyInput(e.target.value);
              setError("");
            }}
            disabled={source === "vendor"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
          {overGodown && (
            <div className="mt-1 text-xs font-medium text-red-600">
              Exceeds available godown stock ({round(godownAvailable || 0)}{" "}
              {requiredUnit}).
            </div>
          )}
          {overGlobalStock && (
            <div className="mt-1 text-xs font-medium text-red-600">
              Exceeds uncommitted global stock ({globalStock.available}{" "}
              {requiredUnit}).
            </div>
          )}
        </div>

        {/* Vendor rows */}
        {showVendorRows && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600">
                Vendors ({requiredUnit})
              </label>
              <button
                type="button"
                onClick={addVendorRow}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <FiPlus size={12} /> Add vendor
              </button>
            </div>
            <div className="space-y-2">
              {vendorRows.map((row) => (
                <div
                  key={row.rowId}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2"
                >
                  <select
                    value={row.vendorId}
                    onChange={(e) =>
                      updateVendorRow(row.rowId, { vendorId: e.target.value })
                    }
                    className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  >
                    <option value="">— Select vendor —</option>
                    {vendorsForCategory.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name || v.vendor_name || v.company_name || `#${v.id}`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Qty"
                    value={row.qtyInput}
                    onChange={(e) =>
                      updateVendorRow(row.rowId, { qtyInput: e.target.value })
                    }
                    className="w-24 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeVendorRow(row.rowId)}
                    disabled={vendorRows.length === 1}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Remove vendor row"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            {vendorsForCategory.length === 0 && (
              <div className="mt-2 text-xs text-amber-700">
                No vendors found for category &quot;{categoryName}&quot;. Add
                one under People → Vendors.
              </div>
            )}
          </div>
        )}

        {/* Sum hint */}
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold ${
            sumMismatch
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-emerald-300 bg-emerald-50 text-emerald-800"
          }`}
        >
          <span>
            Total allocated ({godownQty} godown + {round(vendorTotal)} vendor)
          </span>
          <span>
            {total} / {required} {requiredUnit}
          </span>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </div>
    </FormModal>
  );
}

export default IngredientAllocationModal;
