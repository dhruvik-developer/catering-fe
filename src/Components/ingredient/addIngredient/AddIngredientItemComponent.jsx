/* eslint-disable react/prop-types */
import Dropdown from "../../common/formDropDown/DropDown";
import Input from "../../common/formInputs/Input";

function AddIngredientItemComponent({
  itemName,
  category,
  setItemName,
  setCategory,
  categories,
  navigate,
  handleSubmit,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <button
        type="button"
        className="px-4 py-2 mb-[10px] font-medium bg-gray-300 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Add Ingredient Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name Input */}
        <div>
          <Input
            label="Item Name:"
            type="text"
            placeholder="Please Enter Item Name"
            name="name"
            value={itemName}
            className="w-full p-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-[#845cbd] focus:border-[#845cbd]"
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Category:
          </label>
          <Dropdown
            options={categories}
            selectedValue={category}
            onChange={(value) => setCategory(value)}
            placeholder="Select a category"
            isSearchable={true}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-auto bg-[#845cbd] text-white p-2 rounded-md cursor-pointer"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddIngredientItemComponent;
