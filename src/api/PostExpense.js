import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import { logError } from "../utils/logger";

export const createExpense = async (data) => {
  try {
    const response = await ApiInstance.post("/expenses/", data);
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success(response.data?.message || "Expense added successfully!");
      return response;
    } else {
      toast.error("Failed to create expense.");
      return null;
    }
  } catch (error) {
    logError("Error creating expense:", error);
    // Avoid leaking the raw response body into the toast — use a friendly
    // message only. The backend's structured `message` already comes through
    // logError when running in dev.
    toast.error(
      error?.response?.data?.message ||
        "Something went wrong! Please try again."
    );
    return null;
  }
};

export const updateExpense = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/expenses/${id}/`, data);
    if (response.data?.status || response.data?.id || response.status === 200) {
      toast.success(response.data?.message || "Expense updated successfully!");
      return response;
    } else {
      toast.error("Failed to update expense.");
      return null;
    }
  } catch (error) {
    logError("Error updating expense:", error);
    toast.error("Something went wrong! Please try again.");
    return null;
  }
};

export const createExpenseCategory = async (name) => {
  try {
    const response = await ApiInstance.post("/expenses-categories/", { name });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Expense category added successfully!");
      return response;
    } else {
      toast.error("Failed to create expense category.");
      return null;
    }
  } catch (error) {
    logError("Error creating expense category:", error);
    toast.error("Error creating expense category");
    return null;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await ApiInstance.delete(`/expenses/${id}/`);
    return response;
  } catch (error) {
    logError("Error deleting expense:", error);
    throw error;
  }
};
