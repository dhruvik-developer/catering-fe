/* eslint-disable react/prop-types */
import {
  FaArrowLeft,
  FaUser,
  FaWallet,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaRegListAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { FiCheckCircle, FiCalendar } from "react-icons/fi";

import Loader from "../../../Components/common/Loader";
import FixedStaffSalaryModal from "../../../Components/eventStaff/FixedStaffSalaryModal";
import StaffWithdrawalModal from "../../../Components/eventStaff/StaffWithdrawalModal";
import Swal from "sweetalert2";

function FixedStaffPaymentComponent({
  loading,
  summaryData,
  onBack,
  onAddPayment,
  onEditPayment,
  isModalOpen,
  modalMode,
  selectedPayment,
  onCloseModal,
  onSavePayment,
  onEventPayClick,
  isWithdrawalModalOpen,
  onOpenWithdrawalModal,
  onCloseWithdrawalModal,
  onSaveWithdrawal,
}) {
  const fmt = (n) =>
    parseFloat(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const calculatedPendingSalary = summaryData ?
    Math.round(parseFloat(summaryData.pending_months || 0)) * parseFloat(summaryData.fixed_salary || 0) : 0;

  const handlePayWrapper = async (ev) => {
    const remainingStr = parseFloat(ev.remaining_amount || 0).toFixed(2);
    const { value: paymentAmount } = await Swal.fire({
      title: "Pay Staff For Event",
      html: `
        <div class="text-sm text-gray-600 mb-4 font-medium text-left">
            <p><strong>Staff:</strong> ${ev.staff_name}</p>
            <p><strong>Event:</strong> ${ev.session_name} (${ev.session_date})</p>
            <p class="mt-2 text-red-600 text-lg"><strong>Pending: ₹ ${remainingStr}</strong></p>
        </div>
      `,
      input: "number",
      inputLabel: "Enter payment amount",
      inputValue: remainingStr,
      inputAttributes: { min: 0, max: remainingStr, step: 0.01 },
      showCancelButton: true,
      confirmButtonText: "Submit Payment",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) return "You need to enter an amount!";
        const numVal = parseFloat(value);
        if (numVal <= 0) return "Amount must be greater than zero!";
        if (numVal > parseFloat(remainingStr))
          return `Amount cannot exceed pending amount (₹ ${remainingStr})!`;
      },
    });

    if (paymentAmount) {
      onEventPayClick(ev, paymentAmount);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[var(--color-primary)] font-semibold hover:underline cursor-pointer"
      >
        <FaArrowLeft size={14} /> Back to Staff Master
      </button>

      {loading ? (
        <Loader message="Loading payment summary..." />
      ) : !summaryData ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-gray-500">
            No summary data found or error occurred while loading.
          </p>
        </div>
      ) : (
        <>
          {/* Top Profile & Mega Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-primary-border)] overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                  <FaUser size={28} className="text-white drop-shadow-md" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white capitalize drop-shadow-sm">
                    {summaryData.staff_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 opacity-90">
                    <span className="bg-white/20 text-white text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                      {summaryData.staff_type}
                    </span>
                    <span className="text-xs text-white bg-black/10 px-2 py-1 rounded-md font-medium">
                      {summaryData.role_name}
                    </span>
                    {summaryData.joining_date && (
                      <span className="text-xs text-white bg-green-500/20 px-2 py-1 rounded-md font-medium border border-green-400/30 whitespace-nowrap">
                        Joined: {summaryData.joining_date} ({Math.round(parseFloat(summaryData.months_passed || 0))} mo.)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* High-level Overall Action items */}
              <div className="flexflex-col text-right">
                <p className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-1">
                  Overall Total Paid
                </p>
                <p className="text-3xl font-black text-white drop-shadow-md">
                  ₹{fmt(summaryData.total_overall_paid)}
                </p>
              </div>
            </div>

            {/* Extended Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x divide-gray-100 border-t border-purple-50">
              <div className="p-5 flex flex-col justify-center items-center md:items-start group transition-colors hover:bg-purple-50/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <FaMoneyCheckAlt className="text-[var(--color-primary)]/50 group-hover:text-[var(--color-primary)] transition-colors" />

                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    Monthly Salary
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-800">
                  ₹{fmt(summaryData.fixed_salary)}
                </p>
              </div>

              <div className="p-5 flex flex-col justify-center items-center md:items-start group transition-colors hover:bg-green-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <FaWallet className="text-green-500/50 group-hover:text-green-500 transition-colors" />
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    Total Salary Paid
                  </span>
                </div>
                <p className="text-2xl font-black text-green-600">
                  ₹{fmt(summaryData.total_salary_paid)}
                </p>
                <p className="text-xs text-green-600/70 font-medium mt-1">
                  {Math.round(parseFloat(summaryData.paid_months_equivalent || 0))} month(s) equivalent
                </p>
              </div>

              <div className="p-5 flex flex-col justify-center items-center md:items-start group transition-colors hover:bg-red-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiCalendar className="text-red-400 group-hover:text-red-500 transition-colors" />

                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    Salary Pending
                  </span>
                </div>
                <p
                  className={`text-2xl font-black ${
                    calculatedPendingSalary > 0
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  ₹{fmt(calculatedPendingSalary)}
                </p>
                <p className="text-xs text-red-500/70 font-bold mt-1">
                  {Math.round(parseFloat(summaryData.pending_months || 0))} month(s) pending
                </p>
                {calculatedPendingSalary <= 0 && (
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                    <FiCheckCircle size={12} /> All Clear
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col justify-center items-center md:items-start group transition-colors hover:bg-orange-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <FaMoneyBillWave className="text-orange-400/50 group-hover:text-orange-500 transition-colors" />
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    Pending Withdrawals
                  </span>
                </div>
                <p
                  className={`text-2xl font-black ${
                    parseFloat(summaryData.total_pending_withdrawals) > 0
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  ₹{fmt(summaryData.total_pending_withdrawals)}
                </p>
                <div className="mt-2 w-full">
                  <button
                    onClick={onOpenWithdrawalModal}
                    className="w-full text-[10px] uppercase font-bold text-orange-600 bg-orange-100 hover:bg-orange-200 py-1.5 rounded transition-colors"
                  >
                    + Record Advance
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Lists Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Salary Payments Table Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-primary-border)] overflow-hidden flex flex-col">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-[var(--color-primary)]">
                    <FaRegListAlt size={16} />
                  </div>
                  <h2 className="font-bold text-gray-800 text-lg">
                    Salary Payment Records
                  </h2>
                </div>
                <button
                  onClick={onAddPayment}
                  className="bg-[var(--color-primary)] hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  + Add Salary Payment
                </button>
              </div>
              <div className="p-0 overflow-x-auto flex-1">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                      <th className="px-6 py-4 font-bold">Period</th>
                      <th className="px-6 py-4 font-bold">Total</th>
                      <th className="px-6 py-4 font-bold">Paid</th>
                      <th className="px-6 py-4 font-bold">Pending</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {summaryData.salary_payments?.length > 0 ? (
                      summaryData.salary_payments.map((sp) => (
                        <tr
                          key={sp.id}
                          className="hover:bg-purple-50/20 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">
                                {sp.start_date} <span className="text-gray-400 font-normal">to</span> {sp.end_date}
                              </span>
                              <span className="text-[10px] bg-purple-50 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold">
                                {Math.round(parseFloat(sp.months_count || 0))} month{Math.round(parseFloat(sp.months_count || 0)) !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">
                            ₹{fmt(sp.total_amount)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-col">
                              <span className="font-bold text-green-600">
                                ₹{fmt(sp.paid_amount)}
                              </span>
                              {parseFloat(sp.total_amount) - parseFloat(sp.paid_amount) - parseFloat(sp.remaining_amount) > 0.01 && (
                                <span className="text-[10px] text-orange-500 font-bold mt-1 whitespace-nowrap">
                                  Advance Settled: ₹{fmt(parseFloat(sp.total_amount) - parseFloat(sp.paid_amount) - parseFloat(sp.remaining_amount))}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">
                            <span
                              className={
                                parseFloat(sp.remaining_amount) > 0
                                  ? "text-red-500"
                                  : "text-gray-400"
                              }
                            >
                              ₹{fmt(sp.remaining_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                sp.payment_status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : sp.payment_status === "Partial"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-600"
                              }`}
                            >
                              {sp.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => onEditPayment(sp)}
                              className="text-xs font-bold text-[var(--color-primary)] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-gray-400 font-medium italic"
                        >
                          No salary payment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Event Assignments Table Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-primary-border)] overflow-hidden flex flex-col">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FaMoneyBillWave size={16} />
                </div>
                <h2 className="font-bold text-gray-800 text-lg">
                  Event Payment Records
                </h2>
              </div>
              <div className="p-0 overflow-x-auto flex-1">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-[11px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-100">
                      <th className="px-6 py-4 font-bold">Event</th>
                      <th className="px-6 py-4 font-bold">Total</th>
                      <th className="px-6 py-4 font-bold">Paid</th>
                      <th className="px-6 py-4 font-bold">Pending</th>
                      <th className="px-6 py-4 font-bold text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {summaryData.event_payments?.length > 0 ? (
                      summaryData.event_payments.map((ev) => (
                        <tr
                          key={ev.id}
                          className="hover:bg-blue-50/20 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 capitalize line-clamp-1">
                                {ev.session_name}
                              </span>
                              <span className="text-xs text-gray-400 font-medium">
                                {ev.session_date}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">
                            ₹{fmt(ev.total_amount)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">
                            ₹{fmt(ev.paid_amount)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">
                            <span
                              className={
                                parseFloat(ev.remaining_amount) > 0
                                  ? "text-red-500"
                                  : "text-gray-400"
                              }
                            >
                              ₹{fmt(ev.remaining_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {parseFloat(ev.remaining_amount) > 0 ? (
                              <button
                                onClick={() => handlePayWrapper(ev)}
                                className="bg-[var(--color-primary)] hover:bg-purple-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm transition-colors cursor-pointer w-full max-w-[100px]"
                              >
                                Pay Event
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-md flex items-center justify-center gap-1 w-full max-w-[100px] mx-auto">
                                <FaCheckCircle size={10} /> Cleared
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-gray-400 font-medium italic"
                        >
                          No event payment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal for Add / Edit Salary */}
      <FixedStaffSalaryModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        mode={modalMode}
        initialData={selectedPayment}
        staffId={summaryData?.staff_id}
        summaryData={summaryData}
        onSave={onSavePayment}
      />

      <StaffWithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={onCloseWithdrawalModal}
        staffId={summaryData?.staff_id}
        onSave={onSaveWithdrawal}
      />
    </div>
  );
}

export default FixedStaffPaymentComponent;
