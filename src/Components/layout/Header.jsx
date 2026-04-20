/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { TbLogout2 } from "react-icons/tb";
import {
  FiMenu,
  FiChevronDown,
  FiUsers,
  FiAlertTriangle,
  FiCalendar,
  FiClipboard,
  FiHome,
  FiChevronRight,
  FiChevronLeft,
  FiSettings,
  FiBox,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getStockCategory } from "../../apis/FetchStockCategory";
import { getAllOrder } from "../../apis/FetchAllOrder";
import toast from "react-hot-toast";

// Parse date string in dd-mm-yyyy OR yyyy-mm-dd format
function parseDate(str) {
  if (!str) return null;
  const ddmmyyyy = str.match(/^(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})$/);
  if (ddmmyyyy)
    return new Date(
      Number(ddmmyyyy[3]),
      Number(ddmmyyyy[2]) - 1,
      Number(ddmmyyyy[1])
    );
  const yyyymmdd = str.match(/^(\d{4})[\-\/](\d{1,2})[\-\/](\d{1,2})/);
  if (yyyymmdd)
    return new Date(
      Number(yyyymmdd[1]),
      Number(yyyymmdd[2]) - 1,
      Number(yyyymmdd[3])
    );
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Route-to-label mapping for breadcrumbs
const routeLabels = {
  dish: "Create Dish",
  category: "Category",
  quotation: "Quotation",
  "all-order": "All Orders",
  invoice: "Invoice",
  stock: "Stock",
  "payment-history": "Payment History",
  expense: "Expense",
  "recipe-ingredient": "Recipe Ingredient",
  "create-recipe-ingredient": "Create Ingredient",
  "create-ingredient": "Add Ingredient",
  "add-ingredient-item": "Add Item",
  "edit-ingredient": "Edit Ingredient",
  "item-recipe": "Item Recipe",
  "view-ingredient": "View Ingredient",
  "share-ingredient": "Share Ingredient",
  user: "Users",
  "add-user": "Add User",
  "edit-user": "Edit User",
  radha: "radha",
  item: "Items",
  "create-item": "Create Item",
  "edit-dish": "Edit Order",
  "edit-item": "Edit Item",
  "order-pdf": "Order PDF",
  "edit-order-pdf": "Edit Order PDF",
  "share-order-pdf": "Share Order",
  "share-ingredient-pdf": "Share Ingredient PDF",
  "share-outsourced": "Share Outsourced Items",
  "share-outsourced-pdf": "Share Outsourced Items PDF",
  "share-full-ingredient-pdf": "Share Full Ingredient PDF",
  "quotation-pdf": "Quotation PDF",
  "invoice-order-pdf": "Invoice Order PDF",
  "invoice-bill-pdf": "Bill PDF",
  "complete-invoice-pdf": "Complete Invoice PDF",
  "add-category": "Add Category",
  "create-category": "Create Category",
  "add-rule": "Rules",
  calendar: "Calendar",
  people: "People",
  vendor: "Vendor",
  "add-vendor": "Add Vendor",
  "edit-vendor": "Edit Vendor",
  "view-order-details": "Order Details",
  "event-staff": "Event Staff",
  "waiter-types": "Waiter Types",
  "add-staff": "Add Staff",
  "edit-staff": "Edit Staff",
  "event-assignments": "Event Assignments",
  "add-assignment": "Add Assignment",
  "edit-assignment": "Edit Assignment",
  "event-summary": "Event Summary",
  "staff-detail": "Staff Detail",
  "fixed-staff-payments": "Fixed Staff Payments",
  "gst-billing": "GST Billing",
  "ground-checklist": "Ground Checklist",
  "ground-categories": "Ground Categories",
  "ground-items": "Ground Items",
  settings: "Settings",
  "session-checklist-preview": "Session Checklist",
  "dish-tags-pdf": "Dish Tags PDF",
};

