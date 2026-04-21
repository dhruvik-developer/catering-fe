import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getPaymentHistory = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/all-transaction/", { params });
    return response;
  } catch {
    toast.error("Error fetching payment history");
  }
};
