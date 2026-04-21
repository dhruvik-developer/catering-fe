import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import {
  ensureSuccessfulResponse,
  getApiErrorMessage,
} from "../utils/apiResponse";

const handleQueryError = (errorMessage, error, fallbackValue) => {
  console.error(errorMessage, error);
  toast.error(errorMessage);
  return fallbackValue;
};

const handleMutationSuccess = (response, successMessage, failureMessage) => {
  ensureSuccessfulResponse(response, failureMessage);
  toast.success(successMessage);
  return response;
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

export const getCategories = async (params = {}) => {
  try {
    return await ApiInstance.get("/categories/", { params });
  } catch (error) {
    return handleQueryError("Error fetching categories", error, undefined);
  }
};

export const createCategory = async (categoryName) => {
  try {
    const response = await ApiInstance.post("/categories/", {
      name: categoryName,
    });

    return handleMutationSuccess(
      response,
      "Category created successfully!",
      "Failed to create category"
    );
  } catch (error) {
    return handleMutationError(
      "Category Creation API Error:",
      error,
      "Error creating category"
    );
  }
};

export const updateCategory = async (categoryId, newName) => {
  try {
    const response = await ApiInstance.put(`/categories/${categoryId}/`, {
      name: newName,
    });

    return handleMutationSuccess(
      response,
      "Category updated successfully!",
      "Failed to update category"
    );
  } catch (error) {
    return handleMutationError(
      "Category Update API Error:",
      error,
      "Error updating category"
    );
  }
};

export const createItem = async (
  itemName,
  category,
  base_cost = 0,
  selection_rate = 0
) => {
  if (!itemName.trim() || !category) {
    toast.error("Item name and category are required");
    return null;
  }

  try {
    const response = await ApiInstance.post("/items/", {
      name: itemName,
      category,
      base_cost,
      selection_rate,
    });

    return handleMutationSuccess(
      response,
      "Item created successfully!",
      "Failed to create item"
    );
  } catch (error) {
    return handleMutationError(
      "Item Creation API Error:",
      error,
      "Error creating item"
    );
  }
};

export const updateItemCosts = async (itemId, base_cost, selection_rate) => {
  try {
    const response = await ApiInstance.put(`/items/${itemId}/`, {
      base_cost,
      selection_rate,
    });

    return handleMutationSuccess(
      response,
      "Prices updated successfully!",
      "Failed to update prices."
    );
  } catch (error) {
    return handleMutationError(
      "Update Item Costs API Error:",
      error,
      "Error updating prices."
    );
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    const response = await ApiInstance.put(`/items/${itemId}/`, itemData);

    return handleMutationSuccess(
      response,
      "Item updated successfully!",
      "Failed to update item."
    );
  } catch (error) {
    return handleMutationError(
      "Update Item API Error:",
      error,
      "Error updating item."
    );
  }
};

export const swapCategories = async (categoryId, position) => {
  if (!position) {
    toast.error("Category position is required");
    return null;
  }

  try {
    const response = await ApiInstance.post(
      `/category-positions-changes/${categoryId}/`,
      { positions: position }
    );

    ensureSuccessfulResponse(response, "Failed to update category position");
    toast.success(response.data?.message || "Category position updated");
    return response;
  } catch (error) {
    return handleMutationError(
      "Category Position Change API Error:",
      error,
      "Error updating category position"
    );
  }
};
