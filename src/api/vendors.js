import ApiInstance from "../services/ApiInstance";
import toast from "react-hot-toast";

const handleError = (message, error) => {
  console.error(message, error);
  toast.error(message);
};

// ============================================
// VENDOR FUNCTIONS
// ============================================

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

// Alias for backwards compatibility
export const getSingleVendor = getVendor;

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

// Alias for backwards compatibility
export const getVendors = fetchVendors;

// ============================================
// INGREDIENT FUNCTIONS
// (Consolidated from apis/FetchIngredient.js)
// ============================================

export const getIngredientCategories = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ingredients-categories/", { params });
    return response.data;
  } catch (error) {
    handleError("Error fetching ingredient categories", error);
    return null;
  }
};

export const getIngredientCategoryById = async (id) => {
  try {
    const response = await ApiInstance.get(`/ingredients-categories/${id}/`);
    return response.data;
  } catch (error) {
    handleError("Error fetching ingredient category details", error);
    return null;
  }
};

export const getIngredientItems = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ingredients-items/", { params });
    return response.data;
  } catch (error) {
    handleError("Error fetching ingredient items", error);
    return null;
  }
};

export const getIngredientItemById = async (id) => {
  try {
    const response = await ApiInstance.get(`/ingredients-items/${id}/`);
    return response.data;
  } catch (error) {
    handleError("Error fetching ingredient item details", error);
    return null;
  }
};