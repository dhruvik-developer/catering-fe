/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import { FiChevronDown, FiFolder, FiTag, FiEye } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ViewItemRecipeController from "../../pages/itemRecipe/ViewItemRecipeController";

const CategoryTable = ({
  categories = [],
  activeCategoryId,
  setActiveCategoryId,
  onSubCategoryDelete,
  onItemDelete,
  onSwappingCategory,
  onEditCategory,
  onRefresh,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // State for Item Recipe Modal
  const [selectedItemForRecipe, setSelectedItemForRecipe] = useState(null);

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.positions === undefined) return 1;
    if (b.positions === undefined) return -1;
    return a.positions - b.positions;
  });

  if (sortedCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <IoIosWarning size={48} className="text-yellow-400 mb-3" />
        <p className="text-lg font-semibold text-gray-500">
          No Categories Available
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Add a category to get started
        </p>
      </div>
    );
  }

  // Determine currently selected category
  const activeCategory =
    sortedCategories.find((c) => c.id === activeCategoryId) ||
    sortedCategories[0];
  const subcategories = activeCategory?.items || [];

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Hand Side: Master Category List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3">
        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
          Categories List
        </div>
        <div className="flex flex-col gap-3 max-h-[400px] lg:max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
          {sortedCategories.map((category) => {
            const isActive = category.id === activeCategory?.id;
            const qty = category.items ? category.items.length : 0;
            return (
              <div
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-gradient-to-r from-purple-50 to-white border-[#845cbd] shadow-md ring-1 ring-[#845cbd]/20"
                    : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm"
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isActive
                        ? "bg-[#845cbd] text-white"
                        : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {category.positions || "—"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-bold text-[15px] truncate ${isActive ? "text-[#845cbd]" : "text-gray-800"}`}
                      title={category.name}
                    >
                      {category.name}
                    </span>
                    <span className="text-xs font-medium text-gray-500 mt-0.5">
                      {qty} item{qty !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(category.id, category.name);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#845cbd] hover:bg-purple-100 transition-colors"
                    title="Edit Name"
                  >
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="15" width="15" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwappingCategory(category.id, category.name);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#845cbd] hover:bg-purple-100 transition-colors"
                    title="Change Position"
                  >
                    <LuArrowDownUp size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemDelete(category.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Category"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Hand Side: Detail Item List */}
      <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col lg:h-[calc(100vh-240px)] lg:min-h-[500px] min-h-[400px]">
        {/* Header for Items */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiFolder className="text-[#845cbd]" />
              {activeCategory?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {subcategories.length} total items in this category
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#845cbd]/50 focus:border-[#845cbd] w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {filteredSubcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSubcategories.map((sub, index) => (
                <div
                  key={sub.id}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-[#b39ddb] hover:shadow-sm transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedItemForRecipe(sub)}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${sub.has_recipe === false ? "bg-red-50" : "bg-purple-50"}`}>
                      <FiTag className={sub.has_recipe === false ? "text-red-500" : "text-[#845cbd]"} size={14} />
                    </div>
                    <span className={`text-[14px] font-bold truncate transition-colors ${sub.has_recipe === false ? "text-red-500 group-hover:text-red-600" : "text-gray-800 group-hover:text-[#845cbd]"}`}>
                      {sub.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubCategoryDelete(sub.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                    title="Delete Item"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-10">
              <IoIosWarning size={40} className="text-yellow-400" />
              <p className="text-base font-medium text-gray-500">
                {searchQuery
                  ? "No items match your search."
                  : "No items found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Render Recipe Modal */}
      {selectedItemForRecipe && (
        <ViewItemRecipeController
          itemId={selectedItemForRecipe.id}
          itemName={selectedItemForRecipe.name}
          baseCost={selectedItemForRecipe.base_cost}
          selectionRate={selectedItemForRecipe.selection_rate}
          disableItemDetailsFetch={true}
          onClose={() => {
            setSelectedItemForRecipe(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default CategoryTable;
