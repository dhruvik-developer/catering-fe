/* eslint-disable react/prop-types */
import { FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function EditIngredientComponent({
  navigate,
  recipe,
  ingredientsList,
  personCount,
  setPersonCount,
  handleSubmit,
  handleDeleteItem,
  handleIngredientChange,
  handleDeleteIngredient,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div>
        <button
          type="button"
          className="px-4 py-2 mb-[10px] font-medium bg-gray-300 border border-gray-300 rounded-md cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Recipe ingredient</h2>
      </div>

      {/* Person Count Section */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Recipe For Person Count
        </label>
        <input
          type="number"
          value={personCount}
          onChange={(e) => setPersonCount(parseInt(e.target.value) || 0)}
          min="1"
          placeholder="Enter Person Count (e.g., 100)"
          className="w-full p-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
        />
      </div>

      {/* Recipe Item Name */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Select Item</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={recipe.item.name}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
          />
          <button
            className="p-[10px] mt-[5px] border border-gray-300 text-red-500 text-xl rounded-md cursor-pointer"
            onClick={() => {
              handleDeleteItem(recipe.id);
            }}
            title="Delete Ingredient Item"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Ingredients List */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          {recipe.item.name} ingredient
        </label>
        <AnimatePresence>
          {ingredientsList.map((ingredient, index) => {
            const isLastEmptyRow =
              index === ingredientsList.length - 1 &&
              ingredient.name.trim() === "";
            const isFilledRow = ingredient.name.trim() !== "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 mb-2"
              >
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  placeholder="Please Enter ingredient"
                  className={`flex-1 p-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd] ${isLastEmptyRow ? "" : ""}`}
                />
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  placeholder="Qty (e.g. 100g)"
                  className={`w-[120px] p-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd] ${isFilledRow ? "bg-gray-50 text-[#845cbd] font-semibold" : ""}`}
                />
                {/* Show delete button only for filled rows, not the last empty row */}
                {!isLastEmptyRow ? (
                  <button
                    className="p-[12px] mt-[5px] bg-red-400 text-white text-xl rounded-md cursor-pointer"
                    onClick={() => handleDeleteIngredient(index)}
                  >
                    <FaTimes size={20} />
                  </button>
                ) : (
                  <div className="w-[52px]" /> /* Spacer to keep alignment */
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-[#845cbd] text-white px-4 py-2 rounded-md font-semibold cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EditIngredientComponent;
