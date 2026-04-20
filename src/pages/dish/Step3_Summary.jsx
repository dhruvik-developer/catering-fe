/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiPlus,
  FiX,
  FiUsers,
  FiMapPin,
  FiClock,
  FiClipboard,
  FiBookOpen,
  FiSend,
} from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

function Step3_Summary({
  formData,
  errors,
  waiterTypes,
  isLoadingWaiterTypes,
  handleChange,
  handleSlotChange,
  handleSlotAddExtra,
  handleSlotRemoveExtra,
  handleSlotExtraChange,
  handleSlotAddWaiter,
  handleSlotRemoveWaiter,
  handleSlotWaiterChange,
  handleSubmit,
  onBack,
}) {
  const [showRules, setShowRules] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Flatten schedule into event cards
  const eventCards = [];
  formData.schedule.forEach((day, dIdx) => {
    const dateObj = new Date(day.event_date);
    const pad = (n) => n.toString().padStart(2, "0");
    const dateStr = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;

    day.timeSlots.forEach((slot, sIdx) => {
      eventCards.push({
        dIdx,
        sIdx,
        dateStr,
        dayLabel: `Day ${dIdx + 1}`,
        timeLabel: slot.timeLabel || `Slot ${sIdx + 1}`,
        estimatedPersons: slot.estimatedPersons,
        perPlatePrice: slot.perPlatePrice,
        waiterServices: slot.waiterServices || [],
        dishes: slot.dishes || [],
        extraServices: slot.extraServices || [],
        subtotalAmount: slot.subtotalAmount || 0,
        event_address: slot.event_address || "",
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* ====== Page Header ====== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiClipboard className="text-[#845cbd]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Event Summary & Services
            </h2>
            <p className="text-sm text-gray-400">
              Review each event, set pricing, and add services
            </p>
          </div>
        </div>
        <div className="text-right bg-green-50 px-5 py-2.5 rounded-xl border border-green-200">
          <p className="text-[10px] text-green-700 uppercase font-bold tracking-wider mb-0.5">
            Grand Total
          </p>
          <p className="text-2xl font-black text-green-600">
            ₹{Number(formData.grandTotalAmount || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* ====== Client Info Summary Card ====== */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              Client
            </p>
            <p className="font-bold text-gray-800">{formData.name || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              Mobile
            </p>
            <p className="font-bold text-gray-800">
              {formData.mobile_no || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              Reference
            </p>
            <p className="font-bold text-gray-800">
              {formData.reference || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              Total Events
            </p>
            <p className="font-bold text-gray-800">{eventCards.length}</p>
          </div>
        </div>
      </div>

      {/* ====== Event Cards ====== */}
      <div className="space-y-5">
        {eventCards.map((event, cardIdx) => (
          <div
            key={`${event.dIdx}-${event.sIdx}`}
            className="border-2 border-purple-100 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Event Card Header */}
            <div className="bg-gradient-to-r from-[#845cbd] to-[#6a3faf] px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm backdrop-blur-sm">
                  {cardIdx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-base">{event.timeLabel}</h3>
                  <p className="text-white/70 text-xs">
                    {event.dateStr} • {event.dayLabel}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">
                  Subtotal
                </p>
                <p className="text-xl font-black">
                  ₹{Number(event.subtotalAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* ---- Info Row: Persons + Per Plate Price ---- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <FiUsers className="text-[#845cbd]" size={18} />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Persons
                    </p>
                    <p className="font-bold text-gray-800">
                      {event.estimatedPersons || 0}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                    Per Plate Price (₹)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 350"
                    value={event.perPlatePrice || ""}
                    onChange={(e) =>
                      handleSlotChange(
                        event.dIdx,
                        event.sIdx,
                        "perPlatePrice",
                        e.target.value
                      )
                    }
                    autoComplete="off"
                    className={`w-full p-2.5 border-2 rounded-lg bg-white focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/20 transition-all font-semibold text-lg ${
                      errors[`platePrice_${event.dIdx}_${event.sIdx}`]
                        ? "border-red-500"
                        : "border-purple-200"
                    }`}
                  />
                  {errors[`platePrice_${event.dIdx}_${event.sIdx}`] && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {errors[`platePrice_${event.dIdx}_${event.sIdx}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                    <FiMapPin className="inline mr-1" size={12} /> Venue
                  </label>
                  <input
                    type="text"
                    placeholder="Event venue / address"
                    value={event.event_address}
                    onChange={(e) =>
                      handleSlotChange(
                        event.dIdx,
                        event.sIdx,
                        "event_address",
                        e.target.value
                      )
                    }
                    autoComplete="off"
                    className={`w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:border-[#845cbd] transition-all ${
                      errors[`event_address_${event.dIdx}_${event.sIdx}`]
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#845cbd]/20"
                    }`}
                  />
                  {errors[`event_address_${event.dIdx}_${event.sIdx}`] && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {errors[`event_address_${event.dIdx}_${event.sIdx}`]}
                    </p>
                  )}
                </div>
              </div>

              {/* ---- Selected Dishes List ---- */}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-blue-800 text-sm flex items-center gap-2">
                    <FiFileText size={15} /> Selected Dishes
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {event.dishes.length}
                    </span>
                  </h5>
                </div>

                {event.dishes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {event.dishes.map((dish) => {
                        const isZeroPrice =
                          !dish.selectionRate ||
                          parseFloat(dish.selectionRate) === 0;
                        return (
                          <div
                            key={dish.dishId}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                              isZeroPrice
                                ? "bg-red-50 border border-red-200"
                                : "bg-white border border-gray-100"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                isZeroPrice
                                  ? "bg-red-100 text-red-500"
                                  : "bg-[#845cbd]/10 text-[#845cbd]"
                              }`}
                            >
                              <FiFileText size={10} />
                            </div>
                            <span
                              className={`truncate font-medium ${isZeroPrice ? "text-red-600" : "text-gray-700"}`}
                            >
                              {dish.dishName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {event.dishes.some(
                      (d) =>
                        !d.selectionRate || parseFloat(d.selectionRate) === 0
                    ) && (
                      <p className="mt-2.5 text-xs text-red-500 flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded bg-red-50 border border-red-200 flex-shrink-0"></span>
                        Red highlighted items are not counted in dish price
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No dishes selected for this event.
                  </p>
                )}
              </div>

              {/* ---- Waiter Services Section ---- */}
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-indigo-800 text-sm flex items-center gap-2">
                    <FiUsers size={15} /> Waiter Service
                    {event.waiterServices.length > 0 && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                        {event.waiterServices.length}
                      </span>
                    )}
                  </h5>
                  <button
                    type="button"
                    onClick={() => handleSlotAddWaiter(event.dIdx, event.sIdx)}
                    className="text-xs font-bold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FiPlus size={12} /> Add Waiter
                  </button>
                </div>

                {event.waiterServices.length > 0 ? (
                  <div className="space-y-2">
                    {event.waiterServices.map((ws, wIdx) => {
                      const entryTotal =
                        (Number(ws.waiterRate) || 0) *
                        (Number(ws.waiterCount) || 0);
                      return (
                        <div
                          key={wIdx}
                          className="bg-white rounded-lg border border-indigo-100 p-3 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            {/* Type dropdown */}
                            <select
                              value={ws.waiterType}
                              onChange={(e) =>
                                handleSlotWaiterChange(
                                  event.dIdx,
                                  event.sIdx,
                                  wIdx,
                                  "waiterType",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                            >
                              <option value="">Select waiter type</option>
                              {isLoadingWaiterTypes && (
                                <option value="">Loading...</option>
                              )}
                              {!isLoadingWaiterTypes &&
                                waiterTypes &&
                                waiterTypes.length > 0
                                ? waiterTypes.map((type) => (
                                    <option key={type.id} value={type.name}>
                                      {type.name}
                                    </option>
                                  ))
                                : null}
                            </select>

                            {/* Rate display (auto-filled) */}
                            <div className="w-36 p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-center">
                              ₹<span className="font-bold ml-0.5">{(Number(ws.waiterRate) || 0).toFixed(2)}</span>/head
                            </div>

                            {/* Count */}
                            <input
                              type="text"
                              value={ws.waiterCount}
                              onChange={(e) =>
                                handleSlotWaiterChange(
                                  event.dIdx,
                                  event.sIdx,
                                  wIdx,
                                  "waiterCount",
                                  e.target.value
                                )
                              }
                              placeholder="Count"
                              autoComplete="off"
                              className="w-20 p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                            />

                            {/* Row total */}
                            <span className="text-sm font-bold text-indigo-700 min-w-[70px] text-right">
                              ₹{entryTotal.toFixed(2)}
                            </span>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                handleSlotRemoveWaiter(
                                  event.dIdx,
                                  event.sIdx,
                                  wIdx
                                )
                              }
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiX size={14} />
                            </button>
                          </div>

                          {/* Notes */}
                          <input
                            type="text"
                            value={ws.waiterNotes}
                            onChange={(e) =>
                              handleSlotWaiterChange(
                                event.dIdx,
                                event.sIdx,
                                wIdx,
                                "waiterNotes",
                                e.target.value
                              )
                            }
                            placeholder="Notes (optional)"
                            autoComplete="off"
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                          />
                        </div>
                      );
                    })}

                    {/* Grand total if multiple entries */}
                    {event.waiterServices.length > 1 && (
                      <div className="flex justify-end pt-1">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-lg">
                          Total Waiter Charge: ₹{
                            event.waiterServices
                              .reduce(
                                (sum, ws) =>
                                  sum +
                                  (Number(ws.waiterRate) || 0) *
                                    (Number(ws.waiterCount) || 0),
                                0
                              )
                              .toFixed(2)
                          }
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No waiter services added.
                  </p>
                )}
              </div>

              {/* ---- Extra Services Section ---- */}
              <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-orange-800 text-sm flex items-center gap-2">
                    <FiPlus size={15} /> Extra Services
                    {event.extraServices.length > 0 && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                        {event.extraServices.length}
                      </span>
                    )}
                  </h5>
                  <button
                    type="button"
                    onClick={() => handleSlotAddExtra(event.dIdx, event.sIdx)}
                    className="text-xs font-bold text-orange-600 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FiPlus size={12} /> Add Service
                  </button>
                </div>

                {event.extraServices.length > 0 ? (
                  <div className="space-y-2">
                    {event.extraServices.map((extra, eIdx) => (
                      <div
                        key={eIdx}
                        className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-100"
                      >
                        <input
                          type="text"
                          placeholder="Service name"
                          value={extra.serviceName}
                          onChange={(e) =>
                            handleSlotExtraChange(
                              event.dIdx,
                              event.sIdx,
                              eIdx,
                              "serviceName",
                              e.target.value
                            )
                          }
                          autoComplete="off"
                          className="flex-1 text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                        <input
                          type="text"
                          placeholder="₹ Price"
                          value={extra.price}
                          onChange={(e) =>
                            handleSlotExtraChange(
                              event.dIdx,
                              event.sIdx,
                              eIdx,
                              "price",
                              e.target.value
                            )
                          }
                          autoComplete="off"
                          className="w-24 text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-center transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Qty"
                          value={extra.quantity}
                          onChange={(e) =>
                            handleSlotExtraChange(
                              event.dIdx,
                              event.sIdx,
                              eIdx,
                              "quantity",
                              e.target.value
                            )
                          }
                          autoComplete="off"
                          className="w-16 text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-center transition-all"
                        />
                        <span className="text-sm font-bold text-gray-600 min-w-[60px] text-right">
                          ₹
                          {(
                            (Number(extra.price) || 0) *
                            (Number(extra.quantity) || 1)
                          ).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleSlotRemoveExtra(event.dIdx, event.sIdx, eIdx)
                          }
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No extra services added.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ====== Description + Rule Checkbox ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            General Description
          </label>
          <textarea
            name="description"
            placeholder="Notes for the entire event..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] min-h-[100px] transition-all"
            onChange={handleChange}
            value={formData.description}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              name="rule"
              className="w-5 h-5 accent-[#845cbd] cursor-pointer"
              checked={formData.rule}
              onChange={(e) =>
                handleChange({
                  target: { name: "rule", value: e.target.checked },
                })
              }
            />
            <label
              className="font-medium text-gray-700 cursor-pointer select-none"
              onClick={() =>
                handleChange({
                  target: { name: "rule", value: !formData.rule },
                })
              }
            >
              Display Rules on PDF
            </label>
          </div>
        </div>
      </div>

      {/* ====== Bottom: Rules + Suggestions + Navigation ====== */}
      <div className="border-t border-gray-100 pt-5">
        {/* Rules & Suggestions Buttons */}
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setShowRules(!showRules);
              setShowSuggestions(false);
            }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all border ${
              showRules
                ? "bg-[#845cbd] text-white border-[#845cbd] shadow-lg shadow-[#845cbd]/20"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <FiBookOpen size={15} /> View Rules
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSuggestions(!showSuggestions);
              setShowRules(false);
            }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all border ${
              showSuggestions
                ? "bg-[#845cbd] text-white border-[#845cbd] shadow-lg shadow-[#845cbd]/20"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <FiFileText size={15} /> View Suggestions
          </button>
        </div>

        {/* Rules Panel */}
        {showRules && (
          <div className="mb-5 p-5 bg-amber-50 rounded-xl border border-amber-200 animate-in slide-in-from-top-2 duration-300">
            <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-2">
              <FiBookOpen size={15} /> Terms & Rules
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-500 font-bold">1.</span>
                <span>The party must arrange the cooking area on time.</span>
              </li>
              <li className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-500 font-bold">2.</span>
                <span>
                  The party must confirm the menu and dish count 10 days before
                  the event.
                </span>
              </li>
              <li className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-500 font-bold">3.</span>
                <span>
                  The party must arrange water supply for utensils and waste
                  disposal.
                </span>
              </li>
              <li className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-500 font-bold">4.</span>
                <span>
                  The party must arrange tables for counters and other pandal
                  service equipment.
                </span>
              </li>
              <li className="text-sm text-amber-800 flex gap-2">
                <span className="text-amber-500 font-bold">5.</span>
                <span>
                  The party must pay 30% advance payment after placing the
                  order.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Suggestions Panel */}
        {showSuggestions && (
          <div className="mb-5 p-5 bg-sky-50 rounded-xl border border-sky-200 animate-in slide-in-from-top-2 duration-300">
            <h4 className="font-bold text-sky-900 text-sm mb-3 flex items-center gap-2">
              <FiFileText size={15} /> Suggestions
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-sky-800 flex gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span>
                  Consider adding a welcome drinks section for events with 200+
                  guests.
                </span>
              </li>
              <li className="text-sm text-sky-800 flex gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span>
                  Multi-day events benefit from varied menus to avoid
                  repetition.
                </span>
              </li>
              <li className="text-sm text-sky-800 flex gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span>
                  Ensure dessert selection aligns with the number of main course
                  dishes.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <FiArrowLeft size={16} /> Back to Menu
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-10 py-3.5 font-bold text-lg text-white bg-gradient-to-r from-[#845cbd] to-[#6a3faf] hover:from-[#7350a8] hover:to-[#5e33a0] rounded-xl shadow-xl shadow-[#845cbd]/30 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <FiSend size={18} /> Review & Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step3_Summary;
