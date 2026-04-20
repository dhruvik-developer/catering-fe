/* eslint-disable react/prop-types */
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiPlus,
  FiX,
  FiChevronDown,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiStar,
  FiGrid,
  FiSave,
  FiCalendar,
} from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../../Components/common/Loader";

function EditDishComponent({
  formData,
  errors,
  dishesList,
  isDishesLoading,
  loading,
  handleChange,
  handleAddressChange,
  handleAddSchedule,
  handleRemoveSchedule,
  handleScheduleDateChange,
  handleAddTimeSlot,
  handleRemoveTimeSlot,
  handleSlotChange,
  handleSlotDishesUpdate,
  handleSlotAddExtra,
  handleSlotRemoveExtra,
  handleSlotExtraChange,
  waiterTypes,
  isLoadingWaiterTypes,
  handleSlotAddWaiter,
  handleSlotRemoveWaiter,
  handleSlotWaiterChange,
  handleSubmit,
  isSessionMode,
}) {
  const timeOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "High Tea", label: "High Tea" },
    { value: "Late Night Nasto", label: "Late Night Snack" },
  ];
  const [activeDishModal, setActiveDishModal] = useState(null);
  const [tempDishes, setTempDishes] = useState([]);
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState([]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const categoriesList = [...dishesList].sort(
    (a, b) => (a.positions || 999) - (b.positions || 999)
  );

  const toggleCategoryCollapse = (id) => {
    setCollapsedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openDishModal = (dIdx, sIdx, currentDishes) => {
    setTempDishes(JSON.parse(JSON.stringify(currentDishes)));
    setActiveDishModal({ dIdx, sIdx });
  };

  const closeDishModal = () => {
    setActiveDishModal(null);
    setTempDishes([]);
  };

  const saveDishModal = () => {
    if (activeDishModal) {
      handleSlotDishesUpdate(
        activeDishModal.dIdx,
        activeDishModal.sIdx,
        tempDishes
      );
    }
    closeDishModal();
  };

  const handleTempDishToggle = (dish, categoryName = "Dishes") => {
    const existsIndex = tempDishes.findIndex((d) => d.dishId === dish.id);
    if (existsIndex >= 0) {
      setTempDishes((prev) => prev.filter((_, i) => i !== existsIndex));
    } else {
      setTempDishes((prev) => [
        ...prev,
        {
          dishId: dish.id,
          dishName: dish.name,
          categoryName,
          selectionRate: parseFloat(dish.selection_rate) || 0,
        },
      ]);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-20 flex justify-center">
        <Loader message="Loading Booking Details..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#845cbd] to-[#6a3faf] px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold tracking-wide">
            {isSessionMode ? "Edit Session Details" : "Edit Booking Details"}
          </h2>
          <p className="text-white/60 text-xs font-medium">
            {isSessionMode
              ? "Modify items and extras for this specific session"
              : "Modify schedules, dishes and extras"}
          </p>
        </div>
        <div className="bg-white/15 backdrop-blur-sm px-5 py-2 rounded-xl border border-white/20">
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mr-2">
            Grand Total
          </span>
          <span className="text-white text-xl font-black">
            ₹
            {Number(formData.grandTotalAmount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* ── Customer Info Section ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#845cbd] rounded-full"></span>
            Customer Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={errors.name || "Customer name"}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium focus:outline-none transition-all ${errors.name ? "border-red-300 bg-red-50/50 placeholder-red-400" : "border-gray-200 bg-gray-50/50 focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/15"}`}
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
                maxLength="10"
                placeholder={errors.mobile_no || "10-digit mobile"}
                onInput={(e) =>
                  (e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 10))
                }
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium focus:outline-none transition-all ${errors.mobile_no ? "border-red-300 bg-red-50/50 placeholder-red-400" : "border-gray-200 bg-gray-50/50 focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/15"}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                <FiCalendar className="inline mr-1 -mt-0.5" size={12} /> Order
                Date
              </label>
              <DatePicker
                selected={formData.date || new Date()}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Reference
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference || ""}
                onChange={handleChange}
                placeholder="Optional"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#845cbd]/15 transition-all ${errors.reference ? "border-red-300 bg-red-50/50 placeholder-red-400" : "border-gray-200 bg-gray-50/50 focus:border-[#845cbd]"}`}
              />
              {errors.reference && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.reference}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* ── Event Schedule Section ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-5 bg-[#845cbd] rounded-full"></span>
              {isSessionMode ? "Session Configuration" : "Event Schedule"}
            </h3>
            {!isSessionMode && (
              <button
                type="button"
                onClick={handleAddSchedule}
                className="text-xs font-bold text-[#845cbd] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-purple-200 cursor-pointer"
              >
                <FiPlus size={13} /> Add Date
              </button>
            )}
          </div>

          {errors.schedule && (
            <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 mb-3">
              {errors.schedule}
            </p>
          )}
          {errors.slots && (
            <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 mb-3">
              {errors.slots}
            </p>
          )}

          <div className="space-y-4">
            {formData.schedule.map((day, dIdx) => (
              <div
                key={dIdx}
                className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#f7f3fc] to-white border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-[#845cbd] text-white flex items-center justify-center font-black text-xs shadow">
                      D{dIdx + 1}
                    </span>
                    <DatePicker
                      placeholderText="Pick date"
                      minDate={tomorrow}
                      dateFormat="dd/MM/yyyy"
                      selected={day.event_date}
                      onChange={(date) => handleScheduleDateChange(dIdx, date)}
                      className="w-36 px-3 py-1.5 border border-purple-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#845cbd]/20 font-semibold text-gray-700 text-sm bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                      <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider block leading-none">
                        Day Total
                      </span>
                      <span className="text-base font-black text-green-700">
                        ₹
                        {Number(day.dayTotalAmount || 0).toLocaleString(
                          "en-IN",
                          { minimumFractionDigits: 2 }
                        )}
                      </span>
                    </div>
                    {!isSessionMode && formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSchedule(dIdx)}
                        className="p-2 text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        title="Remove Day"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="px-4 py-3 space-y-3">
                  {day.timeSlots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-gray-50/80 rounded-xl border border-gray-200 p-4 space-y-3"
                    >
                      {/* Row 1: Slot Config */}
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[140px]">
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            <FiClock className="inline mr-0.5" size={10} /> Time
                            Slot
                          </label>
                          <select
                            value={slot.timeLabel}
                            onChange={(e) =>
                              handleSlotChange(
                                dIdx,
                                sIdx,
                                "timeLabel",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-medium bg-white focus:outline-none focus:border-[#845cbd] transition-all cursor-pointer ${errors[`timeLabel_${dIdx}_${sIdx}`] ? "border-red-300" : "border-gray-200"}`}
                          >
                            <option value="">Select...</option>
                            {timeOptions.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          {errors[`timeLabel_${dIdx}_${sIdx}`] && (
                            <p className="text-red-500 text-[10px] mt-1 font-medium leading-tight">
                              {errors[`timeLabel_${dIdx}_${sIdx}`]}
                            </p>
                          )}
                        </div>
                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            <FiUsers className="inline mr-0.5" size={10} />{" "}
                            Persons
                          </label>
                          <input
                            type="text"
                            placeholder="0"
                            value={slot.estimatedPersons || ""}
                            onChange={(e) =>
                              handleSlotChange(
                                dIdx,
                                sIdx,
                                "estimatedPersons",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-medium bg-white focus:outline-none focus:border-[#845cbd] transition-all text-center ${errors[`persons_${dIdx}_${sIdx}`] ? "border-red-300" : "border-gray-200"}`}
                          />
                          {errors[`persons_${dIdx}_${sIdx}`] && (
                            <p className="text-red-500 text-[10px] mt-1 font-medium leading-tight">
                              {errors[`persons_${dIdx}_${sIdx}`]}
                            </p>
                          )}
                        </div>
                        <div className="w-32">
                          <label className="block text-[10px] font-bold text-[#845cbd] mb-1 uppercase tracking-wider">
                            <FiDollarSign className="inline mr-0.5" size={10} />{" "}
                            Per Plate ₹
                          </label>
                          <input
                            type="text"
                            placeholder="0"
                            value={slot.perPlatePrice || ""}
                            onChange={(e) =>
                              handleSlotChange(
                                dIdx,
                                sIdx,
                                "perPlatePrice",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg text-sm font-bold bg-purple-50/50 focus:outline-none focus:border-[#845cbd] transition-all text-center ${errors[`platePrice_${dIdx}_${sIdx}`] ? "border-red-500" : "border-purple-200"}`}
                          />
                          {errors[`platePrice_${dIdx}_${sIdx}`] && (
                            <p className="text-red-500 text-[10px] mt-1 font-medium leading-tight text-center">
                              {errors[`platePrice_${dIdx}_${sIdx}`]}
                            </p>
                          )}
                        </div>
                        <div className="flex items-end gap-2 ml-auto">
                          <div className="text-right py-1">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                              Subtotal
                            </span>
                            <span className="text-base font-black text-[#845cbd]">
                              ₹
                              {Number(slot.subtotalAmount || 0).toLocaleString(
                                "en-IN",
                                { minimumFractionDigits: 2 }
                              )}
                            </span>
                          </div>
                          {!isSessionMode && day.timeSlots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTimeSlot(dIdx, sIdx)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mb-1"
                              title="Remove Slot"
                            >
                              <FiX size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Venue / Address for Slot */}
                      <div className="relative">
                        <FiMapPin
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={12}
                        />
                        <input
                          type="text"
                          placeholder="Event venue / address"
                          value={slot.event_address || ""}
                          onChange={(e) =>
                            handleSlotChange(
                              dIdx,
                              sIdx,
                              "event_address",
                              e.target.value
                            )
                          }
                          className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm font-medium focus:outline-none transition-all bg-white focus:ring-2 ${errors[`event_address_${dIdx}_${sIdx}`] ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-[#845cbd] focus:ring-[#845cbd]/15"}`}
                        />
                        {errors[`event_address_${dIdx}_${sIdx}`] && (
                          <p className="text-red-500 text-[10px] mt-1 font-medium ml-1">
                            {errors[`event_address_${dIdx}_${sIdx}`]}
                          </p>
                        )}
                      </div>

                      {/* Row 2: Dishes + Extras side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Dishes */}
                        <div className="bg-white rounded-lg border border-gray-100 p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-[#845cbd] text-xs flex items-center gap-1">
                              <FiGrid size={12} /> Dishes ({slot.dishes.length})
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                openDishModal(dIdx, sIdx, slot.dishes)
                              }
                              className="text-[11px] font-bold text-white bg-[#845cbd] hover:bg-[#7350a8] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Select
                            </button>
                          </div>
                          {errors[`dishes_${dIdx}_${sIdx}`] && (
                            <p className="text-red-500 text-[11px] font-medium mb-1.5">
                              {errors[`dishes_${dIdx}_${sIdx}`]}
                            </p>
                          )}
                          {slot.dishes.length > 0 ? (
                            <>
                              <div className="flex flex-wrap gap-1">
                                {slot.dishes.map((dish) => {
                                  const isNewZeroPrice =
                                    (!dish.selectionRate ||
                                      parseFloat(dish.selectionRate) === 0) &&
                                    !dish.isOriginal;
                                  return (
                                    <span
                                      key={dish.dishId}
                                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md truncate max-w-[150px] ${isNewZeroPrice ? "text-red-600 bg-red-50 border border-red-200" : "text-[#845cbd] bg-[#f4effc] border border-purple-100"}`}
                                    >
                                      {dish.dishName}
                                    </span>
                                  );
                                })}
                              </div>
                              {slot.dishes.some(
                                (d) =>
                                  (!d.selectionRate ||
                                    parseFloat(d.selectionRate) === 0) &&
                                  !d.isOriginal
                              ) && (
                                <p className="mt-1.5 text-[10px] text-red-500 flex items-center gap-1">
                                  <span className="inline-block w-2.5 h-2.5 rounded bg-red-50 border border-red-200 flex-shrink-0"></span>
                                  Red highlighted items are not counted in dish
                                  price
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">
                              No dishes selected
                            </p>
                          )}
                        </div>

                        {/* Extras */}
                        <div className="bg-white rounded-lg border border-gray-100 p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-orange-600 text-xs flex items-center gap-1">
                              <FiStar size={12} /> Extras (
                              {slot.extraServices.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSlotAddExtra(dIdx, sIdx)}
                              className="text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                          {slot.extraServices.length > 0 ? (
                            <div className="space-y-1.5">
                              {slot.extraServices.map((extra, eIdx) => (
                                <div
                                  key={eIdx}
                                  className="flex items-center gap-1.5"
                                >
                                  <input
                                    type="text"
                                    placeholder="Service"
                                    value={extra.serviceName}
                                    onChange={(e) =>
                                      handleSlotExtraChange(
                                        dIdx,
                                        sIdx,
                                        eIdx,
                                        "serviceName",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-orange-300"
                                  />
                                  <input
                                    type="text"
                                    placeholder="₹"
                                    value={extra.price}
                                    onChange={(e) =>
                                      handleSlotExtraChange(
                                        dIdx,
                                        sIdx,
                                        eIdx,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    className="w-16 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-orange-300 text-center font-bold"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Qty"
                                    value={extra.quantity}
                                    onChange={(e) =>
                                      handleSlotExtraChange(
                                        dIdx,
                                        sIdx,
                                        eIdx,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    className="w-12 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-orange-300 text-center"
                                  />
                                  <span className="text-[11px] font-black text-gray-600 min-w-[40px] text-right">
                                    ₹
                                    {(Number(extra.price) || 0) *
                                      (Number(extra.quantity) || 1)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSlotRemoveExtra(dIdx, sIdx, eIdx)
                                    }
                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                  >
                                    <FiX size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">
                              No extras added
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Waiter Services */}
                      <div className="bg-white rounded-lg border border-gray-100 p-3 mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-indigo-600 text-xs flex items-center gap-1">
                            <FiUsers size={12} /> Waiter Service (
                            {slot.waiterServices?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSlotAddWaiter(dIdx, sIdx)}
                            className="text-[11px] font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            + Add Waiter
                          </button>
                        </div>
                        {slot.waiterServices?.length > 0 ? (
                          <div className="space-y-1.5">
                            {slot.waiterServices.map((ws, wIdx) => (
                              <div
                                key={wIdx}
                                className="flex flex-wrap md:flex-nowrap items-center gap-1.5"
                              >
                                <select
                                  value={ws.waiterType}
                                  onChange={(e) =>
                                    handleSlotWaiterChange(
                                      dIdx,
                                      sIdx,
                                      wIdx,
                                      "waiterType",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 min-w-[120px] text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-300"
                                >
                                  <option value="">Select type</option>
                                  {isLoadingWaiterTypes && (
                                    <option value="">Loading...</option>
                                  )}
                                  {!isLoadingWaiterTypes &&
                                    waiterTypes &&
                                    waiterTypes.map((type) => (
                                      <option key={type.id} value={type.name}>
                                        {type.name}
                                      </option>
                                    ))}
                                </select>
                                <div className="w-16 text-xs px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50 text-center font-bold text-gray-500">
                                  ₹{Number(ws.waiterRate || 0).toFixed(0)}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Count"
                                  value={ws.waiterCount}
                                  onChange={(e) =>
                                    handleSlotWaiterChange(
                                      dIdx,
                                      sIdx,
                                      wIdx,
                                      "waiterCount",
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-300 text-center"
                                />
                                <input
                                  type="text"
                                  placeholder="Notes (optional)"
                                  value={ws.waiterNotes}
                                  onChange={(e) =>
                                    handleSlotWaiterChange(
                                      dIdx,
                                      sIdx,
                                      wIdx,
                                      "waiterNotes",
                                      e.target.value
                                    )
                                  }
                                  className="flex-[2] min-w-[100px] text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-300"
                                />
                                <span className="text-[11px] font-black text-gray-600 min-w-[50px] text-right">
                                  ₹
                                  {(Number(ws.waiterRate) || 0) *
                                    (Number(ws.waiterCount) || 0)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSlotRemoveWaiter(dIdx, sIdx, wIdx)
                                  }
                                  className="text-red-400 hover:text-red-600 cursor-pointer pl-1"
                                >
                                  <FiX size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-400 italic">
                            No waiter services added
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {!isSessionMode && (
                    <button
                      type="button"
                      onClick={() => handleAddTimeSlot(dIdx)}
                      className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-400 font-medium hover:bg-gray-50 transition-colors flex justify-center items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <FiPlus size={13} /> Add Time Slot
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100"></div>

        {/* ── Notes & Submit Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Description / Notes
            </label>
            <textarea
              name="description"
              placeholder="Any special instructions for the event..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-gray-50/50 focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/15 min-h-[90px] transition-all resize-none"
              onChange={handleChange}
              value={formData.description}
            ></textarea>
          </div>
          <div className="flex flex-col justify-between gap-3">
            <label className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                name="rule"
                className="w-4 h-4 accent-[#845cbd] cursor-pointer"
                checked={formData.rule}
                onChange={(e) =>
                  handleChange({
                    target: { name: "rule", value: e.target.checked },
                  })
                }
              />
              <span className="font-medium text-gray-700 text-sm">
                Include Rules on PDF
              </span>
            </label>
            <button
              type="submit"
              className="w-full py-3.5 font-bold text-sm bg-gradient-to-r from-[#845cbd] to-[#6a3faf] hover:from-[#7350a8] hover:to-[#5c339e] text-white rounded-xl shadow-lg shadow-[#845cbd]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiSave size={16} />
              Review & Generate PDF
            </button>
          </div>
        </div>
      </form>

      {/* ── Dish Selection Modal ── */}
      {activeDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8f5fc] to-white">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Select Dishes
                </h3>
                <p className="text-xs text-gray-400">
                  Day {activeDishModal.dIdx + 1} —{" "}
                  {formData.schedule[activeDishModal.dIdx]?.timeSlots[
                    activeDishModal.sIdx
                  ]?.timeLabel || "Slot"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDishModal}
                className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {isDishesLoading ? (
                <div className="py-16 flex justify-center">
                  <Loader fullScreen={false} />
                </div>
              ) : (
                <div className="space-y-3">
                  {categoriesList.map((category) => {
                    const isCollapsed = collapsedCategoryIds.includes(
                      category.id
                    );
                    const items = category.items || [];
                    const selectedCount = items.filter((d) =>
                      tempDishes.some((td) => td.dishId === d.id)
                    ).length;

                    return (
                      <div
                        key={category.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between px-4 py-2.5 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                          onClick={() => toggleCategoryCollapse(category.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-[#845cbd] text-white flex items-center justify-center font-bold text-[11px]">
                              {category.positions || "—"}
                            </span>
                            <span className="font-semibold text-gray-700 text-sm">
                              {category.name}
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">
                              {items.length}
                            </span>
                            {selectedCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#845cbd]/10 text-[#845cbd]">
                                {selectedCount} ✓
                              </span>
                            )}
                          </div>
                          <FiChevronDown
                            className={`text-gray-400 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}
                            size={16}
                          />
                        </div>
                        {!isCollapsed && (
                          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white border-t border-gray-100">
                            {items.map((dish) => {
                              const selectedEntry = tempDishes.find(
                                (d) => d.dishId === dish.id
                              );
                              const isSelected = !!selectedEntry;
                              const isZeroPrice =
                                !dish.selection_rate ||
                                parseFloat(dish.selection_rate) === 0;
                              const isNewZeroPrice =
                                isZeroPrice && !selectedEntry?.isOriginal;
                              return (
                                <div
                                  key={dish.id}
                                  className={`px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                                    isSelected
                                      ? isNewZeroPrice
                                        ? "border-red-300 bg-red-50 font-semibold text-red-600"
                                        : "border-[#845cbd] bg-[#f4effc] font-semibold text-[#845cbd]"
                                      : isZeroPrice
                                        ? "border-red-200 bg-red-50/30 hover:border-red-300 text-red-500"
                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                  }`}
                                  onClick={() =>
                                    handleTempDishToggle(dish, category.name)
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      readOnly
                                      className={`w-3.5 h-3.5 pointer-events-none ${isNewZeroPrice && isSelected ? "accent-red-500" : "accent-[#845cbd]"}`}
                                    />
                                    <span className="truncate">
                                      {dish.name}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                <strong className="text-gray-800">{tempDishes.length}</strong>{" "}
                selected
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeDishModal}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDishModal}
                  className="px-5 py-2 rounded-lg font-bold text-sm text-white bg-[#845cbd] hover:bg-[#7350a8] cursor-pointer shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditDishComponent;
