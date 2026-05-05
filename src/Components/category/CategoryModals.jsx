/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logError } from "../../utils/logger";
import {
  FiX,
  FiFolder,
  FiTag,
  FiDollarSign,
  FiUsers,
  FiBox,
  FiBookOpen,
} from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import Input from "../common/formInputs/Input";
import Dropdown from "../common/formDropDown/DropDown";
import toast from "react-hot-toast";
import {
  useCreateCategoryMutation,
  useCreateMenuItemMutation,
} from "../../hooks/useCategoryMutations";
import { useCreateRecipeMutation } from "../../hooks/useRecipeMutations";
import { useCategories } from "../../hooks/useCategories";

import { useIngredientItems } from "../../hooks/useIngredientItems";

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

// ==================== ADD CATEGORY MODAL ====================
export const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const createCategoryMutation = useCreateCategoryMutation();
  const { data: categories = [] } = useCategories({}, { enabled: isOpen });

  useEffect(() => {
    if (isOpen) {
      setCategoryName("");
      setParentId(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const formattedName = categoryName
      .trim()
      .split(" ")
      .map((word) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
      )
      .join(" ");

    setSaving(true);
    const response = await createCategoryMutation.mutateAsync({
      categoryName: formattedName,
      parentId,
    });
    setSaving(false);
    if (response) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[480px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary-soft)] to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)] shadow-sm">
              <FiFolder className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Create Category
              </h2>
              <p className="text-sm font-medium text-gray-400 mt-0.5">
                Add a new category to organize items
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <Input
              label="Category Name *"
              type="text"
              placeholder="Please Enter Category Name"
              name="name"
              value={categoryName}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="relative z-20">
            <label className="block font-medium text-gray-700 mb-2">
              Parent Category (Optional)
            </label>
            <Dropdown
              options={categories} selectedValue={parentId}
              onChange={(value) => setParentId(value)}
              placeholder="Select a parent category"
              isSearchable={true}
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty for top-level category
            </p>
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
              {saving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

// ==================== ADD ITEM MODAL ====================
export const AddItemModal = ({ isOpen, onClose, onSuccess, initialCategory }) => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [baseCost, setBaseCost] = useState("");
  const [selectionRate, setSelectionRate] = useState("");
  const [saving, setSaving] = useState(false);
  const createItemMutation = useCreateMenuItemMutation();
  const { data: topCategories = [] } = useCategories({}, { enabled: isOpen });

  // Flatten categories and subcategories for the dropdown
  const categories = topCategories.reduce((acc, cat) => {
    acc.push(cat);
    if (cat.subcategories && cat.subcategories.length > 0) {
      cat.subcategories.forEach(sub => {
        acc.push({ ...sub, name: `${cat.name} > ${sub.name}` });
      });
    }
    return acc;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setItemName("");
      setCategory(initialCategory || "");
      setBaseCost("");
      setSelectionRate("");
    }
  }, [initialCategory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const parsedBaseCost = Number(baseCost) || 0;
    const parsedSelectionRate = Number(selectionRate) || 0;

    if (parsedSelectionRate < parsedBaseCost) {
      toast.error("Selection Rate cannot be lower than Base Cost!");
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
      toast.error("Item name already exists");
      return;
    }

    setSaving(true);
    const response = await createItemMutation.mutateAsync({
      itemName: formattedName,
      category,
      base_cost: Number(baseCost) || 0,
      selection_rate: Number(selectionRate) || 0,
    });
    setSaving(false);
    if (response) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[540px] max-h-[90vh] flex flex-col overflow-visible">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary-soft)] to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)] shadow-sm">
              <FiTag className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Create Item</h2>
              <p className="text-sm font-medium text-gray-400 mt-0.5">
                Add a new item with pricing details
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

          <div className="relative z-20">
            <label className="block font-medium text-gray-700 mb-2">
              Category *
            </label>
            <Dropdown
              options={categories} selectedValue={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select a category"
              isSearchable={true}
            />
          </div>

          {/* Pricing */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-4">
              <FiDollarSign className="text-[var(--color-primary-text)]" size={18} />
              <h3 className="font-semibold text-gray-700">Pricing</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Base Cost (₹)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100"
                  value={baseCost}
                  onChange={(e) =>
                    setBaseCost(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all text-base font-medium"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The raw cost of this item
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Selection Rate (₹)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 150"
                  value={selectionRate}
                  onChange={(e) =>
                    setSelectionRate(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all text-base font-medium"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The rate when item is selected
                </p>
              </div>
            </div>
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

// ==================== ADD INGREDIENT (RECIPE) MODAL ====================
export const AddIngredientModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [personCount, setPersonCount] = useState(100);
  const [ingredients, setIngredients] = useState([
    { ingredient: null, quantity: "", unit: "g" },
  ]);
  const [saving, setSaving] = useState(false);
  const createRecipeMutation = useCreateRecipeMutation();
  const { data: categories = [] } = useCategories({}, { enabled: isOpen });
  const { data: ingredientItems = [] } = useIngredientItems(
    {},
    { enabled: isOpen }
  );

  const items = categories.flatMap((cat) => 
    (cat.items || []).map(item => ({
      ...item,
      categoryName: cat.name
    }))
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedItem(null);
      setPersonCount(100);
      setIngredients([{ ingredient: null, quantity: "", unit: "g" }]);
    }
  }, [isOpen]);

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const isLastRow = index === updated.length - 1;
      if (isLastRow && field === "ingredient" && value) {
        updated.push({ ingredient: null, quantity: "", unit: "g" });
      }
      return updated;
    });
  };

  const handleRemoveField = (index) => {
    setIngredients((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      const lastItem = filtered[filtered.length - 1];
      if (!lastItem || lastItem.ingredient) {
        filtered.push({ ingredient: null, quantity: "", unit: "g" });
      }
      return filtered;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.ingredient && String(ing.quantity ?? "").trim() !== ""
    );

    if (validIngredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    setSaving(true);

    try {
      const calls = validIngredients.map((ing) =>
        createRecipeMutation.mutateAsync({
          item: selectedItem,
          ingredient: ing.ingredient,
          quantity: ing.quantity,
          unit: ing.unit || "g",
          person_count: personCount,
        })
      );

      const responses = await Promise.all(calls);
      const success = responses.every((resp) => resp && (resp.status === 201 || resp.status === 200));
      if (success) {
        onSuccess?.();
        onClose();
      } else {
        toast.error("Some recipe entries could not be saved");
      }
    } catch (error) {
      logError("Add Recipe API Error:", error);
      toast.error("Error saving recipe ingredients");
    } finally {
      setSaving(false);
    }
  };

  const selectedItemName = items.find((item) => item.id === selectedItem)?.name;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[650px] max-h-[90vh] flex flex-col overflow-visible">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[var(--color-primary-soft)] to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-primary)] shadow-sm">
              <FiBookOpen className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Add Recipe Ingredient
              </h2>
              <p className="text-sm font-medium text-gray-400 mt-0.5">
                Create a new recipe with ingredients
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
          className="p-6 space-y-5 flex-1 flex flex-col min-h-0 overflow-visible"
        >
          {/* Person Count */}
          <div className="flex-none">
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">
              <FiUsers className="inline mr-1.5 text-[var(--color-primary-text)]" size={14} />
              Recipe For Person Count
            </label>
            <input
              type="number"
              value={personCount}
              onChange={(e) => setPersonCount(parseInt(e.target.value) || 0)}
              min="1"
              placeholder="Enter Person Count (e.g., 100)"
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] bg-gray-50/50 transition-all"
            />
          </div>

          {/* Item Dropdown */}
          <div className="flex-none relative z-20">
            <label className="block font-medium text-gray-700 mb-2">
              Select Item *
            </label>
            <Dropdown
              options={items}
              placeholder="Select an item" selectedValue={selectedItem}
              onChange={(value) => setSelectedItem(value)}
              isSearchable={true}
            />
          </div>

          {/* Ingredients */}
          {selectedItem && (
            <div className="flex-1 overflow-visible pb-2 min-h-0">
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
                <FiBox className="inline mr-1.5 text-[var(--color-primary-text)]" size={14} />
                {selectedItemName} Ingredients
              </label>

              <div className="grid grid-cols-[1fr_120px_120px_44px] sm:grid-cols-[1fr_150px_120px_44px] gap-2 items-center mb-2 px-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Ingredient
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Quantity
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Unit
                </span>
                <span></span>
              </div>

              <AnimatePresence>
                {ingredients.map((ingredient, index) => {
                  const isLastEmptyRow =
                    index === ingredients.length - 1 &&
                    !ingredient.ingredient;
                  const isFilledRow = Boolean(ingredient.ingredient);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 grid grid-cols-[1fr_120px_120px_44px] sm:grid-cols-[1fr_150px_120px_44px] gap-2 items-center mb-2"
                    >
                      <div>
                        <Dropdown
                          options={ingredientItems}
                          placeholder="Select ingredient" selectedValue={ingredient.ingredient}
                          onChange={(value) =>
                            handleIngredientChange(index, "ingredient", value)
                          }
                          isSearchable={true}
                          disabled={isFilledRow}
                        />
                      </div>

                      <input
                        type="number"
                        min="0"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        placeholder="Qty"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
                      />

                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, "unit", e.target.value)
                        }
                        placeholder="Unit"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
                      />

                      {!isLastEmptyRow ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-100 hover:border-red-500 shadow-sm"
                        >
                          <FaTimes size={14} />
                        </button>
                      ) : (
                        <div className="w-[44px]" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/30">
          <span className="text-xs font-medium text-gray-400">
            {ingredients.filter((i) => Boolean(i?.ingredient)).length}{" "}
            ingredient(s)
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[var(--color-primary)] rounded-xl hover:brightness-95 transition-all cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Ingredient"}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
