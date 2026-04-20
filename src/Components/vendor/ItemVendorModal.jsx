import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchVendors } from "../../api/vendors";
import { assignItemVendor, getItemVendorAssignments } from "../../apis/VendorAssignmentApis";
import { FiX, FiCheck } from "react-icons/fi";

const ItemVendorModal = ({ isOpen, onClose, session, eventId }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    if (isOpen && session) {
      loadInitialData();
    }
  }, [isOpen, session]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [vRes, aRes] = await Promise.all([
        fetchVendors(),
        getItemVendorAssignments(session.id)
      ]);
      setVendors(Array.isArray(vRes?.data) ? vRes.data : []);
      
      const newAssignments = {};
      (aRes || []).forEach(a => {
        newAssignments[a.item_name] = a;
      });
      setAssignments(newAssignments);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load item configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (itemName, isVendorSupplied, vendorId, quantity, unit) => {
    try {
      await assignItemVendor({
        event: eventId,
        session: session.id,
        item_name: itemName,
        is_vendor_supplied: isVendorSupplied,
        vendor: vendorId || null,
        quantity: quantity || null,
        unit: unit || ""
      });
      toast.success(`Updated configuration for ${itemName}!`);
      
      setAssignments(prev => ({
        ...prev,
        [itemName]: {
          ...prev[itemName],
          is_vendor_supplied: isVendorSupplied,
          vendor: vendorId || null,
          quantity: quantity || null,
          unit: unit || ""
        }
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item configuration");
    }
  };

  const handleToggleVendorSupplied = (itemName, checked) => {
    const config = assignments[itemName] || {};
    handleUpdateConfig(itemName, checked, config.vendor, config.quantity, config.unit);
  };

  const handleAssignVendor = (itemName, vendorId) => {
    if (!vendorId) return;
    const config = assignments[itemName] || {};
    handleUpdateConfig(itemName, config.is_vendor_supplied || false, vendorId, config.quantity, config.unit);
  };

  const handleQtyChange = (itemName, field, value) => {
    setAssignments(prev => ({
      ...prev,
      [itemName]: { ...prev[itemName], [field]: value }
    }));
  };

  const handleQtyBlur = (itemName) => {
    const config = assignments[itemName] || {};
    if (config.is_vendor_supplied) {
      handleUpdateConfig(itemName, true, config.vendor, config.quantity, config.unit);
    }
  };

  if (!isOpen || !session) return null;

  const entries = Object.entries(session.selected_items || {}).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            Configure Item Sourcing
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#845cbd] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No dishes found in this session.
            </div>
          ) : (
            entries.map(([category, items]) => (
              <div
                key={category}
                className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="px-5 py-3 bg-purple-50/50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-purple-900">{category}</h3>
                  <span className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((dish) => {
                    const dishName = typeof dish === 'object' ? dish.name : dish;
                    const config = assignments[dishName] || {};
                    const isVendorSupplied = config.is_vendor_supplied || false;
                    const assignedVendorId = config.vendor || "";

                    return (
                      <div
                        key={dishName}
                        className="px-5 py-4 flex flex-col gap-3 hover:bg-gray-50 transition-colors"
                      >
                        {/* Row 1: Name + Toggle + Vendor */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 w-[40%]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#845cbd]"></span>
                            <span className="font-medium text-gray-700 truncate" title={dishName}>
                              {dishName}
                            </span>
                          </div>
                          <div className="w-[60%] flex items-center justify-end gap-5">
                            {/* Toggle Switch */}
                            <label className="flex items-center cursor-pointer group">
                              <span className="mr-3 text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">Vendor Supplied</span>
                              <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  className="sr-only" 
                                  checked={isVendorSupplied} 
                                  onChange={(e) => handleToggleVendorSupplied(dishName, e.target.checked)} 
                                />
                                <div className={`block w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${isVendorSupplied ? 'bg-[#845cbd]' : 'bg-gray-200'}`}></div>
                                <div className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full shadow transition-transform duration-300 ease-in-out ${isVendorSupplied ? 'translate-x-5' : ''}`}></div>
                              </div>
                            </label>

                            {/* Vendor Dropdown */}
                            <div className="w-[210px] flex items-center justify-end">
                              {isVendorSupplied ? (
                                <div className="flex items-center gap-2 w-full">
                                  <select
                                    className="flex-1 text-sm border-gray-300 rounded-lg shadow-sm focus:border-[#845cbd] focus:ring focus:ring-[#845cbd]/20"
                                    value={assignedVendorId || ""}
                                    onChange={(e) => handleAssignVendor(dishName, e.target.value)}
                                  >
                                    <option value="">-- Select Vendor --</option>
                                    {vendors.map((v) => (
                                      <option key={v.id} value={v.id}>
                                        {v.name || v.vendor_name || v.company_name}
                                      </option>
                                    ))}
                                  </select>
                                  {assignedVendorId && (
                                    <span className="text-[#845cbd]" title="Vendor Assigned">
                                      <FiCheck size={18} strokeWidth={3} />
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="text-right text-[11px] text-gray-400 font-semibold uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-md">
                                  In-house
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Qty + Unit (only when vendor supplied) */}
                        {isVendorSupplied && (
                          <div className="flex items-center gap-3 pl-4 pt-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-20">Quantity</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g. 15"
                              className="w-24 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-[#845cbd] focus:ring focus:ring-[#845cbd]/20 outline-none"
                              value={config.quantity || ""}
                              onChange={(e) => handleQtyChange(dishName, "quantity", e.target.value)}
                              onBlur={() => handleQtyBlur(dishName)}
                            />
                            <input
                              type="text"
                              placeholder="unit (kg, L…)"
                              className="w-28 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-[#845cbd] focus:ring focus:ring-[#845cbd]/20 outline-none"
                              value={config.unit || ""}
                              onChange={(e) => handleQtyChange(dishName, "unit", e.target.value)}
                              onBlur={() => handleQtyBlur(dishName)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemVendorModal;
