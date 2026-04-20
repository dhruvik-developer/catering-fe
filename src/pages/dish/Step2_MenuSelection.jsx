/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  FiSearch,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";
import Loader from "../../Components/common/Loader";

function Step2_MenuSelection({
  formData,
  errors,
  dishesList,
  isDishesLoading,
  handleSlotDishesUpdate,
  onNext,
  onBack,
}) {
  // Flatten all timeslots into tabs: { dayIndex, slotIndex, label, date }
  const tabs = useMemo(() => {
    const result = [];
    formData.schedule.forEach((day, dIdx) => {
      const dateObj = new Date(day.event_date);
      const pad = (n) => n.toString().padStart(2, "0");
      const dateStr = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}`;
      day.timeSlots.forEach((slot, sIdx) => {
        result.push({
          dIdx,
          sIdx,
          label: slot.timeLabel || `Slot ${sIdx + 1}`,
          dateStr,
          dayLabel: `Day ${dIdx + 1}`,
          fullLabel: `${slot.timeLabel || `Slot ${sIdx + 1}`} - ${dateStr}`,
          dishes: slot.dishes || [],
        });
      });
    });
    return result;
  }, [formData.schedule]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Sort categories by position
  const categoriesList = useMemo(
    () =>
      [...dishesList].sort(
        (a, b) => (a.positions || 999) - (b.positions || 999)
      ),
    [dishesList]
  );

  // Set initial active category when dishes load
  useMemo(() => {
    if (categoriesList.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categoriesList[0].id);
    }
  }, [categoriesList]);

  // Current tab data
  const activeTab = tabs[activeTabIndex];
  const currentDishes = activeTab ? activeTab.dishes : [];

  // Filtered categories for sidebar search
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categoriesList;
    return categoriesList.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categoriesList, categorySearchQuery]);

  // Active category items
  const activeCategory = categoriesList.find((c) => c.id === activeCategoryId);
  const categoryItems = useMemo(() => {
    const items = activeCategory?.items || [];
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery]);

  // Check if a dish is selected in the current tab
  const isDishSelected = (dishId) => {
    return currentDishes.some((d) => d.dishId === dishId);
  };

  // Toggle dish selection for the active tab
  const toggleDish = (dish) => {
    if (!activeTab) return;
    const { dIdx, sIdx } = activeTab;
    const existing = currentDishes.find((d) => d.dishId === dish.id);
    let newDishes;
    if (existing) {
      newDishes = currentDishes.filter((d) => d.dishId !== dish.id);
    } else {
      newDishes = [
        ...currentDishes,
        {
          dishId: dish.id,
          dishName: dish.name,
          categoryName: activeCategory?.name || "Dishes",
          selectionRate: parseFloat(dish.selection_rate) || 0,
          baseCost: parseFloat(dish.base_cost) || 0,
        },
      ];
    }
    handleSlotDishesUpdate(dIdx, sIdx, newDishes);
  };

  // Total selected across all tabs
  const totalSelectedAll = useMemo(() => {
    let count = 0;
    formData.schedule.forEach((day) => {
      day.timeSlots.forEach((slot) => {
        count += slot.dishes?.length || 0;
      });
    });
    return count;
  }, [formData.schedule]);

  // Count selected in category for current tab
  const getSelectedCountForCategory = (catId) => {
    const cat = categoriesList.find((c) => c.id === catId);
    if (!cat) return 0;
    return (cat.items || []).filter((item) => isDishSelected(item.id)).length;
  };

  if (!activeTab) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">
          No event timings defined. Please go back and add event dates with time
          slots.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-6 py-2 text-[#845cbd] border border-[#845cbd] rounded-lg font-semibold hover:bg-purple-50 transition-colors"
        >
          <FiArrowLeft className="inline mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* ====== Event Timing Tabs ====== */}
      <div className="border-b border-gray-200 bg-gray-50 rounded-t-xl -mx-6 -mt-6 px-6 pt-4 mb-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-0 scrollbar-thin">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTabIndex;
            const dishCount = tab.dishes.length;
            return (
              <button
                key={`${tab.dIdx}-${tab.sIdx}`}
                type="button"
                onClick={() => {
                  setActiveTabIndex(idx);
                  setSearchQuery("");
                }}
                className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap rounded-t-xl transition-all duration-200 border border-b-0 ${
                  isActive
                    ? "bg-white text-[#845cbd] border-gray-200 shadow-sm"
                    : "bg-transparent text-gray-500 border-transparent hover:bg-white/60 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-wider">{tab.label}</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {tab.dateStr}
                  </span>
                  {dishCount > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-[#845cbd] text-white text-[10px] font-bold flex items-center justify-center">
                      {dishCount}
                    </span>
                  )}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#845cbd]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====== Main Content: Sidebar + Grid ====== */}
      <div
        className="flex border border-gray-200 rounded-b-xl overflow-hidden h-[calc(100vh-280px)]"
        style={{ marginTop: 0 }}
      >
        {/* ---- Left Sidebar: Categories ---- */}
        <div className="w-56 min-w-[14rem] bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Search bar in sidebar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <FiSearch
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search category..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] bg-white transition-all"
              />
            </div>
          </div>

          {/* Category list */}
          <div className="flex-1 overflow-y-auto">
            {filteredCategories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              const selectedCount = getSelectedCountForCategory(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-all duration-150 flex items-center justify-between group ${
                    isActive
                      ? "bg-white border-[#845cbd] text-[#845cbd] shadow-sm"
                      : "border-transparent text-gray-600 hover:bg-white/70 hover:text-gray-800"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCount > 0 && (
                    <span
                      className={`ml-2 min-w-[20px] h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive
                          ? "bg-[#845cbd] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Right: Dish Grid ---- */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Search + Stats Bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative flex-1 max-w-sm">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  This Event
                </p>
                <p className="text-sm font-bold text-[#845cbd]">
                  {currentDishes.length} dishes
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  All Events
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {totalSelectedAll} dishes
                </p>
              </div>
            </div>
          </div>

          {/* Dish Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {isDishesLoading ? (
              <div className="flex justify-center items-center h-full py-20">
                <Loader fullScreen={false} />
              </div>
            ) : categoryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                <FiGrid size={48} className="mb-3 opacity-30" />
                <p className="text-base font-medium">No dishes found</p>
                <p className="text-sm mt-1">
                  Try selecting a different category or adjusting your search
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {categoryItems.map((dish) => {
                  const selected = isDishSelected(dish.id);
                  return (
                    <div
                      key={dish.id}
                      onClick={() => toggleDish(dish)}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group min-h-[90px] flex flex-col justify-center ${
                        selected
                          ? "border-[#845cbd] bg-[#f4effc] shadow-md shadow-[#845cbd]/10"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Selection indicator */}
                      {selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#845cbd] text-white flex items-center justify-center shadow-sm">
                          <FiCheck size={13} strokeWidth={3} />
                        </div>
                      )}

                      <p
                        className={`text-sm font-semibold leading-snug ${selected ? "text-[#845cbd]" : "text-gray-700 group-hover:text-gray-900"}`}
                      >
                        {dish.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== Footer: Selected Dishes Summary + Navigation ====== */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-6">
          {/* Quick summary chips */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {tabs.map((tab, idx) => (
              <span
                key={idx}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  tab.dishes.length > 0
                    ? "bg-[#845cbd]/10 text-[#845cbd]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {tab.label}: {tab.dishes.length}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 font-bold text-white bg-[#845cbd] hover:bg-[#7350a8] rounded-xl shadow-lg shadow-[#845cbd]/20 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            Continue to Summary <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step2_MenuSelection;
