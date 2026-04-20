import {
  FiBookOpen,
  FiX,
  FiUsers,
  FiBox,
  FiEdit2,
  FiPlus,
  FiArrowLeft,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../Components/common/Loader";
import Dropdown from "../../Components/common/formDropDown/DropDown";

function ViewItemRecipeComponent({
  loading,
  navigate,
  recipeData,
  itemName,
  baseCost,
  selectionRate,
  handleEditCosts,
  onClose,
  // Edit mode props
  isEditing,
  editIngredientsList,
  ingredientOptions,
  editPersonCount,
  setEditPersonCount,
  saving,
  onStartEdit,
  onCancelEdit,
  onEditIngredientChange,
  onDeleteEditIngredient,
  onSaveEdit,
  // Add mode props
  isAdding,
  addIngredientsList,
  addPersonCount,
  setAddPersonCount,
  addSaving,
  onStartAdd,
  onCancelAdd,
  onAddIngredientChange,
  onDeleteAddIngredient,
  onSaveAdd,
}) {
  // Helper to get ingredients as entries array
  const getIngredientEntries = (ingredients) => {
    if (!ingredients) return [];
    if (typeof ingredients === "object" && !Array.isArray(ingredients)) {
      return Object.entries(ingredients);
    }
    if (Array.isArray(ingredients)) {
      return ingredients.map((name) => [name, "-"]);
    }
    return [];
  };

  const ingredientEntries = recipeData
    ? getIngredientEntries(recipeData.ingredients)
    : [];

  // ===================== EDIT MODE CONTENT =====================
  const editContent = (
    <div
      className="bg-white rounded-2xl shadow-2xl relative flex flex-col w-[95vw] md:w-[700px] lg:w-[800px] max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Edit Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-[#f4effc] to-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelEdit}
            className="p-2 rounded-full bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm cursor-pointer border border-gray-200"
            title="Back to View"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="p-2.5 rounded-xl bg-[#845cbd] shadow-sm">
            <FiEdit2 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 capitalize leading-tight">
              Edit Recipe
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-0.5">
              {itemName}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm cursor-pointer"
            title="Close"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Edit Body */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
        {/* Person Count Field */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">
            <FiUsers className="inline mr-1.5 text-green-600" size={14} />
            Recipe For Person Count
          </label>
          <input
            type="number"
            value={editPersonCount}
            onChange={(e) => setEditPersonCount(parseInt(e.target.value) || 0)}
            min="1"
            placeholder="Enter Person Count (e.g., 100)"
            className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#845cbd]/40 focus:border-[#845cbd] bg-gray-50/50 transition-all"
          />
        </div>

        {/* Ingredients Editable List */}
        <div>
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
            <FiBox className="inline mr-1.5 text-blue-600" size={14} />
            Ingredients
          </label>

          {/* Column Headers */}
          <div className="grid grid-cols-[1fr_120px_120px_44px] sm:grid-cols-[1fr_150px_120px_44px] gap-2 items-center mb-2 px-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Name
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
            {editIngredientsList.map((ingredient, index) => {
              const isLastEmptyRow =
                index === editIngredientsList.length - 1 &&
                !ingredient.ingredientId;
              const isFilledRow = Boolean(ingredient.ingredientId);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-[1fr_120px_120px_44px] sm:grid-cols-[1fr_150px_120px_44px] gap-2 items-center mb-2"
                >
                  <Dropdown
                    options={ingredientOptions || []}
                    placeholder="Select ingredient"
                    selectedValue={ingredient.ingredientId}
                    onChange={(value) =>
                      onEditIngredientChange(index, "ingredientId", value)
                    }
                    isSearchable={true}
                    disabled={isFilledRow}
                  />
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      onEditIngredientChange(index, "quantity", e.target.value)
                    }
                    placeholder="e.g. 100g"
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#845cbd]/40 focus:border-[#845cbd] transition-all ${
                      isFilledRow
                        ? "border-gray-200 bg-purple-50/30 text-[#845cbd] font-bold"
                        : "border-dashed border-gray-300 bg-gray-50/50 text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={ingredient.unit || ""}
                    onChange={(e) =>
                      onEditIngredientChange(index, "unit", e.target.value)
                    }
                    placeholder="Unit"
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#845cbd]/40 focus:border-[#845cbd] transition-all ${
                      isFilledRow
                        ? "border-gray-200 bg-purple-50/30 text-[#845cbd] font-bold"
                        : "border-dashed border-gray-300 bg-gray-50/50 text-gray-400"
                    }`}
                  />
                  {!isLastEmptyRow ? (
                    <button
                      onClick={() => onDeleteEditIngredient(index)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-100 hover:border-red-500 shadow-sm"
                      title="Remove ingredient"
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
      </div>

      {/* Edit Footer */}
      <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/30">
        <span className="text-xs font-medium text-gray-400">
          {editIngredientsList.filter((i) => Boolean(i.ingredientId)).length}{" "}
          ingredient(s)
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelEdit}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSaveEdit}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#845cbd] rounded-xl hover:bg-[#7350a8] transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiSave size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  // ===================== VIEW MODE CONTENT =====================
  const viewContent = (
    <div
      className="bg-white rounded-2xl shadow-2xl relative flex flex-col w-[95vw] md:w-[700px] lg:w-[800px] max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#f4effc] shadow-sm">
            <FiBookOpen className="text-[#845cbd]" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize leading-tight pr-4">
              {itemName}
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-0.5">
              Recipe Ingredients Information
            </p>
          </div>
        </div>

        {/* Close Button & Costs */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            {baseCost !== undefined && baseCost !== null && (
              <div className="flex flex-col items-end px-3 py-1.5 bg-green-50/50 rounded-lg border border-green-100 shadow-sm">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">
                  Base Cost
                </span>
                <span className="text-xs font-bold text-green-700">
                  ₹{baseCost}
                </span>
              </div>
            )}
            {selectionRate !== undefined && selectionRate !== null && (
              <div className="flex flex-col items-end px-3 py-1.5 bg-blue-50/50 rounded-lg border border-blue-100 shadow-sm">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">
                  Sel. Rate
                </span>
                <span className="text-xs font-bold text-blue-700">
                  ₹{selectionRate}
                </span>
              </div>
            )}
            <button
              onClick={handleEditCosts}
              className="p-1.5 ml-1 rounded-md bg-white text-gray-400 hover:bg-[#845cbd] hover:text-white transition-colors cursor-pointer shadow-sm border border-gray-200"
              title="Edit Item Costs"
            >
              <FiEdit2 size={14} />
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm cursor-pointer ml-1"
              title="Close"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
        {/* Mobile Costs display */}
        <div className="flex sm:hidden items-center justify-between mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {baseCost !== undefined && baseCost !== null && (
              <div className="flex flex-col items-end px-3 py-1.5 bg-green-50/50 rounded-lg border border-green-100 shadow-sm">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500">
                  Base Cost
                </span>
                <span className="text-xs font-bold text-green-700">
                  ₹{baseCost}
                </span>
              </div>
            )}
            {selectionRate !== undefined && selectionRate !== null && (
              <div className="flex flex-col items-end px-3 py-1.5 bg-blue-50/50 rounded-lg border border-blue-100 shadow-sm">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500">
                  Sel. Rate
                </span>
                <span className="text-xs font-bold text-blue-700">
                  ₹{selectionRate}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleEditCosts}
            className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-[#845cbd] hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
          >
            <FiEdit2 size={12} /> Edit Costs
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center w-full">
            <Loader message="Fetching Recipe Details..." fullScreen={false} />
          </div>
        ) : recipeData ? (
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {recipeData.person_count && (
                <div className="flex items-center gap-2 bg-green-50 px-3.5 py-1.5 border border-green-100 rounded-lg text-green-700 font-bold text-sm">
                  <FiUsers size={16} className="text-green-600" />
                  <span>{recipeData.person_count} Persons</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 border border-blue-100 rounded-lg text-blue-700 font-bold text-sm">
                <FiBox size={16} className="text-blue-600" />
                <span>{ingredientEntries.length} Ingredients</span>
              </div>
              <button
                onClick={onStartEdit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f4effc] text-[#845cbd] hover:bg-[#845cbd] hover:text-white border border-[#e8e0f3] rounded-lg font-bold transition-all cursor-pointer shadow-sm text-sm ml-auto"
                title="Edit Recipe Ingredients"
              >
                <FiEdit2 size={14} />
                <span>Edit Recipe</span>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-[1fr_100px] sm:grid-cols-[1fr_150px] gap-4 items-center bg-gray-50 px-5 py-3 border-b border-gray-200">
                <span className="font-bold text-gray-600 uppercase text-xs tracking-wider">
                  Ingredient Name
                </span>
                <span className="font-bold text-gray-600 uppercase text-xs tracking-wider text-right">
                  Quantity
                </span>
              </div>
              {ingredientEntries.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {ingredientEntries.map(([ingName, qty], index) => (
                    <li
                      key={index}
                      className="grid grid-cols-[1fr_100px] sm:grid-cols-[1fr_150px] gap-4 items-center px-5 py-3 bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {index + 1}
                        </div>
                        <span
                          className="text-sm font-semibold text-gray-800 capitalize truncate"
                          title={ingName}
                        >
                          {ingName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold bg-gray-50 text-gray-700 px-3 py-1 rounded-md shadow-sm border border-gray-200 inline-block min-w-[50px] text-center">
                          {qty || "0"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-10 text-center text-gray-400 font-medium">
                  No particular ingredients mapped.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <IoIosWarning size={48} className="text-yellow-400 mb-3" />
            <p className="text-lg font-bold text-gray-700 mb-2">
              No Recipe Found
            </p>
            <p className="text-sm text-gray-500 max-w-sm text-center mb-5">
              There are no recipe ingredients mapped to{" "}
              <span className="font-bold text-gray-700">{itemName}</span> yet.
            </p>
            <button
              onClick={onStartAdd}
              className="px-5 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2"
            >
              <FiPlus size={16} />
              Add Recipe Ingredient
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ===================== ADD MODE CONTENT =====================
  const addContent = (
    <div
      className="bg-white rounded-2xl shadow-2xl relative flex flex-col w-[95vw] md:w-[700px] lg:w-[800px] max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Add Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-[#f4effc] to-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelAdd}
            className="p-2 rounded-full bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm cursor-pointer border border-gray-200"
            title="Back to View"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="p-2.5 rounded-xl bg-[#845cbd] shadow-sm">
            <FiPlus className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Add Recipe Ingredient
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-0.5">
              {itemName}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm cursor-pointer"
            title="Close"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Add Body */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
        {/* Person Count */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">
            <FiUsers className="inline mr-1.5 text-green-600" size={14} />
            Recipe For Person Count
          </label>
          <input
            type="number"
            value={addPersonCount}
            onChange={(e) => setAddPersonCount(parseInt(e.target.value) || 0)}
            min="1"
            placeholder="Enter Person Count (e.g., 100)"
            className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#845cbd]/40 focus:border-[#845cbd] bg-gray-50/50 transition-all"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
            <FiBox className="inline mr-1.5 text-blue-600" size={14} />
            Ingredients
          </label>

          <div className="grid grid-cols-[1fr_120px_120px_44px] sm:grid-cols-[1fr_150px_120px_44px] gap-2 items-center mb-2 px-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Name
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
            {addIngredientsList?.map((ingredient, index) => {
              const isLastEmptyRow =
                index === addIngredientsList.length - 1 &&
                !ingredient.ingredientId;
              const isFilledRow = Boolean(ingredient.ingredientId);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-[1fr_120px_120px_44px] sm:grid-cols-[1fr_150px_120px_44px] gap-2 items-center mb-2"
                >
                  <Dropdown
                    options={ingredientOptions || []}
                    placeholder="Select ingredient"
                    selectedValue={ingredient.ingredientId}
                    onChange={(value) =>
                      onAddIngredientChange(index, "ingredientId", value)
                    }
                    isSearchable={true}
                    disabled={isFilledRow}
                  />
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      onAddIngredientChange(index, "quantity", e.target.value)
                    }
                    placeholder="e.g. 100g"
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#845cbd]/40 focus:border-[#845cbd] transition-all ${
                      isFilledRow
                        ? "border-gray-200 bg-purple-50/30 text-[#845cbd] font-bold"
                        : "border-dashed border-gray-300 bg-gray-50/50 text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={ingredient.unit || ""}
                    onChange={(e) =>
                      onAddIngredientChange(index, "unit", e.target.value)
                    }
                    placeholder="Unit"
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#845cbd]/40 focus:border-[#845cbd] transition-all ${
                      isFilledRow
                        ? "border-gray-200 bg-purple-50/30 text-[#845cbd] font-bold"
                        : "border-dashed border-gray-300 bg-gray-50/50 text-gray-400"
                    }`}
                  />
                  {!isLastEmptyRow ? (
                    <button
                      onClick={() => onDeleteAddIngredient(index)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-100 hover:border-red-500 shadow-sm"
                      title="Remove ingredient"
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
      </div>

      {/* Add Footer */}
      <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50/30">
        <span className="text-xs font-medium text-gray-400">
          {addIngredientsList?.filter((i) => Boolean(i.ingredientId)).length ||
            0}{" "}
          ingredient(s)
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelAdd}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSaveAdd}
            disabled={addSaving}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#845cbd] rounded-xl hover:bg-[#7350a8] transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiSave size={16} />
            {addSaving ? "Saving..." : "Save Ingredient"}
          </button>
        </div>
      </div>
    </div>
  );

  // Choose which content to render
  const activeContent = isAdding
    ? addContent
    : isEditing
      ? editContent
      : viewContent;

  // If used as a modal/popup
  if (onClose) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            key={isAdding ? "add-mode" : isEditing ? "edit-mode" : "view-mode"}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
          >
            {activeContent}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Fallback if not used as modal
  return activeContent;
}

export default ViewItemRecipeComponent;
