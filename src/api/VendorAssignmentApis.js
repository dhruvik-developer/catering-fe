import ApiInstance from "../services/ApiInstance";

export const assignItemVendor = async (data) => {
  try {
    const response = await ApiInstance.post("/event-item-configs/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignIngredientVendor = async (data) => {
  try {
    const response = await ApiInstance.post("/ingredient-vendor-assignments/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIngredientVendorAssignments = async (sessionId) => {
  try {
    const response = await ApiInstance.get(`/ingredient-vendor-assignments/?session=${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getItemVendorAssignments = async (sessionId) => {
  try {
    const response = await ApiInstance.get(`/event-item-configs/?session=${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
