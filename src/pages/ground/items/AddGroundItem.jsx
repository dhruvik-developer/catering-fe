import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { createGroundItem, updateGroundItem } from "../../../api/GroundApis";
import { logError } from "../../../utils/logger";
import Portal from "../../../Components/common/Portal";

// eslint-disable-next-line react/prop-types
const AddGroundItem = ({ isOpen, onClose, onSuccess, categories = [], editData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    description: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Sync form data when editData or isOpen changes
  useEffect(() => {
    if (!isOpen) return;
    if (editData) {
      setFormData({
        name: editData.name || "",
        category: String(editData.category || ""),
        unit: editData.unit || "",
        description: editData.description || "",
        is_active: editData.is_active !== undefined ? editData.is_active : true,
      });
      setCurrentEditId(editData.id);
    } else {
      setFormData({ name: "", category: "", unit: "", description: "", is_active: true });
      setCurrentEditId(null);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditMode = !!currentEditId;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category || !formData.unit.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        category: Number(formData.category)
      };
      let res;
      if (isEditMode) {
        res = await updateGroundItem(currentEditId, payload);
      } else {
        res = await createGroundItem(payload);
      }
      if (res?.data?.status) {
        toast.success(isEditMode ? "Item updated successfully" : "Item created successfully");
        setFormData({ name: "", category: "", unit: "", description: "", is_active: true });
        setCurrentEditId(null);
        onSuccess();
      } else {
        toast.error(res?.data?.message || `Failed to ${isEditMode ? "update" : "create"} item`);
      }
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative slide-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">
            {isEditMode ? "Edit Ground Item" : "Add Ground Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Gas Cylinder"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all" required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all bg-white" required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. Nos, Kg, Set"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all" required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="item_is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <label
                htmlFor="item_is_active"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Active
              </label>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-[var(--color-primary)] border border-transparent rounded-lg hover:brightness-95 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Saving..." : isEditMode ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
};

export default AddGroundItem;
