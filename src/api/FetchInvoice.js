import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getInvoice = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/payments/", { params });
    return response;
  } catch {
    toast.error("Error fetching invoice");
  }
};
