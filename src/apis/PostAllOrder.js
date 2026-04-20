import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

// Re-export updateEventBooking as updateOrder for backward compatibility
// Both use the same PUT /event-bookings/:id/ endpoint
import { updateEventBooking } from "./PutEventBooking";
export const updateOrder = updateEventBooking;

export const addPayment = async (paymentPayload) => {
  try {
    const response = await ApiInstance.post("/payments/", paymentPayload);
    if (response.data.status) {
      return response.data;
    } else {
      toast.error(response.data.message);
      return null;
    }
  } catch (error) {
    toast.error("Failed to process payment");
    console.error(error);
    return null;
  }
};