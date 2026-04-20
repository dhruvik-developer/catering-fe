/* eslint-disable react/prop-types */
import { useState } from "react";
import Loader from "../../Components/common/Loader";
import { IoIosWarning } from "react-icons/io";
import {
  FiFileText,
  FiPhone,
  FiClock,
  FiUsers,
  FiCalendar,
  FiEdit2,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiX,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function QuotationComponent({
  loading,
  quotation,
  totalCount,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleQuickFilter,
  handleDeleteQuotation,
  handleViewQuotation,
  handleEditOrder,
  handleCompleteQuotation,
}) {
  const [sessionsModal, setSessionsModal] = useState(null);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#f4effc]">
            <FiFileText className="text-[#845cbd]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quotation List</h2>
            <p className="text-sm text-gray-400">
              {quotation?.length || 0}
              {totalCount !== quotation?.length ? ` of ${totalCount}` : ""}{" "}
              quotation{quotation?.length !== 1 ? "s" : ""}
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
              autoComplete="off"
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-gray-50 focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/15 w-56 transition-all"
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
            <button onClick={() => handleQuickFilter("next7Days")} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">Next 7 Days</button>
            <button onClick={() => handleQuickFilter("next30Days")} className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer">Next 30 Days</button>
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
              placeholderText="Select date range"
              minDate={new Date()}
              isClearable
              className="pl-9 pr-7 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-gray-50 focus:outline-none focus:border-[#845cbd] focus:ring-2 focus:ring-[#845cbd]/15 w-[220px] transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading Quotations..." />
      ) : !quotation || quotation.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <IoIosWarning size={48} className="text-yellow-400 mb-3" />
          <p className="text-lg font-semibold text-gray-500">
            No quotations found for the selected date range.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your date filters or search parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {quotation.map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg bg-[#faf8fd] border border-[#e8e0f3]"
              >
                {/* Card Header - Light purple */}
                <div className="flex items-center justify-between px-5 py-4 bg-[#f4effc] border-b border-[#ede7f6]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#845cbd] text-white flex items-center justify-center font-bold text-sm">
                      {quote.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {quote.name}
                      </h3>
                      {quote.reference && (
                        <p className="text-xs text-gray-400">
                          Ref: {quote.reference}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-white text-[#845cbd] border border-[#ede7f6] max-w-[200px] truncate"
                      title={
                        quote.sessions?.length > 0
                          ? Array.from(
                              new Set(quote.sessions.map((s) => s.event_date))
                            ).join(", ")
                          : quote.event_date || "—"
                      }
                    >
                      <FiCalendar className="inline mr-1.5 -mt-0.5" size={12} />
                      {quote.sessions?.length > 0
                        ? Array.from(
                            new Set(quote.sessions.map((s) => s.event_date))
                          ).join(", ")
                        : quote.event_date || "—"}
                    </span>
                    <button
                      onClick={() => handleEditOrder(quote.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-[#845cbd] hover:bg-white transition-colors duration-200 cursor-pointer"
                      title="Edit Quotation"
                    >
                      <FiEdit2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Card Body - Details */}
                <div className="flex-1 px-5 py-4">
                  <div className="flex flex-col gap-3">
                    {/* Phone */}
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-white rounded-lg px-3 py-2.5 border border-[#ede7f6] w-max">
                      <FiPhone size={14} className="text-[#845cbd]" />
                      <span className="font-medium">
                        {quote.mobile_no || "—"}
                      </span>
                    </div>

                    {/* Order Summary — clickable */}
                    {(() => {
                      const allSessions =
                        quote.sessions?.length > 0
                          ? quote.sessions
                          : [
                              {
                                event_date: quote.event_date,
                                event_time: quote.event_time,
                                estimated_persons: quote.estimated_persons,
                              },
                            ];
                      const totalPersons = allSessions.reduce(
                        (total, session) =>
                          total + (Number(session.estimated_persons) || 0),
                        0
                      );
                      return (
                        <div
                          className="flex flex-col gap-2 bg-indigo-50/40 border border-[#ede7f6] rounded-lg px-4 py-3 cursor-pointer hover:bg-[#f4effc] hover:border-[#845cbd] transition-all duration-150 group"
                          onClick={() =>
                            setSessionsModal({
                              name: quote.name,
                              sessions: allSessions,
                            })
                          }
                          title="View All Events"
                        >
                          <div className="flex items-center justify-between text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <FiFileText
                                size={14}
                                className="text-[#845cbd]"
                              />
                              <span className="font-semibold text-gray-800">
                                Total Sessions: {allSessions.length}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-[#845cbd] font-semibold">
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
                          <div className="flex items-center gap-2 text-xs text-gray-500 pl-6">
                            <span className="font-medium text-gray-400">
                              Total Estimated Persons:
                            </span>
                            <span>{totalPersons || "—"}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Card Footer - Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-5 py-3 border-t border-[#ede7f6]">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#f4effc] hover:bg-[#e8ddf5] text-[#845cbd] text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => handleViewQuotation(quote.id)}
                  >
                    <FiEye size={14} />
                    View
                  </button>

                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => handleCompleteQuotation(quote.id)}
                  >
                    <FiCheckCircle size={14} />
                    Confirm
                  </button>

                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => handleDeleteQuotation(quote.id)}
                  >
                    <FiXCircle size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Sessions Modal */}
      {sessionsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSessionsModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8f5fc] to-white">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  All Event Schedules
                </h3>
                <p className="text-xs text-gray-400">
                  {sessionsModal.name} — {sessionsModal.sessions.length} event
                  {sessionsModal.sessions.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSessionsModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sessionsModal.sessions.map((session, sIdx) => (
                <div
                  key={sIdx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 bg-indigo-50/40 border border-[#ede7f6] rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiClock size={14} className="text-[#845cbd]" />
                    <span className="font-medium text-sm break-all">
                      <span className="text-gray-400 mr-1">
                        {session.event_date}
                      </span>{" "}
                      <strong>{session.event_time || "—"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiUsers size={14} className="text-[#845cbd]" />
                    <span className="font-medium text-sm">
                      <strong>{session.estimated_persons || "—"}</strong>{" "}
                      persons
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSessionsModal(null)}
                className="px-5 py-2 rounded-lg font-bold text-sm text-white bg-[#845cbd] hover:bg-[#7350a8] cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationComponent;
