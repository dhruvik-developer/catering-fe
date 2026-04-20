/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import Loader from "../../Components/common/Loader";
import Dropdown from "../../Components/common/formDropDown/DropDown";
import {
  FiPackage,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiAlertTriangle,
  FiDollarSign,
  FiBox,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

function StockComponent({
  selectedCategory,
  setSelectedCategory,
  categories,
  items,
  loading,
  handleAddCategory,
  handleAddItem,
  onCategoryDelete,
  onItemDelete,
  handleIncreaseItem,
  handleDecreaseItem,
}) {
  const unitLabels = {
    KG: "Kilogram",
    G: "Gram",
    L: "Litre",
    ML: "Millilitre",
    QTY: "Quantity",
  };

  const unitShort = {
    KG: "Kg",
    G: "g",
    L: "L",
    ML: "mL",
    QTY: "Qty",
  };

  // Stats
  const totalItems = items?.length || 0;
  const lowStockItems =
    items?.filter((i) => parseInt(i.quantity) <= parseInt(i.alert)).length || 0;
  const totalValue =
    items?.reduce((sum, i) => sum + Number(i.total_price || 0), 0) || 0;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiPackage className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Stocks</h2>
            <p className="text-sm text-gray-400">
              Manage your inventory & stock levels
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading Stocks Details..." />
      ) : (
        <>
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 mb-5 p-4 bg-[#faf8fd] rounded-xl border border-[#e8e0f3]">
            {categories.length > 0 && (
              <div className="flex gap-2 flex-1 items-center">
                <Dropdown
                  options={categories}
                  selectedValue={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  placeholder="Select Category"
                />
                {selectedCategory !== "low_stock" && selectedCategory !== "all_items" && (
                  <button
                    onClick={() =>
                      selectedCategory && onCategoryDelete(selectedCategory)
                    }
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer flex-shrink-0"
                    title="Delete Stock Category"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <button
                className="px-4 py-2.5 bg-[#845cbd] hover:bg-[#7350a8] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
              {selectedCategory !== "low_stock" && selectedCategory !== "all_items" && (
                <button
                  className="px-4 py-2.5 bg-white hover:bg-[#f4effc] text-[#845cbd] text-sm font-medium rounded-lg border border-[#845cbd] cursor-pointer transition-colors duration-200"
                  onClick={handleAddItem}
                >
                  Add Item
                </button>
              )}
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#845cbd] to-[#6a3faf] text-white rounded-xl p-4 shadow-md shadow-[#845cbd]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold mt-1">{totalItems}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <FiBox size={22} className="text-white/80" />
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl p-4 shadow-md ${lowStockItems > 0 ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/10" : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/10"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    {lowStockItems > 0 ? "Low Stock" : "All Good"}
                  </p>
                  <p className="text-3xl font-bold mt-1">{lowStockItems}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  {lowStockItems > 0 ? (
                    <FiAlertTriangle size={22} className="text-white/80" />
                  ) : (
                    <FiTrendingUp size={22} className="text-white/80" />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-md shadow-amber-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    ₹
                    {totalValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <FiDollarSign size={22} className="text-white/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <IoIosWarning size={48} className="text-yellow-400 mb-3" />
              <p className="text-lg font-semibold text-gray-500">
                No Items Available
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Add items to track your stock
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item) => {
                const alertStock = parseInt(item.alert);
                const quantity = parseInt(item.quantity);
                const isLowStock = quantity <= alertStock;
                const stockPercent =
                  alertStock > 0
                    ? Math.min((quantity / (alertStock * 4)) * 100, 100)
                    : 100;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border group ${
                      isLowStock
                        ? "bg-gradient-to-br from-red-50 to-white border-red-200 hover:border-red-300"
                        : "bg-gradient-to-br from-[#faf8fd] to-white border-[#e8e0f3] hover:border-[#c9b8e3]"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="px-5 pt-4 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                              isLowStock ? "bg-red-100" : "bg-[#f4effc]"
                            }`}
                          >
                            <FiBox
                              size={18}
                              className={
                                isLowStock ? "text-red-500" : "text-[#845cbd]"
                              }
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-800 truncate">
                              {item.name}
                            </h3>
                            {item.categoryName && (
                              <p className="text-[11px] font-medium text-gray-400 truncate mb-0.5">
                                {item.categoryName}
                              </p>
                            )}
                            <p
                              className={`text-sm font-semibold ${isLowStock ? "text-red-500" : "text-[#845cbd]"}`}
                            >
                              {item.quantity}{" "}
                              {unitLabels[item.type] || item.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isLowStock && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
                              <FiAlertTriangle size={10} />
                              LOW
                            </span>
                          )}
                          <button
                            onClick={() => onItemDelete(item.id)}
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stock Level Bar */}
                    <div className="px-5 pb-3">
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLowStock
                              ? "bg-gradient-to-r from-red-400 to-red-500"
                              : stockPercent > 60
                                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                : "bg-gradient-to-r from-amber-400 to-amber-500"
                          }`}
                          style={{ width: `${stockPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Stock Level
                        </span>
                        <span
                          className={`text-[10px] font-bold ${isLowStock ? "text-red-500" : "text-gray-500"}`}
                        >
                          Min: {item.alert} {unitShort[item.type] || item.type}
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="px-5 pb-3">
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Net Price
                          </p>
                          <p className="text-sm font-bold text-gray-700 mt-0.5">
                            ₹{Number(item.nte_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Total Value
                          </p>
                          <p className="text-sm font-bold text-emerald-600 mt-0.5">
                            ₹{Number(item.total_price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-5 pb-4">
                      <div className="flex gap-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#f4effc] hover:bg-[#e8ddf5] text-[#845cbd] rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold active:scale-[0.97]"
                          title="Increase Stock"
                          onClick={() => handleIncreaseItem(item)}
                        >
                          <FiPlus size={16} />
                          <span>Add</span>
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold active:scale-[0.97]"
                          title="Decrease Stock"
                          onClick={() => handleDecreaseItem(item)}
                        >
                          <FiMinus size={16} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StockComponent;
