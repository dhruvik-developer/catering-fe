import { Link, useLocation } from "react-router-dom";
import { FiClipboard, FiFileText, FiFile, FiBarChart2 } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

const tabs = [
  {
    label: "Quotation",
    icon: FiFileText,
    path: "/order-management/quotation",
    requiredPermission: "quotations.view",
  },
  {
    label: "All Order",
    icon: FiClipboard,
    path: "/order-management/all-order",
    requiredPermission: "event_bookings.view",
  },
  {
    label: "Invoice",
    icon: FiFile,
    path: "/order-management/invoice",
    requiredPermission: "invoices.view",
  },
  {
    label: "Event Summary",
    icon: FiBarChart2,
    path: "/order-management/event-summary",
    requiredPermission: "event_summary.view",
  },
];

function OrderManagementTabs() {
  const location = useLocation();
  const { hasPermission } = usePermissions();

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-white/80 p-2 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.55)] backdrop-blur">
      <nav
        className="flex flex-col gap-2 md:flex-row"
        aria-label="Order management sections"
      >
        {tabs.map((tab) => {
          if (
            tab.requiredPermission &&
            !hasPermission(tab.requiredPermission)
          ) {
            return null;
          }
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`group flex flex-1 items-center gap-3 rounded-2xl border px-4 py-2 transition-all duration-200 ${
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                  : "border-transparent bg-transparent text-gray-600 hover:border-[var(--app-border)] hover:bg-white/70"
              }`}
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-white/70 text-[var(--color-primary)] group-hover:bg-white"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold sm:text-base">
                  {tab.label}
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
