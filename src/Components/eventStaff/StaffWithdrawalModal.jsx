/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { logError } from "../../utils/logger";
import Portal from "../common/Portal";

function StaffWithdrawalModal({
  isOpen,
  onClose,
  staffId,
  onSave,
}) {
  const [formData, setFormData] = useState({
    amount: "",
    payment_date: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: "",
        payment_date: format(new Date(), "yyyy-MM-dd"), // Today default
        note: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        staff: staffId,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date, // backend expects native date format
        note: formData.note,
      };

      await onSave(payload);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-400 to-red-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Record Advance / Withdrawal</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors cursor-pointer text-2xl font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 flex items-start gap-2">
              <span className="text-xl leading-none">⚠️</span>
              <p>Advances recorded here will automatically be <b>deducted</b> from this staff&apos;s next Fixed Salary Payment.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Advance Amount (₹)
              </label>
              <input
                type="number"
                name="amount" required
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all text-gray-800 font-bold text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Disbursement Date
              </label>
              <input
                type="date"
                name="payment_date" required
                value={formData.payment_date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Note / Reason (Optional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="2"
                placeholder="e.g. For medical emergency"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all text-sm resize-none"
              ></textarea>
            </div>
          </div>

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
              className={`px-5 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Record Advance"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}

export default StaffWithdrawalModal;
