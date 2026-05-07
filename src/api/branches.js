import ApiInstance from "../services/ApiInstance";
import toast from "react-hot-toast";
import {
  ensureSuccessfulResponse,
  getApiErrorMessage,
} from "../utils/apiResponse";
import { logError } from "../utils/logger";

// ────────────────────────────────────────────────────────────────────────────
// Branch Profiles API
//
// Multi-branch support per tenant. Endpoints are tenant-scoped — call them on
// the tenant subdomain (handled automatically by ApiInstance).
//
// Tenant admins can CRUD all branches; branch users see only their own branch
// from the list endpoint (server-enforced).
// ────────────────────────────────────────────────────────────────────────────

const handleQueryError = (message, error) => {
  logError(message, error);
  toast.error(message);
  return null;
};

const handleMutationError = (errorLabel, error, fallbackMessage) => {
  logError(errorLabel, error);
  toast.error(getApiErrorMessage(error, fallbackMessage));
  return null;
};

const handleMutationSuccess = (response, successMessage, failureMessage) => {
  ensureSuccessfulResponse(response, failureMessage);
  toast.success(successMessage);
  return response;
};

export const getBranches = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/branch-profiles/", { params });
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching branches", error);
  }
};

export const getBranchById = async (id) => {
  try {
    const response = await ApiInstance.get(`/branch-profiles/${id}/`);
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching branch details", error);
  }
};

export const getBranchUsers = async (id) => {
  try {
    const response = await ApiInstance.get(`/branch-profiles/${id}/users/`);
    return response.data;
  } catch (error) {
    return handleQueryError("Error fetching branch users", error);
  }
};

export const createBranch = async (data) => {
  try {
    const response = await ApiInstance.post("/branch-profiles/", data);
    return handleMutationSuccess(
      response,
      response.data?.message || "Branch created successfully!",
      "Failed to create branch"
    );
  } catch (error) {
    return handleMutationError(
      "Error creating branch:",
      error,
      "Something went wrong! Please try again."
    );
  }
};

export const updateBranch = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/branch-profiles/${id}/`, data);
    return handleMutationSuccess(
      response,
      response.data?.message || "Branch updated successfully!",
      "Failed to update branch"
    );
  } catch (error) {
    return handleMutationError(
      "Error updating branch:",
      error,
      "Something went wrong! Please try again."
    );
  }
};

export const deleteBranch = async (id) => {
  try {
    const response = await ApiInstance.delete(`/branch-profiles/${id}/`);
    toast.success("Branch deleted successfully");
    return response;
  } catch (error) {
    return handleMutationError(
      "Error deleting branch:",
      error,
      "Failed to delete branch"
    );
  }
};

// Reassign a user to a different branch (or null to clear assignment).
// Tenant admin only.
export const changeUserBranch = async (userId, branchProfileId) => {
  try {
    const response = await ApiInstance.put(`/users/${userId}/branch/`, {
      branch_profile_id: branchProfileId,
    });
    return handleMutationSuccess(
      response,
      response.data?.message || "Branch assignment updated",
      "Failed to update branch assignment"
    );
  } catch (error) {
    return handleMutationError(
      "Error updating user branch:",
      error,
      "Failed to update branch assignment"
    );
  }
};
