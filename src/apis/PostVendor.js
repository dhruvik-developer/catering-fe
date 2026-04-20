import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import {
  ensureSuccessfulResponse,
  getApiErrorMessage,
} from "../utils/apiResponse";

export const addVendor = async (data) => {
  try {
    const response = await ApiInstance.post("/vendors/", data);
    ensureSuccessfulResponse(response, "Failed to add vendor");
    toast.success(response.data?.message || "Vendor added successfully!");
    return response;
  } catch (error) {
    console.error("Error adding vendor:", error);
    toast.error(getApiErrorMessage(error, "Something went wrong! Please try again."));
    return null;
  }
};

export const updateVendor = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/vendors/${id}/`, data);
    ensureSuccessfulResponse(response, "Failed to update vendor");
    toast.success(response.data?.message || "Vendor updated successfully!");
    return response;
  } catch (error) {
    console.error("Error updating vendor:", error);
    toast.error(getApiErrorMessage(error, "Something went wrong! Please try again."));
    return null;
  }
};
