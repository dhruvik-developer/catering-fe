import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const createEventBooking = async (data) => {
  try {
    const response = await ApiInstance.post("/event-bookings/", data);
    if (response.data?.status) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error("Failed to create Event Booking.");
      return null;
    }
  } catch (error) {
    console.error("Error creating event booking:", error);
    toast.error("Something went wrong! Please try again.");
    return null;
  }
};
