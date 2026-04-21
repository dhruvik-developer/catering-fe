import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

/**
 * GROUND CATEGORIES
 */

export const getGroundCategories = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ground/categories/", { params });
    return response;
  } catch (error) {
    toast.error("Error fetching ground categories");
    throw error;
  }
};

export const createGroundCategory = async (data) => {
  try {
    const response = await ApiInstance.post("/ground/categories/", data);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error creating category");
    throw error;
  }
};

export const updateGroundCategory = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/ground/categories/${id}/`, data);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error updating category");
    throw error;
  }
};

export const deleteGroundCategory = async (id) => {
  try {
    const response = await ApiInstance.delete(`/ground/categories/${id}/`);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error deleting category");
    throw error;
  }
};

/**
 * GROUND ITEMS
 */

export const getGroundItems = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ground/items/", { params });
    return response;
  } catch (error) {
    toast.error("Error fetching ground items");
    throw error;
  }
};

export const createGroundItem = async (data) => {
  try {
    const response = await ApiInstance.post("/ground/items/", data);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error creating ground item");
    throw error;
  }
};

export const updateGroundItem = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/ground/items/${id}/`, data);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error updating ground item");
    throw error;
  }
};

export const deleteGroundItem = async (id) => {
  try {
    const response = await ApiInstance.delete(`/ground/items/${id}/`);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error deleting ground item");
    throw error;
  }
};

/**
 * EVENT GROUND REQUIREMENTS
 */

export const getEventGroundRequirements = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ground/event-requirements/", { params });
    return response;
  } catch (error) {
    toast.error("Error fetching event ground requirements");
    throw error;
  }
};

export const createEventGroundRequirements = async (data) => {
  try {
    const response = await ApiInstance.post("/ground/event-requirements/", data);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error assigning requirements");
    throw error;
  }
};

export const updateEventGroundRequirement = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/ground/event-requirements/${id}/`, data);
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error updating requirement");
    throw error;
  }
};
