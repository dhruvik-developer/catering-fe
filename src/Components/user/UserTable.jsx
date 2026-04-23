/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import { FiEdit2, FiUsers } from "react-icons/fi";
import EmptyState from "../common/EmptyState";

function UsersTable({ users, onUserEdit, onUserDelete }) {
  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers size={24} />}
        title="No Users Available"
        message='Use the "Add User" button to create new users.'
      />
    );
  }

  return (
    <div className="w-full">
      {/* Mobile card layout */}
      <div className="md:hidden flex flex-col gap-3">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:border-[var(--color-primary-border)] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-border)] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {user.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">
                  #{(index + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <p className="font-bold text-gray-900 text-sm truncate">
                {user.username || "N/A"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email || "-"}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onUserEdit(user.id)}
                title="Edit Password"
                className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer"
              >
                <FiEdit2 size={15} />
              </button>
              <button
                onClick={() => onUserDelete(user.id)}
                title="Delete User"
                className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[640px] w-full border-separate" style={{ borderSpacing: "0 8px" }}>
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-3 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                #
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Email
              </th>
              <th className="px-6 py-3 text-center text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="bg-white hover:bg-[var(--color-primary-tint)] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(132,92,189,0.08)] group rounded-xl"
              >
                <td className="px-6 py-4 first:rounded-l-xl last:rounded-r-xl border-y border-transparent group-hover:border-[var(--color-primary-border)] first:border-l last:border-r font-medium text-gray-500 w-12">
                  {(index + 1).toString().padStart(2, "0")}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-border)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="font-bold text-gray-800 text-[15px]">
                      {user.username || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] font-medium text-gray-500">
                  {user.email || "-"}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center first:rounded-l-xl last:rounded-r-xl first:border-l last:border-r">
                  <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onUserEdit(user.id)}
                      title="Edit Password"
                      className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer shadow-sm border border-transparent hover:border-[var(--color-primary-border)]/30"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onUserDelete(user.id)}
                      title="Delete User"
                      className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shadow-sm border border-transparent hover:border-red-100"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;
