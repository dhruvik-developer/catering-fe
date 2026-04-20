import { Link, useLocation } from "react-router-dom";
import { FiBriefcase, FiTruck, FiUsers } from "react-icons/fi";

const tabs = [
  {
    label: "Event Staff",
    description: "Manage staff profiles, roles, and staffing rates.",
    icon: FiUsers,
    path: "/people/event-staff",
  },
  {
    label: "Vendor",
    description: "Track suppliers and category-wise vendor pricing.",
    icon: FiTruck,
    path: "/people/vendor",
  },
  {
    label: "Waiter Types",
    description: "Define waiter categories and per-person pricing.",
    icon: FiBriefcase,
    path: "/people/waiter-types",
  },
];

function PeopleTabs() {
  const location = useLocation();

  return (
    <div className="rounded-2xl border border-[#ede7f6] bg-white p-2 shadow-sm">
      <nav
        className="flex flex-col gap-2 md:flex-row"
        aria-label="People module sections"
      >
        {tabs.map((tab) => {
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

export default PeopleTabs;
