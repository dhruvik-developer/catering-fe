import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getStockCategory = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/stoke-categories/", { params });
    return response;
  } catch {
    toast.error("Error fetching stock categories");
  }
};
