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
  FiImage,
  FiDroplet,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_COLOR_CODE = "#845CBD";

const normalizeHexColor = (value) => {
  if (typeof value !== "string") return DEFAULT_COLOR_CODE;

  const trimmed = value.trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(trimmed)) return trimmed;
  if (/^[0-9A-F]{6}$/.test(trimmed)) return `#${trimmed}`;

  return DEFAULT_COLOR_CODE;
};

function SettingsComponent({
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  isEditing,
  handleEdit,
  handleCancel,
  extractedColors,
  canModifyProfile,
}) {
  const normalizedColorCode = normalizeHexColor(formData.color_code);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-gray-50 via-[var(--color-primary-soft)]/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ====== Page Header ====== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
              <FiUser className="text-[var(--color-primary-text)]" size={22} />
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

          {!isEditing && canModifyProfile ? (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2.5 font-semibold text-[var(--color-primary)] bg-[var(--color-primary-soft)] hover:brightness-95 rounded-xl transition-all duration-200 border border-[var(--color-primary)]/20 cursor-pointer"
            >
              <FiEdit3 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 font-semibold text-gray-600 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-300 cursor-pointer"
              >
                <FiX size={16} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:brightness-95 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 transition-all duration-200 cursor-pointer ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FiSave size={16} />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* ====== Profile Card ====== */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Editing Mode Banner */}
            {isEditing && (
              <div className="bg-gradient-to-r from-[var(--color-primary-tint)] to-[var(--color-primary-tint)] border-b border-[var(--color-primary-border)] px-6 py-3 flex items-center gap-2">
                <FiEdit3 className="text-[var(--color-primary-text)]" size={14} />
                <span className="text-sm font-medium text-[var(--color-primary-text)]">
                  You are editing your business profile
                </span>
              </div>
            )}

            {/* ---- Business Details Section ---- */}
            <div className="p-6 space-y-6 bg-[var(--color-primary-soft)]/10">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <FiImage size={12} className="text-[var(--color-primary-text)]" />
                  Business Logo
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Business logo preview"
                        className="h-16 w-auto max-w-[200px] rounded-lg border border-gray-200 object-contain bg-white p-1 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-32 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                        No logo
                      </div>
                    )}
                    <input
                      type="file"
                      name="logoFile"
                      accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                      onChange={handleInputChange}
                      className="w-full p-2.5 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] text-sm text-gray-700 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-[var(--color-primary-soft)] file:text-[var(--color-primary)] file:font-medium"
                    />
                  </div>
                ) : (
                  <div className="w-full p-3 bg-[var(--color-primary-soft)]/30 rounded-xl border border-[var(--color-primary-soft)]/50 min-h-[80px] flex items-center">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Business logo"
                        className="h-14 w-auto max-w-[200px] rounded-lg border border-gray-200 object-contain bg-white p-1 shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-300 italic">Not set</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-[var(--color-primary)]"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Business Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cater's Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiUser size={12} className="text-[var(--color-primary-text)]" />
                    Business Name
                    <span className="text-red-400">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="caters_name"
                      value={formData.caters_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Shreeji Catering Services" required
                      autoComplete="off"
                      className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-[var(--color-primary-soft)]/30 rounded-xl border border-[var(--color-primary-soft)]/50 text-gray-800 font-medium min-h-[48px] flex items-center">
                      {formData.caters_name || (
                        <span className="text-gray-300 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* FSSAI Number */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiShield size={12} className="text-[var(--color-primary-text)]" />
                    FSSAI Number
                    <span className="text-red-400">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fssai_number"
                      value={formData.fssai_number}
                      onChange={handleInputChange}
                      placeholder="e.g. 10021021000123" required
                      autoComplete="off"
                      className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-[var(--color-primary-soft)]/30 rounded-xl border border-[var(--color-primary-soft)]/50 text-gray-800 font-medium min-h-[48px] flex items-center">
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

            {/* ---- Brand Identity Section ---- */}
            <div className="p-6 space-y-6 bg-[var(--color-primary-soft)]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-[var(--color-primary)]"></div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Brand Identity
                  </h3>
                </div>
                {isEditing && (
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Logo Color Analysis
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Brand Color Code */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiDroplet size={12} className="text-[var(--color-primary)]" />
                    Brand Color Code
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="color_code"
                      value={isEditing ? formData.color_code || "" : normalizedColorCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="#000000"
                      className={`w-full p-3 border-2 ${
                        isEditing
                          ? "border-[var(--color-primary-border)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 cursor-text"
                          : "border-transparent bg-[var(--color-primary-soft)]/30 cursor-default"
                      } rounded-xl bg-white transition-all text-gray-800 font-mono font-bold tracking-widest`}
                    />
                    {isEditing && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <input
                          type="color"
                          name="color_code"
                          value={normalizedColorCode}
                          onChange={handleInputChange}
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-sm cursor-pointer overflow-hidden p-0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Color Preview */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiDroplet size={12} className="text-[var(--color-primary)]" />
                    Brand Color Preview
                  </label>
                  <motion.div
                    initial={false}
                    animate={{ backgroundColor: normalizedColorCode }}
                    className="h-[52px] w-full rounded-xl shadow-inner-lg relative overflow-hidden group border border-gray-100"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </motion.div>
                </div>

                {/* Quick Theme Colors (Extracted) */}
                {isEditing && (
                  <div className="space-y-4">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Quick Theme Colors
                    </label>
                    
                    {extractedColors && extractedColors.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        <AnimatePresence mode="popLayout">
                          {extractedColors.map((color, idx) => (
                            <motion.button
                              key={`${color}-${idx}`}
                              type="button"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleInputChange({
                                  target: { name: "color_code", value: color },
                                })
                              }
                              title={color}
                              className={`h-11 w-full rounded-xl border-4 ${
                                normalizedColorCode.toLowerCase() ===
                                normalizeHexColor(color).toLowerCase()
                                  ? "border-[var(--color-primary-tint)] shadow-md scale-110"
                                  : "border-white shadow-sm"
                              } transition-transform cursor-pointer`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="h-24 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 text-gray-400">
                        <FiImage size={24} className="mb-2 opacity-20" />
                        <p className="text-[10px] font-medium uppercase tracking-widest opacity-60 text-center px-4">
                          {formData.logo ? "Analysing logo colors..." : "Upload logo to see theme colors"}
                        </p>
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 italic">
                      Tip: Click a color to select it.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-100"></div>

            {/* ---- Contact Information Section ---- */}
            <div className="p-6 space-y-6 bg-[var(--color-primary-soft)]/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-[var(--color-primary)]"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiPhone size={12} className="text-[var(--color-primary)]" />
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
                      className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-[var(--color-primary-soft)]/30 rounded-xl border border-[var(--color-primary-soft)]/50 text-gray-800 font-medium min-h-[48px] flex items-center">
                      {formData.phone_number || (
                        <span className="text-gray-300 italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <FiMessageCircle size={12} className="text-[var(--color-primary)]" />
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
                      className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-gray-800 font-medium"
                    />
                  ) : (
                    <div className="w-full p-3 bg-[var(--color-primary-soft)]/30 rounded-xl border border-[var(--color-primary-soft)]/50 text-gray-800 font-medium min-h-[48px] flex items-center">
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
            <div className="p-6 space-y-6 bg-[var(--color-primary-soft)]/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full bg-[var(--color-primary)]"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Address
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <FiMapPin size={12} className="text-[var(--color-primary)]" />
                  Godown / Office Address
                  <span className="text-red-400">*</span>
                </label>
                {isEditing ? (
                  <textarea
                    name="godown_address"
                    value={formData.godown_address}
                    onChange={handleInputChange}
                    placeholder="Enter full address for your Godown/Office. This will be used in Share options." required
                    rows={3}
                    autoComplete="off"
                    className="w-full p-3 border-2 border-[var(--color-primary-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-gray-800 font-medium resize-none"
                  />
                ) : (
                  <div className="w-full p-3 bg-[var(--color-primary-soft)]/30 rounded-xl border border-[var(--color-primary-soft)]/50 text-gray-800 font-medium min-h-[80px] flex items-start">
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