// Parent route mapping for nested pages
const parentRoutes = {
  item: "/category",
  "create-item": "/category",
  "create-category": "/category",
  "item-recipe": "/category",
  "create-ingredient": "/category",
  "edit-ingredient": "/category",
  "add-ingredient-item": "/create-recipe-ingredient",
  "edit-dish": "/all-order",
  "edit-item": "/all-order",
  "order-pdf": "/all-order",
  "edit-order-pdf": "/all-order",
  "share-order-pdf": "/all-order",
  "share-ingredient": "/all-order",
  "share-ingredient-pdf": "/all-order",
  "share-outsourced": "/all-order",
  "share-outsourced-pdf": "/all-order",
  "share-full-ingredient-pdf": "/all-order",
  "view-ingredient": "/all-order",
  "view-order-details": "/all-order",
  "quotation-pdf": "/quotation",
  "invoice-order-pdf": "/invoice",
  "invoice-bill-pdf": "/invoice",
  "complete-invoice-pdf": "/invoice",
  "add-user": "/user",
  "edit-user": "/user",
  "add-rule": "/user",
  vendor: "/people",
  "add-vendor": "/people/vendor",
  "edit-vendor": "/people/vendor",
  "event-staff": "/people",
  "waiter-types": "/people",
  "add-staff": "/people/event-staff",
  "edit-staff": "/people/event-staff",
  "staff-detail": "/people/event-staff",
  "fixed-staff-payments": "/people/event-staff",
  "event-assignments": "/all-order",
  "add-assignment": "/event-assignments",
  "edit-assignment": "/event-assignments",
  pdf: "/dish",
  "dish-tags-pdf": "/dish",
  "session-checklist-preview": "/all-order",
  "ground-categories": "/ground-checklist",
  "ground-items": "/ground-checklist",
};

