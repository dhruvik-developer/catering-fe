import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const updatePayment = async (id, paymentData) => {
  try {
    const response = await ApiInstance.put(`/payments/${id}/`, paymentData);
    if (response.data?.status) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error(response.data.message || "Failed to update payment");
      return null;
    }
  } catch (error) {
    console.error("Upadte Payment API Error:", error);
    toast.error("Failed to update payment");
    return null;
  }
};
