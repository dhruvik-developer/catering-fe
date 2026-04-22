/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import Loader from "../../Components/common/Loader";
import Dropdown from "../../Components/common/formDropDown/DropDown";
import {
  FiFileText,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiEye,
  FiCheckCircle,
  FiSend,
  FiSearch,
  FiX,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function InvoiceComponent({
  loading,
  invoice,
  totalCount,
  navigate,
  selectedFilter,
  setSelectedFilter,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleQuickFilter,
  getStatusColor,
}) {
  const filterOptions = [
    { id: "All", name: "All" },
    { id: "Paid", name: "Paid" },
    { id: "Unpaid", name: "Unpaid" },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-soft)]">
            <FiFileText className="text-[var(--color-primary)]" size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Invoice List</h2>
            <p className="text-sm text-gray-400">
              {invoice?.length || 0}
              {totalCount !== invoice?.length ? ` of ${totalCount}` : ""}{" "}
              invoice{invoice?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search + Date Filter + Status Dropdown */}
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
              maxDate={new Date()}
              isClearable
              className="pl-9 pr-7 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-gray-50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 w-[220px] transition-all cursor-pointer"
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-[120px]">
            <Dropdown
              options={filterOptions}
              selectedValue={selectedFilter}
              onChange={setSelectedFilter}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading Invoices..." />
      ) : !invoice || invoice.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <IoIosWarning size={48} className="text-yellow-400 mb-3" />
          <p className="text-lg font-semibold text-gray-500">
            No invoices found for the selected date range.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your date filters or search parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {invoice.map((invo) => (
            <div
              key={invo.id}
              className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg bg-[var(--color-primary-tint)] border border-[var(--color-primary-border)]"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-primary-soft)] border-b border-[var(--color-primary-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                    {invo.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {invo.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      <FiCalendar className="inline mr-1 -mt-0.5" size={11} />
                      {invo.sessions?.length > 0
                        ? Array.from(
                            new Set(invo.sessions.map((s) => s.event_date))
                          ).join(", ")
                        : invo.event_date || "—"}
                    </p>
                  </div>
                </div>

                <span
                  className={`${getStatusColor(invo.payment_status)} px-3 py-1.5 rounded-full text-xs font-semibold`}
                >
                  {invo.payment_status}
                </span>
              </div>

              {/* Dynamic Calculation for Pending Amount */}
              {(() => {
                const calculatedPending = invo.payment_status === "PAID"
                  ? 0
                  : Number(invo.total_amount || 0) - Number(invo.advance_amount || 0) - Number(invo.transaction_amount || 0);
                
                return (
                  <div className="flex-1 px-5 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-white rounded-lg px-3 py-2.5 border border-[var(--color-primary-border)]">
                        <FiCreditCard size={14} className="text-[var(--color-primary)]" />
                        <span className="font-medium">
                          {invo.payment_mode || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-white rounded-lg px-3 py-2.5 border border-[var(--color-primary-border)]">
                        <FiDollarSign
                          size={14}
                          className={
                            invo.payment_status === "PAID"
                              ? "text-emerald-500"
                              : "text-emerald-500"
                          }
                        />
                        <span className="font-medium">
                          {invo.payment_status === "PAID"
                            ? `Paid: ₹ ${Number(invo.total_amount || 0).toFixed(2)}`
                            : `Adv: ₹ ${Number(invo.advance_amount || 0).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-gray-800 bg-white rounded-lg px-3 py-2.5 border border-[var(--color-primary-border)]">
                        <FiDollarSign size={14} className="text-[var(--color-primary)]" />
                        <span className="font-semibold text-gray-800">
                          Total: ₹ {Number(invo.total_amount || 0).toFixed(2)}
                        </span>
                      </div>
                      {invo.payment_status !== "PAID" && (
                        <div className="col-span-1 sm:col-span-3 mt-1 flex items-center justify-between text-sm text-red-600 bg-red-50/50 rounded-lg px-4 py-2 border border-red-100">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            <span className="font-medium tracking-wide">
                              Pending Amount
                            </span>
                          </div>
                          <span className="font-bold">
                            ₹ {Math.max(0, calculatedPending).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Card Footer - Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-5 py-3 border-t border-[var(--color-primary-border)]">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/invoice-order-pdf/${invo.id}`)}
                >
                  <FiEye size={14} />
                  View Order
                </button>

                {invo.payment_status !== "PAID" && (
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/complete-invoice-pdf/${invo.id}`)}
                  >
                    <FiCheckCircle size={14} />
                    Complete Payment
                  </button>
                )}

                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/invoice-bill-pdf/${invo.id}`)}
                >
                  <FiSend size={14} />
                  Send Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoiceComponent;
