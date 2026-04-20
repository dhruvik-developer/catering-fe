import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getQuotation = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/pending-event-bookings/", {
      params,
    });
    return response;
  } catch {
    toast.error("Error fetching quotation");
  }
};

export const getSingleQuotation = async (id) => {
  try {
    const response = await ApiInstance.get(`/event-bookings/${id}/`);
    return response;
  } catch (error) {
    toast.error("Error fetching quotation details");
    console.error("API Error:", error);
  }
};
