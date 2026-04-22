/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import Loader from "../../Components/common/Loader";
import {
  FiClipboard,
  FiPhone,
  FiClock,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiShare2,
  FiSearch,
  FiX,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AllOrderComponent({
  allOrder,
  loading,
  handleViewOrder,
  handleShareOrder,
  handleViewIngredient,
  handleViewIngredientBySession,
  handleCompleteOrder,
  handleDeleteAllOrder,
  handleViewOrderDetails,
  handleDownloadOrderPDF,
  totalCount,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleQuickFilter,
}) {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6 w-full">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiClipboard className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
            <p className="text-sm text-gray-400">
              {allOrder?.length || 0}
              {totalCount !== allOrder?.length ? ` of ${totalCount}` : ""}{" "}
              order{allOrder?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search + Date Filter */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-gray-50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 w-56 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="hidden lg:flex items-center gap-1.5 mr-1">
            <button onClick={() => handleQuickFilter("today")} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">Today</button>
            <button onClick={() => handleQuickFilter("thisWeek")} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">This Week</button>
            <button onClick={() => handleQuickFilter("thisMonth")} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">This Month</button>
            <button onClick={() => handleQuickFilter("upcoming")} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">Upcoming</button>
          </div>

          {/* Date Range Filter */}
          <div className="relative flex items-center">
            <FiCalendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
              size={14}
            />
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              dateFormat="dd MMM yyyy"
              placeholderText="Select event date range"
              isClearable
              className="pl-9 pr-7 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-gray-50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 w-[220px] transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading Orders..." />
      ) : allOrder.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <IoIosWarning size={48} className="text-yellow-400 mb-3" />
          <p className="text-lg font-semibold text-gray-500">
            No Orders Available
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Orders will appear here once created
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {allOrder.map((order) => (
            <div
              key={order.id}
              className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg bg-[var(--color-primary-tint)] border border-[var(--color-primary-border)]"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-primary-soft)] border-b border-[var(--color-primary-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                    {order.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {order.name}
                    </h3>
                    {order.reference && (
                      <p className="text-xs text-gray-400">
                        Ref: {order.reference}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-white text-[var(--color-primary)] border border-[var(--color-primary-border)] max-w-[200px] truncate"
                    title={
                      order.sessions?.length > 0
                        ? Array.from(
                            new Set(order.sessions.map((s) => s.event_date))
                          ).join(", ")
                        : order.event_date || "—"
                    }
                  >
                    <FiCalendar className="inline mr-1.5 -mt-0.5" size={12} />
                    {order.sessions?.length > 0
                      ? Array.from(
                          new Set(order.sessions.map((s) => s.event_date))
                        ).join(", ")
                      : order.event_date || "—"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 px-5 py-4 flex flex-col gap-3">
                {/* Phone */}
                <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-white rounded-lg px-3 py-2.5 border border-[var(--color-primary-border)] w-max">
                  <FiPhone size={14} className="text-[var(--color-primary)]" />
                  <span className="font-medium">{order.mobile_no || "—"}</span>
                </div>

                {/* Order Summary — clickable */}
                <div
                  className="flex flex-col gap-2 bg-indigo-50/40 border border-[var(--color-primary-border)] rounded-lg px-4 py-3 cursor-pointer hover:bg-[var(--color-primary-soft)] hover:border-[var(--color-primary)] transition-all duration-150 group"
                  onClick={() => handleViewOrderDetails(order.id)}
                  title="View Detailed Order"
                >
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FiClipboard size={14} className="text-[var(--color-primary)]" />
                      <span className="font-semibold text-gray-800">
                        Total Sessions: {order.sessions?.length || 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] font-semibold">
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 pl-6">
                    <span className="font-medium text-gray-400">
                      Total Estimated Persons:
                    </span>
                    <span>
                      {order.sessions?.reduce(
                        (total, session) =>
                          total + (Number(session.estimated_persons) || 0),
                        0
                      ) ||
                        order.estimated_persons ||
                        "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-5 py-3 border-t border-[var(--color-primary-border)]">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => handleCompleteOrder(order.id)}
                >
                  <FiCheckCircle size={14} />
                  Complete
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => handleShareOrder(order.id)}
                >
                  <FiShare2 size={14} />
                  Share
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-[var(--color-primary)] text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => handleDownloadOrderPDF(order.id)}
                >
                  <FiClipboard size={14} />
                  PDF
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => handleDeleteAllOrder(order.id)}
                >
                  <FiXCircle size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllOrderComponent;
