import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const updateEventBooking = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/event-bookings/${id}/`, data);
    if (response.data?.status) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error("Failed to update Event Booking.");
      return null;
    }
  } catch (error) {
    console.error("Error updating event booking:", error);
    toast.error("Something went wrong! Please try again.");
    return null;
  }
};
