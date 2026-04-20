import { useState } from "react";
import IngredientTable from "../../Components/ingredient/IngredientTable";
import Loader from "../../Components/common/Loader";
import { FiGrid, FiPlus } from "react-icons/fi";
import { AddIngredientItemModal } from "../../Components/ingredient/IngredientModals";

function CreateIngredientComponent({
  categories,
  items,
  onAddCategory,
  onSubCategoryDelete,
  onIngredientDelete,
  loading,
  navigate,
  onRefresh,
}) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiGrid className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create Ingredient Item
            </h2>
            <p className="text-sm text-gray-400">
              {categories?.length || 0} categories •{" "}
              {categories?.reduce(
                (sum, c) => sum + (c.items?.length || 0),
                0
              ) || 0}{" "}
              items
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddCategory}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
          >
            <FiPlus size={15} />
            Add Category
          </button>
          <button
            onClick={() => setShowAddItem(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#f4effc] text-[#845cbd] text-sm font-medium rounded-lg border border-[#845cbd] cursor-pointer transition-colors duration-200"
          >
            <FiPlus size={15} />
            Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading ingredient categories & subcategories..." />
      ) : (
        <IngredientTable
          categories={categories || []}
          items={items || []}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          onSubCategoryDelete={onSubCategoryDelete}
          onIngredientDelete={onIngredientDelete}
        />
      )}

      <AddIngredientItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        onSuccess={onRefresh}
        initialCategory={activeCategoryId || (categories?.length > 0 ? categories[0].id : null)}
      />
    </div>
  );
}

export default CreateIngredientComponent;
