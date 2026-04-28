/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { format, parse, parseISO, addDays, addMonths, subDays, differenceInDays, differenceInMonths, isBefore, getDaysInMonth } from "date-fns";

function FixedStaffSalaryModal({
  isOpen,
  onClose,
  mode,
  initialData,
  staffId,
  summaryData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    months_count: 1,
    paid_amount: "",
    payment_date: "",
    note: "",
  });

  const [calcData, setCalcData] = useState({
    gross_amount: 0,
    withdrawal_deduction: 0,
    final_payable: 0,
  });

  const [loading, setLoading] = useState(false);

  // Auto-calculate financial fields whenever relevant inputs change
  useEffect(() => {
    if (!isOpen) return;
    
    const fixedSalary = parseFloat(summaryData?.fixed_salary || 0);
    const mCount = parseFloat(formData.months_count || 0);
    const gross = fixedSalary * mCount;
    
    // Total pending from backend, bounded by the gross salary for this transaction
    const pendingWithdrawals = parseFloat(summaryData?.total_pending_withdrawals || 0);
    const deduction = Math.min(pendingWithdrawals, gross);
    
    const finalAmount = gross - deduction;

    setCalcData({
      gross_amount: gross,
      withdrawal_deduction: deduction,
      final_payable: finalAmount,
    });
    
    // Automatically keep the actual form payload mapped to the final amount
    setFormData((prev) => ({
      ...prev,
      paid_amount: finalAmount > 0 ? finalAmount.toFixed(2) : "0.00",
    }));
  }, [formData.months_count, summaryData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        // Parse 'DD-MM-YYYY' to 'YYYY-MM-DD'
        let parsedStartDate = "";
        let parsedEndDate = "";
        let parsedPaymentDate = "";
        try {
          if (initialData.start_date) {
            parsedStartDate = format(
              parse(initialData.start_date, "dd-MM-yyyy", new Date()),
              "yyyy-MM-dd"
            );
          }
          if (initialData.end_date) {
            parsedEndDate = format(
              parse(initialData.end_date, "dd-MM-yyyy", new Date()),
              "yyyy-MM-dd"
            );
          }
        } catch (e) {
            console.error(" error parsing start/end date: ", e);
        }
        try {
          if (initialData.payment_date) {
            parsedPaymentDate = format(
              parse(initialData.payment_date, "dd-MM-yyyy", new Date()),
              "yyyy-MM-dd"
            );
          }
        } catch(e) {
            console.error(" error parsing payment date: ", e);
        }

        setFormData({
          start_date: parsedStartDate,
          end_date: parsedEndDate,
          months_count: initialData.months_count || 1,
          paid_amount: initialData.paid_amount || "",
          payment_date: parsedPaymentDate,
          note: initialData.note || "",
        });
      } else {
        // Auto Start Date Logic for Add Mode
        let autoStart = "";
        if (summaryData?.last_payment_end_date) {
          try {
            autoStart = format(addDays(parseISO(summaryData.last_payment_end_date), 1), "yyyy-MM-dd");
          } catch (e) {
            autoStart = format(new Date(), "yyyy-MM-dd");
          }
        } else if (summaryData?.joining_date) {
          autoStart = summaryData.joining_date; 
        } else {
          autoStart = format(new Date(), "yyyy-MM-dd");
        }

        // Auto End Date based on 1 default month
        let autoEnd = "";
        try {
          autoEnd = format(subDays(addMonths(parseISO(autoStart), 1), 1), "yyyy-MM-dd");
        } catch (e) {
          autoEnd = autoStart;
        }

        setFormData({
          start_date: autoStart, 
          end_date: autoEnd,
          months_count: 1,
          paid_amount: "", 
          payment_date: format(new Date(), "yyyy-MM-dd"), // Today
          note: "",
        });
      }
    }
  }, [isOpen, mode, initialData, summaryData]);

  if (!isOpen) return null;

  // Handle Input Changes with Smart Reverse Calculations
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };

      try {
        if (name === "start_date" || name === "months_count") {
           // Forward calc: Start + Months = End
           if (nextData.start_date && nextData.months_count) {
              const m = parseFloat(nextData.months_count);
              if (!isNaN(m) && m > 0) {
                 const start = parseISO(nextData.start_date);
                 nextData.end_date = format(subDays(addMonths(start, m), 1), "yyyy-MM-dd");
              }
           }
        } else if (name === "end_date") {
           // Reverse calc: Start + End = Months
           if (nextData.start_date && nextData.end_date) {
              const start = parseISO(nextData.start_date);
              const end = parseISO(nextData.end_date);
              if (!isBefore(end, start)) {
                 const endPlusOne = addDays(end, 1);
                 const fullMonths = differenceInMonths(endPlusOne, start);
                 const dateAfterFullMonths = addMonths(start, fullMonths);
                 const remainingDays = differenceInDays(endPlusOne, dateAfterFullMonths);
                 
                 let m = fullMonths;
                 if (remainingDays > 0) {
                     const daysInCurrentMonth = getDaysInMonth(dateAfterFullMonths);
                     m += remainingDays / daysInCurrentMonth;
                 }
                 
                 nextData.months_count = Math.round(m);
                 if (nextData.months_count < 1) nextData.months_count = 1;
              }
           }
        }
      } catch (err) {
        console.warn("Date calc error:", err);
      }

      return nextData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // transform dates back to DD-MM-YYYY
      const formattedStartDate = format(
        parse(formData.start_date, "yyyy-MM-dd", new Date()),
        "dd-MM-yyyy"
      );
      const formattedEndDate = format(
        parse(formData.end_date, "yyyy-MM-dd", new Date()),
        "dd-MM-yyyy"
      );
      const formattedPaymentDate = format(
        parse(formData.payment_date, "yyyy-MM-dd", new Date()),
        "dd-MM-yyyy"
      );

      const payload = {
        staff: staffId,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        months_count: parseFloat(formData.months_count),
        paid_amount: parseFloat(formData.paid_amount || 0),
        payment_date: formattedPaymentDate,
        note: formData.note,
      };

      await onSave(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {mode === "add" ? "Add" : "Edit"} Salary Payment
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors cursor-pointer text-2xl font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date" required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-gray-800"
              />
            </div>
            
            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date" required
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-gray-800"
              />
            </div>
            
            <div className="col-span-2 text-xs text-[var(--color-primary)] mt-[-8px]">
              Select the exact date range this salary covers.
            </div>

            {/* Months Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Number of Months
              </label>
              <input
                type="number"
                name="months_count" required
                min="1"
                step="1"
                value={formData.months_count}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            </div>
            
            {/* Payment Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="payment_date" required
                value={formData.payment_date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Automated Financial Breakdown UI */}
          <div className="bg-[var(--color-primary-tint)]/50 p-4 rounded-xl border border-[var(--color-primary-border)]/30 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Gross Salary ({formData.months_count || 0} months):</span>
                <span className="font-bold text-gray-800">₹{calcData.gross_amount.toFixed(2)}</span>
            </div>
            
            {calcData.withdrawal_deduction > 0 && (
                <div className="flex justify-between items-center text-sm text-red-500 pb-2 border-b border-[var(--color-primary-border)]/30/50">
                    <span className="font-medium">Withdrawal Deduction (Pending: ₹{summaryData?.total_pending_withdrawals}):</span>
                    <span className="font-bold">- ₹{calcData.withdrawal_deduction.toFixed(2)}</span>
                </div>
            )}
            
            <div className="flex justify-between items-center pt-2 mt-1">
                <span className="text-gray-800 font-bold">Final Payable Amount:</span>
                <span className="text-xl font-black text-[var(--color-primary)]">₹{calcData.final_payable.toFixed(2)}</span>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="2"
              placeholder="e.g. Cleared March dues"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all text-sm resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-text)] rounded-lg transition-colors shadow-sm cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? mode === "add"
                  ? "Saving..."
                  : "Updating..."
                : mode === "add"
                  ? "Save Payment"
                  : "Update Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FixedStaffSalaryModal;
