/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { FiFileText, FiChevronRight } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";
import Loader from "../../../Components/common/Loader";

function EventSummaryComponent({
  loading,
  summaryData,
  staffType,
  onStaffTypeChange,
}) {
  const navigate = useNavigate();

  const fmt = (n) =>
    parseFloat(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiFileText className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Summary Report</h2>
            <p className="text-sm text-gray-400">
              Click a staff member to view their full event &amp; payment
              details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="staffType"
            className="text-sm font-semibold text-gray-600"
          >
            Filter by Staff Type:
          </label>
          <div className="relative">
            <select
              id="staffType"
              value={staffType}
              onChange={onStaffTypeChange}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#845cbd]/20 focus:border-[#845cbd] cursor-pointer"
            >
              <option value="All">All Staff</option>
              <option value="Fixed">Fixed (My Staff)</option>
              <option value="Agency">Agency</option>
              <option value="Contract">Contract</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      {loading ? (
        <Loader message="Loading report data..." />
      ) : !summaryData || summaryData.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2 text-yellow-500 py-16">
          <IoIosWarning size={48} />
          <p className="text-center text-gray-600 text-lg font-semibold">
            No Report Data Available!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse">
            <thead>
              <tr className="bg-[#f4effc] text-[#845cbd]">
                <th className="px-4 py-3 text-left font-bold text-sm rounded-tl-lg">
                  Staff Name
                </th>
                <th className="px-4 py-3 text-center font-bold text-sm">
                  Type
                </th>
                <th className="px-4 py-3 text-center font-bold text-sm">
                  Total Events
                </th>
                <th className="px-4 py-3 text-right font-bold text-sm">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-right font-bold text-sm">Paid</th>
                <th className="px-4 py-3 text-right font-bold text-sm">
                  Pending
                </th>
                <th className="px-4 py-3 text-center font-bold text-sm rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaryData.map((row, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-purple-50 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/staff-detail/${row.staff_id}`)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#845cbd] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {row.staff_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-bold text-gray-800 capitalize">
                        {row.staff_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                      {row.staff_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-[#845cbd] text-lg">
                    {row.events?.length || 0}
                  </td>
                  {row.staff_type === "Fixed" ? (
                    <td colSpan="3" className="px-4 py-4 text-center">
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        N/A (Paid Monthly)
                      </span>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-4 text-right font-black text-gray-800">
                        ₹{fmt(row.total_amount)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-green-600">
                        ₹{fmt(row.total_paid)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`font-bold ${parseFloat(row.total_pending) > 0 ? "text-red-500" : "text-gray-400"}`}
                        >
                          ₹{fmt(row.total_pending)}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-4 py-4 text-center">
                    <FiChevronRight
                      className="mx-auto text-gray-400 group-hover:text-[#845cbd] transition-colors"
                      size={18}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventSummaryComponent;
