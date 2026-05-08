import ApiInstance from "../services/ApiInstance";

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const fetchLeads = async (params = {}) => {
  const response = await ApiInstance.get(`/leads/${buildQuery(params)}`, {
    dedupe: false,
  });
  return response.data;
};

export const fetchLeadStats = async () => {
  const response = await ApiInstance.get("/leads/stats/", { dedupe: false });
  return response.data;
};

export const fetchLeadById = async (id) => {
  const response = await ApiInstance.get(`/leads/${id}/`);
  return response.data;
};

export const updateLead = async (id, payload) => {
  const response = await ApiInstance.patch(`/leads/${id}/`, payload);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await ApiInstance.delete(`/leads/${id}/`);
  return response.data;
};
