/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiChevronDown, FiGrid, FiTag } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";

const IngredientTable = ({
  categories = [],
  activeCategoryId,
  setActiveCategoryId,
  onSubCategoryDelete,
  onIngredientDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <IoIosWarning size={48} className="text-yellow-400 mb-3" />
        <p className="text-lg font-semibold text-gray-500">
          No Ingredients Available
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Add an ingredient category to get started
        </p>
      </div>
    );
  }

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0];
  const subcategories = activeCategory?.items || [];

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Hand Side: Master Category List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3">
        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
          Ingredient Categories
        </div>
        <div className="flex flex-col gap-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
          {categories.map((category, index) => {
            const isActive = category.id === activeCategory?.id;
            const qty = category.items ? category.items.length : 0;
            return (
              <div
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-50 to-white border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]/20"
                    : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-bold text-[15px] truncate ${isActive ? "text-[var(--color-primary)]" : "text-gray-800"}`}
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
                      onIngredientDelete(category.id);
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
      <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[500px]">
        {/* Header for Items */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiGrid className="text-[var(--color-primary)]" />
              {activeCategory?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {subcategories.length} total ingredients in this category
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
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] w-full sm:w-64 transition-all"
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
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-[var(--color-primary-light)] hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <FiTag className="text-[var(--color-primary)]" size={14} />
                    </div>
                    <span className="text-[14px] font-bold text-gray-800 truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {sub.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubCategoryDelete(sub.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                    title="Delete Ingredient"
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
                  ? "No ingredients match your search."
                  : "No ingredients found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientTable;
