import { Link, useLocation } from "react-router-dom";
import { FiClipboard, FiFileText, FiFile, FiBarChart2 } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

const tabs = [
  {
    label: "Quotation",
    description: "Create and manage customer quotations.",
    icon: FiFileText,
    path: "/order-management/quotation",
    requiredPermission: "quotations.view",
  },
  {
    label: "All Order",
    description: "Track and manage all event orders.",
    icon: FiClipboard,
    path: "/order-management/all-order",
    requiredPermission: "event_bookings.view",
  },
  {
    label: "Invoice",
    description: "Generate and complete billing invoices.",
    icon: FiFile,
    path: "/order-management/invoice",
    requiredPermission: "invoices.view",
  },
  {
    label: "Event Summary",
    description: "View event-level reports and summaries.",
    icon: FiBarChart2,
    path: "/order-management/event-summary",
    requiredPermission: "event_summary.view",
  },
];

function OrderManagementTabs() {
  const location = useLocation();
  const { hasPermission } = usePermissions();

  return (
    <div className="rounded-2xl border border-[#ede7f6] bg-white p-2 shadow-sm">
      <nav
        className="flex flex-col gap-2 md:flex-row"
        aria-label="Order management sections"
      >
        {tabs.map((tab) => {
          if (tab.requiredPermission && !hasPermission(tab.requiredPermission)) {
            return null;
          }
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`group flex flex-1 items-start gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "border-[#845cbd] bg-gradient-to-r from-[#845cbd] to-[#6f49a9] text-white shadow-lg shadow-[#845cbd]/15"
                  : "border-transparent bg-transparent text-gray-600 hover:border-[#ede7f6] hover:bg-[#faf8fd]"
              }`}
            >
              <div
                className={`mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-[#f4effc] text-[#845cbd] group-hover:bg-white"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold sm:text-base">{tab.label}</p>
                <p
                  className={`mt-1 text-xs leading-5 sm:text-sm ${
                    isActive ? "text-white/75" : "text-gray-400"
                  }`}
                >
                  {tab.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default OrderManagementTabs;
