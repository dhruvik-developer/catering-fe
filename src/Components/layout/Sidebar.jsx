/* eslint-disable react/prop-types */
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dish01Icon,
  MenuRestaurantIcon,
  MoneyReceiveSquareIcon,
  Note03Icon,
  StickyNote02Icon,
  TaskAdd01Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";
import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import { getAllBusinessProfiles } from "../../api/BusinessProfile";

const menuItems = [
  {
    name: "Create Dish",
    path: "/dish",
    icon: <HugeiconsIcon icon={Dish01Icon} size={24} color="var(--color-primary)" />,
    requiredPermission: "dishes.view",
  },
  {
    name: "Category",
    path: "/category",
    icon: <HugeiconsIcon icon={MenuRestaurantIcon} size={24} color="var(--color-primary)" />,
    requiredPermission: "categories.view",
  },
  {
    name: "Order Management",
    path: "/order-management",
    icon: <HugeiconsIcon icon={Note03Icon} size={24} color="var(--color-primary)" />,
    requiredPermission: [
      "quotations.view",
      "event_bookings.view",
      "invoices.view",
      "event_summary.view",
    ],
  },
  {
    name: "Stock",
    path: "/stock",
    icon: <HugeiconsIcon icon={StickyNote02Icon} size={24} color="var(--color-primary)" />,
    requiredPermission: "stock.view",
  },
  {
    name: "Payment History",
    path: "/payment-history",
    icon: (
      <HugeiconsIcon icon={TransactionHistoryIcon} size={24} color="var(--color-primary)" />
    ),
    requiredPermission: "payments.view",
  },
  {
    name: "Expense",
    path: "/expense",
    icon: (
      <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={24} color="var(--color-primary)" />
    ),
    requiredPermission: "expenses.view",
  },
  {
    name: "Create Ingredient",
    path: "/create-recipe-ingredient",
    icon: <HugeiconsIcon icon={TaskAdd01Icon} size={24} color="var(--color-primary)" />,
    requiredPermission: "ingredients.view",
  },
  {
    name: "People",
    path: "/people",
    icon: <FiUsers size={24} color="var(--color-primary)" />,
    requiredPermission: ["vendors.view", "eventstaff.view"],
  },
  {
    name: "Ground Checklist",
    path: "/ground-checklist",
    icon: <HugeiconsIcon icon={TaskAdd01Icon} size={24} color="var(--color-primary)" />,
    requiredPermission: "ground.view",
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const [businessLogo, setBusinessLogo] = useState("");
  const [isLogoLoading, setIsLogoLoading] = useState(true);

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

  useEffect(() => {
    const fetchBusinessLogo = async () => {
      try {
        const response = await getAllBusinessProfiles();
        const profileList = Array.isArray(response?.data)
          ? response.data
          : response?.data
            ? [response.data]
            : [];

        if (profileList.length > 0) {
          setBusinessLogo(profileList[0]?.logo || "");
        } else {
          setBusinessLogo("");
        }
      } catch (error) {
        console.error("Failed to load business logo:", error);
        setBusinessLogo("");
      } finally {
        setIsLogoLoading(false);
      }
    };

    fetchBusinessLogo();
  }, []);

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
    "/order-management": [
      "/order-management",
      "/quotation",
      "/all-order",
      "/invoice",
      "/order-management/quotation",
      "/order-management/all-order",
      "/order-management/invoice",
      "/order-management/event-summary",
      "/quotation-pdf/",
      "/order-pdf/",
      "/share-order-pdf",
      "/view-ingredient",
      "/share-ingredient",
      "/share-ingredient-pdf",
      "/share-full-ingredient-pdf",
      "/share-outsourced",
      "/share-outsourced-pdf",
      "/invoice-order-pdf/",
      "/invoice-bill-pdf/",
      "/complete-invoice",
      "/event-summary",
    ],
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
        className={`fixed top-0 left-0 h-screen max-h-screen w-72 bg-[var(--color-primary-tint)] border-r-2 border-gray-100 z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col items-center gap-2">
          {isLogoLoading ? (
            <div className="h-20 w-40 rounded-lg bg-gray-100 animate-pulse" />
          ) : businessLogo ? (
            <img
              src={businessLogo}
              alt="Business Logo"
              className="h-20 max-w-[180px] object-contain"
              onError={() => setBusinessLogo("")}
            />
          ) : (
            <>
              <p className="text-[11px] text-center text-gray-500 leading-4">
                Set your business profile logo in Settings tab.
              </p>
              <Link
                to="/settings"
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                onClick={handleItemClick}
              >
                Go to Settings
              </Link>
            </>
          )}
        </div>
        <ul className="space-y-4 text-black p-4">
          {menuItems.map((item, index) => {
            if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
              return null;
            }
            const parentActive = isMenuItemActive(item.path);

            return (
              <li key={index} className="space-y-1">
                <div
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    parentActive
                        ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" 
                        : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Link
                    to={item.path}
                    className="flex items-center space-x-4 flex-1"
                    onClick={handleItemClick}
                  >
                    <div className={`p-2 rounded-xl transition-colors bg-white  ${
                      parentActive ? "" : "shadow-sm"
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
