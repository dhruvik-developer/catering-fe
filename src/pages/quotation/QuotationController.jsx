import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import QuotationComponent from "./QuotationComponent";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import { getSingleQuotation } from "../../api/FetchQuotation";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { updateQuotation } from "../../api/PostQuotation";
import { addPayment } from "../../api/PostAllOrder";
import { useQuotations } from "../../hooks/useQuotations";
import { useTranslation } from "react-i18next";

function QuotationController() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: quotation = [],
    isLoading: loading,
    refetch: refetchQuotations,
  } = useQuotations();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  const handleQuickFilter = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === "today") {
      setDateRange([today, today]);
    } else if (type === "next7Days") {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 6);
      nextWeek.setHours(23, 59, 59, 999);
      setDateRange([today, nextWeek]);
    } else if (type === "next30Days") {
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 29);
      nextMonth.setHours(23, 59, 59, 999);
      setDateRange([today, nextMonth]);
    } else if (type === "clear") {
      setDateRange([null, null]);
    }
  };

  //Handle View Quotation
  const handleViewQuotation = (id) => {
    navigate(`/quotation-pdf/${id}`);
  };

  //Handle Edit Order
  const handleEditOrder = (id) => {
    navigate(`/edit-dish/${id}`, { state: { from: "quotation" } });
  };

  //Convert selected_item data into single array
  const transformSelectedItems = (selectedItems) => {
    if (!selectedItems || typeof selectedItems !== "object") return {};

    const transformed = {};
    Object.keys(selectedItems).forEach((category) => {
      transformed[category] = selectedItems[category]
        .map((item) => {
          if (typeof item === "object" && item.name && item.name.name) {
            return { name: item.name.name };
          }
          if (typeof item === "object" && item.name) {
            return { name: item.name };
          }
          return { name: item };
        })
        .filter((item) => item && item.name);
    });
    return transformed;
  };

  //Handle Confirm Quotation
  const handleCompleteQuotation = async (id) => {
    try {
      const response = await getSingleQuotation(id);
      if (!response.data.status) {
        toast.error(t("quotation.messages.fetchFailed"));
        return;
      }
      const quotationDetails = response.data.data;

      // Calculate Total Order Amount
      let totalOrderAmount = 0;
      if (quotationDetails.sessions && quotationDetails.sessions.length > 0) {
        quotationDetails.sessions.forEach((session) => {
          const dishTotal =
            Number(session.per_dish_amount || 0) *
            Number(session.estimated_persons || 0);
          totalOrderAmount += dishTotal;

          // Add extra service charges
          if (session.extra_service && session.extra_service.length > 0) {
            session.extra_service.forEach((service) => {
              if (Object.keys(service).length > 0 && service.amount) {
                totalOrderAmount += Number(service.amount || 0);
              }
            });
          }

          // Add waiter service charges
          totalOrderAmount += Number(session.waiter_service_amount || 0);
        });
      } else {
        totalOrderAmount =
          Number(quotationDetails.per_dish_amount || 0) *
            Number(quotationDetails.estimated_persons || 0) +
          Number(quotationDetails.extra_service_amount || 0) +
          Number(quotationDetails.waiter_service_amount || 0);
      }

      const formatAmount = (amount) =>
        Number(amount || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const { value: formValues } = await Swal.fire({
        title: t("quotation.confirmModal.title", {
          name: quotationDetails.name,
        }),
        html:
          `<div style="margin-bottom: 20px; padding: 12px; background: #fdfae8; border: 1px solid #fce88a; border-radius: 8px; text-align: center;">
                        <span style="font-size: 14px; color: #8a6d3b; font-weight: 600;">${t("quotation.confirmModal.totalOrderAmount")}</span><br/>
                        <span style="font-size: 22px; color: var(--color-primary); font-weight: 800;">₹ ${formatAmount(totalOrderAmount)}</span>
                    </div>` +
          `<label class="custom-stock-label">${t("quotation.confirmModal.paymentMode")}</label>` +
          '<select id="payment-type" class="swal2-input custom-stock-input">' +
          `<option value="CASH" selected>${t("paymentModes.cash")}</option>` +
          `<option value="CHEQUE">${t("paymentModes.cheque")}</option>` +
          `<option value="BANK_TRANSFER">${t("paymentModes.bank_transfer")}</option>` +
          `<option value="ONLINE">${t("paymentModes.online")}</option>` +
          `<option value="OTHER">${t("paymentModes.other")}</option>` +
          "</select>" +
          `<label class="custom-stock-label">${t("quotation.confirmModal.advanceAmount")}</label>` +
          `<input id="payment-amount" class="swal2-input custom-stock-input" placeholder="${t("quotation.confirmModal.advancePlaceholder")}" type="number" min="0">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: t("quotation.actions.confirm"),
        confirmButtonColor: "var(--color-primary)",
        cancelButtonText: t("common.cancel"),
        customClass: {
          popup: "custom-popup",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
        preConfirm: () => {
          const advanceAmount = document
            .getElementById("payment-amount")
            .value.trim();
          const advanceAmountNum = Number(advanceAmount) || 0;

          if (advanceAmountNum > totalOrderAmount) {
            Swal.showValidationMessage(
              t("quotation.confirmModal.advanceExceeds", {
                amount: formatAmount(totalOrderAmount),
              })
            );
            return false;
          }

          return {
            advance_payment_mode: document.getElementById("payment-type").value,
            advance_amount: advanceAmount === "" ? "0" : advanceAmount,
            status: "confirm",
          };
        },
      });

      if (formValues) {
        try {
          const updatedQuotation = {
            ...quotationDetails,
            advance_payment_mode: formValues.advance_payment_mode,
            advance_amount: formValues.advance_amount,
            status: "confirm",
            sessions: quotationDetails.sessions
              ? quotationDetails.sessions.map((session) => ({
                  ...session,
                  selected_items: transformSelectedItems(
                    session.selected_items
                  ),
                }))
              : [],
          };

          const updateResponse = await updateQuotation(id, updatedQuotation);

          if (updateResponse) {
            // save transaction into payments table
            const paymentPayload = {
              booking: id,
              total_amount: totalOrderAmount,
              pending_amount:
                totalOrderAmount - Number(formValues.advance_amount || 0),
              advance_amount: Number(formValues.advance_amount || 0),
              payment_date: formatDate(new Date()),
              transaction_amount: Number(formValues.advance_amount || 0),
              settlement_amount: 0,
              payment_mode: formValues.advance_payment_mode || "CASH",
              note: t("quotation.confirmModal.paymentNote"),
              total_extra_amount:
                Number(quotationDetails.extra_service_amount || 0) +
                Number(quotationDetails.waiter_service_amount || 0),
            };

            await addPayment(paymentPayload);
            refetchQuotations();
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["payment-history"] });
          }
        } catch (error) {
          toast.error(t("quotation.messages.confirmFailed"));
          console.error(error);
        }
      }
    } catch (error) {
      toast.error(t("quotation.messages.confirmFailed"));
      console.error(error);
    }
  };

  // Handle Delete Quotation
  const handleDeleteQuotation = async (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/event-bookings",
      name: t("entities.quotation"),
      successMessage: t("quotation.messages.deleteSuccess"),
      onSuccess: refetchQuotations,
      method: "PUT",
      payload: { status: "cancelled" },
    });
  };

  // Filter quotations by search query and date
  const filteredQuotation = quotation.filter((q) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const nameMatch = q.name?.toLowerCase().includes(query);
      const mobileMatch = q.mobile_no?.includes(query);
      if (!nameMatch && !mobileMatch) return false;
    }
    // Date range filter
    const [startDate, endDate] = dateRange;
    if (startDate || endDate) {
      let eventDates = [];
      if (q.sessions && q.sessions.length > 0) {
        eventDates = q.sessions.map((s) => {
          if (!s.event_date) return new Date(NaN);
          const parts = s.event_date.split("-");
          if (parts.length < 3) return new Date(NaN);
          if (parts[0].length === 4) return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        });
      } else if (q.event_date) {
         const parts = q.event_date.split("-");
         if (parts.length === 3) {
           if (parts[0].length === 4) eventDates.push(new Date(`${parts[0]}-${parts[1]}-${parts[2]}`));
           else eventDates.push(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`));
         }
      }

      const passesDateRange = eventDates.some((dateObj) => {
        if (isNaN(dateObj.getTime())) return false;
        dateObj.setHours(0,0,0,0);
        
        const start = startDate ? new Date(startDate) : null;
        if (start) start.setHours(0,0,0,0);
        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23,59,59,999);

        if (start && end) {
          return dateObj >= start && dateObj <= end;
        } else if (start) {
          return dateObj >= start; 
        } else if (end) {
          return dateObj <= end;
        }
        return false;
      });
      
      if (!passesDateRange) return false;
    }
    return true;
  });

  return (
    <QuotationComponent
      loading={loading}
      quotation={filteredQuotation}
      totalCount={quotation.length}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleQuickFilter={handleQuickFilter}
      handleViewQuotation={handleViewQuotation}
      handleEditOrder={handleEditOrder}
      handleCompleteQuotation={handleCompleteQuotation}
      handleDeleteQuotation={handleDeleteQuotation}
    />
  );
}

export default QuotationController;
