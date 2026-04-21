import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FixedStaffPaymentComponent from "./FixedStaffPaymentComponent";
import {
  getFixedStaffPaymentSummary,
  createFixedSalaryPayment,
  updateFixedSalaryPayment,
  updateAssignment,
  createStaffWithdrawal,
} from "../../../api/EventStaffApis";
import toast from "react-hot-toast";

function FixedStaffPaymentController() {
  const { staffId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await getFixedStaffPaymentSummary(staffId);
      if (response?.data?.status) {
        setSummaryData(response.data.data);
      } else {
        toast.error(response?.data?.message || "Failed to fetch summary.");
      }
    } catch (error) {
      toast.error("Error fetching fixed staff payment summary");
      console.error(error);
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchSummary();
    }
  }, [staffId]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (payment) => {
    setModalMode("edit");
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleSaveSalaryPayment = async (formData) => {
    try {
      let response;
      if (modalMode === "add") {
        response = await createFixedSalaryPayment(formData);
      } else {
        response = await updateFixedSalaryPayment(selectedPayment.id, formData);
      }

      if (response?.data) {
        toast.success(
          `Salary payment ${modalMode === "add" ? "added" : "updated"} successfully!`
        );
        setIsModalOpen(false);
        fetchSummary();
      }
    } catch (error) {
      const errorData = error?.response?.data;
      if (errorData) {
        // Show validation errors, e.g. overlapping month
        const firstErrorKey = Object.keys(errorData)[0];
        if (firstErrorKey && Array.isArray(errorData[firstErrorKey])) {
          toast.error(`${firstErrorKey}: ${errorData[firstErrorKey][0]}`);
          return;
        }
      }
      toast.error(
        `Failed to ${modalMode} salary payment. Please check your inputs.`
      );
      console.error(error);
    }
  };
  
  const handleOpenWithdrawalModal = () => setIsWithdrawalModalOpen(true);
  const handleCloseWithdrawalModal = () => setIsWithdrawalModalOpen(false);

  const handleSaveWithdrawal = async (formData) => {
    try {
      const response = await createStaffWithdrawal(formData);
      if (response?.data) {
        toast.success("Withdrawal recorded successfully!");
        setIsWithdrawalModalOpen(false);
        fetchSummary();
      }
    } catch (error) {
       toast.error("Failed to record withdrawal.");
       console.error(error);
    }
  };
  
  const handleEventPayClick = async (assignment, paymentAmount) => {
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
      // Keep payload clean as per existing staff detail logic
      for (const k of ["staff_name", "session_name", "role_name_at_event"]) {
        delete payload[k];
      }

      const res = await updateAssignment(assignment.id, payload);
      if (res?.data) {
        toast.success(`Payment of ₹ ${paymentAmount} recorded!`);
        fetchSummary();
      } else {
        toast.error("Failed to update event payment.");
      }
    } catch (err) {
      toast.error("Error processing event payment");
      console.error(err);
    }
  };

  return (
    <FixedStaffPaymentComponent
      loading={loading}
      summaryData={summaryData}
      onBack={() => navigate(-1)}
      onAddPayment={handleOpenAddModal}
      onEditPayment={handleOpenEditModal}
      isModalOpen={isModalOpen}
      modalMode={modalMode}
      selectedPayment={selectedPayment}
      onCloseModal={handleCloseModal}
      onSavePayment={handleSaveSalaryPayment}
      onEventPayClick={handleEventPayClick}
      isWithdrawalModalOpen={isWithdrawalModalOpen}
      onOpenWithdrawalModal={handleOpenWithdrawalModal}
      onCloseWithdrawalModal={handleCloseWithdrawalModal}
      onSaveWithdrawal={handleSaveWithdrawal}
    />
  );
}

export default FixedStaffPaymentController;
