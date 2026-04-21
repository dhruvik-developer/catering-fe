import React, { useState, useEffect } from "react";
import {
  FiX,
  FiDollarSign,
  FiCalendar,
  FiCreditCard,
  FiFileText,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { getInvoice } from "../../api/FetchInvoice";
import { updatePayment } from "../../api/PutInvoice";

const PAYMENT_MODES = [
  { value: "CASH", label: "CASH" },
  { value: "ONLINE", label: "ONLINE" },
  { value: "BANK_TRANSFER", label: "BANK TRANSFER" },
  { value: "CHEQUE", label: "CHEQUE" },
  { value: "OTHER", label: "OTHER" },
];

function PaymentModal({ isOpen, onClose, bookingId, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const [formData, setFormData] = useState({
    transaction_amount: "",
    payment_mode: "CASH",
    payment_date: new Date(),
    note: "",
  });

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchPaymentDetails();
      setFormData({
        transaction_amount: "",
        payment_mode: "CASH",
        payment_date: new Date(),
        note: "",
      });
    }
  }, [isOpen, bookingId]);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const response = await getInvoice();
      if (response?.data?.status) {
        // Find the invoice that belongs to this booking
        const invoice = response.data.data.find(
          (inv) => inv.booking?.id === bookingId || inv.booking === bookingId
        );

        if (invoice) {
          setPaymentData(invoice);
        } else {
          toast.error("No active payment found for this booking.");
          onClose();
        }
      } else {
        toast.error("Failed to fetch payment details.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transaction_amount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentData || !paymentData.bill_no) {
      toast.error("Invalid invoice data.");
      return;
    }

    const amount = Number(formData.transaction_amount || 0);
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const pending = Number(paymentData.pending_amount || 0);
    if (amount > pending) {
      toast.error(`Amount cannot exceed pending balance (₹${pending})`);
      return;
    }

    setSubmitting(true);

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const payload = {
      transaction_amount: amount,
      payment_mode: formData.payment_mode,
      payment_date: formatDate(formData.payment_date),
      note: formData.note,
    };

    try {
      const response = await updatePayment(paymentData.bill_no, payload);
      if (response && response.data?.status) {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex flex-shrink-0 items-center justify-center border border-emerald-200 shadow-sm">
              <FiDollarSign size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Record Payment
              </h2>
              {paymentData && (
                <p className="text-xs text-gray-500 font-medium tracking-wide">
                  INV-{paymentData.bill_no} /{" "}
                  {paymentData?.booking?.name || "Booking"}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 py-16 text-gray-400">
            <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin mb-3"></div>
            <p className="text-sm font-medium">Fetching balance...</p>
          </div>
        ) : !paymentData ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            Unable to load payment details.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {/* Summary Box */}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div className="flex flex-col gap-1 text-center flex-1 border-r border-emerald-200/50">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  Total Order
                </span>
                <span className="font-bold text-emerald-900">
                  ₹ {Number(paymentData.total_amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-center flex-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                  Pending
                </span>
                <span className="font-bold text-red-600 text-lg">
                  ₹ {Number(paymentData.pending_amount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {paymentData.payment_status === "PAID" ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center flex flex-col items-center gap-2">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FiDollarSign size={20} />
                </span>
                <h3 className="font-bold text-gray-800">Fully Paid</h3>
                <p className="text-xs text-gray-500">
                  There is no pending balance for this booking.
                </p>
              </div>
            ) : (
              <>
                {/* Amount Input */}
                <div className="space-y-1.5 focus-within:text-emerald-600">
                  <label className="text-xs tracking-wide font-bold uppercase text-gray-600 ml-1">
                    Amount Paying Now <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">
                      ₹
                    </div>
                    <input
                      type="text"
                      name="transaction_amount"
                      value={formData.transaction_amount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white transition-all text-gray-800"
                      placeholder={`Max ₹${Number(paymentData.pending_amount || 0).toLocaleString()}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Payment Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs tracking-wide font-bold uppercase text-gray-600 ml-1">
                      Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiCreditCard size={14} />
                      </div>
                      <select
                        name="payment_mode"
                        value={formData.payment_mode}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white appearance-none cursor-pointer transition-all text-gray-800"
                        required
                      >
                        {PAYMENT_MODES.map((mode) => (
                          <option key={mode.value} value={mode.value}>
                            {mode.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs tracking-wide font-bold uppercase text-gray-600 ml-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                        <FiCalendar size={14} />
                      </div>
                      <DatePicker
                        selected={formData.payment_date}
                        onChange={(date) =>
                          setFormData({ ...formData, payment_date: date })
                        }
                        dateFormat="dd-MM-yyyy"
                        className="w-full pl-9 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white transition-all cursor-pointer text-gray-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-1.5 focus-within:text-emerald-600">
                  <label className="text-xs tracking-wide font-bold uppercase text-gray-600 ml-1">
                    Note{" "}
                    <span className="text-gray-400 font-normal lowercase">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                      <FiFileText size={14} />
                    </div>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows="2"
                      className="w-full pl-9 pr-4 py-2 text-sm font-medium rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white transition-all text-gray-800 resize-none"
                      placeholder="Enter any notes..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              {paymentData.payment_status !== "PAID" && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiDollarSign size={16} />
                      <span>Record Payment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
