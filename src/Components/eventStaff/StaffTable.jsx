/* eslint-disable react/prop-types */
import { FaTrash, FaWallet } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";

function StaffTable({ staffList, onStaffEdit, onStaffDelete, onStaffPaymentSummary }) {
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
              Name
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
              Role & Type
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
              Financials
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
          {staffList && staffList.length > 0 ? (
            staffList.map((staff, index) => (
              <tr
                key={staff.id}
                className="bg-white hover:bg-[#fcfafc] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(132,92,189,0.08)] group rounded-xl"
              >
                <td className="px-6 py-4 first:rounded-l-xl last:rounded-r-xl border-y border-transparent group-hover:border-[#e2d5f8] first:border-l last:border-r font-medium text-gray-500 w-12">
                  {(index + 1).toString().padStart(2, "0")}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[#e2d5f8]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#845cbd] to-purple-400 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-purple-50 group-hover:ring-purple-100 transition-all flex-shrink-0">
                      {staff.name ? staff.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-[15px]">
                        {staff.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[#e2d5f8] font-medium text-gray-500">
                  {staff.phone || "-"}
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[#e2d5f8]">
                  <div className="flex flex-col gap-2 items-start">
                    <span className="font-bold text-[#845cbd] text-sm break-words line-clamp-2">
                      {staff.role_name || staff.role || "N/A"}
                    </span>
                    {staff.waiter_type_name ||
                    (staff.waiter_type && staff.waiter_type.name) ? (
                      <span className="text-[10px] text-gray-500 uppercase px-2.5 py-1 rounded-md">
                        Waiter Type: {staff.waiter_type_name || staff.waiter_type.name}
                      </span>
                    ) : null}
                    <span className="text-[10px] font-extrabold tracking-wider text-purple-700 bg-purple-50 group-hover:bg-purple-100 transition-colors uppercase px-2.5 py-1 rounded-md shadow-sm border border-purple-100 w-fit">
                      {staff.staff_type}{" "}
                      {staff.agency_name ? `• ${staff.agency_name}` : ""}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[#e2d5f8]">
                  <div className="flex flex-col gap-2 text-sm">
                    {parseFloat(staff.per_person_rate) > 0 && (
                      <div className="flex items-center justify-between text-xs w-36 bg-gray-50/80 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-gray-500 font-medium">
                          Per Day
                        </span>
                        <span className="font-bold text-gray-800">
                          ₹{parseFloat(staff.per_person_rate).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {staff.staff_type === "Fixed" &&
                      parseFloat(staff.fixed_salary) > 0 && (
                        <div className="flex items-center justify-between text-xs w-36 bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                          <span className="text-blue-600 font-medium">
                            Fixed
                          </span>
                          <span className="font-bold text-blue-900">
                            ₹{parseFloat(staff.fixed_salary).toFixed(2)}
                            <span className="font-normal opacity-60 text-[10px]">
                              /mo
                            </span>
                          </span>
                        </div>
                      )}
                    {staff.staff_type === "Contract" &&
                      parseFloat(staff.contract_rate) > 0 && (
                        <div className="flex items-center justify-between text-xs w-36 bg-purple-50/80 px-3 py-1.5 rounded-lg border border-purple-100 shadow-sm">
                          <span className="text-purple-600 font-medium">
                            Contract
                          </span>
                          <span className="font-bold text-purple-900">
                            ₹{parseFloat(staff.contract_rate).toFixed(2)}
                          </span>
                        </div>
                      )}
                    {/* Fallback if all values are 0 or empty */}
                    {!(parseFloat(staff.per_person_rate) > 0) &&
                      !(
                        staff.staff_type === "Fixed" &&
                        parseFloat(staff.fixed_salary) > 0
                      ) &&
                      !(
                        staff.staff_type === "Contract" &&
                        parseFloat(staff.contract_rate) > 0
                      ) && (
                        <span className="text-xs text-gray-400 italic font-medium">
                          No financials
                        </span>
                      )}
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[#e2d5f8] text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm ${staff.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.is_active ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {staff.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 border-y border-transparent group-hover:border-[#e2d5f8] text-center w-40 first:rounded-l-xl last:rounded-r-xl first:border-l last:border-r">
                  <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {staff.staff_type === "Fixed" && onStaffPaymentSummary && (
                      <button
                        onClick={() => onStaffPaymentSummary(staff.id)}
                        title="Salary Payments"
                        className="p-2 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer shadow-sm border border-transparent hover:border-emerald-100"
                      >
                        <FaWallet size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onStaffEdit(staff)}
                      title="Edit Staff"
                      className="p-2 rounded-lg text-gray-500 hover:text-[#845cbd] hover:bg-[#f4effc] transition-all cursor-pointer shadow-sm border border-transparent hover:border-purple-100"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onStaffDelete(staff.id)}
                      title="Delete Staff"
                      className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shadow-sm border border-transparent hover:border-red-100"
                    >
                      <FaTrash size={16} />
                    </button>
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
                    No Staff Available
                  </p>
                  <p className="text-sm text-gray-500 font-medium max-w-sm">
                    Use the "Add Staff" button to register new staff members and
                    they will appear here.
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

export default StaffTable;
