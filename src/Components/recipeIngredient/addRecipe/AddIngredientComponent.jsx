/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../common/formDropDown/DropDown";
import { FaTimes } from "react-icons/fa";

function AddIngredientComponent({
  items,
  ingredientItems,
  selectedItem,
  setSelectedItem,
  personCount,
  setPersonCount,
  ingredients,
  handleIngredientChange,
  handleRemoveField,
  handleSubmit,
  navigate,
}) {
  const selectedItemName = items.find((item) => item.id === selectedItem)?.name;
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <button
        type="button"
        className="px-4 py-2 mb-[10px] font-medium bg-gray-300 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Add Recipe Ingredient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Person Count */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Recipe For Person Count:
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
            placeholder="Enter Person Count (e.g., 100)"
            value={personCount}
            onChange={(e) => setPersonCount(parseInt(e.target.value) || 0)}
            min="1"
            required
          />
        </div>

        {/* Item Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Select Item:
          </label>
          <Dropdown
            options={items}
            placeholder="Select an item"
            selectedValue={selectedItem}
            onChange={(value) => setSelectedItem(value)}
            isSearchable={true}
          />
        </div>

        {/* Selected Item Label */}
        {selectedItem && (
          <div className="block font-semibold text-gray-700 mb-[0px]">
            {selectedItemName} ingredients
          </div>
        )}

        {/* Ingredients List - inline rows */}
        {selectedItem && (
          <div>
            <AnimatePresence>
              {ingredients.map((ingredient, index) => {
                const isLastEmptyRow =
                  index === ingredients.length - 1 && !ingredient.ingredient;
                const isFilledRow = Boolean(ingredient.ingredient);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <div className="flex-1">
                      <Dropdown
                        options={ingredientItems}
                        placeholder="Select ingredient"
                        selectedValue={ingredient.ingredient}
                        onChange={(value) =>
                          handleIngredientChange(index, "ingredient", value)
                        }
                        isSearchable={true}
                      />
                    </div>

                    <input
                      type="number"
                      min="0"
                      className="w-[90px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
                      placeholder="Qty"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(index, "quantity", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      className="w-[80px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) =>
                        handleIngredientChange(index, "unit", e.target.value)
                      }
                    />

                    {!isLastEmptyRow ? (
                      <button
                        type="button"
                        className="p-[10px] bg-red-400 text-white rounded-md"
                        onClick={() => handleRemoveField(index)}
                      >
                        <FaTimes />
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

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-auto bg-[#845cbd] text-white p-2 rounded-md cursor-pointer"
          >
            Save Ingredient
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddIngredientComponent;
