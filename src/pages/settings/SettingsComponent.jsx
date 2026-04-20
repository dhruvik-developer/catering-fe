/* eslint-disable react/prop-types */
import {
  FiEdit3,
  FiSave,
  FiX,
  FiPhone,
  FiMapPin,
  FiShield,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";

function SettingsComponent({
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  isEditing,
  handleEdit,
  handleCancel,
}) {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ====== Page Header ====== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f4effc]">
              <FiUser className="text-[#845cbd]" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Business Profile
              </h2>
              <p className="text-sm text-gray-400">
                Manage your business information and settings
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2.5 font-semibold text-[#845cbd] bg-[#f4effc] hover:bg-[#e8ddf5] rounded-xl transition-all duration-200 border border-[#845cbd]/20 cursor-pointer"
            >
              <FiEdit3 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 font-semibold text-gray-600 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-300 cursor-pointer"
              >
                <FiX size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-[#845cbd] to-[#6a3faf] hover:from-[#7350a8] hover:to-[#5e33a0] rounded-xl shadow-lg shadow-[#845cbd]/20 transition-all duration-200 cursor-pointer ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FiSave size={16} />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </div>

        {/* ====== Profile Card ====== */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Editing Mode Banner */}
            {isEditing && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
                <FiEdit3 className="text-amber-600" size={14} />
                <span className="text-sm font-medium text-amber-700">
                  You are editing your business profile
                </span>
              </div>
            )}

            {/* ---- Business Details Section ---- */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-[#845cbd]"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Business Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cater's Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiUser size={12} className="text-[#845cbd]" />
                    Business Name
                    <span className="text-red-400">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="caters_name"
                      value={formData.caters_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Shreeji Catering Services"
                      required
                      autoComplete="off"
                      className="w-full p-3 border-2 border-purple-200 rounded-xl bg-white focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium min-h-[48px] flex items-center">
                      {formData.caters_name || (
                        <span className="text-gray-300 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* FSSAI Number */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiShield size={12} className="text-[#845cbd]" />
                    FSSAI Number
                    <span className="text-red-400">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fssai_number"
                      value={formData.fssai_number}
                      onChange={handleInputChange}
                      placeholder="e.g. 10021021000123"
                      required
                      autoComplete="off"
                      className="w-full p-3 border-2 border-purple-200 rounded-xl bg-white focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium min-h-[48px] flex items-center">
                      {formData.fssai_number || (
                        <span className="text-gray-300 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-100"></div>

            {/* ---- Contact Information Section ---- */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-emerald-500"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiPhone size={12} className="text-emerald-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Primary contact number"
                      autoComplete="off"
                      className="w-full p-3 border-2 border-purple-200 rounded-xl bg-white focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium min-h-[48px] flex items-center">
                      {formData.phone_number || (
                        <span className="text-gray-300 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiMessageCircle size={12} className="text-emerald-500" />
                    WhatsApp Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleInputChange}
                      placeholder="WhatsApp contact number"
                      autoComplete="off"
                      className="w-full p-3 border-2 border-purple-200 rounded-xl bg-white focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium min-h-[48px] flex items-center">
                      {formData.whatsapp_number || (
                        <span className="text-gray-300 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-100"></div>

            {/* ---- Address Section ---- */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Address
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <FiMapPin size={12} className="text-amber-500" />
                  Godown / Office Address
                  <span className="text-red-400">*</span>
                </label>
                {isEditing ? (
                  <textarea
                    name="godown_address"
                    value={formData.godown_address}
                    onChange={handleInputChange}
                    placeholder="Enter full address for your Godown/Office. This will be used in Share options."
                    required
                    rows={3}
                    autoComplete="off"
                    className="w-full p-3 border-2 border-purple-200 rounded-xl bg-white focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/20 transition-all text-gray-800 font-medium resize-none"
                  />
                ) : (
                  <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium min-h-[80px] flex items-start">
                    {formData.godown_address || (
                      <span className="text-gray-300 italic">Not set</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsComponent;