// Mini Calendar Component
const MiniCalendar = ({ onDateSelect, onClose, orderDates = new Set() }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const today = new Date();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const handleDayClick = (day) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    onDateSelect(`${yyyy}-${mm}-${dd}`);
    onClose();
  };

  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth.getMonth() &&
    today.getFullYear() === currentMonth.getFullYear();

  const hasOrder = (day) => {
    const yyyy = currentMonth.getFullYear();
    const mm = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return orderDates.has(`${yyyy}-${mm}-${dd}`);
  };

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`} />
  ));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 p-4 border border-gray-100 w-[280px]">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[#f4effc] text-gray-500 hover:text-[#845cbd] transition-colors cursor-pointer"
        >
          <FiChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[#f4effc] text-gray-500 hover:text-[#845cbd] transition-colors cursor-pointer"
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-1">
        {blanks}
        {days.map((day) => {
          const todayFlag = isToday(day);
          const orderFlag = hasOrder(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                                ${
                                  todayFlag
                                    ? "bg-[#845cbd] text-white font-bold shadow-sm"
                                    : orderFlag
                                      ? "bg-[#f4effc] text-[#845cbd] font-semibold ring-1 ring-[#845cbd]/30"
                                      : "text-gray-600 hover:bg-[#f4effc] hover:text-[#845cbd]"
                                }`}
            >
              {day}
              {orderFlag && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${todayFlag ? "bg-white" : "bg-[#845cbd]"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#845cbd]" />
          <span className="text-[10px] text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#f4effc] ring-1 ring-[#845cbd]/30 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-[#845cbd]" />
          </span>
          <span className="text-[10px] text-gray-400">Has Order</span>
        </div>
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [upcomingOrderCount, setUpcomingOrderCount] = useState(0);
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [orderDates, setOrderDates] = useState(new Set());
  const dropdownRef = useRef(null);
  const calendarRef = useRef(null);
  const upcomingRef = useRef(null);
  const lowStockRef = useRef(null);
  const { username, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = username || "User";
  const initial = displayName.charAt(0).toUpperCase();

  // Build breadcrumbs from the current path
  const breadcrumbs = useMemo(() => {
    const path = (location.pathname || "")
      .replace(/^\//, "")
      .replace(/\/$/, "");
    if (!path) return [];
    const segments = path.split("/");
    let crumbs = [];

    // Routes that require an ID parameter to be valid
    const routesWithId = new Set([
      "view-ingredient",
      "view-order-details",
      "item-recipe",
      "edit-user",
      "edit-vendor",
      "edit-staff",
      "edit-assignment",
      "staff-detail",
      "edit-dish",
      "edit-ingredient",
      "order-pdf",
      "share-order-pdf",
      "quotation-pdf",
      "invoice-order-pdf",
      "invoice-bill-pdf",
      "complete-invoice-pdf",
      "fixed-staff-payments",
      "session-checklist-preview",
    ]);

    // Find any numeric ID in the current URL or from state if passed (e.g., for edit-order-pdf)
    const numericId =
      segments.find((s) => /^\d+$/.test(s)) || location.state?.id;

    // Build dynamic parent routes based on navigation state
    const fromState =
      location.state?.from || location.state?.fromNavigation?.from;
    const dynamicParentRoutes = {
      ...parentRoutes,
      ...location.state?.customParents,
    };

    // If a simple fromState is passed but no customParents, just carefully set the leaf's parent
    if (fromState && !location.state?.customParents) {
      const leaf = [...segments].reverse().find((s) => !/^\d+$/.test(s));
      if (leaf) {
        dynamicParentRoutes[leaf] = `/${fromState}`;
      }
    }

    // 1. Build hierarchy chain from parentRoutes mapping
    // Find the last segment that isn't a numeric ID to start the parent discovery
    const leafSegment = [...segments].reverse().find((s) => !/^\d+$/.test(s));

    if (leafSegment) {
      let currentKey = leafSegment;
      let parentChain = [];
      let visitedKeys = new Set([currentKey]);

      while (dynamicParentRoutes[currentKey]) {
        const parentPath = dynamicParentRoutes[currentKey];

        // Keep parentKey accurate by ignoring any numeric IDs
        const parentSegments = parentPath
          .replace(/^\//, "")
          .split("/")
          .filter(Boolean);
        const parentKey = [...parentSegments]
          .reverse()
          .find((s) => !/^\d+$/.test(s));

        if (parentKey && !visitedKeys.has(parentKey)) {
          visitedKeys.add(parentKey);
          const label =
            routeLabels[parentKey] ||
            parentKey.charAt(0).toUpperCase() +
              parentKey.slice(1).replace(/-/g, " ");

          // If the parent route requires an ID and we have one in the URL, append it
          let finalParentPath = parentPath;
          if (
            routesWithId.has(parentKey) &&
            numericId &&
            !parentPath.includes(numericId)
          ) {
            finalParentPath = `${parentPath}/${numericId}`;
          }

          parentChain.unshift({ label, path: finalParentPath, isLast: false });
          currentKey = parentKey;
        } else {
          break;
        }
      }
      crumbs = parentChain;
    }

    // 2. Add current URL segments
    let currentFullPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentFullPath += `/${segment}`;

      // Skip numeric IDs directly as separate crumbs, unless making the previous crumb's path specific
      if (/^\d+$/.test(segment)) {
        if (crumbs.length > 0) {
          crumbs[crumbs.length - 1].path = currentFullPath;
        }
        continue;
      }

      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      const isLast =
        i === segments.length - 1 ||
        (i < segments.length - 1 &&
          segments.slice(i + 1).every((s) => /^\d+$/.test(s)));

      // Avoid duplicates already added via parent chain
      const existingIndex = crumbs.findIndex(
        (c) =>
          c.path === currentFullPath ||
          c.path === `${currentFullPath}/${numericId}`
      );
      if (existingIndex === -1) {
        crumbs.push({ label, path: currentFullPath, isLast });
      } else {
        crumbs[existingIndex].isLast = isLast;
        if (!isLast && numericId) {
          crumbs[existingIndex].path = `${currentFullPath}/${numericId}`;
        }
      }
    }

    return crumbs;
  }, [location.pathname, location.state]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(event.target))
        setShowCalendar(false);
      if (upcomingRef.current && !upcomingRef.current.contains(event.target))
        setShowUpcoming(false);
      if (lowStockRef.current && !lowStockRef.current.contains(event.target))
        setShowLowStock(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch low stock count & upcoming orders — re-fetch on every page navigation
  useEffect(() => {
    const fetchHeaderData = async () => {
      const [stockResult, orderResult] = await Promise.allSettled([
        getStockCategory(),
        getAllOrder(),
      ]);

      if (stockResult.status === "fulfilled") {
        const stockData = stockResult.value?.data?.data;
        if (stockData && Array.isArray(stockData)) {
          let lowCount = 0;
          const lowItems = [];
          stockData.forEach((cat) => {
            const items = cat.stokeitem || cat.stoke_item || cat.items || [];
            if (Array.isArray(items)) {
              items.forEach((item) => {
                const qty = Number(item.quantity) || 0;
                const alertQty = Number(item.alert) || 0;
                if (alertQty > 0 && qty <= alertQty) {
                  lowCount++;
                  lowItems.push({
                    id: item.id,
                    name: item.name,
                    quantity: qty,
                    alert: alertQty,
                    type: item.type,
                    categoryName: cat.name,
                    categoryId: cat.id,
                  });
                }
              });
            }
          });
          setLowStockCount(lowCount);
          setLowStockItems(lowItems);
        }
      }

      if (orderResult.status === "fulfilled") {
        const orderData = orderResult.value?.data?.data;
        if (orderData) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Collect ALL order dates for calendar highlighting
          const dates = new Set();
          orderData.forEach((order) => {
            const activeEventDate =
              order.sessions && order.sessions.length > 0
                ? order.sessions[0].event_date
                : order.event_date;
            if (activeEventDate) {
              const d = parseDate(activeEventDate);
              if (d && !isNaN(d.getTime())) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                dates.add(`${yyyy}-${mm}-${dd}`);
              }
            }
          });
          setOrderDates(dates);

          // Only count upcoming orders within the next 7 days
          const sevenDaysLater = new Date(today);
          sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
          const upcoming = orderData.filter((order) => {
            const activeEventDate =
              order.sessions && order.sessions.length > 0
                ? order.sessions[0].event_date
                : order.event_date;
            if (!activeEventDate) return false;
            const eventDate = parseDate(activeEventDate);
            return (
              eventDate &&
              eventDate >= today &&
              eventDate <= sevenDaysLater &&
              order.status !== "done" &&
              order.status !== "cancelled" &&
              order.status !== "Completed" &&
              order.status !== "completed"
            );
          });
          // Sort by event_date ascending (soonest first)
          upcoming.sort((a, b) => {
            const dateA =
              a.sessions && a.sessions.length > 0
                ? a.sessions[0].event_date
                : a.event_date;
            const dateB =
              b.sessions && b.sessions.length > 0
                ? b.sessions[0].event_date
                : b.event_date;
            return parseDate(dateA) - parseDate(dateB);
          });
          setUpcomingOrders(upcoming);
          setUpcomingOrderCount(upcoming.length);
        }
      }
    };
    fetchHeaderData();

    // Listen for custom event triggered when an order is completed or cancelled
    window.addEventListener("orderStatusChanged", fetchHeaderData);

    return () => {
      window.removeEventListener("orderStatusChanged", fetchHeaderData);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully!");
    navigate("/login");
  };

  const handleDateSelect = (dateStr) => {
    navigate(`/all-order?date=${dateStr}`);
  };

  return (
    <div className="relative flex items-center justify-between px-3 sm:px-6 py-3 bg-[#845cbd] text-white shadow-md">
      {/* Left Side: Sidebar Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 text-xl hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FiMenu />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          <button
            onClick={() => navigate("/dish")}
            className="flex items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <FiHome size={18} className="stroke-[2.5]" />
          </button>
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <FiChevronRight size={12} className="text-white/40" />
              {crumb.isLast ? (
                <span className="font-medium text-white">{crumb.label}</span>
              ) : (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Side: Badges + Calendar + Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Low Stock Chip + Dropdown */}
        <div className="relative" ref={lowStockRef}>
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${
              lowStockCount > 0
                ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
            title="Low Stock Items"
          >
            <FiAlertTriangle size={12} />
            <span className="hidden sm:inline">{lowStockCount} Low Stock</span>
            <span className="sm:hidden">{lowStockCount}</span>
            {lowStockCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
          </button>

          {/* Low Stock Dropdown */}
          {showLowStock && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 w-[320px] overflow-hidden">
              {/* Dropdown Header */}
              <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle size={14} className="text-red-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      Low Stock Items
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-red-500 bg-white px-2 py-0.5 rounded-full">
                    {lowStockCount} Alert{lowStockCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto">
                {lowStockItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FiBox size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-400">
                      All stock levels are good
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      No items below alert level
                    </p>
                  </div>
                ) : (
                  lowStockItems.map((item) => {
                    const unitShort = {
                      KG: "Kg",
                      G: "g",
                      L: "L",
                      ML: "mL",
                      QTY: "Qty",
                    };
                    const unit = unitShort[item.type] || item.type;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setShowLowStock(false);
                          navigate("/stock", {
                            state: {
                              selectCategoryId: item.categoryId,
                              _ts: Date.now(),
                            },
                          });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50/50 transition-colors duration-150 border-b border-gray-50 last:border-b-0 cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                          <FiBox size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {item.categoryName}
                          </p>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-xs font-bold text-red-500">
                            {item.quantity} {unit}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Min: {item.alert} {unit}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* View All Footer */}
              {lowStockItems.length > 0 && (
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowLowStock(false);
                      navigate("/stock", {
                        state: { view: "low_stock", _ts: Date.now() },
                      });
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    View All Low Stock Items
                    <FiChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Orders Chip + Dropdown */}
        <div className="relative" ref={upcomingRef}>
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${
              upcomingOrderCount > 0
                ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
            title="Upcoming Orders (Next 7 Days)"
          >
            <FiClipboard size={12} />
            <span className="hidden sm:inline">
              {upcomingOrderCount} Upcoming
            </span>
            <span className="sm:hidden">{upcomingOrderCount}</span>
            {upcomingOrderCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Upcoming Orders Dropdown */}
          {showUpcoming && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 w-[320px] overflow-hidden">
              {/* Dropdown Header */}
              <div className="px-4 py-3 bg-[#f4effc] border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClipboard size={14} className="text-[#845cbd]" />
                    <span className="text-sm font-semibold text-gray-700">
                      Upcoming Orders
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-[#845cbd] bg-white px-2 py-0.5 rounded-full">
                    Next 7 Days
                  </span>
                </div>
              </div>

              {/* Orders List */}
              <div className="max-h-[300px] overflow-y-auto">
                {upcomingOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FiClipboard size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-400">
                      No upcoming orders
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      No events in the next 7 days
                    </p>
                  </div>
                ) : (
                  upcomingOrders.map((order) => {
                    const activeEventDate =
                      order.sessions && order.sessions.length > 0
                        ? order.sessions[0].event_date
                        : order.event_date;
                    const eventDate = parseDate(activeEventDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diffDays = eventDate
                      ? Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
                      : -1;
                    const dayLabel =
                      diffDays === 0
                        ? "Today"
                        : diffDays === 1
                          ? "Tomorrow"
                          : `In ${diffDays} days`;

                    return (
                      <button
                        key={order.id}
                        onClick={() => {
                          setShowUpcoming(false);
                          navigate(`/order-pdf/${order.id}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#faf8fd] transition-colors duration-150 border-b border-gray-50 last:border-b-0 cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#f4effc] text-[#845cbd] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {order.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700 truncate">
                            {order.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <FiCalendar size={10} />
                              {order.event_date}
                            </span>
                            {order.event_time && (
                              <span className="text-[11px] text-gray-400">
                                • {order.event_time}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            diffDays === 0
                              ? "bg-red-50 text-red-500"
                              : diffDays === 1
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {dayLabel}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* View All Footer */}
              {upcomingOrders.length > 0 && (
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowUpcoming(false);
                      navigate("/all-order?filter=upcoming");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#845cbd] hover:bg-[#f4effc] transition-colors cursor-pointer"
                  >
                    View All Upcoming Orders
                    <FiChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Calendar Button */}
        <button
          onClick={() => navigate("/calendar")}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          title="View orders by date"
        >
          <FiCalendar size={15} className="text-white/80" />
          <span className="text-xs font-medium text-white/80 hidden md:inline">
            Calendar
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-white/90 hover:bg-white pl-4 pr-3 py-1.5 rounded-full focus:outline-none cursor-pointer transition-all duration-300 shadow-sm"
          >
            <span className="hidden sm:inline text-sm font-semibold text-[#845cbd]">
              {displayName}
            </span>
            <div className="w-9 h-9 rounded-full bg-[#845cbd] flex items-center justify-center text-white font-bold text-sm">
              {initial}
            </div>
            <FiChevronDown
              className={`text-[#845cbd] text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 transition-all duration-200 origin-top-right ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/user");
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-[#f4effc] hover:text-[#845cbd] transition-colors duration-200 cursor-pointer"
            >
              <FiUsers size={16} />
              <span className="font-medium">Users</span>
            </button>
            <hr className="border-gray-100" />
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/settings");
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-600 hover:bg-[#f4effc] hover:text-[#845cbd] transition-colors duration-200 cursor-pointer"
            >
              <FiSettings size={16} />
              <span className="font-medium">Settings</span>
            </button>
            <hr className="border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
            >
              <TbLogout2 size={16} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
