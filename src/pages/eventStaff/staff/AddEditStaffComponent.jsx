/* eslint-disable react/prop-types */
import { FiCheckCircle, FiPhone, FiUser, FiUsers } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import Loader from "../../../Components/common/Loader";
import RoleDropdown from "../../../Components/eventStaff/RoleDropdown";
import AddRoleModal from "../../../Components/eventStaff/AddRoleModal";

function AddEditStaffComponent({
  mode,
  formData,
  loading,
  saving,
  errors,
  rolesList,
  waiterTypes,
  waiterTypesLoading,
  showWaiterType,
  addNewRoleOptionValue,
  isAddRoleModalOpen,
  roleModalForm,
  roleModalErrors,
  isAddingRole,
  hasExistingLogin,
  handleAddRoleSubmit,
  handleRoleModalChange,
  handleCloseAddRoleModal,
  handleChange,
  handleStaffTypeChange,
  handleStatusToggle,
  handleSubmit,
  handleCancel,
}) {
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader message="Loading Staff Details..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#845cbd] to-[#6a3faf] px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <FiUsers className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {mode === "add" ? "Add New Staff" : "Edit Staff Member"}
              </h2>
              <p className="text-white/70 text-sm mt-1 font-medium">
                {mode === "add"
                  ? "Register a new event staff member"
                  : "Update existing staff details"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Account Status
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Control whether this staff member is active
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.is_active}
                  onChange={handleStatusToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
              </label>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <span className="w-1.5 h-5 bg-[#845cbd] rounded-full" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiUser className="text-[#845cbd]" /> Full Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                  />
                  {errors.name ? (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FiPhone className="text-[#845cbd]" /> Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., 9876543210"
                    maxLength="10"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                  />
                  {errors.phone ? (
                    <p className="text-red-500 text-xs font-medium pl-1">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="text-[#845cbd] font-bold">@</span> Role{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <RoleDropdown
                    value={formData.role}
                    onChange={handleChange}
                    rolesList={rolesList}
                    error={errors.role}
                    addNewValue={addNewRoleOptionValue}
                  />
                </div>

                {showWaiterType ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Waiter Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="waiter_type_id"
                        value={formData.waiter_type_id || ""}
                        onChange={handleChange}
                        disabled={waiterTypesLoading}
                        className={`appearance-none w-full px-4 py-3 rounded-xl border ${errors.waiter_type_id ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                      >
                        <option value="">Select waiter type</option>
                        {waiterTypes.map((wt) => (
                          <option key={wt.id} value={wt.id}>
                            {wt.name}{" "}
                            {wt.per_person_rate
                              ? `- INR ${Number(wt.per_person_rate).toFixed(2)} / head`
                              : ""}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.waiter_type_id ? (
                      <p className="text-red-500 text-xs font-medium pl-1">
                        {errors.waiter_type_id}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <span className="w-1.5 h-5 bg-[#845cbd] rounded-full" />
                Login Access
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      Linked Login
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Optional login account for this staff member
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="login_enabled"
                      className="sr-only peer"
                      checked={Boolean(formData.login_enabled)}
                      onChange={handleChange}
                      disabled={hasExistingLogin}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#845cbd]" />
                  </label>
                </div>

                {hasExistingLogin ? (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Existing linked login mila hai. Current backend se login
                    disable nahi hota, sirf update hota hai.
                  </p>
                ) : null}

                {formData.login_enabled ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Login Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="login_username"
                        value={formData.login_username}
                        onChange={handleChange}
                        placeholder="e.g., ramesh_staff"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.login_username ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                      />
                      {errors.login_username ? (
                        <p className="text-red-500 text-xs font-medium pl-1">
                          {errors.login_username}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Login Password
                        {!hasExistingLogin ? (
                          <span className="text-red-500">*</span>
                        ) : null}
                      </label>
                      <input
                        type="password"
                        name="login_password"
                        value={formData.login_password}
                        onChange={handleChange}
                        placeholder={
                          hasExistingLogin
                            ? "Leave blank to keep current password"
                            : "Minimum 4 characters"
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${errors.login_password ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                      />
                      {errors.login_password ? (
                        <p className="text-red-500 text-xs font-medium pl-1">
                          {errors.login_password}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Login Email
                      </label>
                      <input
                        type="email"
                        name="login_email"
                        value={formData.login_email}
                        onChange={handleChange}
                        placeholder="e.g., ramesh@example.com"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.login_email ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                      />
                      {errors.login_email ? (
                        <p className="text-red-500 text-xs font-medium pl-1">
                          {errors.login_email}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 pl-1">Optional</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                <span className="w-1.5 h-5 bg-[#845cbd] rounded-full" />
                Employment & Financials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Fixed", "Agency", "Contract"].map((type) => (
                      <label
                        key={type}
                        className={`flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.staff_type === type
                            ? "border-[#845cbd] bg-[#845cbd]/5 text-[#845cbd]"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="staff_type"
                          value={type}
                          checked={formData.staff_type === type}
                          onChange={handleStaffTypeChange}
                          className="sr-only"
                        />
                        {formData.staff_type === type ? <FiCheckCircle /> : null}
                        <span className="font-bold">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.staff_type === "Fixed" ? (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <BiMoney className="text-[#845cbd]" size={18} /> Fixed
                        Salary (Monthly) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                          INR
                        </span>
                        <input
                          type="number"
                          name="fixed_salary"
                          value={formData.fixed_salary}
                          onChange={handleChange}
                          placeholder="15000.00"
                          step="0.01"
                          min="0"
                          className={`w-full pl-14 pr-4 py-3 rounded-xl border ${errors.fixed_salary ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                        />
                      </div>
                      {errors.fixed_salary ? (
                        <p className="text-red-500 text-xs font-medium pl-1">
                          {errors.fixed_salary}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Joining Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="joining_date"
                        value={formData.joining_date || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.joining_date ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                      />
                      {errors.joining_date ? (
                        <p className="text-red-500 text-xs font-medium pl-1">
                          {errors.joining_date}
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : null}

                {formData.staff_type === "Agency" ||
                formData.staff_type === "Contract" ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <BiMoney className="text-[#845cbd]" size={18} /> Paid Per
                      Person (Rate) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                        INR
                      </span>
                      <input
                        type="number"
                        name="per_person_rate"
                        value={formData.per_person_rate}
                        onChange={handleChange}
                        placeholder="500.00"
                        step="0.01"
                        min="0"
                        className={`w-full pl-14 pr-4 py-3 rounded-xl border ${errors.per_person_rate ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] transition-all outline-none`}
                      />
                    </div>
                    {errors.per_person_rate ? (
                      <p className="text-red-500 text-xs font-medium pl-1">
                        {errors.per_person_rate}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-[#845cbd] text-white font-bold hover:bg-[#7350a8] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : mode === "add" ? (
                "Save Staff"
              ) : (
                "Update Staff"
              )}
            </button>
          </div>
        </form>
      </div>

      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        formData={roleModalForm}
        errors={roleModalErrors}
        isSaving={isAddingRole}
        onChange={handleRoleModalChange}
        onClose={handleCloseAddRoleModal}
        onSubmit={handleAddRoleSubmit}
      />
    </div>
  );
}

export default AddEditStaffComponent;
