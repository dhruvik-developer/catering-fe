/* eslint-disable react/prop-types */
import React from "react";
import Loader from "../../Components/common/Loader";
import { format } from "date-fns";

// ─── Unit Conversion Helper ───────────────────────────────────────────────────
const UNIT_CONVERSIONS = {
  kg: { g: 1000, kg: 1 },
  g: { kg: 0.001, g: 1 },
  l: { ml: 1000, l: 1 },
  ml: { l: 0.001, ml: 1 },
};

function convertToUnit(value, fromUnit, toUnit) {
  if (!fromUnit || !toUnit) return value;
  const from = fromUnit.trim().toLowerCase();
  const to = toUnit.trim().toLowerCase();
  if (from === to) return value;
  const factor = UNIT_CONVERSIONS[from]?.[to];
  return factor !== undefined ? value * factor : null;
}

function parseQuantity(str) {
  if (!str) return { value: 0, unit: "" };
  const match = String(str).match(/^([\d.]+)\s*([a-zA-Z]*)$/);
  if (match) return { value: parseFloat(match[1]) || 0, unit: match[2] || "" };
  return { value: parseFloat(str) || 0, unit: "" };
}

function getUniqueUsedItems(rows = []) {
  const usedItemsMap = new Map();

  rows.forEach((row) => {
    const usedItems = Array.isArray(row?.used_in_items) ? row.used_in_items : [];

    usedItems.forEach((usedItem) => {
      const itemName = String(usedItem || "").trim();
      const normalizedName = itemName.toLowerCase();

      if (normalizedName && !usedItemsMap.has(normalizedName)) {
        usedItemsMap.set(normalizedName, itemName);
      }
    });
  });

  return Array.from(usedItemsMap.values());
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      let d;
      if (parts[0].length === 4) {
        d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
      } else {
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
      if (!isNaN(d)) return format(d, "dd MMM, yyyy");
    }
  } catch (e) {
    /* fallback */
  }
  return dateStr;
}
// ─────────────────────────────────────────────────────────────────────────────

