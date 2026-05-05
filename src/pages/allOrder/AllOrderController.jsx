import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import AllOrderComponent from "./AllOrderComponent";
import { logError } from "../../utils/logger";

// Parse date string in dd-mm-yyyy OR yyyy-mm-dd format
function parseDate(str) {
  if (!str) return null;
  const ddmmyyyy = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (ddmmyyyy)
    return new Date(
      Number(ddmmyyyy[3]),
      Number(ddmmyyyy[2]) - 1,
      Number(ddmmyyyy[1])
    );
  const yyyymmdd = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (yyyymmdd)
    return new Date(
      Number(yyyymmdd[1]),
      Number(yyyymmdd[2]) - 1,
      Number(yyyymmdd[3])
    );
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import { getSingleOrder } from "../../api/FetchAllOrder";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addPayment, updateOrder } from "../../api/PostAllOrder";
import Swal from "sweetalert2";
import { useOrders } from "../../hooks/useOrders";
import { useTranslation } from "react-i18next";
import {
  flattenSelectedItemEntries,
  getSelectedItemName,
} from "../../utils/categoryTree";

function AllOrderController() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const {
    data: allOrder = [],
    isLoading: loading,
    refetch: refetchOrders,
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize date filter from search params if present
  const initDateRange = () => {
    const upcomingFilter = searchParams.get("filter") === "upcoming";
    const dateParam = searchParams.get("date");
    if (upcomingFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      sevenDaysLater.setHours(23, 59, 59, 999);
      return [today, sevenDaysLater];
    }
    if (dateParam) {
      const d = parseDate(dateParam);
      if (d && !isNaN(d.getTime())) {
         d.setHours(0,0,0,0);
         const dEnd = new Date(d);
         dEnd.setHours(23,59,59,999);
         return [d, dEnd];
      }
    }
    return [null, null];
  };

  const [dateRange, setDateRange] = useState(initDateRange);

  const handleQuickFilter = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDay = new Date();
    
    if (type === "today") {
      setDateRange([today, today]);
    } else if (type === "thisWeek") {
      const first = currentDay.getDate() - currentDay.getDay() + (currentDay.getDay() === 0 ? -6 : 1);
      const firstDay = new Date(currentDay.setDate(first));
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      lastDay.setHours(23, 59, 59, 999);
      setDateRange([firstDay, lastDay]);
    } else if (type === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      firstDay.setHours(0, 0, 0, 0);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      setDateRange([firstDay, lastDay]);
    } else if (type === "upcoming") {
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      sevenDaysLater.setHours(23, 59, 59, 999);
      setDateRange([today, sevenDaysLater]);
    } else if (type === "clear") {
      setDateRange([null, null]);
    }
  };

  // Filter orders by search query and date range
  const filteredOrders = (() => {
    let filtered = allOrder;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const nameMatch = order.name?.toLowerCase().includes(query);
        const mobileMatch = order.mobile_no?.includes(query);
        return nameMatch || mobileMatch;
      });
    }

    // Date range filter
    const [startDate, endDate] = dateRange;
    if (startDate || endDate) {
      filtered = filtered.filter((order) => {
        let eventDates = [];
        if (order.sessions && order.sessions.length > 0) {
          eventDates = order.sessions.map((s) => parseDate(s.event_date));
        } else if (order.event_date) {
          eventDates.push(parseDate(order.event_date));
        }

        const passesDateRange = eventDates.some((dateObj) => {
          if (!dateObj || isNaN(dateObj.getTime())) return false;
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
        return passesDateRange;
      });
    }

    return filtered;
  })();

  //Handle View Order
  const handleViewOrder = (id) => {
    navigate(`/order-pdf/${id}`);
  };

  //Handle View Order
  const handleShareOrder = (id) => {
    navigate(`/share-order-pdf/${id}`);
  };

  //Handle View Ingredient
  const handleViewIngredient = (id) => {
    navigate(`/view-ingredient/${id}`, {
      state: { customParents: { "view-ingredient": "all-order" } },
    });
  };

  //Handle View Ingredient for a specific session
  const handleViewIngredientBySession = (id, sessionTime) => {
    navigate(
      `/view-ingredient/${id}?session=${encodeURIComponent(sessionTime)}`,
      { state: { customParents: { "view-ingredient": "all-order" } } }
    );
  };

  //Handle View Order Details
  const handleViewOrderDetails = (id) => {
    navigate(`/view-order-details/${id}`, {
      state: { customParents: { "view-order-details": "all-order" } },
    });
  };

  const handleDownloadOrderPDF = (id) => {
    // Open preview first; download/share options are available on the PDF view page
    navigate(`/order-pdf/${id}`);
  };

  //Convert selected_item data into single array
  const transformSelectedItems = (selectedItems) => {
    if (!selectedItems || typeof selectedItems !== "object") return {};

    const transformed = {};
    flattenSelectedItemEntries(selectedItems).forEach(
      ({ categoryName, item }) => {
        const name = getSelectedItemName(item);
        if (!name) return;

        const category = categoryName || t("allOrders.completeModal.dishes");
        if (!transformed[category]) transformed[category] = [];
        transformed[category].push({ name });
      }
    );

    Object.keys(transformed).forEach((category) => {
      if (transformed[category].length === 0) {
        delete transformed[category];
      }
    });

    return transformed;
  };

  //Handle Complete Order
  const handleCompleteOrder = async (id) => {
    try {
      const response = await getSingleOrder(id);
      if (!response.data.status) {
        toast.error(t("allOrders.messages.fetchFailed"));
        return;
      }
      const orderDetails = response.data.data;
      const formatAmount = (amount) => Number(amount).toLocaleString("en-IN");
      const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const sessions =
        orderDetails.sessions && orderDetails.sessions.length > 0
          ? orderDetails.sessions
          : [orderDetails];

      let baseExtraCharge = 0;
      let baseWaiterCharge = 0;

      const sessionData = sessions.map((session) => {
        baseExtraCharge += Number(session.extra_service_amount || 0);
        baseWaiterCharge += Number(session.waiter_service_amount || 0);
        return {
          per_dish_amount: Number(session.per_dish_amount || 0),
          estimated_persons: Number(session.estimated_persons || 0),
        };
      });

      let extraServiceAmount = baseExtraCharge;
      const waiterServiceAmount = baseWaiterCharge;

      const calculateTotals = () => {
        let dishAmount = 0;
        let totalDishCount = 0;
        sessionData.forEach((s) => {
          dishAmount += s.per_dish_amount * s.estimated_persons;
          totalDishCount += s.estimated_persons;
        });
        const totalAmount = dishAmount + extraServiceAmount + waiterServiceAmount;
        const remainingAmount =
          totalAmount - Number(orderDetails.advance_amount || 0);
        return { dishAmount, totalDishCount, totalAmount, remainingAmount };
      };

      let { dishAmount, totalDishCount, totalAmount, remainingAmount } =
        calculateTotals();

      const formatSessionDate = (dateStr) => {
        if (!dateStr) return "";
        try {
          const parts = dateStr.split("-");
          if (parts.length === 3) {
            let d;
            if (parts[0].length === 4) {
              d = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
            } else {
              d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            if (!isNaN(d)) {
              const locale =
                {
                  gu: "gu-IN",
                  hi: "hi-IN",
                  en: "en-GB",
                }[(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2)] ||
                "en-GB";
              return d.toLocaleString(locale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            }
          }
        } catch {
          /* ignore */
        }
        return dateStr;
      };

      const inputsHtml =
        sessionData
          .map((session, index) => {
            const sessionTitle =
              sessions[index].event_time ||
              t("allOrders.completeModal.session", { count: index + 1 });
            const sessionDate = formatSessionDate(sessions[index].event_date);
            const displayLabel = sessionDate
              ? `${sessionTitle} (${sessionDate})`
              : sessionTitle;
              
            const initialSlotTotal = Number(session.per_dish_amount || 0) * Number(session.estimated_persons || 0);

            return `
              <div class="mb-4 bg-[var(--color-primary-tint)] p-4 rounded-xl border border-[var(--color-primary-border)]/30">
                <div class="font-bold text-left mb-3 text-[var(--color-primary)]">
                  <span>${displayLabel}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-left">
                    <label class="block text-xs font-semibold text-gray-500 mb-1">${t("allOrders.completeModal.perDishPrice")}</label> 
                    <input id="per-dish-amount-${index}" class="swal2-input custom-stock-input m-0 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] transition-all font-bold" placeholder="${t("allOrders.completeModal.pricePlaceholder")}" type="number" value="${session.per_dish_amount}">
                  </div>
                  <div class="text-left">
                    <label class="block text-xs font-semibold text-gray-500 mb-1">${t("allOrders.completeModal.dishCount")}</label> 
                    <input id="estimated-persons-${index}" class="swal2-input custom-stock-input m-0 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] transition-all font-bold" placeholder="${t("allOrders.completeModal.countPlaceholder")}" type="number" value="${session.estimated_persons}">
                  </div>
                </div>
                
                <div class="mt-3 pt-3 border-t border-[var(--color-primary-border)]/30 flex flex-col gap-2 bg-white px-3 py-2 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-gray-500">${t("allOrders.completeModal.slotTotal")}</span>
                    <span class="font-black text-[var(--color-primary-text)] text-lg" id="slot-total-${index}">₹${formatAmount(initialSlotTotal)}</span>
                  </div>
                  ${Number(sessions[index].extra_service_amount) > 0 ? `
                  <div class="flex justify-between items-center border-t border-gray-100 pt-2 mt-1">
                    <span class="text-[11px] font-bold text-[var(--color-primary-tint)]">${t("allOrders.completeModal.extraServiceCharge")}</span>
                    <span class="font-bold text-[var(--color-primary)] text-sm">₹${formatAmount(sessions[index].extra_service_amount)}</span>
                  </div>
                  ` : ''}
                  ${Number(sessions[index].waiter_service_amount) > 0 ? `
                  <div class="flex justify-between items-center border-t border-gray-100 pt-2 mt-1">
                    <span class="text-[11px] font-bold text-[var(--color-primary-tint)]">${t("allOrders.completeModal.waiterService")}</span>
                    <span class="font-bold text-[var(--color-primary)] text-sm">₹${formatAmount(sessions[index].waiter_service_amount)}</span>
                  </div>
                  ` : ''}
                </div>
              </div>
        `;
          })
          .join("");

      const { value: formValues } = await Swal.fire({
        title: `<span class="text-[20px] font-bold">${t("allOrders.completeModal.title", { name: orderDetails.name })}</span>`,
        html: ` 
          <div class="text-left overflow-y-auto max-h-[60vh] p-1 scrollbar-hide">
            ${inputsHtml}
            
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4">
              <h3 class="text-left font-bold text-gray-700 mb-3 text-sm">${t("allOrders.completeModal.orderSubtotals")}</h3>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between items-center text-gray-600">
                  <span class="font-medium">${t("allOrders.completeModal.totalDishCount")}</span>
                  <span id="total-dish-count" class="font-bold text-gray-800">${totalDishCount}</span>
                </div>
                <div class="flex justify-between items-center text-gray-600">
                  <span class="font-medium">${t("allOrders.completeModal.totalDishAmount")}</span>
                  <span id="dish-amount" class="font-bold text-gray-800">₹${formatAmount(dishAmount)}</span>
                </div>
                ${extraServiceAmount > 0 ? `
                <div class="flex justify-between items-center text-gray-600">
                  <span class="font-medium">${t("allOrders.completeModal.extraCharge")}</span>
                  <span class="font-bold text-gray-800">₹${formatAmount(extraServiceAmount)}</span>
                </div>` : ''}
                ${waiterServiceAmount > 0 ? `
                <div class="flex justify-between items-center text-gray-600">
                  <span class="font-medium">${t("allOrders.completeModal.waiterService")}</span>
                  <span class="font-bold text-gray-800">₹${formatAmount(waiterServiceAmount)}</span>
                </div>` : ''}
              </div>
              
              <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span class="font-bold text-gray-700">${t("allOrders.completeModal.totalAmount")}</span>
                <span id="total-amount" class="font-black text-[var(--color-primary)] text-lg">₹${formatAmount(totalAmount)}</span>
              </div>
            </div>

            <div class="bg-white rounded-xl p-4 border border-gray-200 mt-4 space-y-4">
              <h3 class="text-left font-bold text-gray-700 text-sm m-0">${t("allOrders.completeModal.paymentDetails")}</h3>
              
              <div class="flex justify-between items-center bg-[var(--color-primary-tint)] p-3 rounded-lg border border-[var(--color-primary-border)]/30 mb-2">
                <span class="text-xs font-semibold text-[var(--color-primary-text)]">${t("allOrders.completeModal.advancePaidAtConfirmation")}</span>
                <span class="font-bold text-[var(--color-primary-text)]">₹${formatAmount(orderDetails.advance_amount || 0)}</span>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="text-left">
                  <label class="block text-xs font-semibold text-gray-500 mb-1">${t("allOrders.completeModal.amountPaidAtCompletion")}</label> 
                  <input id="completion-payment" class="swal2-input custom-stock-input w-full m-0 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] transition-all" placeholder="${t("allOrders.completeModal.enterAmount")}" type="number">
                </div>
                <div class="text-left">
                  <label class="block text-xs font-semibold text-gray-500 mb-1">${t("quotation.confirmModal.paymentMode")}</label> 
                  <select id="payment-mode" class="swal2-input custom-stock-input w-full m-0 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] transition-all">
                    <option value="CASH">${t("paymentModes.cash")}</option>
                    <option value="ONLINE">${t("paymentModes.online")}</option>
                    <option value="CHEQUE">${t("paymentModes.cheque")}</option>
                    <option value="OTHER">${t("paymentModes.other")}</option>
                  </select>
                </div>
              </div>
              
              <div class="text-left">
                <label class="block text-xs font-semibold text-gray-500 mb-1">${t("allOrders.completeModal.noteReference")}</label> 
                <input id="payment-note" class="swal2-input custom-stock-input w-full m-0 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] transition-all" placeholder="${t("allOrders.completeModal.optionalNotes")}" type="text">
              </div>
            </div>
            
            <div class="mt-4 p-4 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/20 flex justify-between items-center">
              <span class="font-bold text-[var(--color-primary)] text-sm">${t("allOrders.completeModal.totalRemainingAmount")}</span>
              <span id="final-remaining-amount" class="text-2xl font-black text-[var(--color-primary)]">₹${formatAmount(remainingAmount)}</span>
            </div>
          </div>
        `,
        width: "600px",
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: t("common.submit"),
        confirmButtonColor: "var(--color-primary)",
        cancelButtonText: t("common.cancel"),
        customClass: {
          popup: "custom-popup",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
        didOpen: () => {
          const dishAmountSpan = document.getElementById("dish-amount");
          const totalDishCountSpan =
            document.getElementById("total-dish-count");
          const totalAmountSpan = document.getElementById("total-amount");
          const completionPaymentInput =
            document.getElementById("completion-payment");
          const finalRemainingAmountSpan = document.getElementById(
            "final-remaining-amount"
          );

          const updateCalculations = () => {
            sessionData.forEach((s, index) => {
              const perDishInput = document.getElementById(
                `per-dish-amount-${index}`
              );
              const estimatedInput = document.getElementById(
                `estimated-persons-${index}`
              );
              if (perDishInput)
                s.per_dish_amount = parseFloat(perDishInput.value) || 0;
              if (estimatedInput)
                s.estimated_persons = parseFloat(estimatedInput.value) || 0;

              const slotTotalSpan = document.getElementById(`slot-total-${index}`);
              if (slotTotalSpan) {
                slotTotalSpan.textContent = "₹" + formatAmount(s.per_dish_amount * s.estimated_persons);
              }
            });

            ({ dishAmount, totalDishCount, totalAmount, remainingAmount } =
              calculateTotals());

            if (totalDishCountSpan)
              totalDishCountSpan.textContent = totalDishCount;
            if (dishAmountSpan)
              dishAmountSpan.textContent = "₹" + formatAmount(dishAmount);
            if (totalAmountSpan)
              totalAmountSpan.textContent = "₹" + formatAmount(totalAmount);
            if (finalRemainingAmountSpan)
              finalRemainingAmountSpan.textContent = "₹" + formatAmount(remainingAmount);
          };

          sessionData.forEach((_, index) => {
            const perDishInput = document.getElementById(
              `per-dish-amount-${index}`
            );
            const estimatedInput = document.getElementById(
              `estimated-persons-${index}`
            );
            if (perDishInput)
              perDishInput.addEventListener("input", updateCalculations);
            if (estimatedInput)
              estimatedInput.addEventListener("input", updateCalculations);
          });

          if (completionPaymentInput) {
            completionPaymentInput.addEventListener("input", (event) => {
              let numericValue = event.target.value.replace(/[^0-9]/g, "");
              if (parseFloat(numericValue) < 0) {
                numericValue = "0";
              }
              event.target.value = numericValue;
              const completionPayment = parseFloat(numericValue) || 0;
              const newRemainingAmount = remainingAmount - completionPayment;
              if (finalRemainingAmountSpan)
                finalRemainingAmountSpan.textContent = "₹" + formatAmount(newRemainingAmount);
            });
          }
        },
        preConfirm: () => {
          const completionPaymentInput =
            document.getElementById("completion-payment");
          const paymentModeInput = document.getElementById("payment-mode");
          const paymentNoteInput = document.getElementById("payment-note");

          const completionPayment = completionPaymentInput
            ? parseFloat(completionPaymentInput.value.trim()) || 0
            : 0;

          if (completionPayment > remainingAmount) {
            Swal.showValidationMessage(
              t("allOrders.completeModal.paymentExceeds", {
                amount: formatAmount(remainingAmount),
              })
            );
            return false;
          }

          const paymentMode = paymentModeInput
            ? paymentModeInput.value
            : "CASH";
          const paymentNote = paymentNoteInput
            ? paymentNoteInput.value.trim()
            : "";

          const updatedAdvanceAmount =
            Number(orderDetails.advance_amount || 0) +
            Number(completionPayment);

          // Update session data one last time before submitting
          sessionData.forEach((s, index) => {
            const perDishInput = document.getElementById(
              `per-dish-amount-${index}`
            );
            const estimatedInput = document.getElementById(
              `estimated-persons-${index}`
            );
            if (perDishInput)
              s.per_dish_amount = parseFloat(perDishInput.value) || 0;
            if (estimatedInput)
              s.estimated_persons = parseFloat(estimatedInput.value) || 0;
          });

          return {
            sessionData,
            advance_amount: updatedAdvanceAmount,
            status: "done",
            completion_payment: completionPayment,
            payment_mode: paymentMode,
            payment_note: paymentNote,
          };
        },
      });

      if (formValues) {
        try {
          const updatedOrder = {
            ...orderDetails,
            advance_amount: formValues.advance_amount,
            status: "done",
            per_dish_amount:
              formValues.sessionData && formValues.sessionData.length > 0
                ? formValues.sessionData[0].per_dish_amount
                : orderDetails.per_dish_amount,
            estimated_persons:
              formValues.sessionData && formValues.sessionData.length > 0
                ? formValues.sessionData[0].estimated_persons
                : orderDetails.estimated_persons,
            sessions: orderDetails.sessions
              ? orderDetails.sessions.map((session, index) => ({
                  ...session,
                  per_dish_amount:
                    formValues.sessionData[index]?.per_dish_amount,
                  estimated_persons:
                    formValues.sessionData[index]?.estimated_persons,
                  selected_items: transformSelectedItems(
                    session.selected_items
                  ),
                }))
              : [],
          };

          const updateResponse = await updateOrder(id, updatedOrder);
          if (!updateResponse) return;

          //Calling Add-Payment API
          const paymentPayload = {
            booking: id,
            total_amount: totalAmount,
            pending_amount: totalAmount - formValues.advance_amount,
            advance_amount: formValues.advance_amount,
            payment_date: formatDate(new Date()),
            transaction_amount: formValues.completion_payment || 0,
            settlement_amount: 0,
            payment_mode: formValues.payment_mode,
            note: formValues.payment_note || t("quotation.confirmModal.paymentNote"),
            total_extra_amount: extraServiceAmount + waiterServiceAmount,
          };
          const paymentResponse = await addPayment(paymentPayload);
          if (paymentResponse) {
            toast.success(t("allOrders.messages.confirmSuccess"));
            refetchOrders();
            queryClient.invalidateQueries({ queryKey: ["payment-history"] });
            window.dispatchEvent(new Event("orderStatusChanged"));
          }
        } catch (error) {
          toast.error(t("allOrders.messages.confirmFailed"));
          logError(error);
        }
      }
    } catch (error) {
      toast.error(t("allOrders.messages.confirmFailed"));
      logError(error);
    }
  };

  // Handle Delete Order
  const handleDeleteAllOrder = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/event-bookings",
      name: t("entities.order"),
      successMessage: t("allOrders.messages.deleteSuccess"),
      onSuccess: () => {
        refetchOrders();
        window.dispatchEvent(new Event("orderStatusChanged"));
      },
      method: "PUT",
      payload: { status: "cancelled" },
    });
  };
  return (
    <AllOrderComponent
      allOrder={filteredOrders}
      totalCount={allOrder.length}
      loading={loading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      dateRange={dateRange}
      setDateRange={setDateRange}
      handleQuickFilter={handleQuickFilter}
      handleViewOrder={handleViewOrder}
      handleShareOrder={handleShareOrder}
      handleViewIngredient={handleViewIngredient}
      handleViewIngredientBySession={handleViewIngredientBySession}
      handleCompleteOrder={handleCompleteOrder}
      handleDeleteAllOrder={handleDeleteAllOrder}
      handleViewOrderDetails={handleViewOrderDetails}
      handleDownloadOrderPDF={handleDownloadOrderPDF}
    />
  );
}

export default AllOrderController;
