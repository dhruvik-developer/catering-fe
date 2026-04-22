import { Link, useLocation } from "react-router-dom";
import { FiBriefcase, FiLock, FiTruck, FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";

const tabs = [
  {
    label: "Event Staff",
    icon: FiUsers,
    path: "/people/event-staff",
    requiredPermission: "eventstaff.view",
  },
  {
    label: "Vendor",
    icon: FiTruck,
    path: "/people/vendor",
    requiredPermission: "vendors.view",
  },
  {
    label: "Waiter Types",
    icon: FiBriefcase,
    path: "/people/waiter-types",
    requiredPermission: "eventstaff.view", // Waiters are part of eventstaff
  },
  {
    label: "Permissions",
    icon: FiLock,
    path: "/people/permissions",
    requiredPermission: "*", // Only superuser/admin can manage permissions
  },
];

function PeopleTabs() {
  const location = useLocation();
  const { hasPermission } = usePermissions();

  return (
    <div className="rounded-2xl border border-[var(--color-primary-border)] bg-white p-2 shadow-sm">
      <nav
        className="flex flex-col gap-2 md:flex-row"
        aria-label="People module sections"
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
              className={`group flex flex-1 items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all duration-200 ${
                isActive
                  ? "border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg shadow-[var(--color-primary)]/15"
                  : "border-transparent bg-transparent text-gray-600 hover:border-[var(--color-primary-border)] hover:bg-[var(--color-primary-tint)]"
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-[var(--color-primary-soft)] text-[var(--color-primary)] group-hover:bg-white"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold sm:text-base">{tab.label}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default PeopleTabs;
