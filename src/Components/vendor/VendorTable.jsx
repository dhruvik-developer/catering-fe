/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import { FiEdit2, FiUsers } from "react-icons/fi";
import usePermissions from "../../hooks/usePermissions";
import EmptyState from "../common/EmptyState";

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${active ? "bg-[var(--color-primary-tint)] text-[var(--color-primary-text)] border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? "bg-emerald-500" : "bg-red-500"}`}
      ></span>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CategoryChips({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <span className="text-gray-400 text-xs italic">No categories</span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((vc) => (
        <span
          key={vc.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-sm"
        >
          <span>{vc.category_name}</span>
          {vc.price != null && (
            <span className="text-[var(--color-primary-light)] bg-white px-1.5 py-0.5 rounded-md text-[10px]">
              ₹{vc.price}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function VendorTable({ vendors, onVendorEdit, onVendorDelete }) {
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission("vendors.update");
  const canDelete = hasPermission("vendors.delete");

  if (!vendors || vendors.length === 0) {
    return (
      <EmptyState
        icon={<FiUsers size={24} />}
        title="No Vendors Available"
        message='Use the "Add Vendor" button to register new vendors and they will appear here.'
      />
    );
  }

  return (
    <div className="w-full">
      {/* Mobile card layout */}
      <div className="md:hidden flex flex-col gap-3">
        {vendors.map((vendor, index) => (
          <div
            key={vendor.id}
            className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:border-[var(--color-primary-border)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400">
                    #{(index + 1).toString().padStart(2, "0")}
                  </span>
                  <StatusBadge active={vendor.is_active} />
                </div>
                <p className="mt-1 font-bold text-gray-900 text-base truncate">
                  {vendor.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {vendor.mobile_no || "-"}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {canEdit && (
                  <button
                    onClick={() => onVendorEdit(vendor)}
                    title="Edit Vendor"
                    className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onVendorDelete(vendor.id)}
                    title="Delete Vendor"
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            </div>
            {vendor.address && (
              <div>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Address
                </span>
                <p className="text-sm text-gray-600 mt-0.5">{vendor.address}</p>
              </div>
            )}
            <div>
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Categories
              </span>
              <div className="mt-1.5">
                <CategoryChips categories={vendor.vendor_categories} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto w-full pb-4">
        <table
          className="min-w-[900px] w-full border-separate"
          style={{ borderSpacing: "0 8px" }}
        >
          <thead>
            <tr className="bg-white">
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                #
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Vendor Name
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Mobile
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Address
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Categories
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Status
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr
                key={vendor.id}
                className="bg-white hover:bg-[var(--color-primary-tint)] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(132,92,189,0.08)] group rounded-xl"
              >
                <td className="px-6 py-4 first:rounded-l-xl last:rounded-r-xl border-y border-transparent group-hover:border-[var(--color-primary-border)] first:border-l last:border-r font-medium text-gray-500 w-12">
                  {(index + 1).toString().padStart(2, "0")}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)]">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-[15px]">
                      {vendor.name || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] font-medium text-gray-500">
                  {vendor.mobile_no || "-"}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] font-medium text-gray-500">
                  {vendor.address || "-"}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] max-w-sm">
                  <CategoryChips categories={vendor.vendor_categories} />
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center">
                  <StatusBadge active={vendor.is_active} />
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center w-32 first:rounded-l-xl last:rounded-r-xl first:border-l last:border-r">
                  <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {canEdit && (
                      <button
                        onClick={() => onVendorEdit(vendor)}
                        title="Edit Vendor"
                        className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer shadow-sm border border-transparent hover:border-[var(--color-primary-border)]/30"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onVendorDelete(vendor.id)}
                        title="Delete Vendor"
                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shadow-sm border border-transparent hover:border-red-100"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
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

export default VendorTable;
