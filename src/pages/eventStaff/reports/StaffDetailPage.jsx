import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { logError } from "../../../utils/logger";
import {
  getAllAssignments,
  updateAssignment,
} from "../../../api/EventStaffApis";
import Loader from "../../../Components/common/Loader";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";

import { FiCheckCircle, FiCalendar } from "react-icons/fi";


function StaffDetailPage() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllAssignments();
      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];

      const staffAssignments = data.filter(
        (a) => String(a.staff) === String(staffId)
      );

      if (staffAssignments.length > 0) {
        const first = staffAssignments[0];
        setStaffData({
          staff_id: first.staff,
          staff_name: first.staff_name || "Unknown Staff",
          staff_type: first.staff_type || "Unknown",
          total_amount: staffAssignments.reduce(
            (s, a) => s + parseFloat(a.total_amount || 0),
            0
          ),
          total_paid: staffAssignments.reduce(
            (s, a) => s + parseFloat(a.paid_amount || 0),
            0
          ),
          total_pending: staffAssignments.reduce(
            (s, a) => s + parseFloat(a.remaining_amount || 0),
            0
          ),
        });
        setEvents(staffAssignments);
      } else {
        toast.error("No data found for this staff member");
      }
    } catch (error) {
      toast.error("Error fetching staff details");
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [staffId]);

  const handlePayClick = async (assignment) => {
    const remainingStr = parseFloat(assignment.remaining_amount || 0).toFixed(
      2
    );
    const { value: paymentAmount } = await Swal.fire({
      title: "Pay Staff For Event",
      html: `
                <div class="text-sm text-gray-600 mb-4 font-medium text-left">
                    <p><strong>Staff:</strong> ${assignment.staff_name}</p>
                    <p><strong>Event:</strong> ${assignment.session_name} (${assignment.session_date})</p>
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
      try {
        const newPaidAmount =
          parseFloat(assignment.paid_amount || 0) + parseFloat(paymentAmount);
        const newRemainingAmount =
          parseFloat(assignment.total_amount || 0) - newPaidAmount;
        const newStatus = newRemainingAmount <= 0 ? "Paid" : "Pending";

        const payload = {
          ...assignment,
          paid_amount: newPaidAmount,
          remaining_amount: newRemainingAmount,
          payment_status: newStatus,
        };
        delete payload.staff_name;
        delete payload.session_name;

        const res = await updateAssignment(assignment.id, payload);
        if (res?.data) {
          toast.success(`Payment of ₹ ${paymentAmount} recorded!`);
          fetchData();
        } else {
          toast.error("Failed to update payment.");
        }
      } catch (err) {
        toast.error("Error processing payment");
        logError(err);
      }
    }
  };

  const fmt = (n) =>
    parseFloat(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[var(--color-primary)] font-semibold hover:underline cursor-pointer"
      >
        <FaArrowLeft size={14} /> Back to Summary Report
      </button>

      {loading ? (
        <Loader message="Loading staff details..." />
      ) : !staffData ? (
        <p className="text-center text-gray-500 py-12 text-lg font-semibold">
          No data found.
        </p>
      ) : (
        <>
          {/* Staff Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-primary-border)] overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUser size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white capitalize">
                    {staffData.staff_name}
                  </h1>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold mt-1 inline-block">
                    {staffData.staff_type}
                  </span>
                </div>
              </div>
              
              {staffData.staff_type === "Fixed" && (
                <button
                  onClick={() => navigate(`/fixed-staff-payments/${staffData.staff_id}`)}
                  className="flex items-center gap-2 bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 border border-transparent whitespace-nowrap"
                >
                  <FaMoneyBillWave size={18} />
                  Manage Salary Payments
                </button>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-6 py-4">
              <div className="py-4 sm:py-0 sm:pr-6 text-center">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wide">
                  Total Events
                </p>
                <p className="text-3xl font-black text-[var(--color-primary)]">
                  {events.length}
                </p>
              </div>
              <div className="py-4 sm:py-0 sm:px-6 text-center">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wide">
                  Total Amount
                </p>
                {staffData.staff_type === "Fixed" ? (
                  <p className="text-[15px] font-bold text-gray-500 mt-2">N/A (Monthly Salary)</p>
                ) : (
                  <>
                    <p className="text-2xl font-black text-gray-800">
                      ₹{fmt(staffData.total_amount)}
                    </p>
                    <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">
                      Paid: ₹{fmt(staffData.total_paid)}
                    </p>
                  </>
                )}
              </div>
              <div className="py-4 sm:py-0 sm:pl-6 text-center">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wide">
                  Pending Amount
                </p>
                {staffData.staff_type === "Fixed" ? (
                  <p className="text-[15px] font-bold text-gray-500 mt-2">N/A (Monthly Salary)</p>
                ) : (
                  <>
                    <p
                      className={`text-2xl font-black ${staffData.total_pending > 0 ? "text-red-500" : "text-[var(--color-primary)]"}`}
                    >
                      ₹{fmt(staffData.total_pending)}
                    </p>
                    {staffData.total_pending <= 0 && (
                      <span className="text-xs text-[var(--color-primary)] font-bold flex items-center justify-center gap-1 mt-0.5">
                        <FiCheckCircle size={12} /> Fully Cleared
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Event Assignments */}
          <div className="bg-white rounded-2xl shadow-lg border border-[var(--color-primary-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <FaMoneyBillWave className="text-[var(--color-primary-text)]" size={18} />
              <h2 className="font-bold text-gray-800 text-lg">
                Event Assignments & Payment History
              </h2>
            </div>

            {events.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No events found.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {events.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-5 hover:bg-[var(--color-primary-tint)] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-base capitalize">
                          {ev.session_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <FiCalendar size={11} />

                          {ev.session_date}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3 text-sm">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
                            Role: {ev.role_name_at_event || "Staff"}
                          </span>
                          <span className="bg-[var(--color-primary-tint)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-medium">
                            {ev.total_days} Day(s) × {ev.number_of_persons}{" "}
                            Person(s)
                          </span>
                        </div>
                      </div>

                      {/* Payment Breakdown */}
                      <div className="flex flex-col sm:items-end gap-1 min-w-[160px]">
                        {staffData.staff_type === "Fixed" ? (
                          <div className="flex items-center justify-end h-full">
                            <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-4 py-2 rounded-lg border border-[var(--color-primary-border)]/30 flex items-center gap-1.5 shadow-sm mt-3 sm:mt-0">
                               Fixed Staff - Paid Monthly
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between gap-6 w-full sm:justify-end sm:gap-4">
                              <span className="text-xs text-gray-400 font-semibold">
                                Total
                              </span>
                              <span className="text-sm font-bold text-gray-800">
                                ₹{fmt(ev.total_amount)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-6 w-full sm:justify-end sm:gap-4">
                              <span className="text-xs text-gray-400 font-semibold">
                                Paid
                              </span>
                              <span className="text-sm font-bold text-[var(--color-primary)]">
                                ₹{fmt(ev.paid_amount)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-6 w-full sm:justify-end sm:gap-4">
                              <span className="text-xs text-gray-400 font-semibold">
                                Pending
                              </span>
                              <span
                                className={`text-sm font-bold ${parseFloat(ev.remaining_amount) > 0 ? "text-red-500" : "text-gray-400"}`}
                              >
                                ₹{fmt(ev.remaining_amount)}
                              </span>
                            </div>

                            <div className="mt-2">
                              {parseFloat(ev.remaining_amount) > 0 ? (
                                <button
                                  onClick={() => handlePayClick(ev)}
                                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-text)] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer w-full"
                                >
                                  Pay Amount
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary-tint)] px-4 py-2 rounded-lg flex items-center gap-1.5">
                                  <FiCheckCircle size={12} /> Cleared
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StaffDetailPage;
