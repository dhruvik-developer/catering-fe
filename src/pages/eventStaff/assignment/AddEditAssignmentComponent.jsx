/* eslint-disable react/prop-types */
import { FiBriefcase, FiUser, FiClock, FiUsers, FiCheck, FiX, FiSearch, FiChevronRight, FiChevronLeft, FiArrowRight } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import Loader from "../../../Components/common/Loader";
import { useState, useMemo } from "react";

function AddEditAssignmentComponent({
  mode,
  formData,
  loading,
  saving,
  errors,
  staffList,
  filteredStaffList,
  rolesList,
  handleChange,
  handleStaffChange,
  handleRoleChange,
  handleSubmit,
  handleCancel,
  // Multi-staff props
  selectedStaffEntries = [],
  onToggleStaff,
  onUpdateStaffEntry,
  onRemoveStaffEntry,
  grandTotal = 0,
  // Wizard step props
  currentStep = 1,
  goToStep1,
  goToStep2,
  activeCategoryFilter = "",
  handleCategoryFilterChange,
  // Waiter service info from order
  waiterService = [],
  waiterServiceAmount = 0,
  eventName = "",
}) {
  const [staffSearchQuery, setStaffSearchQuery] = useState("");
  const [assignedWaiterTally, setAssignedWaiterTally] = useState({});

  const toggleWaiterTally = (idx) => {
    setAssignedWaiterTally((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Filter staff list by search query
  const searchFilteredStaff = useMemo(() => {
    if (!staffSearchQuery.trim()) return filteredStaffList;
    return filteredStaffList.filter((s) =>
      s.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
    );
  }, [filteredStaffList, staffSearchQuery]);

  // Check if a staff is already selected
  const isStaffSelected = (staffId) =>
    selectedStaffEntries.some((e) => String(e.staffId) === String(staffId));

  // Get role name by id
  const getRoleName = (roleId) => {
    const role = rolesList?.find((r) => String(r.id) === String(roleId));
    return role?.name || "—";
  };

  // Safely parse waiterService taking into account object structures
  const parsedWaiterService = useMemo(() => {
    let ws = waiterService;
    if (typeof ws === "string") {
      try {
        ws = JSON.parse(ws);
      } catch (e) {
        return [];
      }
    }
    
    if (!ws) return [];
    if (Array.isArray(ws)) return ws;
    if (ws.entries && Array.isArray(ws.entries)) return ws.entries;
    if (ws.type && ws.count) return [ws];
    
    return [];
  }, [waiterService]);

  // Compute total waiter count from order's waiter_service
  const totalWaiterCount = useMemo(() => {
    return parsedWaiterService.reduce((sum, w) => {
      if (!w || (!w.type && !w.waiterType)) return sum;
      return sum + (parseInt(w.count || w.waiterCount) || 0);
    }, 0);
  }, [parsedWaiterService]);

  // Filter valid waiter entries (non-empty)
  const validWaiters = useMemo(() => {
    return parsedWaiterService.filter((w) => w && (w.type || w.waiterType) && (parseInt(w.count || w.waiterCount) || 0) > 0);
  }, [parsedWaiterService]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader message="Loading Assignment Details..." />
      </div>
    );
  }

  // Edit mode renders original single-staff form
  if (mode === "edit") {
    return renderSingleStaffForm();
  }

  // Add mode renders 2-step wizard
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm self-start">
                <FiBriefcase className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Assign Staff to Event
                </h2>
                <p className="text-white/60 text-sm mt-0.5 font-medium">
                  {formData.sessionName || "Event Session"}
                  {eventName && <span className="text-white/40"> • {eventName}</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
              {/* Waiters Needed (from Order) */}
              {totalWaiterCount > 0 && (
                <div className="bg-amber-500/20 border border-amber-300/30 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <span className="text-amber-100/90 text-[10px] font-bold uppercase tracking-wider block mb-1">
                    Waiters Needed
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {validWaiters.map((w, idx) => {
                      const isAssigned = assignedWaiterTally[idx];
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-1.5 text-white text-[13px] font-bold border px-2 py-1 rounded-md cursor-pointer transition-all ${
                            isAssigned
                              ? "bg-amber-500/10 border-transparent opacity-60"
                              : "bg-amber-500/30 border-amber-400/20 hover:bg-amber-500/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!isAssigned}
                            onChange={() => toggleWaiterTally(idx)}
                            className="w-3.5 h-3.5 rounded-sm border-amber-300/50 text-amber-500 focus:ring-amber-500 bg-transparent/20 cursor-pointer"
                            title="Tally when assigned"
                          />
                          <div className={`flex items-center gap-1 ${isAssigned ? "line-through" : ""}`}>
                            {w.type_name || w.type || w.waiterType}
                            <span className={`text-[11px] font-black ${isAssigned ? "text-amber-200/50" : "text-amber-200/90"}`}>
                              {w.count || w.waiterCount}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedStaffEntries.length > 0 && (
                <>
                  <div className="bg-white/15 rounded-xl px-4 py-2 text-center backdrop-blur-sm">
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider block">
                      Selected
                    </span>
                    <span className="text-white text-lg font-black">
                      {selectedStaffEntries.length}
                    </span>
                  </div>
                  <div className="bg-white/15 rounded-xl px-4 py-2 text-center backdrop-blur-sm">
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider block">
                      Total
                    </span>
                    <span className="text-white text-lg font-black">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mt-5">
            <div
              onClick={currentStep === 2 ? goToStep1 : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentStep === 1
                  ? "bg-white text-[var(--color-primary)] shadow-lg"
                  : "bg-white/15 text-white/80 cursor-pointer hover:bg-white/25"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 1 ? "bg-[var(--color-primary)] text-white" : "bg-white/20 text-white"
              }`}>
                {currentStep > 1 ? <FiCheck size={12} /> : "1"}
              </span>
              Select Staff
            </div>
            <FiChevronRight className="text-white/40" size={16} />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                currentStep === 2
                  ? "bg-white text-[var(--color-primary)] shadow-lg"
                  : "bg-white/15 text-white/50"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 2 ? "bg-[var(--color-primary)] text-white" : "bg-white/20 text-white/60"
              }`}>2</span>
              Configure & Assign
            </div>
          </div>
        </div>

        {/* STEP 1: Select Staff */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8">
            {/* Category filter tabs */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 mb-3 block">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-4">
                {["Fixed", "Agency", "Contract"].map((category) => {
                  const isActive = activeCategoryFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryFilterChange(isActive ? "" : category)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all border-2 cursor-pointer shadow-sm ${
                        isActive
                          ? "bg-white border-[var(--color-primary)] text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10"
                          : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {isActive && <FiCheck className="stroke-[3px]" />}
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-5 max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search staff by name..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            {/* Staff grid */}
            {searchFilteredStaff.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(100vh-440px)] overflow-y-auto pr-1 custom-scrollbar">
                {searchFilteredStaff.map((staff) => {
                  const selected = isStaffSelected(staff.id);
                  return (
                    <div
                      key={staff.id}
                      onClick={() => onToggleStaff(staff)}
                      className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 group ${
                        selected
                          ? "border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary-tint)] to-[var(--color-primary-tint)] shadow-md ring-1 ring-[var(--color-primary)]/20"
                          : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm"
                      }`}
                    >
                      {/* Selection check */}
                      <div
                        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          selected
                            ? "bg-[var(--color-primary)] text-white shadow-sm"
                            : "border-2 border-gray-200 text-transparent group-hover:border-purple-300"
                        }`}
                      >
                        <FiCheck size={14} />
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                            selected
                              ? "bg-[var(--color-primary)] text-white shadow-md"
                              : "bg-gray-100 text-gray-500 group-hover:bg-purple-50 group-hover:text-[var(--color-primary)]"
                          }`}
                        >
                          {staff.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${selected ? "text-[var(--color-primary)]" : "text-gray-800"}`}>
                            {staff.name}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {staff.staff_type}
                            {staff.agency_name && ` • ${staff.agency_name}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600">
                          ₹{staff.per_person_rate || staff.per_day_rate || 0}/day
                        </span>
                        {staff.waiter_type_name && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-600">
                            {staff.waiter_type_name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FiUsers size={32} className="mb-2 text-gray-300" />
                <p className="text-sm font-medium">
                  {staffSearchQuery ? "No staff match your search" : "No active staff found for this role"}
                </p>
              </div>
            )}

            {/* Selected staff summary chips */}
            {selectedStaffEntries.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Selected ({selectedStaffEntries.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStaffEntries.map((entry) => {
                    const staffObj = staffList.find(
                      (s) => String(s.id) === String(entry.staffId)
                    );
                    return (
                      <div
                        key={entry.staffId}
                        className="flex items-center gap-2 bg-[var(--color-primary-soft)] border border-[var(--color-primary)]/20 text-[var(--color-primary)] px-3 py-1.5 rounded-xl text-sm font-semibold"
                      >
                        <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-black">
                          {staffObj?.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                        {staffObj?.name || "Unknown"}
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({getRoleName(entry.roleId)})
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveStaffEntry(entry.staffId);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1 Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={goToStep2}
                disabled={selectedStaffEntries.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-95 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                Continue
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Configure & Assign */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-4">
              {selectedStaffEntries.map((entry) => {
                const staffObj = staffList.find(
                  (s) => String(s.id) === String(entry.staffId)
                );
                const isBulk =
                  staffObj &&
                  (staffObj.staff_type === "Agency" ||
                    staffObj.staff_type === "Contract");
                const isFixed =
                  staffObj && staffObj.staff_type === "Fixed";
                const entryTotal = isFixed
                  ? 0
                  : (parseFloat(entry.total_days) || 0) *
                    (parseFloat(entry.per_day_rate) || 0) *
                    (isBulk ? parseInt(entry.number_of_persons) || 1 : 1);

                return (
                  <div
                    key={entry.staffId}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    {/* Staff header */}
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {staffObj?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">
                          {staffObj?.name || "Unknown"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {staffObj?.staff_type} • {getRoleName(entry.roleId)}
                        </p>
                      </div>
                      {!isFixed && (
                        <div className="bg-[var(--color-primary-soft)] px-3 py-1.5 rounded-lg text-right">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">
                            Amount
                          </span>
                          <span className="text-sm font-black text-[var(--color-primary)]">
                            ₹{entryTotal.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {isFixed && (
                        <span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[11px] font-bold">
                          Fixed Staff
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveStaffEntry(entry.staffId)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        title="Remove"
                      >
                        <FiX size={16} />
                      </button>
                    </div>

                    {/* Config fields */}
                    <div className="px-5 py-3.5">
                      <div className={`grid gap-4 ${
                        isBulk ? "grid-cols-2 sm:grid-cols-4" : isFixed ? "grid-cols-2" : "grid-cols-3"
                      }`}>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <FiClock size={11} /> Days
                          </label>
                          <input
                            type="number"
                            value={entry.total_days}
                            onChange={(e) => onUpdateStaffEntry(entry.staffId, "total_days", e.target.value)}
                            min="0.5"
                            step="0.5"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none text-sm font-semibold"
                          />
                        </div>

                        {!isFixed && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <BiMoney size={11} /> Rate/Day
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                              <input
                                type="number"
                                value={entry.per_day_rate}
                                onChange={(e) => onUpdateStaffEntry(entry.staffId, "per_day_rate", e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none text-sm font-semibold"
                              />
                            </div>
                          </div>
                        )}

                        {isBulk && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <FiUsers size={11} /> Persons
                            </label>
                            <input
                              type="number"
                              value={entry.number_of_persons}
                              onChange={(e) => onUpdateStaffEntry(entry.staffId, "number_of_persons", e.target.value)}
                              min="1"
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none text-sm font-semibold"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <BiMoney size={11} /> Paid
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              value={entry.paid_amount}
                              onChange={(e) => onUpdateStaffEntry(entry.staffId, "paid_amount", e.target.value)}
                              min="0"
                              step="0.01"
                              className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none text-sm font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary bar */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Staff</span>
                  <span className="text-lg font-black text-gray-700">{selectedStaffEntries.length}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-500 uppercase block">Grand Total</span>
                  <span className="text-lg font-black text-purple-700">₹{grandTotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-green-500 uppercase block">Paid</span>
                  <span className="text-lg font-black text-green-700">
                    ₹{selectedStaffEntries.reduce((s, e) => s + (parseFloat(e.paid_amount) || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase block">Pending</span>
                  <span className="text-lg font-black text-red-600">
                    ₹{Math.max(0, grandTotal - selectedStaffEntries.reduce((s, e) => s + (parseFloat(e.paid_amount) || 0), 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={goToStep1}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <FiChevronLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                disabled={saving || selectedStaffEntries.length === 0}
                className="px-8 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-95 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Assign {selectedStaffEntries.length > 1
                      ? `${selectedStaffEntries.length} Staff`
                      : "Staff"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  // ─── Edit Mode: Original single-staff form ───────────────────────
  function renderSingleStaffForm() {
    const selectedStaffObj = staffList.find(
      (s) => s.id.toString() === formData.staff?.toString()
    );
    const isBulkStaff =
      selectedStaffObj &&
      (selectedStaffObj.staff_type === "Agency" || selectedStaffObj.staff_type === "Contract");
    const isFixedStaff =
      selectedStaffObj && selectedStaffObj.staff_type === "Fixed";

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 py-5 sm:px-8 sm:py-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <FiBriefcase className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Edit Event Assignment</h2>
                <p className="text-white/70 text-sm mt-1 font-medium">Modify existing staff assignment</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 text-right">
              <span className="text-white/70 text-xs font-bold uppercase tracking-wider block">Total Amount</span>
              <span className="text-white text-xl font-black">₹{formData.total_amount || "0.00"}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-1.5 h-5 bg-[var(--color-primary)] rounded-full"></span> Assignment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiClock className="text-[var(--color-primary)]" /> Session Name
                    </label>
                    <input type="text" value={formData.sessionName || "Assigned Session"} disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 focus:outline-none cursor-not-allowed" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span className="text-[var(--color-primary)] font-bold">@</span> Role for this Event <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select name="role_at_event" value={formData.role_at_event} onChange={handleRoleChange}
                        className="appearance-none w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none">
                        <option value="">-- Select a Role --</option>
                        {rolesList?.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiUser className="text-[var(--color-primary)]" /> Select Staff <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select name="staff" value={formData.staff} onChange={handleStaffChange} disabled={!formData.role_at_event}
                        className={`appearance-none w-full px-4 py-3 rounded-xl border ${errors.staff ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed`}>
                        <option value="">{formData.role_at_event ? "-- Choose a Staff Member --" : "-- Select a Role First --"}</option>
                        {filteredStaffList.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name} ({staff.role}) - ₹{staff.per_person_rate || staff.per_day_rate || 0}/day
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.staff && <p className="text-red-500 text-xs font-medium pl-1">{errors.staff}</p>}
                  </div>

                  {isBulkStaff && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FiUsers className="text-[var(--color-primary)]" /> Number of Persons <span className="text-red-500">*</span>
                      </label>
                      <input type="number" name="number_of_persons" value={formData.number_of_persons} onChange={handleChange}
                        min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-1.5 h-5 bg-[var(--color-primary)] rounded-full"></span> Work Duration & Payout
                </h3>
                <div className={`grid grid-cols-1 ${isFixedStaff ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <FiClock className="text-[var(--color-primary)]" /> Total Days <span className="text-red-500">*</span>
                    </label>
                    <input type="number" name="total_days" value={formData.total_days} onChange={handleChange}
                      placeholder="1.0" step="0.5" min="0.5"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.total_days ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none`} />
                    {errors.total_days && <p className="text-red-500 text-[10px] font-medium pl-1">{errors.total_days}</p>}
                  </div>

                  {!isFixedStaff && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <BiMoney className="text-[var(--color-primary)]" size={16} /> Per Day Rate <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                        <input type="number" name="per_day_rate" value={formData.per_day_rate} onChange={handleChange}
                          placeholder="500.00" step="0.01" min="0"
                          className={`w-full pl-7 pr-3 py-3 rounded-xl border ${errors.per_day_rate ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none`} />
                      </div>
                      {errors.per_day_rate && <p className="text-red-500 text-[10px] font-medium pl-1">{errors.per_day_rate}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <BiMoney className="text-[var(--color-primary)]" size={16} /> Amount Paid
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input type="number" name="paid_amount" value={formData.paid_amount} onChange={handleChange}
                        placeholder="0.00" step="0.01" min="0"
                        className={`w-full pl-7 pr-3 py-3 rounded-xl border ${errors.paid_amount ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none`} />
                    </div>
                    {errors.paid_amount && <p className="text-red-500 text-[10px] font-medium pl-1">{errors.paid_amount}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button type="button" onClick={handleCancel} disabled={saving}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-8 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-95 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2">
                {saving ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : ("Update Assignment")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddEditAssignmentComponent;
