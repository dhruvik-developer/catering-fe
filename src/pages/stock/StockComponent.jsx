/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import Loader from "../../Components/common/Loader";
import Dropdown from "../../Components/common/formDropDown/DropDown";
import Button from "../../Components/common/Button";
import PageHeader from "../../Components/common/PageHeader";
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
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <PageHeader
        icon={<FiPackage size={22} />}
        title="Stocks"
        subtitle="Manage your inventory & stock levels"
        className="mb-6"
      />

      {loading ? (
        <Loader message="Loading Stocks Details..." />
      ) : (
        <>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 p-4 bg-[var(--color-primary-tint)] rounded-xl border border-[var(--color-primary-border)]">
            {categories.length > 0 && (
              <div className="flex gap-2 flex-1 items-center min-w-0">
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
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddCategory} leftIcon={<FiPlus size={15} />}>
                Add Category
              </Button>
              {selectedCategory !== "low_stock" && selectedCategory !== "all_items" && (
                <Button
                  variant="secondary"
                  onClick={handleAddItem}
                  leftIcon={<FiPlus size={15} />}
                >
                  Add Item
                </Button>
              )}
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-2xl p-5 shadow-lg shadow-[var(--color-primary)]/20 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                    Total Items
                  </p>
                  <p className="text-3xl font-black mt-1 tracking-tight">{totalItems}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <FiBox size={22} className="text-white" />
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-all duration-300 ${
                lowStockItems > 0 
                  ? "bg-gradient-to-br from-red-600 to-[var(--color-primary-dark)] text-white shadow-red-500/20" 
                  : "bg-gradient-to-br from-[var(--color-primary-tint)]0 to-[var(--color-primary)] text-white shadow-emerald-500/20"
              }`}
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                    {lowStockItems > 0 ? "Low Stock Items" : "Inventory Status"}
                  </p>
                  <p className="text-3xl font-black mt-1 tracking-tight">
                    {lowStockItems > 0 ? lowStockItems : "All Healthy"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  {lowStockItems > 0 ? (
                    <FiAlertTriangle size={22} className="text-white animate-pulse" />
                  ) : (
                    <FiTrendingUp size={22} className="text-white" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--color-primary-text)] to-gray-800 text-white rounded-2xl p-5 shadow-lg shadow-gray-400/20 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                    Total Inventory Value
                  </p>
                  <p className="text-2xl font-black mt-1 tracking-tight">
                    ₹
                    {totalValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <FiDollarSign size={22} className="text-white/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-[var(--color-primary-tint)] rounded-[2.5rem] border border-[var(--color-primary-border)]/30">
              <IoIosWarning size={64} className="text-[var(--color-primary-light)] mb-4" />
              <p className="text-xl font-black text-[var(--color-primary-text)]">
                No Stock Items Found
              </p>
              <p className="text-sm text-[var(--color-primary-text)]/60 mt-2 font-medium max-w-xs text-center">
                Your inventory is currently empty. Add items to start tracking your stock levels.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                    className={`group relative rounded-3xl overflow-hidden transition-all duration-300 border-2 ${
                      isLowStock
                        ? "bg-gradient-to-br from-red-50/50 to-white border-red-200 hover:border-red-400 shadow-sm hover:shadow-red-200/50"
                        : "bg-white border-gray-100 hover:border-[var(--color-primary-light)] shadow-sm hover:shadow-[var(--color-primary)]/10"
                    }`}
                  >
                    {/* Low Stock Indicator Stripe */}
                    {isLowStock && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 z-10" />
                    )}

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300 ${
                              isLowStock 
                                ? "bg-red-500 text-white" 
                                : "bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
                            }`}
                          >
                            <FiBox size={22} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-gray-800 truncate">
                                {item.name}
                              </h3>
                              {isLowStock && (
                                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-black uppercase tracking-tighter">
                                  Low Stock
                                </span>
                              )}
                            </div>
                            {item.categoryName && (
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {item.categoryName}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onItemDelete(item.id)}
                          className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                          title="Delete Item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      {/* Main Quantity Display */}
                      <div className="flex items-end justify-between mb-5">
                        <div>
                          <p className={`text-2xl font-black leading-none ${isLowStock ? "text-red-600" : "text-[var(--color-primary)]"}`}>
                            {item.quantity}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                            Current {unitLabels[item.type] || item.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-600">
                            {item.alert} {unitShort[item.type] || item.type}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Minimum Level
                          </p>
                        </div>
                      </div>

                      {/* Stock Level Bar */}
                      <div className="mb-6">
                        <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              isLowStock
                                ? "bg-gradient-to-r from-red-500 to-[var(--color-primary)]"
                                : stockPercent > 60
                                  ? "bg-gradient-to-r from-[var(--color-primary-border)] to-[var(--color-primary)]"
                                  : "bg-gradient-to-r from-[var(--color-primary-border)] to-[var(--color-primary)]"
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Financial Info Cards */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-gray-50/50 rounded-2xl px-3.5 py-2.5 border border-gray-100/50">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Net Price
                          </p>
                          <p className="text-sm font-black text-gray-800">
                            ₹{Number(item.nte_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-[var(--color-primary-tint)]/50 rounded-2xl px-3.5 py-2.5 border border-[var(--color-primary-border)]/20">
                          <p className="text-[9px] font-bold text-[var(--color-primary-text)] opacity-60 uppercase tracking-widest mb-1">
                            Stock Value
                          </p>
                          <p className="text-sm font-black text-[var(--color-primary)]">
                            ₹{Number(item.total_price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex gap-3">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary-light)] text-[var(--color-primary-text)] rounded-2xl cursor-pointer transition-all duration-200 text-xs font-black uppercase tracking-wider active:scale-95"
                          onClick={() => handleIncreaseItem(item)}
                        >
                          <FiPlus size={14} />
                          <span>Stock In</span>
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl cursor-pointer transition-all duration-200 text-xs font-black uppercase tracking-wider active:scale-95"
                          onClick={() => handleDecreaseItem(item)}
                        >
                          <FiMinus size={14} />
                          <span>Stock Out</span>
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
