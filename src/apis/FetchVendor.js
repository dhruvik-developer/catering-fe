import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getVendors = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/vendors/", { params });
    return response;
  } catch {
    toast.error("Error fetching vendors");
  }
};

export const getSingleVendor = async (id) => {
  try {
    const response = await ApiInstance.get(`/vendors/${id}/`);
    return response;
  } catch (error) {
    toast.error("Error fetching vendor details");
    console.error("API Error:", error);
  }
};

export const getVendorsByCategory = async (categoryId) => {
  try {
    const response = await ApiInstance.get("/vendors/", {
      params: { category_id: categoryId },
    });
    return response;
  } catch {
    toast.error("Error fetching vendors by category");
  }
};

export const getIngredientCategories = async () => {
  try {
    const response = await ApiInstance.get("/ingredients-categories/");
    return response;
  } catch (error) {
    console.error("Get Ingredient Categories API Error:", error);
    toast.error("Error fetching ingredient categories");
    return null;
  }
};
