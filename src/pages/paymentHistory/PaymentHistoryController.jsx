import { useEffect, useState } from "react";
import PaymentHistoryComponent from "./PaymentHistoryComponent";
import { getPaymentHistory } from "../../api/FetchPaymentHistory";
import toast from "react-hot-toast";

function PaymentHistoryController() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await getPaymentHistory();
      if (response.data.status) {
        setPaymentData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <PaymentHistoryComponent paymentData={paymentData} loading={loading} />
    </div>
  );
}

export default PaymentHistoryController;
