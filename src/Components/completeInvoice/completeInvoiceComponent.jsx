/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/common/Loader";
import Dropdown from "../common/formDropDown/DropDown";
import Input from "../common/formInputs/Input";
import { FiCalendar } from "react-icons/fi";
import BaseImage from "../common/BaseImage";


function CompleteInvoiceComponent({
  loading,
  completeInvoice,
  formData,
  handleChange,
  handleSubmit,
}) {
  const navigate = useNavigate();
  const paymentOptions = [
    { id: "CASH", name: "Cash" },
    { id: "CHEQUE", name: "Cheque" },
    { id: "BANK_TRANSFER", name: "Bank Transfer" },
    { id: "ONLINE", name: "Online" },
    { id: "OTHER", name: "Other" },
  ];

  //Add coma(,) in numbers
  const formatAmount = (amount) => Number(amount || 0).toLocaleString("en-IN");

  //Current date in "DD-MM-YYYY" format
  const currentDate = new Date().toLocaleDateString("en-GB");

  // Calculation
  const activeSession = completeInvoice?.sessions?.[0] || completeInvoice;
  // We must reduce over ALL sessions to get accurate totals
  const total_dish_price = (completeInvoice?.sessions || []).reduce(
    (acc, curr) => {
      return (
        acc +
        Number(curr.per_dish_amount || 0) * Number(curr.estimated_persons || 0)
      );
    },
    0
  );

  const total_extra_charges = (completeInvoice?.sessions || []).reduce(
    (acc, curr) => {
      return acc + Number(curr.extra_service_amount || 0);
    },
    0
  );

  // The true total amount should be derived from all items
  const trueTotalAmount = total_dish_price + total_extra_charges;
  const totalAmount = completeInvoice?.total_amount || trueTotalAmount;

  // The actual advance amount from the backend payment object
  const advancePaid = completeInvoice?.advance_amount || 0;
  
  const calculatedPending = completeInvoice?.payment_status === "PAID" 
    ? 0 
    : (Number(totalAmount) - Number(advancePaid));
    
  const total_remain_amount = calculatedPending;
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Bill</h2>
      </div>

      {loading ? (
        <Loader message="Loading Invoices..." />
      ) : !completeInvoice ? (
        <div className="text-center text-gray-500 text-lg font-bold mt-4">
          No invoices available.
        </div>
      ) : (
        <>
          {/* Customer Details */}
          <div className="bg-[var(--color-primary-tint)]/50 border border-[var(--color-primary-border)]/30 rounded-md mb-4 p-4">
            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[var(--color-primary)] rounded-full inline-block"></span>
              Billed To
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Customer Name
                </p>
                <p className="font-bold text-gray-800 capitalize">
                  {completeInvoice?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Mobile Number
                </p>
                <p className="font-bold text-gray-800">
                  {completeInvoice?.mobile_no || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Reference
                </p>
                <p className="font-bold text-gray-800 capitalize">
                  {completeInvoice?.reference || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Status
                </p>
                <span className="bg-[var(--color-primary-soft)] text-[var(--color-primary-text)] px-2 py-0.5 rounded text-xs font-bold uppercase">
                  {completeInvoice?.status || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Section */}
          <div className="bg-[#fff] border border-gray-300 rounded-md mb-6 calculation-section">
            <div className="p-[10px]">
              {/* Date Header */}
              <div className="p-3 border-b border-gray-300">
                <p className="font-semibold">
                  Date:{" "}
                  {activeSession?.event_date || completeInvoice?.event_date} (
                  {activeSession?.event_time || completeInvoice?.event_time})
                </p>
              </div>

              {/* Calculation Header */}
              <div className="grid grid-cols-5">
                <div className="p-2 text-center font-semibold">
                  Per Dish Price
                </div>
                <div>
                  <span className="hidden">Extra div for better design</span>
                </div>
                <div className="p-2 text-center font-semibold">Dish Count</div>
                <div>
                  <span className="hidden">Extra div for better design</span>
                </div>
                <div className="p-2 text-center font-semibold">
                  Total Dish Amount
                </div>
              </div>

              {/* Calculation Values */}
              <div className="grid grid-cols-5">
                <div className="p-2 text-center">
                  {activeSession?.per_dish_amount || 0}
                </div>
                <div className="flex items-center justify-center">*</div>
                <div className="p-2 text-center">
                  {activeSession?.estimated_persons || 0}
                </div>
                <div className="flex items-center justify-center">=</div>
                <div className="p-2 text-center">
                  {formatAmount(total_dish_price)}
                </div>
              </div>

              {/* Extra Charges Header */}
              <div className="relative p-2 text-center font-semibold">
                <hr className="absolute top-1/2 left-[0%] w-full border-gray-400"></hr>
                <span className="relative bg-[#fff] p-2">Extra Charges</span>
              </div>

              {/* Extra Charges Items */}
              {completeInvoice?.sessions &&
                completeInvoice.sessions.map(
                  (session) =>
                    session.extra_service &&
                    session.extra_service.map((service, index) => (
                      <div
                        key={`${session.id}-${index}`}
                        className="grid grid-cols-2"
                      >
                        <div className="p-2 pl-4">{service?.extra}</div>
                        <div className="p-2 text-right pr-4">
                          {service?.amount}
                        </div>
                      </div>
                    ))
                )}

              {/* Total Extra Charges */}
              <div className="grid grid-cols-3 border-y border-gray-300">
                <div className="p-2 pl-4">Total Extra Charges</div>
                <div className="flex items-center justify-center">=</div>
                <div className="p-2 text-right pr-4">{total_extra_charges}</div>
              </div>

              {/* Grand Total */}
              <div className="grid grid-cols-2">
                <div className="p-2 pl-4 text-sm">
                  True Total Amount (Total Dish Amount + Total Extra Charges)
                </div>
                <div className="p-2 text-right pr-4">
                  {formatAmount(trueTotalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Final Calculation Summary */}
          <div className="mb-6">
            <div className="grid grid-cols-2 py-2">
              <div className="font-semibold">Total Dish Amount:</div>
              <div className="text-right font-bold">
                {formatAmount(total_dish_price)}
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-black-300 py-2">
              <div className="font-semibold">Extra Charges:</div>
              <div className="text-right font-bold">
                + {total_extra_charges}
              </div>
            </div>

            <div className="grid grid-cols-3 py-2">
              <div className="font-semibold">Total Amount</div>
              <div className="text-center font-bold">=</div>
              <div className="text-right font-bold">
                {formatAmount(trueTotalAmount)}
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-black-300 py-2">
              <div className="font-semibold">Advance Paid Amount:</div>
              <div className="text-right font-bold text-red-600">
                - {formatAmount(advancePaid)}
              </div>
            </div>

            <div className="grid grid-cols-3 py-2 bg-red-50/50 rounded-md mt-2 p-2 border border-red-100">
              <div className="font-semibold text-red-600">Pending Amount</div>
              <div className="text-center font-bold text-red-600">=</div>
              <div className="text-right font-bold text-red-600">
                {" "}
                {formatAmount(total_remain_amount)}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium text-black-700">
                Payment Date
              </label>
              <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]">
                <FiCalendar className="text-[var(--color-primary-text)]" size={20} />

                <span className="font-semibold">
                  {currentDate.replace(/\//g, "-")}
                </span>
              </div>
            </div>

            <div>
              <Input
                label="Pending Amount"
                type="text"
                name="pending_amount"
                value={formatAmount(total_remain_amount)}
                className={`w-full p-2 border border-gray-300 rounded-md font-semibold focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]`} readOnly
              />
            </div>

            <div>
              <label className="block font-medium text-black-700">
                Payment Mode
              </label>
              <Dropdown
                options={paymentOptions} selectedValue={formData.payment_mode}
                onChange={(value) =>
                  handleChange({ target: { name: "payment_mode", value } })
                }
                placeholder="Select Payment Mode"
              />
            </div>

            <div>
              <Input
                label="Transaction Amount"
                type="text"
                placeholder={"Please Enter Transaction Amount"}
                name="transaction_amount"
                maxLength="10"
                value={formData.transaction_amount}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]`}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 10);
                }}
              />
            </div>

            <div>
              <Input
                label="Settlement Amount"
                type="text"
                placeholder={"Please Enter Settlement Amount"}
                name="settlement_amount"
                maxLength="10"
                value={formData.settlement_amount}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]`}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 10);
                }}
              />
            </div>

            <div>
              <label className="block font-medium text-black-700">Note</label>
              <textarea
                name="note"
                placeholder="Enter Note"
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                value={formData.note}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-4 py-2 font-medium bg-gray-300 border border-gray-300 rounded-md"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-medium bg-[var(--color-primary)] text-white rounded-md cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default CompleteInvoiceComponent;
