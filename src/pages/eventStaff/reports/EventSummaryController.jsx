import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getAllAssignments,
  updateAssignment,
} from "../../../api/EventStaffApis";
import EventSummaryComponent from "./EventSummaryComponent";

function EventSummaryController() {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [staffType, setStaffType] = useState("All");

  const fetchSummary = async (typeFilter) => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter && typeFilter !== "All") {
        params.staff_type = typeFilter;
      }
      const response = await getAllAssignments(params);
      if (response?.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        // Group by Staff
        const staffMap = {};

        data.forEach((assignment) => {
          const staffId = assignment.staff;
          if (!staffMap[staffId]) {
            staffMap[staffId] = {
              staff_id: staffId,
              staff_name: assignment.staff_name || "Unknown Staff",
              staff_type: assignment.staff_type || "Unknown",
              total_amount: 0,
              total_paid: 0,
              total_pending: 0,
              events: [],
            };
          }

          const amount = parseFloat(assignment.total_amount || 0);
          const paid = parseFloat(assignment.paid_amount || 0);
          const pending = parseFloat(assignment.remaining_amount || 0);

          staffMap[staffId].total_amount += amount;
          staffMap[staffId].total_paid += paid;
          staffMap[staffId].total_pending += pending;

          staffMap[staffId].events.push(assignment);
        });

        setSummaryData(Object.values(staffMap));
      } else {
        toast.error("Failed to fetch event summary report");
      }
    } catch (error) {
      toast.error("Error fetching report data");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(staffType);
  }, [staffType]);

  const handleStaffTypeChange = (e) => {
    setStaffType(e.target.value);
  };

  const handlePayClick = async (assignment) => {
    const remainingStr = parseFloat(assignment.remaining_amount || 0).toFixed(
      2
    );
    const { value: paymentAmount } = await Swal.fire({
      title: `Pay Staff For Event`,
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
      inputAttributes: {
        min: 0,
        max: remainingStr,
        step: 0.01,
      },
      showCancelButton: true,
      confirmButtonText: "Submit Payment",
      confirmButtonColor: "#845cbd",
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
        // Calculate new totals
        const newPaidAmount =
          parseFloat(assignment.paid_amount || 0) + parseFloat(paymentAmount);
        const newRemainingAmount =
          parseFloat(assignment.total_amount || 0) - newPaidAmount;
        const newStatus = newRemainingAmount <= 0 ? "Paid" : "Pending"; // Backend logic uses Pending instead of Partial in Assignments usually

        // Prepare API Payload for Partial Update
        const payload = {
          ...assignment, // Send existing standard structure so backend validations don't fail for required fields
          paid_amount: newPaidAmount,
          remaining_amount: newRemainingAmount,
          payment_status: newStatus,
        };

        // Exclude read-only nested or dynamic properties if needed (backend usually ignores, but just in case)
        delete payload.staff_name;
        delete payload.session_name;

        const res = await updateAssignment(assignment.id, payload);
        if (res?.data) {
          toast.success(`Payment of ₹ ${paymentAmount} recorded successfully!`);
          fetchSummary(staffType); // Refresh grid
        } else {
          toast.error("Failed to update payment.");
        }
      } catch (error) {
        toast.error("Error processing payment update");
        console.error("Payment Update Error:", error);
      }
    }
  };

  return (
    <EventSummaryComponent
      loading={loading}
      summaryData={summaryData}
      staffType={staffType}
      onStaffTypeChange={handleStaffTypeChange}
      onPayClick={handlePayClick}
    />
  );
}

export default EventSummaryController;
