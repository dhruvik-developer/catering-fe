/* eslint-disable react/prop-types */
import DatePicker from "react-datepicker";
import Input from "../../Components/common/formInputs/Input";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "../../Components/common/PageHero";
import { FiTruck, FiArrowLeft } from "react-icons/fi";

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
    <div className="space-y-4">
      <PageHero
        icon={<FiTruck size={24} />}
        eyebrow="Outsourced supply"
        title="Share Outsourced Items"
        subtitle="Send the consolidated outsourced item list to your vendors."
        actions={
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 hover:bg-white/25 px-4 py-2 text-white font-semibold transition-all cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft size={14} />
            Back
          </button>
        }
      />
      <div className="p-6 bg-white rounded-xl shadow-lg">

      {/* Address Section */}
      <div className="mb-6">
        {vendorGroups?.map((vg, i) => (
          <p key={i} className="pb-1 text-lg font-bold text-center">
            * {vg.vendor_name} *
          </p>
        ))}

        <p className="pb-1 font-bold">Delivery Address</p>
        <div
          className={`flex items-center justify-between mb-4 p-2 border rounded-md ${selectedAddress === "event" ? "border-[var(--color-primary)]" : "border-gray-300"}`}
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
          className={`flex items-center justify-between p-2 border rounded-md ${selectedAddress === "office" ? "border-[var(--color-primary)]" : "border-gray-300"}`}
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
            className="p-2 bg-[var(--color-primary)] text-white font-medium rounded-md cursor-pointer"
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
              <div className={`p-2 border rounded-md ${selectedAddress === "custom" ? "border-[var(--color-primary)]" : "border-gray-300"}`}>
                <label className="block font-medium">New Address</label>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter new address"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] mt-1"
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
          placeholderText="Select Date" selected={selectedDate}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => setSelectedDate(date)}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Delivery Time */}
      <div className="mb-4">
        <Input
          label="Delivery Time"
          labelClass="pb-1 font-bold"
          type="text"
          placeholder="Please Enter Delivery Time"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
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
                    isChecked ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)]" : "border-gray-300"
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
                      className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer ml-3 flex-shrink-0"
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
          className="p-2 bg-[var(--color-primary)] text-white font-medium rounded-md cursor-pointer"
          onClick={handleSubmit}
        >
          Generate Share PDF
        </button>
      </div>
      </div>
    </div>
  );
}

export default ShareOutsourcedComponent;
