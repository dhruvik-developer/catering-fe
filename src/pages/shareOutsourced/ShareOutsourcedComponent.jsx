/* eslint-disable react/prop-types */
import DatePicker from "react-datepicker";
import Input from "../../Components/common/formInputs/Input";
import { motion, AnimatePresence } from "framer-motion";

function ShareOutsourcedComponent({
  eventAddress,
  vendorGroups,
  navigate,
  selectedAddress,
  handleAddressChange,
  selectedDate,
  setSelectedDate,
  deliveryTime,
  setDeliveryTime,
  checkedItems,
  handleCheckboxChange,
  handleSubmit,
  customAddress,
  setCustomAddress,
  showCustomAddressInput,
  setShowCustomAddressInput,
  businessProfile,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="header-button-div">
        <button
          type="button"
          className="px-4 py-2 mb-[10px] font-medium bg-gray-300 border border-gray-300 rounded-md cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Share Outsourced Items</h2>
      </div>

      {/* Address Section */}
      <div className="mb-6">
        {vendorGroups?.map((vg, i) => (
          <p key={i} className="pb-1 text-lg font-bold text-center">
            * {vg.vendor_name} *
          </p>
        ))}

        <p className="pb-1 font-bold">Delivery Address</p>
        <div
          className={`flex items-center justify-between mb-4 p-2 border rounded-md ${selectedAddress === "event" ? "border-[#845cbd]" : "border-gray-300"}`}
        >
          <div>
            <p className="font-bold">Event Address</p>
            <p>{eventAddress}</p>
          </div>
          <input
            type="checkbox"
            name="address"
            className="w-4 h-4"
            checked={selectedAddress === "event"}
            onChange={() => handleAddressChange("event")}
          />
        </div>

        <div
          className={`flex items-center justify-between p-2 border rounded-md ${selectedAddress === "office" ? "border-[#845cbd]" : "border-gray-300"}`}
        >
          <div>
            <p className="font-bold">Godown / Office Address</p>
            <p>{businessProfile?.godown_address || "C1 1201 Pragati IT Park ,Near AR Mall Mota Varaccha, Surat"}</p>
          </div>
          <input
            type="checkbox"
            name="address"
            className="w-4 h-4"
            checked={selectedAddress === "office"}
            onChange={() => handleAddressChange("office")}
          />
        </div>

        <div className="my-2 flex items-center justify-end">
          <button
            className="p-2 bg-[#845CBD] text-white font-medium rounded-md cursor-pointer"
            onClick={() => setShowCustomAddressInput(!showCustomAddressInput)}
          >
            {showCustomAddressInput ? "Cancel" : "Add Address"}
          </button>
        </div>

        <AnimatePresence>
          {showCustomAddressInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`p-2 border rounded-md ${selectedAddress === "custom" ? "border-[#845cbd]" : "border-gray-300"}`}>
                <label className="block font-medium">New Address</label>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter new address"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd] mt-1"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                    />
                  </div>
                  <input
                    type="checkbox"
                    name="address"
                    className="w-4 h-4"
                    checked={selectedAddress === "custom"}
                    onChange={() => handleAddressChange("custom")}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delivery Date */}
      <div className="mb-4">
        <p className="pb-1 font-bold">Delivery Date</p>
        <DatePicker
          placeholderText="Select Date"
          selected={selectedDate}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => setSelectedDate(date)}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
        />
      </div>

      {/* Delivery Time */}
      <div className="mb-4">
        <Input
          label="Delivery Time"
          labelClass="pb-1 font-bold"
          type="text"
          placeholder="Please Enter Delivery Time"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />
      </div>

      {/* Outsourced Items grouped by Vendor */}
      <div className="mt-2">
        {vendorGroups?.map((vg, vIdx) => (
          <div key={vIdx} className="mb-4">
            <p className="pb-1 text-lg font-bold">
              🏢 Vendor: {vg.vendor_name || "Unassigned"}
            </p>
            {vg.items.map((item, iIdx) => {
              const key = `${vIdx}-${iIdx}`;
              const isChecked = checkedItems[key] || false;
              return (
                <div
                  key={iIdx}
                  className={`p-3 border rounded-md mb-3 transition-all ${
                    isChecked ? "border-[#845cbd] bg-purple-50" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">* {item.item_name}</p>
                      {(item.quantity || item.unit) && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          Qty: {item.quantity || "—"} {item.unit || ""}
                        </p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#845CBD] cursor-pointer ml-3 flex-shrink-0"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(vIdx, iIdx, item.item_name, vg.vendor_name)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="p-2 bg-[#845CBD] text-white font-medium rounded-md cursor-pointer"
          onClick={handleSubmit}
        >
          Generate Share PDF
        </button>
      </div>
    </div>
  );
}

export default ShareOutsourcedComponent;
