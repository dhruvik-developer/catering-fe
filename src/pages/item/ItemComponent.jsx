/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import Loader from "../../Components/common/Loader";
import {
  FiList,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";

function ItemComponent({
  categories,
  selectedItemsState,
  loading,
  navigate,
  generatePDF,
  handleItemSelect,
}) {
  const [collapsedIds, setCollapsedIds] = useState([]);

  const toggleCollapse = (id) => {
    setCollapsedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Count total selected items
  const totalSelected = Object.values(selectedItemsState).reduce(
    (sum, cat) => sum + (cat?.items?.length || 0),
    0
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiList className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Items</h2>
            <p className="text-sm text-gray-400">
              {totalSelected > 0 ? (
                <span className="text-[var(--color-primary)] font-medium">
                  {totalSelected} item{totalSelected !== 1 ? "s" : ""} selected
                </span>
              ) : (
                "Select items for your order"
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create-item")}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200 shadow-sm"
        >
          <FiPlus size={15} />
          Add Item
        </button>
      </div>

      {loading ? (
        <Loader message="Loading Items..." />
      ) : (
        <div>
          {categories.length > 0 ? (
            <>
              <div className="space-y-4">
                {[...categories]
                  .sort((a, b) => a.positions - b.positions)
                  .map((category) => {
                    const isCollapsed = collapsedIds.includes(category.id);
                    const selectedCount =
                      selectedItemsState[category.id]?.items?.length || 0;

                    return (
                      <div
                        key={category.positions}
                        className="border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
                      >
                        {/* Category Header */}
                        <div
                          className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[var(--color-primary-tint)] to-white cursor-pointer select-none"
                          onClick={() => toggleCollapse(category.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {category.positions || "—"}
                            </div>
                            <span className="font-semibold text-gray-800 text-base">
                              {category.name}
                            </span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-primary-border)] text-[var(--color-primary)]">
                              {category.items?.length || 0} items
                            </span>
                            {selectedCount > 0 && (
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                <FiCheck
                                  size={10}
                                  className="inline mr-1 -mt-0.5"
                                />
                                {selectedCount} selected
                              </span>
                            )}
                          </div>
                          <FiChevronDown
                            className={`text-gray-400 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`}
                            size={18}
                          />
                        </div>

                        {/* Category Items */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[10000px] opacity-100"}`}
                        >
                          <div className="border-t border-gray-100 px-5 py-4">
                            {category.items && category.items.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {category.items.map((item) => {
                                  const isSelected =
                                    selectedItemsState[
                                      category.id
                                    ]?.items?.some(
                                      (selectedItem) =>
                                        selectedItem.id === item.id
                                    ) || false;

                                  return (
                                    <div
                                      key={item.id}
                                      onClick={() =>
                                        handleItemSelect(
                                          category.id,
                                          item.id,
                                          item.name,
                                          category.name,
                                          category.positions
                                        )
                                      }
                                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                                        isSelected
                                          ? "bg-[var(--color-primary-soft)] border-[var(--color-primary)] shadow-sm"
                                          : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                                      }`}
                                    >
                                      <div
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                          isSelected
                                            ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {isSelected && (
                                          <FiCheck
                                            size={12}
                                            className="text-white"
                                          />
                                        )}
                                      </div>
                                      <span
                                        className={`text-sm ${isSelected ? "text-[var(--color-primary)] font-medium" : "text-gray-600"}`}
                                      >
                                        {item.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                                <IoIosWarning
                                  size={20}
                                  className="text-yellow-400"
                                />
                                <span className="text-sm font-medium">
                                  No items available in this category
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Bottom Action Buttons — at the end of the page */}
              <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(-1)}
                >
                  <FiArrowLeft size={15} />
                  Back
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200 shadow-sm"
                  onClick={generatePDF}
                >
                  <FiCheck size={15} />
                  Submit
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <IoIosWarning size={48} className="text-yellow-400 mb-3" />
              <p className="text-lg font-semibold text-gray-500">
                No Items Available
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Please add an item to get started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ItemComponent;
