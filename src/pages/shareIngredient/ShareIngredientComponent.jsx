/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import DatePicker from "react-datepicker";
import Input from "../../Components/common/formInputs/Input";
import { motion, AnimatePresence } from "framer-motion";

function ShareIngredientComponent({
  mode,
  eventAddress,
  ingredients,
  navigate,
  selectedAddress,
  handleAddressChange,
  selectedDate,
  setSelectedDate,
  deliveryTime,
  setDeliveryTime,
  vendorName,
  setVendorName,
  selectedVendor,
  setSelectedVendor,
  vendors = [],
  checkedItems,
  handleCheckboxChange,
  handleSubmit,
  customAddress,
  setCustomAddress,
  isCustomAddress,
  showCustomAddressInput,
  setShowCustomAddressInput,
  itemSources = {},
  handleSourceChange,
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
        <h2 className="text-2xl font-semibold">
          {mode === "assign" ? "Assign Vendor" : "Share Ingredient"}
        </h2>
      </div>

      {/* Address, Date, Time (Only in Share Mode) */}
      {mode === "share" && (
        <>
          {/* Adress Section */}
          <div className="mb-6">
            {ingredients?.map((category, i) => (
              <p key={i} className="pb-1 text-lg font-bold text-center">
                * {category.categoryName} *
              </p>
            ))}

            <p className="pb-1 font-bold">Delivery Address</p>
            <div
              className={`flex items-center justify-between mb-4 p-2 border rounded-md ${selectedAddress === "event" ? "border-[var(--color-primary)]" : "border-gray-300"}`}
            >
              <div className="event-address-div">
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
              className={`flex items-center justify-between p-2 border rounded-md ${selectedAddress === "office" ? "border-[var(--color-primary)]" : "border-gray-300"} `}
            >
              <div className="office-address-div">
                <p className="font-bold">Godown / Office Address</p>
                <p>
                  {businessProfile?.godown_address ||
                    "C1 1201 Pragati IT Park ,Near AR Mall Mota Varaccha, Surat"}
                </p>
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
                onClick={() =>
                  setShowCustomAddressInput(!showCustomAddressInput)
                }
              >
                {showCustomAddressInput ? "Cancel" : "Add Address"}
              </button>
            </div>

            {/* Animate Input Section */}
            <AnimatePresence>
              {showCustomAddressInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className={` p-2 border rounded-md ${selectedAddress === "custom" ? "border-[var(--color-primary)]" : "border-gray-300"}`}
                  >
                    <label className="block text-black-700 font-medium">
                      New Address
                    </label>
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

          {/* Delivery Date Section */}
          <div className="mb-4">
            <p className="pb-1 font-bold">Delivery Date</p>
            <DatePicker
              placeholderText="Event Date" selected={selectedDate}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setSelectedDate(date)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Delivery Time Section */}
          <div className="mb-4">
            <Input
              label="Delivery Time"
              labelClass="pb-1 font-bold"
              type="text"
              placeholder={"Please Enter Delivery Time"}
              className={`w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]`}
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Vendor Name Section (Only in Assign Mode) */}
      {mode === "assign" && (
        <div className="mb-4">
          <p className="pb-2 font-bold">Vendor Name</p>

          {vendors && vendors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 max-h-56 overflow-y-auto pr-1">
                {vendors.map((vendor, idx) => {
                  const name =
                    vendor.name ||
                    vendor.vendor_name ||
                    vendor.company_name ||
                    `Vendor ${idx + 1}`;
                  const mobile =
                    vendor.mobile || vendor.mobile_no || vendor.phone || "";
                  const address = vendor.address || vendor.city || "";
                  const isSelected = selectedVendor?.id
                    ? selectedVendor.id === vendor.id
                    : vendorName === name;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedVendor(vendor)}
                      className={`cursor-pointer p-3 border-2 rounded-lg transition-all ${
                        isSelected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)] shadow-md"
                          : "border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-tint)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {name}
                          </p>
                          {mobile && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              📞 {mobile}
                            </p>
                          )}
                          {address && (
                            <p className="text-sm text-gray-500 mt-0.5 truncate">
                              📍 {address}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Manual override */}
              <Input
                label="Or type vendor name manually"
                labelClass="text-sm text-gray-500 pb-1"
                type="text"
                placeholder="Type vendor name..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </>
          ) : (
            <Input
              label=""
              labelClass=""
              type="text"
              placeholder="Please Enter Vendor Name"
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          )}
        </div>
      )}

      {/* Item Data Section */}
      <div className="mt-2">
        {ingredients?.map((category, index) => (
          <div key={index}>
            <p className="pb-1 text-lg font-bold">Item Data</p>
            {category.items.map((item, i) => {
              const isFromGodown = item.godownQuantity > 0;
              const isChecked = checkedItems[`${index}-${i}`] || false;
              const itemKey = `${index}-${i}`;
              const source =
                itemSources[itemKey] || (isFromGodown ? "godown" : "vendor");
              const isGodownSource = source === "godown";

              // In assign mode, godown items can be routed to godown or vendor
              const showSourceToggle = mode === "assign" && isFromGodown;

              return (
                <div
                  key={i}
                  className={`p-3 border rounded-md mb-3 transition-all ${
                    isGodownSource && isFromGodown
                      ? "border-green-200 bg-[var(--color-primary-tint)]"
                      : isChecked
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)]"
                        : "border-gray-300"
                  }`}
                >
                  {/* Source Toggle for godown items */}
                  {showSourceToggle && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Source:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSourceChange(itemKey, "godown")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                          isGodownSource
                            ? "bg-[var(--color-primary-tint)] text-white border-green-500"
                            : "bg-white text-gray-500 border-gray-300 hover:border-green-400 hover:text-[var(--color-primary)]"
                        }`}
                      >
                        🏭 Godown
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSourceChange(itemKey, "vendor")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                          !isGodownSource
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : "bg-white text-gray-500 border-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        🛒 Vendor
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">* {item.itemName}</p>
                        {isFromGodown && isGodownSource && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary-text)] bg-[var(--color-primary-soft)] border border-green-300 px-2 py-0.5 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            From Godown
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Total: {item.totalQuantity}
                      </p>
                      {(() => {
                        const numericTotal = parseFloat(item.totalQuantity) || 0;
                        const godownQty = isGodownSource ? (item.godownQuantity || 0) : 0;
                        const isVendorAssigned = item.vendor && item.vendor.id !== "godown";
                        const remainingVal = isVendorAssigned ? 0 : Math.max(0, numericTotal - godownQty);
                        const vendorCoverage = isVendorAssigned ? Math.max(0, numericTotal - godownQty) : 0;
                        const unitMatch = String(item.totalQuantity).match(/[\d.]+\s*([a-zA-Z]+)/);
                        const unit = unitMatch ? unitMatch[1] : item.quantityType || "";
                        return (
                          <div className="mt-1 space-y-1">
                            {/* Source breakdown */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {godownQty > 0 && (
                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                                  godownQty >= numericTotal
                                    ? "text-[var(--color-primary-text)] bg-[var(--color-primary-tint)] border-green-200"
                                    : "text-[var(--color-primary-text)] bg-[var(--color-primary-tint)] border-[var(--color-primary-border)]"
                                }`}>
                                  🏭 Godown: {godownQty} {unit}
                                  {godownQty < numericTotal && <span className="text-[9px]">(partial)</span>}
                                </span>
                              )}
                              {isVendorAssigned && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-tint)] border border-[var(--color-primary-border)]/50 px-2 py-0.5 rounded-full">
                                  🛒 Vendor: {vendorCoverage} {unit}
                                </span>
                              )}
                            </div>
                            {/* Remaining */}
                            <p className={`text-sm font-semibold ${remainingVal === 0 ? "text-[var(--color-primary)]" : "text-[var(--color-primary)]"}`}>
                              {remainingVal === 0 ? "✅" : "⚠️"} Remaining: {remainingVal} {unit}
                            </p>
                          </div>
                        );
                      })()}
                      {item.vendor && (
                        <p
                          className={`text-xs mt-0.5 font-bold ${item.vendor.id === "godown" ? "text-[var(--color-primary)]" : "text-[var(--color-primary)]"}`}
                        >
                          {item.vendor.id === "godown"
                            ? "🏭 From Godown"
                            : `★ Assigned to: ${item.vendor.name}`}
                        </p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer ml-3 flex-shrink-0"
                      checked={isChecked}
                      onChange={() =>
                        handleCheckboxChange(
                          index,
                          i,
                          item.itemName,
                          category.categoryName
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Button Section */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="p-2 bg-[var(--color-primary)] text-white font-medium rounded-md cursor-pointer"
          onClick={handleSubmit}
        >
          {mode === "assign" ? "Assign Vendor" : "Generate Share PDF"}
        </button>
      </div>
    </div>
  );
}

export default ShareIngredientComponent;
