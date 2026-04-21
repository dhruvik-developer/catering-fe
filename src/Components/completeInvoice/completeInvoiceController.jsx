/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import CompleteInvoiceComponent from "./completeInvoiceComponent";
import toast from "react-hot-toast";
import { getInvoice } from "../../api/FetchInvoice";
import { useNavigate, useParams } from "react-router-dom";
import { updatePayment } from "../../api/PutInvoice";

function CompleteInvoiceController() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [completeInvoice, setCompleteInvoice] = useState([]);
  const [formData, setFormData] = useState({
    transaction_amount: "",
    settlement_amount: "",
    payment_mode: "",
    note: "",
  });

  const fetchCompleteInvoice = async () => {
    try {
      const response = await getInvoice();
      if (response.data.status) {
        const selectedInvoice = response.data.data
          .map((item) => {
            const billed = item.booking || {};
            return {
              ...billed,
              bill_no: item.bill_no,
              payment_mode: item.payment_mode,
              payment_status: item.payment_status,
              advance_amount: item.advance_amount,
              pending_amount: item.pending_amount,
              transaction_amount: item.transaction_amount,
              total_amount: item.total_amount,
            };
          })
          .find((invoice) => invoice.id === parseInt(id));
        if (selectedInvoice) {
          setCompleteInvoice(selectedInvoice);
        } else {
          toast.error("Invoice data not found");
        }
      } else {
        toast.error("Failed to fetch invoice data");
      }
    } catch (error) {
      toast.error("Error fetching invoice data");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleteInvoice();
  }, [id]);

  // const handleChange = (e) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["transaction_amount", "settlement_amount"].includes(name)) {
      // Allow only numbers, remove non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionAmount = Number(formData.transaction_amount || 0);
    const settlementAmount = Number(formData.settlement_amount || 0);
    const currentPending = Number(completeInvoice?.pending_amount || 0);

    if (transactionAmount + settlementAmount > currentPending) {
      toast.error(
        `Payment amount cannot exceed the pending amount (₹${currentPending.toLocaleString("en-IN")})`
      );
      return;
    }

    // The pending amount should be reduced by whatever they are paying NOW
    const pendingAmount =
      currentPending - (transactionAmount + settlementAmount);
    const paymentStatus = pendingAmount <= 0 ? "PAID" : "PARTIAL";
    const bookingId = completeInvoice?.id;

    // Formatting date as DD-MM-YYYY
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const payload = {
      booking: bookingId,
      total_amount: completeInvoice.total_amount, // KEEP ORIGINAL TOTAL
      advance_amount: completeInvoice.advance_amount, // KEEP ORIGINAL ADVANCE
      pending_amount: pendingAmount,
      payment_date: formatDate(new Date()),
      transaction_amount: transactionAmount,
      settlement_amount: settlementAmount,
      payment_mode: formData.payment_mode,
      payment_status: paymentStatus,
      total_extra_amount: completeInvoice.total_extra_amount || 0,
    };

    if (formData.note) {
      payload.note = formData.note;
    }

    try {
      const response = await updatePayment(completeInvoice?.bill_no, payload);
      if (response) {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  return (
    <CompleteInvoiceComponent
      loading={loading}
      completeInvoice={completeInvoice}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}

export default CompleteInvoiceController;
