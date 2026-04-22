/* eslint-disable react/prop-types */
import { useState } from "react";
import CategoryTable from "../../Components/category/CategoryTable";
import Loader from "../../Components/common/Loader";
import { FiFolder } from "react-icons/fi";
import {
  AddCategoryModal,
  AddItemModal,
  AddIngredientModal,
} from "../../Components/category/CategoryModals";

function CategoryComponent({
  categories,
  items,
  onAddCategory,
  onEditCategory,
  onSubCategoryDelete,
  onItemDelete,
  onSwappingCategory,
  loading,
  navigate,
  onRefresh,
}) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiFolder className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
            <p className="text-sm text-gray-400">
              {categories?.length || 0} categories •{" "}
              {categories?.reduce(
                (sum, c) => sum + (c.items?.length || 0),
                0
              ) || 0}{" "}
              subcategories
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => setShowAddCategory(true)}
            className="px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium shadow-sm"
          >
            + Add Category
          </button>
          <button
            onClick={() => setShowAddIngredient(true)}
            className="px-4 py-2.5 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium"
          >
            + Add Ingredient
          </button>
          <button
            onClick={() => setShowAddItem(true)}
            className="px-4 py-2.5 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading categories & subcategories..." />
      ) : (
        <CategoryTable
          categories={categories || []}
          items={items || []}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          onEditCategory={onEditCategory}
          onSubCategoryDelete={onSubCategoryDelete}
          onItemDelete={onItemDelete}
          onSwappingCategory={onSwappingCategory}
          onRefresh={onRefresh}
        />
      )}

      {/* Modals */}
      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSuccess={onRefresh}
      />
      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        onSuccess={onRefresh}
        initialCategory={
          activeCategoryId || (categories?.length > 0 ? categories[0].id : null)
        }
      />
      <AddIngredientModal
        isOpen={showAddIngredient}
        onClose={() => setShowAddIngredient(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}

export default CategoryComponent;
