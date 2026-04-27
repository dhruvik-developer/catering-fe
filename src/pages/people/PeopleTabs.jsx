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
    requiredPermission: "users.view", // Admin can manage permissions if they have users.view
  },
];

function PeopleTabs() {
  const location = useLocation();
  const { hasPermission } = usePermissions();

  return (
    <div className="mb-4 rounded-[24px] bg-[var(--color-primary-tint)] p-2 shadow-sm">
      <nav
        className="flex flex-col gap-2 md:flex-row"
        aria-label="People module sections"
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
              className={`group flex flex-1 items-center justify-center gap-3 rounded-[20px] px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "bg-transparent text-[var(--color-primary-text)] hover:bg-white/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white text-[var(--color-primary)] shadow-sm group-hover:shadow"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm sm:text-base ${isActive ? "font-bold" : "font-semibold"}`}>
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

export default PeopleTabs;
