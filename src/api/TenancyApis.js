import ApiInstance from "../services/ApiInstance";

export const getTenants = async () => {
  try {
    const response = await ApiInstance.get("/tenants/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTenant = async (data) => {
  try {
    const response = await ApiInstance.post("/tenants/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTenant = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/tenants/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const provisionTenant = async (id) => {
  try {
    const response = await ApiInstance.post(`/tenants/${id}/provision/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionPlans = async () => {
  try {
    const response = await ApiInstance.get("/subscription-plans/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
