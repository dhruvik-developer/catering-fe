/* eslint-disable react/prop-types */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../../Components/common/formInputs/Input";
import {
  FiUser,
  FiPlus,
  FiClock,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

function Step1_ClientEvent({
  formData,
  errors,
  handleChange,
  handleAddSchedule,
  handleRemoveSchedule,
  handleScheduleDateChange,
  handleAddTimeSlot,
  handleRemoveTimeSlot,
  handleSlotChange,
  onNext,
}) {
  const timeOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "High Tea", label: "High Tea" },
    { value: "Late Night Nasto", label: "Late Night Snack" },
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="space-y-8">
      {/* ====== Section 1: Client Information ====== */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiUser className="text-[var(--color-primary)]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Client Information
            </h2>
            <p className="text-sm text-gray-400">
              Enter basic details of the client
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Client Name *"
            type="text"
            placeholder={errors.name ? errors.name : "Enter client name"}
            name="name"
            value={formData.name}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all ${errors.name ? "border-red-500 placeholder-red-500" : "border-gray-300"}`}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Mobile Number *"
            type="text"
            placeholder={errors.mobile_no ? errors.mobile_no : "Mobile Number"}
            name="mobile_no"
            maxLength="10"
            value={formData.mobile_no}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all ${errors.mobile_no ? "border-red-500 placeholder-red-500" : "border-gray-300"}`}
            onChange={handleChange}
          />
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Order Date
            </label>
            <DatePicker
              selected={formData.date}
              dateFormat="dd/MM/yyyy"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 bg-gray-50 focus:border-[var(--color-primary)] transition-all"
              disabled
            />
          </div>
          <Input
            label="Reference Name (Optional)"
            type="text"
            placeholder="Reference Name"
            name="reference"
            value={formData.reference}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all ${errors.reference ? "border-red-500 placeholder-red-500" : "border-gray-300"}`}
            onChange={handleChange}
            error={errors.reference}
          />
        </div>
      </div>

      {/* ====== Divider ====== */}
      <div className="border-t border-gray-100" />

      {/* ====== Section 2: Event Dates & Time Slots ====== */}
      <div>
        <div className="flex items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50">
              <FiCalendar className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Event Schedule
              </h2>
              <p className="text-sm text-gray-400">
                Add event dates and time slots for each day
              </p>
            </div>
          </div>
        </div>

        {errors.schedule && (
          <p className="text-red-500 text-sm mb-3 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
            {errors.schedule}
          </p>
        )}
        {errors.slots && (
          <p className="text-red-500 text-sm mb-3 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
            {errors.slots}
          </p>
        )}

        <div className="space-y-5">
          {formData.schedule.map((day, dIdx) => (
            <div
              key={dIdx}
              className="p-5 border-2 border-purple-100 rounded-xl bg-gradient-to-br from-gray-50/80 to-purple-50/30 shadow-sm relative"
            >
              {/* Day Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {dIdx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">Event Date:</span>
                    <DatePicker
                      placeholderText="Choose Date"
                      minDate={tomorrow}
                      dateFormat="dd/MM/yyyy"
                      selected={day.event_date}
                      onChange={(date) => handleScheduleDateChange(dIdx, date)}
                      className="w-36 p-2 border border-purple-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 font-semibold text-gray-700 bg-white"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {formData.schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(dIdx)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                      title="Delete Day"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                {day.timeSlots.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 bg-gradient-to-r from-[var(--color-primary-tint)] to-white border-2 border-[var(--color-primary)]/20 rounded-xl shadow-md relative overflow-hidden"
                  >
                    {/* Highlighted left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-l-xl" />

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pl-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                          <FiClock size={15} className="text-[var(--color-primary)]" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                          Slot {sIdx + 1}
                        </span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                            Event Timing
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
                            className={`w-full p-2.5 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 font-medium transition-all ${errors[`timeLabel_${dIdx}_${sIdx}`] ? "border-red-500" : "border-[var(--color-primary)]/25 focus:border-[var(--color-primary)]"}`}
                          >
                            <option value="">Select Timing...</option>
                            {timeOptions.map((t) => {
                              const count = day.timeSlots.reduce(
                                (acc, currentSlot, currIdx) =>
                                  currIdx !== sIdx &&
                                  currentSlot.timeLabel === t.value
                                    ? acc + 1
                                    : acc,
                                0
                              );
                              const isDisabled = count >= 3;
                              return (
                                <option
                                  key={t.value}
                                  value={t.value}
                                  disabled={isDisabled}
                                  className={isDisabled ? "text-gray-300 bg-gray-50" : ""}
                                >
                                  {t.label} {isDisabled && "(Max 3 limit reached)"}
                                </option>
                              );
                            })}
                          </select>
                          {errors[`timeLabel_${dIdx}_${sIdx}`] && (
                            <p className="text-red-500 text-[10px] mt-1 font-medium">
                              {errors[`timeLabel_${dIdx}_${sIdx}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
                            Number of Persons
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 250"
                            value={slot.estimatedPersons || ""}
                            onChange={(e) =>
                              handleSlotChange(
                                dIdx,
                                sIdx,
                                "estimatedPersons",
                                e.target.value
                              )
                            }
                            className={`w-full p-2.5 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 font-medium transition-all ${errors[`persons_${dIdx}_${sIdx}`] ? "border-red-500" : "border-[var(--color-primary)]/25 focus:border-[var(--color-primary)]"}`}
                          />
                          {errors[`persons_${dIdx}_${sIdx}`] && (
                            <p className="text-red-500 text-[10px] mt-1 font-medium">
                              {errors[`persons_${dIdx}_${sIdx}`]}
                            </p>
                          )}
                        </div>
                      </div>

                      {day.timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(dIdx, sIdx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                          title="Remove this time slot"
                        >
                          <AiOutlineDelete size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddTimeSlot(dIdx)}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all flex justify-center items-center gap-2 text-sm"
                >
                  <FiPlus size={14} /> Add Time Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== Bottom: Add Event Date + Next Button ====== */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleAddSchedule}
          className="px-5 py-2.5 font-semibold text-[var(--color-primary)] bg-purple-50 hover:bg-purple-100 rounded-xl flex items-center gap-2 transition-colors border border-purple-200 text-sm"
        >
          <FiPlus size={16} /> Add Event Date
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 font-bold text-white bg-[var(--color-primary)] hover:brightness-95 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98] flex items-center gap-2 text-base"
        >
          Continue to Menu Selection <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Step1_ClientEvent;
