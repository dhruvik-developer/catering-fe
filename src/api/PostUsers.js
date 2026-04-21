import ApiInstance from "../services/ApiInstance";
import {
  ensureSuccessfulResponse,
  getApiErrorMessage,
} from "../utils/apiResponse";

export const addUser = async (payload) => {
  try {
    const response = await ApiInstance.post("/users/", payload);
    return ensureSuccessfulResponse(response, "Failed to create user");
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to create user"));
  }
};

export const updateUserPassword = async (id, data) => {
  try {
    const response = await ApiInstance.post(`/change-password/${id}/`, data);
    ensureSuccessfulResponse(response, "Failed to change password");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to change password"));
  }
};
