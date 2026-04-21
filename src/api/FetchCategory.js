import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getCategories = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/categories/", { params });
    return response;
  } catch {
    toast.error("Error fetching categories");
  }
};

export const getCategory = getCategories;
