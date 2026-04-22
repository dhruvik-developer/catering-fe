import { useState, useEffect } from "react";
import { FiFolder, FiTag, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";
import { getGroundCategories, deleteGroundCategory, deleteGroundItem } from "../../../api/GroundApis";
import { HugeiconsIcon } from "@hugeicons/react";
import { TaskAdd01Icon } from "@hugeicons/core-free-icons";
import AddGroundCategory from "../categories/AddGroundCategory";
import AddGroundItem from "../items/AddGroundItem";

const EventGroundChecklist = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [editItemData, setEditItemData] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getGroundCategories();
      if (res?.data?.status) {
        const data = res.data.data || [];
        setCategories(data);
        // Auto-select first category
        if (data.length > 0 && !activeCategoryId) {
          setActiveCategoryId(data[0].id);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ground categories");
    } finally {
      setLoading(false);
    }
  };

  // Determine currently selected category
  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0] || null;
  const groundItems = activeCategory?.ground_items || [];

  const filteredItems = groundItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = categories.reduce(
    (sum, c) => sum + (c.ground_items?.length || 0),
    0
  );

  // Edit category
  const handleEditCategory = (category) => {
    setEditCategoryData(category);
    setShowAddCategory(true);
  };

  // Delete category
  const handleDeleteCategory = (category) => {
    import("sweetalert2").then(({ default: Swal }) => {
      Swal.fire({
        title: "Delete Category?",
        text: `Are you sure you want to delete "${category.name}"? This will also remove all items in this category.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "var(--color-primary)",
        confirmButtonText: "Yes, delete it",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg px-4 py-2 text-sm font-semibold",
          cancelButton: "rounded-lg px-4 py-2 text-sm font-semibold",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteGroundCategory(category.id);
            toast.success("Category deleted successfully");
            if (activeCategoryId === category.id) {
              setActiveCategoryId(null);
            }
            fetchCategories();
          } catch (error) {
            console.error(error);
          }
        }
      });
    });
  };

  // Edit item
  const handleEditItem = (item) => {
    setEditItemData({
      ...item,
      category: activeCategory?.id || item.category,
    });
    setShowAddItem(true);
  };

  // Delete item
  const handleDeleteItem = (item) => {
    import("sweetalert2").then(({ default: Swal }) => {
      Swal.fire({
        title: "Delete Item?",
        text: `Are you sure you want to delete "${item.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "var(--color-primary)",
        confirmButtonText: "Yes, delete it",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg px-4 py-2 text-sm font-semibold",
          cancelButton: "rounded-lg px-4 py-2 text-sm font-semibold",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteGroundItem(item.id);
            toast.success("Item deleted successfully");
            fetchCategories();
          } catch (error) {
            console.error(error);
          }
        }
      });
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <HugeiconsIcon
              icon={TaskAdd01Icon}
              size={22}
              color="var(--color-primary)"
              className="text-[var(--color-primary)]"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Ground Checklist
            </h2>
            <p className="text-sm text-gray-400">
              {categories.length} categories • {totalItems} items
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => {
              setEditCategoryData(null);
              setShowAddCategory(true);
            }}
            className="px-4 py-2.5 bg-[var(--color-primary)] hover:brightness-95 text-white rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium shadow-sm"
          >
            + Add Category
          </button>
          <button
            onClick={() => {
              setEditItemData(null);
              setShowAddItem(true);
            }}
            className="px-4 py-2.5 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading ground categories..." />
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <IoIosWarning size={48} className="text-yellow-400 mb-3" />
          <p className="text-lg font-semibold text-gray-500">
            No Categories Available
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Add a ground category to get started
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Hand Side: Category List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
              Categories List
            </div>
            <div className="flex flex-col gap-3 max-h-[400px] lg:max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
              {categories.map((category, index) => {
                const isActive = category.id === activeCategory?.id;
                const qty = category.ground_items
                  ? category.ground_items.length
                  : 0;
                return (
                  <div
                    key={category.id}
                    className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-purple-50 to-white border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]/20"
                        : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 overflow-hidden flex-1 min-w-0"
                      onClick={() => {
                        setActiveCategoryId(category.id);
                        setSearchQuery("");
                      }}
                    >
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
                          className={`font-bold text-[15px] truncate ${
                            isActive ? "text-[var(--color-primary)]" : "text-gray-800"
                          }`}
                          title={category.name}
                        >
                          {category.name}
                        </span>
                        <span className="text-xs font-medium text-gray-500 mt-0.5">
                          {qty} item{qty !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {/* Edit/Delete buttons for category */}
                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                        title="Edit Category"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category);
                        }}
                        title="Delete Category"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Hand Side: Items Grid */}
          <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col lg:h-[calc(100vh-240px)] lg:min-h-[500px] min-h-[400px]">
            {/* Header for Items */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiFolder className="text-[var(--color-primary)]" />
                  {activeCategory?.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {groundItems.length} total items in this category
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] w-full sm:w-64 transition-all"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-100 hover:border-[var(--color-primary-light)] hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2 flex-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-50">
                          <FiTag className="text-[var(--color-primary)]" size={14} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[14px] font-bold truncate text-gray-800 group-hover:text-[var(--color-primary)] transition-colors block">
                            {item.name}
                          </span>
                          {item.unit && (
                            <span className="text-[11px] text-gray-400">
                              Unit: {item.unit}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Edit/Delete buttons for item */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <button
                          onClick={() => handleEditItem(item)}
                          title="Edit Item"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          title="Delete Item"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
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
        </div>
      )}
      {/* Modals */}
      <AddGroundCategory
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          setEditCategoryData(null);
        }}
        onSuccess={() => {
          setShowAddCategory(false);
          setEditCategoryData(null);
          fetchCategories();
        }}
        editData={editCategoryData}
      />
      <AddGroundItem
        isOpen={showAddItem}
        onClose={() => {
          setShowAddItem(false);
          setEditItemData(null);
        }}
        onSuccess={() => {
          setShowAddItem(false);
          setEditItemData(null);
          fetchCategories();
        }}
        categories={categories.filter(c => c.is_active)}
        editData={editItemData}
      />
    </div>
  );
};

export default EventGroundChecklist;
