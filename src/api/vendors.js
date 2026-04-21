import ApiInstance from "../services/ApiInstance";
import toast from "react-hot-toast";
import { queryClient } from "../lib/queryClient";
import {
  ensureSuccessfulResponse,
  getApiErrorMessage,
} from "../utils/apiResponse";

const handleQueryError = (message, error) => {
  console.error(message, error);
  toast.error(message);
  return null;
};

const handleMutationError = (
  errorLabel,
  error,
  fallbackMessage,
  failureValue = null
) => {
  console.error(errorLabel, error);
  toast.error(getApiErrorMessage(error, fallbackMessage));
  return failureValue;
};

const handleMutationSuccess = (response, successMessage, failureMessage) => {
  ensureSuccessfulResponse(response, failureMessage);
  toast.success(successMessage);
  queryClient.invalidateQueries({ queryKey: ["vendors"] });
  return response;
};

export const getVendors = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/vendors/", { params });
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching vendors", error);
  }
};

export const fetchVendors = getVendors;

export const getVendorById = async (id) => {
  try {
    const response = await ApiInstance.get(`/vendors/${id}/`);
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching vendor details", error);
  }
};

export const getVendor = getVendorById;
export const getSingleVendor = getVendorById;

export const getVendorsByCategory = async (categoryId) => {
  try {
    const response = await ApiInstance.get("/vendors/", {
      params: { category_id: categoryId },
    });
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching vendors by category", error);
  }
};

export const createVendor = async (data) => {
  try {
    const response = await ApiInstance.post("/vendors/", data);
    return handleMutationSuccess(
      response,
      response.data?.message || "Vendor added successfully!",
      "Failed to add vendor"
    );
  } catch (error) {
    return handleMutationError(
      "Error adding vendor:",
      error,
      "Something went wrong! Please try again."
    );
  }
};

export const addVendor = createVendor;

export const updateVendor = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/vendors/${id}/`, data);
    return handleMutationSuccess(
      response,
      response.data?.message || "Vendor updated successfully!",
      "Failed to update vendor"
    );
  } catch (error) {
    return handleMutationError(
      "Error updating vendor:",
      error,
      "Something went wrong! Please try again."
    );
  }
};

export const getIngredientCategories = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ingredients-categories/", {
      params,
    });
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching ingredient categories", error);
  }
};

export const getIngredientCategoryById = async (id) => {
  try {
    const response = await ApiInstance.get(`/ingredients-categories/${id}/`);
    return response.data;
  } catch (error) {
    return handleQueryError(
      "Error fetching ingredient category details",
      error
    );
  }
};

export const createIngredientCategory = async (name, isCommon = false) => {
  try {
    const response = await ApiInstance.post("/ingredients-categories/", {
      name,
      is_common: isCommon,
    });
    return handleMutationSuccess(
      response,
      "Ingredient Category added successfully!",
      "Failed to add ingredient category"
    );
  } catch (error) {
    return handleMutationError(
      "Add Category API Error:",
      error,
      "Failed to add ingredient category"
    );
  }
};

export const addIngredientCategory = createIngredientCategory;

export const getIngredientItems = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ingredients-items/", { params });
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching ingredient items", error);
  }
};

export const getIngredientItemById = async (id) => {
  try {
    const response = await ApiInstance.get(`/ingredients-items/${id}/`);
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching ingredient item details", error);
  }
};

export const createIngredientItem = async (itemName, category) => {
  if (!itemName.trim() || !category) {
    toast.error("Ingredient Item name and category are required");
    return null;
  }

  try {
    const response = await ApiInstance.post("/ingredients-items/", {
      name: itemName,
      category,
    });
    return handleMutationSuccess(
      response,
      "Ingredient item created successfully!",
      "Failed to create ingredient item"
    );
  } catch (error) {
    return handleMutationError(
      "Item Creation API Error:",
      error,
      "Error creating ingredient item"
    );
  }
};

export const addIngredientItem = createIngredientItem;
