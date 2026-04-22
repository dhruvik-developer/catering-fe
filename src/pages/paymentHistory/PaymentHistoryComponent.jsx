/* eslint-disable react/prop-types */
import { IoIosWarning } from "react-icons/io";
import {
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaHandshake,
  FaReceipt,
} from "react-icons/fa";
import Loader from "../../Components/common/Loader";

function PaymentHistoryComponent({ paymentData, loading }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-auto mx-auto mt-10">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
      </div>

      {loading ? (
        <Loader message="Loading Payment Histories..." />
      ) : !paymentData ? (
        <div className="flex justify-center items-center gap-2 text-yellow-500">
          <IoIosWarning size={30} />
          <p className="text-center text-red-500 text-xl font-semibold py-4">
            No Payment History Available!
          </p>
          <IoIosWarning size={30} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Total Balance - Hero Card */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <FaWallet size={22} />
              </div>
              <p className="text-lg font-medium opacity-90">Total Balance</p>
            </div>
            <p className="text-3xl font-bold ml-1">
              ₹ {paymentData?.net_amount?.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Paid */}
            <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaCheckCircle size={18} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Total Paid Amount
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₹ {paymentData?.total_paid_amount?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Total Unpaid */}
            <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-red-100 p-2 rounded-lg">
                  <FaTimesCircle size={18} className="text-red-500" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Total Unpaid Amount
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₹ {paymentData?.total_unpaid_amount?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Total Settlement */}
            <div className="bg-white border border-yellow-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FaHandshake size={18} className="text-yellow-600" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Total Settlement Amount
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₹{" "}
                {paymentData?.total_settlement_amount?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Total Expense */}
            <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FaReceipt size={18} className="text-orange-500" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Total Expense Amount
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₹{" "}
                {paymentData?.total_expense_amount?.toLocaleString("en-IN") ||
                  0}
              </p>
              <p className="text-[10px] text-gray-400 mt-1.5 italic">
                Includes expense entries, event staff paid, and fixed salary paid.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentHistoryComponent;
