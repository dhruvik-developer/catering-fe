import ApiInstance from "../services/ApiInstance";
import toast from "react-hot-toast";

const handleError = (message, error) => {
  console.error(message, error);
  toast.error(message);
};

export const fetchVendors = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/vendors/", { params });
    return response.data;
  } catch (error) {
    handleError("Error fetching vendors", error);
    return null;
  }
};

export const getVendor = async (id) => {
  try {
    const response = await ApiInstance.get(`/vendors/${id}/`);
    return response.data;
  } catch (error) {
    handleError("Error fetching vendor details", error);
    return null;
  }
};

export const getVendorsByCategory = async (categoryId) => {
  try {
    const response = await ApiInstance.get("/vendors/", {
      params: { category_id: categoryId },
    });
    return response.data;
  } catch (error) {
    handleError("Error fetching vendors by category", error);
    return null;
  }
};

export const getIngredientCategories = async () => {
  try {
    const response = await ApiInstance.get("/ingredients-categories/");
    return response.data;
  } catch (error) {
    handleError("Error fetching ingredient categories", error);
    return null;
  }
};