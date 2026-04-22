/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTag } from "react-icons/fi";
import Input from "../common/formInputs/Input";
import Dropdown from "../common/formDropDown/DropDown";
import toast from "react-hot-toast";
import { useCreateIngredientItemMutation } from "../../hooks/useVendorMutations";
import { useIngredientCategories } from "../../hooks/useIngredientCategories";

// ==================== MODAL WRAPPER ====================
const ModalWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==================== ADD INGREDIENT ITEM MODAL ====================
export const AddIngredientItemModal = ({ isOpen, onClose, onSuccess, initialCategory }) => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const createIngredientItemMutation = useCreateIngredientItemMutation();
  const { data: categories = [] } = useIngredientCategories(
    {},
    { enabled: isOpen }
  );

  useEffect(() => {
    if (isOpen) {
      setItemName("");
      setCategory(initialCategory || "");
    }
  }, [initialCategory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!category) {
      toast.error("Please select an ingredient category");
      return;
    }

    const formattedName = itemName
      .trim()
      .split(" ")
      .map((word) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
      )
      .join(" ");

    const isDuplicate = categories.some(
      (cat) =>
        cat.items &&
        cat.items.some(
          (item) =>
            item.name && item.name.toLowerCase() === formattedName.toLowerCase()
        )
    );

    if (isDuplicate) {
      toast.error("Ingredient item name already exists");
      return;
    }

    setSaving(true);
    const response = await createIngredientItemMutation.mutateAsync({
      itemName: formattedName,
      category,
    });
    setSaving(false);
    if (response) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[540px] flex flex-col overflow-visible">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary-soft)] to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)] shadow-sm">
              <FiTag className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Add Ingredient Item
              </h2>
              <p className="text-sm font-medium text-gray-400 mt-0.5">
                Add a new ingredient item to a category
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-visible"
        >
          <div>
            <Input
              label="Item Name *"
              type="text"
              placeholder="Please Enter Item Name"
              name="name"
              value={itemName}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Category *
            </label>
            <Dropdown
              options={categories}
              selectedValue={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select a category"
              isSearchable={true}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[var(--color-primary)] rounded-xl hover:brightness-95 transition-all cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};
