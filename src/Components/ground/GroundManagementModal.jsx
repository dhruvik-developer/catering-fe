/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { FiX, FiSearch, FiSave, FiBox, FiTag, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { getGroundCategories } from "../../api/GroundApis";

/**
 * GroundManagementModal
 *
 * Props:
 *   isOpen        – boolean
 *   onClose       – () => void
 *   onSave        – (groundManagementData) => void   // receives the final object
 *   existingData  – existing ground_management from the session (object | null)
 *   sessionName   – display label for which session
 */
const GroundManagementModal = ({ isOpen, onClose, onSave, existingData, sessionName }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // { itemId: quantity } – tracks user-entered quantities
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // When categories load and existingData is present, pre-fill quantities
  useEffect(() => {
    if (categories.length > 0 && existingData) {
      const prefilled = {};
      Object.entries(existingData).forEach(([, items]) => {
        const itemList = Array.isArray(items) ? items : [items];
        itemList.forEach((item) => {
          // Find matching item by name across all categories
          for (const cat of categories) {
            const found = (cat.ground_items || []).find(
              (gi) => gi.name === item.name
            );
            if (found) {
              prefilled[found.id] = String(item.quantity || "0");
              break;
            }
          }
        });
      });
      setQuantities(prefilled);
    }
  }, [categories, existingData]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getGroundCategories();
      if (res?.data?.status) {
        const data = res.data.data || [];
        setCategories(data);
        if (data.length > 0) {
          setActiveCategoryId(data[0].id);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ground categories");
    } finally {
      setLoading(false);
    }
  };

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0] || null;
  const groundItems = activeCategory?.ground_items || [];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return groundItems;
    return groundItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groundItems, searchQuery]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const selectedCount = Object.values(quantities).filter(
    (q) => q && Number(q) > 0
  ).length;

  const handleSave = async () => {
    // Build the ground_management object grouped by category
    const result = {};

    categories.forEach((cat) => {
      const selectedItems = (cat.ground_items || [])
        .filter((item) => quantities[item.id] && Number(quantities[item.id]) > 0)
        .map((item) => ({
          name: item.name,
          unit: item.unit || "Nos",
          quantity: String(quantities[item.id]),
        }));

      if (selectedItems.length > 0) {
        result[cat.name] = selectedItems;
      }
    });

    setSaving(true);
    try {
      await onSave(result);
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = () => {
    setQuantities({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Ground Management
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {sessionName ? `Session: ${sessionName}` : "Select items and set quantities"}
              {selectedCount > 0 && (
                <span className="ml-2 text-[var(--color-primary)] font-semibold">
                  • {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
              <span className="ml-3 text-sm text-gray-500">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiBox size={32} className="mb-2" />
              <p className="text-sm font-medium">No ground categories found</p>
            </div>
          ) : (
            <div className="flex h-full" style={{ minHeight: "400px" }}>
              {/* Left Panel - Categories */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Categories
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {categories.map((cat) => {
                    const isActive = cat.id === activeCategory?.id;
                    const qty = cat.ground_items?.length || 0;
                    const catSelectedCount = (cat.ground_items || []).filter(
                      (item) => quantities[item.id] && Number(quantities[item.id]) > 0
                    ).length;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategoryId(cat.id);
                          setSearchQuery("");
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-all duration-150 flex items-center gap-3 ${
                          isActive
                            ? "bg-[var(--color-primary-soft)] border-l-3 border-l-[var(--color-primary)]"
                            : "hover:bg-gray-50 border-l-3 border-l-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${isActive ? "text-[var(--color-primary)]" : "text-gray-800"}`}>
                            {cat.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-gray-400">{qty} items</span>
                            {catSelectedCount > 0 && (
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                {catSelectedCount} selected
                              </span>
                            )}
                          </div>
                        </div>
                        <FiChevronRight size={14} className={isActive ? "text-[var(--color-primary)]" : "text-gray-300"} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel - Items */}
              <div className="w-2/3 flex flex-col">
                {/* Items Header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">
                      {activeCategory?.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {groundItems.length} items
                    </p>
                  </div>
                  <div className="relative">
                    <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 w-40"
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5">
                      {filteredItems.map((item) => {
                        const currentQty = quantities[item.id] || "";
                        const hasQuantity = currentQty && Number(currentQty) > 0;

                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 ${
                              hasQuantity
                                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)]/30"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              hasQuantity ? "bg-[var(--color-primary)]/10" : "bg-gray-100"
                            }`}>
                              <FiTag size={13} className={hasQuantity ? "text-[var(--color-primary)]" : "text-gray-400"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${
                                hasQuantity ? "text-[var(--color-primary)]" : "text-gray-800"
                              }`}>
                                {item.name}
                              </p>
                              <span className="text-[11px] text-gray-400">
                                Unit: {item.unit || "Nos"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <label className="text-[10px] font-semibold text-gray-400 uppercase">Qty</label>
                              <input
                                type="number"
                                min="0"
                                value={currentQty}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                placeholder="0"
                                className={`w-20 text-center px-2 py-1.5 border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all ${
                                  hasQuantity
                                    ? "border-[var(--color-primary)]/30 bg-white text-[var(--color-primary)]"
                                    : "border-gray-200 text-gray-600"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                      <FiSearch size={24} className="mb-2 text-gray-300" />
                      <p className="text-sm">
                        {searchQuery ? "No items match your search" : "No items in this category"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear All
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-[var(--color-primary)] hover:brightness-95 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <FiSave size={14} />
              {saving ? "Saving..." : "Save Ground Items"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundManagementModal;
