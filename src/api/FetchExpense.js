import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getExpenses = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/expenses/", { params });
    return response;
  } catch {
    toast.error("Error fetching expenses");
  }
};

export const getExpenseCategories = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/expenses-categories/", { params });
    return response;
  } catch {
    toast.error("Error fetching expense categories");
  }
};
