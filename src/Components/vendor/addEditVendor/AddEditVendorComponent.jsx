/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { FiArrowLeft, FiPlus, FiTruck } from "react-icons/fi";
import Loader from "../../common/Loader";
import Input from "../../common/formInputs/Input";

function AddEditVendorComponent({
  navigate,
  mode,
  loading,
  form,
  errors,
  vendorCategories,
  availableCategories,
  hasExistingLogin,
  onInputChange,
  onSubmit,
  handleCategoryChange,
  handleRemoveCategory,
  handleAddCategoryRow,
}) {
  const isEdit = mode === "edit";

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader message="Loading vendor details..." />
      </div>
    );
  }

  const selectedCategoryIds = vendorCategories
    .filter((entry) => entry.category)
    .map((entry) => Number(entry.category));

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <button
        type="button"
        className="px-4 py-2 mb-4 font-medium bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm text-gray-600"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[#f4effc]">
          <FiTruck className="text-[#845cbd]" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Vendor" : "Add Vendor"}
          </h2>
          <p className="text-sm text-gray-400">
            {isEdit ? "Update vendor details" : "Register a new vendor"}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <Input
            label="Vendor Name *"
            type="text"
            placeholder="Enter vendor name"
            name="name"
            value={form.name}
            className={`w-full p-2.5 border ${errors.name ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all`}
            onChange={onInputChange}
          />
          {errors.name ? (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <Input
            label="Mobile Number"
            type="text"
            placeholder="Enter mobile number"
            name="mobile_no"
            value={form.mobile_no}
            className={`w-full p-2.5 border ${errors.mobile_no ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all`}
            onChange={onInputChange}
          />
          {errors.mobile_no ? (
            <p className="text-xs text-red-500 mt-1">{errors.mobile_no}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-black-700 font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onInputChange}
            placeholder="Enter vendor address"
            rows={3}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all resize-none mt-1"
          />
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Vendor Login</h3>
              <p className="text-xs text-gray-500 mt-1">
                Optional linked user account for vendor login.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="login_enabled"
                checked={Boolean(form.login_enabled)}
                onChange={onInputChange}
                disabled={hasExistingLogin}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#845cbd]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#845cbd]" />
              <span className="ml-2 text-sm text-gray-600">
                {form.login_enabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>

          {hasExistingLogin ? (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Existing linked login mila hai. Current backend se login disable
              nahi hota, sirf update hota hai.
            </p>
          ) : null}

          {form.login_enabled ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Login Username *"
                  type="text"
                  placeholder="Enter login username"
                  name="login_username"
                  value={form.login_username}
                  className={`w-full p-2.5 border ${errors.login_username ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all`}
                  onChange={onInputChange}
                />
                {errors.login_username ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.login_username}
                  </p>
                ) : null}
              </div>

              <div>
                <Input
                  label={`Login Password${hasExistingLogin ? "" : " *"}`}
                  type="password"
                  placeholder={
                    hasExistingLogin
                      ? "Leave blank to keep current password"
                      : "Minimum 4 characters"
                  }
                  name="login_password"
                  value={form.login_password}
                  className={`w-full p-2.5 border ${errors.login_password ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all`}
                  onChange={onInputChange}
                />
                {errors.login_password ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.login_password}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Login Email"
                  type="email"
                  placeholder="vendor@example.com"
                  name="login_email"
                  value={form.login_email}
                  className={`w-full p-2.5 border ${errors.login_email ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all`}
                  onChange={onInputChange}
                />
                {errors.login_email ? (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.login_email}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <label className="block text-black-700 font-medium">
            Active Status
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={onInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#845cbd]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#845cbd]" />
            <span className="ml-2 text-sm text-gray-600">
              {form.is_active ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-700">Vendor Categories</h3>
              <span className="text-xs text-gray-400">
                (Send nested `category` objects as required by backend)
              </span>
            </div>
            {vendorCategories.length === 0 ? (
              <button
                type="button"
                onClick={handleAddCategoryRow}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#845cbd] bg-[#f4effc] rounded-lg hover:bg-[#e8ddf5] transition-colors cursor-pointer"
              >
                <FiPlus size={14} /> Add Category
              </button>
            ) : null}
          </div>

          <AnimatePresence>
            {vendorCategories.map((entry, index) => {
              const isLastEmptyRow =
                index === vendorCategories.length - 1 && !entry.category;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <select
                    value={entry.category}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all bg-white"
                  >
                    <option value="">Select Category</option>
                    {availableCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        disabled={
                          selectedCategoryIds.includes(category.id) &&
                          Number(entry.category) !== category.id
                        }
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!isLastEmptyRow ? (
                    <button
                      type="button"
                      className="p-2.5 bg-red-400 text-white rounded-lg cursor-pointer hover:bg-red-500 transition-colors"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <FaTimes size={16} />
                    </button>
                  ) : (
                    <div className="w-[42px]" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center pt-3">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white font-semibold rounded-lg cursor-pointer shadow-md shadow-[#845cbd]/20 transition-all active:scale-[0.98]"
          >
            {isEdit ? "Update Vendor" : "Save Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditVendorComponent;
