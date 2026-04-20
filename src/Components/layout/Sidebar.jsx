/* eslint-disable react/prop-types */
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dish01Icon,
  Invoice02Icon,
  MenuRestaurantIcon,
  MoneyReceiveSquareIcon,
  Note03Icon,
  NoteEditIcon,
  StickyNote02Icon,
  TaskAdd01Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";
import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BaseImage from "../common/BaseImage";
import { FiUsers, FiFileText } from "react-icons/fi";

const menuItems = [
  {
    name: "Create Dish",
    path: "/dish",
    icon: <HugeiconsIcon icon={Dish01Icon} size={24} color="#845cbd" />,
  },
  {
    name: "Category",
    path: "/category",
    icon: <HugeiconsIcon icon={MenuRestaurantIcon} size={24} color="#845cbd" />,
  },
  {
    name: "Quotation",
    path: "/quotation",
    icon: <HugeiconsIcon icon={NoteEditIcon} size={24} color="#845cbd" />,
  },
  {
    name: "All Order",
    path: "/all-order",
    icon: <HugeiconsIcon icon={Note03Icon} size={24} color="#845cbd" />,
  },
  {
    name: "Invoice",
    path: "/invoice",
    icon: <HugeiconsIcon icon={Invoice02Icon} size={24} color="#845cbd" />,
  },
  {
    name: "Stock",
    path: "/stock",
    icon: <HugeiconsIcon icon={StickyNote02Icon} size={24} color="#845cbd" />,
  },
  {
    name: "Payment History",
    path: "/payment-history",
    icon: (
      <HugeiconsIcon icon={TransactionHistoryIcon} size={24} color="#845cbd" />
    ),
  },
  {
    name: "Expense",
    path: "/expense",
    icon: (
      <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={24} color="#845cbd" />
    ),
  },
  {
    name: "Create Ingredient",
    path: "/create-recipe-ingredient",
    icon: <HugeiconsIcon icon={TaskAdd01Icon} size={24} color="#845cbd" />,
  },
  {
    name: "People",
    path: "/people",
    icon: <FiUsers size={24} color="#845cbd" />,
  },
  {
    name: "Event Summary",
    path: "/event-summary",
    icon: <FiFileText size={24} color="#845cbd" />,
  },
  {
    name: "Ground Checklist",
    path: "/ground-checklist",
    icon: <HugeiconsIcon icon={TaskAdd01Icon} size={24} color="#845cbd" />,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setSidebarOpen]);

  // Open sidebar when mouse is within 15px of the left edge
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!sidebarOpen && event.clientX <= 15) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sidebarOpen, setSidebarOpen]);

  // Close sidebar when any menu item is clicked
  const handleItemClick = () => {
    setSidebarOpen(false);
  };

  const activePaths = {
    "/dish": ["/dish", "/edit-dish", "/edit-item", "/pdf", "/edit-order-pdf"],
    "/category": [
      "/category",
      "/create-category",
      "/create-item",
      "/item-recipe",
      "/create-ingredient",
      "/edit-ingredient",
    ],
    "/quotation": ["/quotation", "/quotation-pdf/"],
    "/all-order": [
      "/all-order",
      "/order-pdf/",
      "/share-order-pdf",
      "/view-ingredient",
      "/share-ingredient",
      "/share-ingredient-pdf",
      "/share-full-ingredient-pdf",
      "/share-outsourced",
      "/share-outsourced-pdf",
    ],
    "/invoice": ["/invoice", "/invoice-order-pdf/", "/complete-invoice"],
    "/user": ["/user", "/add-rule"],
    "/people": [
      "/people",
      "/event-staff",
      "/vendor",
      "/waiter-types",
      "/add-staff",
      "/edit-staff",
      "/add-vendor",
      "/edit-vendor",
      "/staff-detail",
      "/fixed-staff-payments",
    ],
    "/create-recipe-ingredient": [
      "/create-recipe-ingredient",
      "/add-ingredient-item",
    ],
    "/event-summary": ["/event-summary"],
    "/ground-checklist": ["/ground-checklist", "/ground-categories", "/ground-items"],
  };

  const isMenuItemActive = (itemPath) => {
    return (
      activePaths[itemPath]?.some((path) =>
        location.pathname.startsWith(path)
      ) || location.pathname === itemPath
    );
  };

  return (
    <>
      {/* Backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed top-0 left-0 h-screen max-h-screen w-72 bg-[#fcfcfd] border-r-2 border-gray-100 z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-center">
          <BaseImage src="/logo1.png" alt="Logo" className="h-20" />
        </div>
        <ul className="space-y-4 text-black p-4">
          {menuItems.map((item, index) => {
            return (
              <li key={index} className="space-y-1">
                <div
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isMenuItemActive(item.path) 
                        ? "bg-[#845cbd] text-white shadow-lg shadow-[#845cbd]/20" 
                        : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Link 
                    to={item.path}
                    className="flex items-center space-x-4 flex-1"
                    onClick={handleItemClick}
                  >
                    <div className={`p-2 rounded-xl transition-colors bg-white  ${
                      isMenuItemActive(item.path) ? "" : "shadow-sm"
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-semibold text-[15px]">{item.name}</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
