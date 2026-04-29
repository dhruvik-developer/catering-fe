import ApiInstance from "../services/ApiInstance";

export const getTenants = async () => {
  const response = await ApiInstance.get("/tenants/");
  return response.data;
};

export const createTenant = async (data) => {
  const response = await ApiInstance.post("/tenants/", data);
  return response.data;
};

export const updateTenant = async (id, data) => {
  const response = await ApiInstance.put(`/tenants/${id}/`, data);
  return response.data;
};

export const deleteTenant = async (id) => {
  const response = await ApiInstance.delete(`/tenants/${id}/`);
  return response.data;
};

export const provisionTenant = async (id) => {
  const response = await ApiInstance.post(`/tenants/${id}/provision/`);
  return response.data;
};

export const getSubscriptionPlans = async () => {
  const response = await ApiInstance.get("/subscription-plans/");
  return response.data;
};

export const createSubscriptionPlan = async (data) => {
  const response = await ApiInstance.post("/subscription-plans/", data);
  return response.data;
};

export const updateSubscriptionPlan = async (id, data) => {
  const response = await ApiInstance.put(`/subscription-plans/${id}/`, data);
  return response.data;
};

export const deleteSubscriptionPlan = async (id) => {
  const response = await ApiInstance.delete(`/subscription-plans/${id}/`);
  return response.data;
};