function ViewIngredientComponent({
  viewIngredient,
  eventIngredientsList = [],
  formValues,
  checkedItems = {},
  handleCheckboxChange,
  handleShareIngredients,
  handleFullShareIngredients,
  handleShareOutsourced,
  sessionFilter,
  sessionIdFilter,
  loading,
  navigate,
  onUpdateQuantity,
}) {
  const outsourcedItemsList = React.useMemo(() => {
    if (!viewIngredient?.sessions) return [];
    const items = [];
    viewIngredient.sessions.forEach(session => {
      if (sessionIdFilter && String(session.id) !== String(sessionIdFilter)) return;
      if (!sessionIdFilter && sessionFilter && session.event_time !== sessionFilter) return;
      const outsourced = session.outsourced_items || [];
      outsourced.forEach(oi => {
        items.push({
          ...oi,
          sessionTime: session.event_time
        });
      });
    });
    return items;
  }, [viewIngredient, sessionFilter]);

  // Inline edit state for ingredient quantities
  const [editingKey, setEditingKey] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");
  const [savingEdit, setSavingEdit] = React.useState(false);

  const handleSaveEdit = async (sessionId, ingredientName) => {
    if (!editValue.trim()) {
      setEditingKey(null);
      return;
    }
    setSavingEdit(true);
    const success = await onUpdateQuantity(sessionId, ingredientName, editValue.trim());
    setSavingEdit(false);
    if (success !== false) {
      setEditingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm gap-2">
        <button
          type="button"
          className="flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 truncate">
          Ingredient Details
        </h1>
        <div className="w-10 sm:w-20 flex-shrink-0" /> {/* spacer */}
      </div>

      {loading ? (
        <div className="p-8">
          <Loader message="Loading Ingredients..." />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Session filter hero banner */}
          {sessionFilter &&
            (() => {
              const matchedSession = sessionIdFilter
                ? viewIngredient?.sessions?.find((s) => String(s.id) === String(sessionIdFilter)) || {}
                : (viewIngredient?.sessions?.find(
                    (s) => (s.event_time || "").trim().toLowerCase() === (sessionFilter || "").trim().toLowerCase()
                  ) || {});
              const uniqueDates = Array.from(
                new Set((viewIngredient?.sessions || []).map((s) => s.event_date))
              ).filter(Boolean);
              const displayDate = 
                matchedSession.event_date || 
                viewIngredient?.event_date || 
                (uniqueDates.length > 0 ? uniqueDates[0] : null);

              const persons =
                matchedSession.estimated_persons ||
                viewIngredient?.estimated_persons ||
                "—";
              const address =
                matchedSession.event_address ||
                viewIngredient?.event_address ||
                "—";
              return (
                <>
                  {/* Person & session info card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4">
                    <div className="flex flex-wrap gap-5">
                      {viewIngredient?.name && (
                        <div>
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                            Customer
                          </p>
                          <p className="text-base font-bold text-gray-900">
                            {viewIngredient.name}
                          </p>
                        </div>
                      )}
                      {viewIngredient?.mobile_no && (
                        <div>
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                            Mobile
                          </p>
                          <p className="text-base font-semibold text-gray-700">
                            {viewIngredient.mobile_no}
                          </p>
                        </div>
                      )}
                       {displayDate && (
                        <div>
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                            Event Date
                          </p>
                          <p className="text-base font-semibold text-gray-700">
                            {formatDate(displayDate)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                          Estimated Persons
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {persons}
                        </p>
                      </div>
                      {address && address !== "—" && (
                        <div>
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                            Event Address
                          </p>
                          <p className="text-base font-medium text-gray-700">
                            {address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Session banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#845CBD] text-white px-4 sm:px-6 py-4 rounded-2xl shadow-md">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                        Viewing Session
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-bold">{sessionFilter}</p>
                        {displayDate && (
                          <span className="text-xs font-medium text-white/80">
                            • {formatDate(displayDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="sm:ml-auto w-full sm:w-auto flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="text-sm font-semibold">
                        {persons} persons
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}

          {/* Event info (only when no session filter) */}
          {!sessionFilter && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 flex flex-wrap gap-6 font-sans">
              {(() => {
                const uniqueDates = Array.from(
                  new Set((viewIngredient?.sessions || []).map((s) => s.event_date))
                ).filter(Boolean);
                const allDates = [...uniqueDates];
                if (viewIngredient?.event_date && !allDates.includes(viewIngredient.event_date)) {
                  allDates.push(viewIngredient.event_date);
                }
                
                return (
                  <>
                    {viewIngredient?.name && (
                      <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                          Customer
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          {viewIngredient.name}
                        </p>
                      </div>
                    )}
                    {viewIngredient?.mobile_no && (
                      <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                          Mobile
                        </p>
                        <p className="text-base font-semibold text-gray-700">
                          {viewIngredient.mobile_no}
                        </p>
                      </div>
                    )}
                    {allDates.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                          Event Date{allDates.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-base font-semibold text-gray-700">
                          {allDates.map(d => formatDate(d)).join(", ")}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                  Estimated Persons
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {viewIngredient.estimated_persons}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">
                  Event Address
                </p>
                <p className="text-base font-medium text-gray-700">
                  {viewIngredient.event_address}
                </p>
              </div>
            </div>
          )}

          {/* Vendor Supplied / Outsourced Items Block */}
          {outsourcedItemsList.length > 0 && (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-6 py-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-emerald-800 tracking-wide flex items-center gap-2">
                  <span className="text-lg">🍱</span> Vendor Supplied Items
                </h3>
                <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                  {outsourcedItemsList.length} item{outsourcedItemsList.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outsourcedItemsList.map((oi, idx) => {
                  return (
                    <div key={idx} className="bg-white border border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-gray-800 text-sm leading-snug">{oi.item_name}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200 shrink-0">
                          Outsourced
                        </span>
                      </div>

                      {/* Quantity */}
                      {oi.quantity ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                          <span>📦</span>
                          <span>Qty: {oi.quantity} {oi.unit || ''}</span>
                        </div>
                      ) : null}

                      {oi.vendor ? (
                         <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                           <span className="text-emerald-600">🏢</span> 
                           <span>Supplier:</span>
                           <span className="text-gray-800 truncate">{oi.vendor.name}</span>
                         </div>
                      ) : (
                         <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                           <span>⚠️</span> 
                           <span>No Vendor Assigned</span>
                         </div>
                      )}

                      {!sessionFilter && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <span>⏰</span> {oi.sessionTime}
                        </div>
                      )}

                      {/* Per-item share button */}
                      <button
                        type="button"
                        className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all text-[#845CBD] border border-[#845CBD] hover:bg-[#845CBD] hover:text-white cursor-pointer"
                        onClick={() => handleShareOutsourced(oi)}
                        title={`Share ${oi.item_name} with ${oi.vendor?.name || 'vendor'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Share with Vendor
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category blocks */}
          {eventIngredientsList.map((category, index) => {
            // Check if this category has any visible items for the active session
            const hasVisibleItems = category.data.some((item) => {
                if (sessionIdFilter) return item.use_item?.some((u) => String(u.session_id) === String(sessionIdFilter));
                if (!sessionFilter) return true;
                return item.use_item?.some((u) => {
                  const m = (u.item_name || "").match(/\(Session:\s*([^)]+)\)/);
                  return m ? m[1].trim() === sessionFilter : true;
                });
            });
            if (!hasVisibleItems) return null;

            const visibleItems = category.data.filter((item) => {
                if (sessionIdFilter) return item.use_item?.some((u) => String(u.session_id) === String(sessionIdFilter));
                if (!sessionFilter) return true;
                return item.use_item?.some((u) => {
                  const m = (u.item_name || "").match(/\(Session:\s*([^)]+)\)/);
                  return m ? m[1].trim() === sessionFilter : true;
                });
            });

            // Check if all items that need ordering already have a vendor
            const allItemsAssigned =
              visibleItems.length > 0 &&
              visibleItems.every((item) => {
                // Compute session-filtered total for this item
                const filteredUseItems = item.use_item?.filter((u) => {
                  if (sessionIdFilter) return String(u.session_id) === String(sessionIdFilter);
                  if (!sessionFilter) return true;
                  const m = (u.item_name || "").match(/\(Session:\s*([^)]+)\)/);
                  return m ? m[1].trim() === sessionFilter : true;
                }) || [];

                const itemTotal = filteredUseItems.reduce((sum, u) => {
                  const { value } = parseQuantity(u.quantity || "");
                  return sum + value;
                }, 0);

                const godownQty = parseFloat(item.godown_quantity || 0);

                // Godown fully covers the requirement → no vendor needed
                if (godownQty >= itemTotal && itemTotal > 0) return true;

                // Check if a non-godown vendor is assigned (covers the remainder)
                let hasVendor = false;
                if (viewIngredient?.sessions) {
                  viewIngredient.sessions.forEach((session) => {
                    if (sessionIdFilter && String(session.id) !== String(sessionIdFilter)) return;
                    if (!sessionIdFilter && sessionFilter && session.event_time !== sessionFilter) return;
                    const req = session.ingredients_required || {};
                    if (req[item.item] && req[item.item].vendor && req[item.item].vendor.id !== "godown") {
                      hasVendor = true;
                    }
                  });
                }
                return hasVendor;
              });

            // Check if at least one item has a vendor assigned (for the Share button)
            const anyItemAssigned = visibleItems.some((item) => {
              let hasVendor = false;
              if (viewIngredient?.sessions) {
                viewIngredient.sessions.forEach((session) => {
                  if (sessionIdFilter && String(session.id) !== String(sessionIdFilter)) return;
                  if (!sessionIdFilter && sessionFilter && session.event_time !== sessionFilter) return;
                  const req = session.ingredients_required || {};
                  if (req[item.item] && req[item.item].vendor) {
                    hasVendor = true;
                  }
                });
              }
              return hasVendor;
            });

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Category name bar */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 px-6 py-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-purple-800 tracking-wide">
                    {category.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${allItemsAssigned ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed" : "text-[#845CBD] border border-[#845CBD] hover:bg-[#845CBD] hover:text-white cursor-pointer"}`}
                      onClick={() =>
                        !allItemsAssigned &&
                        handleShareIngredients(
                          category.name,
                          sessionFilter || undefined,
                          "assign"
                        )
                      }
                      disabled={allItemsAssigned}
                      title={
                        allItemsAssigned
                          ? "All items already assigned"
                          : "Assign vendors to items"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {allItemsAssigned ? "Vendor Assigned" : "Assign Vendor"}
                    </button>
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${anyItemAssigned ? "text-[#845CBD] border border-[#845CBD] hover:bg-[#845CBD] hover:text-white cursor-pointer" : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"}`}
                      onClick={() =>
                        anyItemAssigned &&
                        handleShareIngredients(
                          category.name,
                          sessionFilter || undefined,
                          "share"
                        )
                      }
                      disabled={!anyItemAssigned}
                      title={
                        anyItemAssigned
                          ? "Share ingredient list"
                          : "Assign a vendor first to enable sharing"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share {category.name}
                    </button>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="p-3 grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3 bg-gray-50/50">
                  {category.data.map((item, i) => {
                    const firstUseQtyStr = item.use_item?.[0]?.quantity || "";
                    const { unit: requiredUnit } =
                      parseQuantity(firstUseQtyStr);

                    // Compute visible rows first (filtered by session)
                    const visibleRows =
                      item.use_item?.filter((u) => {
                        if (sessionIdFilter) return String(u.session_id) === String(sessionIdFilter);
                        if (!sessionFilter) return true;
                        const m = (u.item_name || "").match(
                          /\(Session:\s*([^)]+)\)/
                        );
                        return m ? m[1].trim() === sessionFilter : true;
                      }) || [];
                    const usedInItems = getUniqueUsedItems(visibleRows);

                    if (visibleRows.length === 0) return null;

                    // Calculate total from visible rows only
                    const totalRequiredValue = visibleRows.reduce(
                      (sum, u) => {
                        const { value: existingVal } = parseQuantity(
                          u.quantity || ""
                        );
                        return sum + existingVal;
                      },
                      0
                    );

                    const godownRaw = parseFloat(item.godown_quantity || 0);
                    const godownUnit = item.godown_quantity_type || "";
                    const convertedGodown =
                      requiredUnit && godownUnit
                        ? (convertToUnit(godownRaw, godownUnit, requiredUnit) ??
                          godownRaw)
                        : godownRaw;

                    // Compute vendor assignments for this item
                    const itemVendorsMap = new Map();
                    if (viewIngredient?.sessions) {
                      viewIngredient.sessions.forEach((session) => {
                        if (sessionIdFilter && String(session.id) !== String(sessionIdFilter)) return;
                        if (!sessionIdFilter && sessionFilter && session.event_time !== sessionFilter) return;
                        const req = session.ingredients_required || {};
                        if (req[item.item] && req[item.item].vendor) {
                          const v = req[item.item].vendor;
                          itemVendorsMap.set(v.id || v.name, v);
                        }
                      });
                    }
                    const itemVendors = Array.from(itemVendorsMap.values());
                    const hasNonGodownVendor = itemVendors.some((v) => v.id !== "godown");

                    const remaining = totalRequiredValue - convertedGodown;
                    const totalQuantity = hasNonGodownVendor ? 0 : Math.max(0, remaining);
                    const isFromGodown = godownRaw > 0;
                    const isChecked =
                      !!checkedItems[`${category.name}||${item.item}`];

                    return (
                      <div
                        key={i}
                        className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                      >
                        <div className="p-3 flex-1 flex flex-col">
                          {/* Item header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                              <h4 className="text-sm font-bold text-gray-800">
                                {item.item}
                              </h4>
                            </div>
                          </div>

                          {/* Session quantity rows */}
                          <div className="flex flex-col gap-1 mb-3">
                            {visibleRows.map((usedItem, j) => {
                              const rawName = usedItem?.item_name || "N/A";
                              const itemCat = usedItem?.item_category || "";
                              const sessionMatch = rawName.match(
                                /\(Session:\s*([^)]+)\)/
                              );
                              const sessionLabel = sessionMatch
                                ? sessionMatch[1].trim()
                                : rawName;
                              const qty = usedItem?.quantity || "0";

                              return (
                                <div
                                  key={j}
                                  className="group/row flex items-center justify-between bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5"
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      {sessionLabel}
                                    </span>
                                    {itemCat && (
                                      <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                                        {itemCat}
                                      </span>
                                    )}
                                  </div>
                                  {editingKey === `${item.item}||${usedItem.session_id}` ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-24 px-2 py-0.5 text-sm font-bold text-gray-800 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleSaveEdit(usedItem.session_id, item.item);
                                          if (e.key === "Escape") setEditingKey(null);
                                        }}
                                        disabled={savingEdit}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEdit(usedItem.session_id, item.item)}
                                        disabled={savingEdit}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                                        title="Save"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingKey(null)}
                                        disabled={savingEdit}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                        title="Cancel"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-bold text-gray-800">
                                        {qty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingKey(`${item.item}||${usedItem.session_id}`);
                                          setEditValue(qty);
                                        }}
                                        className="p-0.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors cursor-pointer opacity-0 group-hover/row:opacity-100"
                                        title="Edit quantity"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {usedInItems.length > 0 && (
                            <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                                Used In Items
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-700 leading-6">
                                {usedInItems.join(", ")}
                              </p>
                            </div>
                          )}

                          {/* Vendor Assignment Display */}
                          {itemVendors.length > 0 && (
                              <div
                                className="mb-3 flex items-center flex-wrap gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
                                style={
                                  itemVendors.some((v) => v.id === "godown")
                                    ? {
                                        backgroundColor: "#f0fdf4",
                                        borderColor: "#86efac",
                                        color: "#15803d",
                                      }
                                    : {
                                        backgroundColor: "#f5f3ff",
                                        borderColor: "#c4b5fd",
                                        color: "#845CBD",
                                      }
                                }
                              >
                                {itemVendors.some((v) => v.id === "godown") ? (
                                  <>
                                    <span>🏭</span>
                                    <span>Ordered from Godown</span>
                                  </>
                                ) : (
                                  <div className="flex flex-col gap-1 w-full">
                                    {itemVendors.map((v) => (
                                      <div key={v.id || v.name} className="flex justify-between items-center w-full">
                                        <span>★ Assigned to: {v.name}</span>
                                        {v.source_type === "item" ? (
                                            <span className="text-[10px] bg-blue-100 text-blue-700 font-medium px-1.5 py-0.5 rounded ml-2 border border-blue-200">Auto (Item)</span>
                                        ) : v.source_type === "manual" ? (
                                            <span className="text-[10px] bg-purple-100/50 text-purple-800 font-medium px-1.5 py-0.5 rounded ml-2 border border-purple-200">Manual</span>
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                          )}

                          {/* Calculation strip (pushed to bottom) */}
                          <div className="mt-auto bg-gray-50/80 border border-gray-100 rounded-lg px-3 py-2.5 space-y-2 text-xs">
                            {/* Source breakdown row */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Godown badge */}
                              {isFromGodown && (
                                <div className={`flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full border ${
                                  convertedGodown >= totalRequiredValue
                                    ? "text-green-700 bg-green-50 border-green-200"
                                    : "text-amber-700 bg-amber-50 border-amber-200"
                                }`}>
                                  <span>{convertedGodown >= totalRequiredValue ? "✅" : "🏭"}</span>
                                  <span>Godown: {godownRaw} {godownUnit}</span>
                                  {convertedGodown < totalRequiredValue && (
                                    <span className="text-[10px] text-amber-600 font-medium">(partial)</span>
                                  )}
                                </div>
                              )}
                              {!isFromGodown && (
                                <div className="flex items-center gap-1.5 font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                                  <span>📦</span>
                                  <span>Godown: 0</span>
                                </div>
                              )}

                              {/* Vendor badge */}
                              {hasNonGodownVendor && (
                                <div className="flex items-center gap-1.5 font-semibold text-[#845CBD] bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                                  <span>🛒</span>
                                  <span>Vendor: {Math.max(0, remaining)} {requiredUnit || item.quantity_type || ""}</span>
                                </div>
                              )}
                              {!hasNonGodownVendor && totalQuantity > 0 && (
                                <div className="flex items-center gap-1.5 font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                                  <span>⚠️</span>
                                  <span>Vendor: Not assigned</span>
                                </div>
                              )}
                            </div>

                            {/* Total + Remaining row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-200">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-gray-500">
                                  Total:
                                </span>
                                <span className="text-sm font-bold text-gray-700">
                                  {totalRequiredValue}
                                  <span className="text-xs font-medium ml-0.5 text-gray-400">
                                    {requiredUnit || item.quantity_type || ""}
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold ${totalQuantity === 0 ? "text-green-600" : "text-orange-600"}`}>
                                  {totalQuantity === 0 ? "✅" : "⚠️"} Remaining:
                                </span>
                                <span className={`text-base font-black ${totalQuantity === 0 ? "text-green-600" : "text-orange-600"}`}>
                                  {totalQuantity}
                                  <span className="text-xs font-medium ml-1 text-gray-500">
                                    {formValues[
                                      `${category.name}-${i}-quantityType`
                                    ] ||
                                      item.quantity_type ||
                                      ""}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default ViewIngredientComponent;
