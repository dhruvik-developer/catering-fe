/* eslint-disable react/prop-types */
import Dropdown from "../../common/formDropDown/DropDown";
import Input from "../../common/formInputs/Input";
import { FiArrowLeft, FiTag, FiDollarSign } from "react-icons/fi";

function AddItemComponent({
  itemName,
  category,
  setItemName,
  setCategory,
  baseCost,
  setBaseCost,
  selectionRate,
  setSelectionRate,
  categories,
  navigate,
  handleSubmit,
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <button
        type="button"
        className="px-4 py-2 mb-4 font-medium bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm text-gray-600"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-[#f4effc]">
          <FiTag className="text-[#845cbd]" size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create Item</h2>
          <p className="text-sm text-gray-400">
            Add a new item with pricing details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Item Name Input */}
        <div>
          <Input
            label="Item Name *"
            type="text"
            placeholder="Please Enter Item Name"
            name="name"
            value={itemName}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/30 focus:border-[#845cbd] transition-all"
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
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

        {/* ---- Pricing Section ---- */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <FiDollarSign className="text-green-600" size={18} />
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all text-base font-medium"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-base font-medium"
              />
              <p className="text-xs text-gray-400 mt-1">
                The rate when item is selected for an event
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center pt-3">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white font-semibold rounded-lg cursor-pointer shadow-md shadow-[#845cbd]/20 transition-all active:scale-[0.98]"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItemComponent;
