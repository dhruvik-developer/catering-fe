/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";
import usePermissions from "../../hooks/usePermissions";

function VendorTable({ vendors, onVendorEdit, onVendorDelete }) {
  const { hasPermission } = usePermissions();
  return (
    <div className="overflow-x-auto w-full pb-4">
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
          {vendors && vendors.length > 0 ? (
            vendors.map((vendor, index) => (
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
                  {vendor.vendor_categories?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vendor.vendor_categories.map((vc) => (
                        <span
                          key={vc.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-sm"
                        >
                          <span>{vc.category_name}</span>
                          {vc.price != null && (
                            <span className="text-purple-400 bg-white px-1.5 py-0.5 rounded-md text-[10px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                              ₹{vc.price}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No categories
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${vendor.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${vendor.is_active ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {vendor.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[var(--color-primary-border)] text-center w-32 first:rounded-l-xl last:rounded-r-xl first:border-l last:border-r">
                  <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {hasPermission("vendors.update") && (
                      <button
                        onClick={() => onVendorEdit(vendor)}
                        title="Edit Vendor"
                        className="p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-all cursor-pointer shadow-sm border border-transparent hover:border-purple-100"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    {hasPermission("vendors.delete") && (
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
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-12">
                <div className="flex flex-col justify-center items-center gap-3">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                    <IoIosWarning size={40} className="text-amber-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    No Vendors Available
                  </p>
                  <p className="text-sm text-gray-500 font-medium max-w-sm">
                    Use the "Add Vendor" button to register new vendors and they
                    will appear here.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VendorTable;
