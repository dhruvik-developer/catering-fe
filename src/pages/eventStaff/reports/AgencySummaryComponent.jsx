/* eslint-disable react/prop-types */
import { FaBuilding } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";
import Loader from "../../../Components/common/Loader";

function AgencySummaryComponent({ loading, summaryData }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiPieChart className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Agency Summary Report
            </h2>
            <p className="text-sm text-gray-400">
              Overview of total spend and staff count by labor agency
            </p>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      {loading ? (
        <Loader message="Loading report data..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Agency Name
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center">
                  Active Staff Count
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right">
                  Total Payable Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {summaryData && summaryData.length > 0 ? (
                summaryData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center gap-2 font-bold text-gray-800">
                        <FaBuilding className="text-gray-400" />
                        {row.agency_name || "Independent / N/A"}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                        {row.staff_count || 0} Staff
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-black text-[#845cbd] text-lg">
                      ₹{parseFloat(row.total_amount_payable || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    <div className="flex flex-col justify-center items-center gap-2 text-yellow-500 py-6">
                      <IoIosWarning size={40} />
                      <p className="text-center text-gray-600 text-lg font-semibold">
                        No Report Data Available!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AgencySummaryComponent;
