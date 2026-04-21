import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const createBusinessProfile = async (payload) => {
  try {
    const response = await ApiInstance.post("/business-profiles/", payload);
    return response.data;
  } catch (error) {
    toast.error("Error creating business profile");
    console.error("API Error:", error);
  }
};

export const updateBusinessProfile = async (id, payload) => {
  try {
    const response = await ApiInstance.put(
      `/business-profiles/${id}/`,
      payload
    );
    return response.data;
  } catch (error) {
    toast.error("Error updating business profile");
    console.error("API Error:", error);
  }
};

export const getAllBusinessProfiles = async () => {
  try {
    const response = await ApiInstance.get("/business-profiles/");
    return response.data;
  } catch (error) {
    // Suppress error toast here as it might be empty on first load.
    console.error("API Error:", error);
    return { status: false, data: [] };
  }
};
