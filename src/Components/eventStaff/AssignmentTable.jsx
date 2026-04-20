/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";

function AssignmentTable({
  assignments,
  onAssignmentEdit,
  onAssignmentDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Event & Role
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Staff Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Days
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Financials
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Payment Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment, index) => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-800">
                      {assignment.event_name || "N/A"}
                    </span>
                    <span className="text-xs text-[#845cbd] bg-[#f4effc] px-2 py-0.5 rounded-full w-fit font-medium">
                      {assignment.role_at_event || "General"}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                  {assignment.staff_name || "N/A"}
                  {assignment.staff_type && (
                    <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                      {assignment.staff_type}
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-gray-600">
                  {assignment.total_days}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-col gap-0.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate/Day:</span>
                      <span className="font-medium">
                        ₹
                        {assignment.per_person_rate ||
                          assignment.per_day_rate ||
                          "0"}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                      <span className="text-gray-600 font-bold">Total:</span>
                      <span className="font-bold text-gray-800">
                        ₹{assignment.total_amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-0.5">
                      <span className="text-gray-400">Paid:</span>
                      <span className="text-green-600 font-medium">
                        ₹{assignment.paid_amount}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {(() => {
                    let badgeColor = "bg-gray-100 text-gray-600";
                    if (assignment.payment_status === "Paid")
                      badgeColor = "bg-green-100 text-green-700";
                    if (assignment.payment_status === "Partial")
                      badgeColor = "bg-yellow-100 text-yellow-700";
                    if (assignment.payment_status === "Pending")
                      badgeColor = "bg-red-100 text-red-600";

                    return (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold leading-none ${badgeColor}`}
                        >
                          {assignment.payment_status}
                        </span>
                        {assignment.remaining_amount > 0 && (
                          <span className="text-[10px] text-red-500 font-bold mt-1 block">
                            Due: ₹{assignment.remaining_amount}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center min-w-[120px]">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => onAssignmentEdit(assignment)}
                      title="Edit Assignment"
                      className="p-1.5 rounded-md text-gray-500 hover:text-[#845cbd] hover:bg-[#f4effc] transition-colors cursor-pointer"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onAssignmentDelete(assignment.id)}
                      title="Delete Assignment"
                      className="text-[#d33] hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4">
                <div className="flex flex-col justify-center items-center gap-2 text-yellow-500 py-6">
                  <IoIosWarning size={40} />
                  <p className="text-center text-gray-600 text-lg font-semibold">
                    No Assignments Found!
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

export default AssignmentTable;
