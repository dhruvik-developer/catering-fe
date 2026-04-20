import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getItem = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/branch-items/", { params });
    return response;
  } catch (error) {
    console.error("Get Items API Error:", error);
    toast.error("Error fetching items");
    return null;
  }
};

export const getItemById = async (id) => {
  try {
    const response = await ApiInstance.get(`/branch-items/${id}/`);
    return response;
  } catch (error) {
    console.error("Get Item By ID API Error:", error);
    toast.error("Error fetching item details");
    return null;
  }
};

export const createItem = async (data) => {
  try {
    const response = await ApiInstance.post("/branch-items/", data);
    if (response.status === 201 || response.status === 200) {
      toast.success("Item created successfully!");
      return response;
    }
    return response;
  } catch (error) {
    console.error("Create Item API Error:", error);
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    toast.error(`Error creating item: ${errorMsg}`);
    return null;
  }
};

export const updateItem = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/branch-items/${id}/`, data);
    if (response.status === 200) {
      toast.success("Item updated successfully!");
      return response;
    }
    return response;
  } catch (error) {
    console.error("Update Item API Error:", error);
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    toast.error(`Error updating item: ${errorMsg}`);
    return null;
  }
};

export const patchItem = async (id, data) => {
  try {
    const response = await ApiInstance.patch(`/branch-items/${id}/`, data);
    if (response.status === 200) {
      toast.success("Item updated successfully!");
      return response;
    }
    return response;
  } catch (error) {
    console.error("Patch Item API Error:", error);
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    toast.error(`Error updating item: ${errorMsg}`);
    return null;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await ApiInstance.delete(`/branch-items/${id}/`);
    if (response.status === 204 || response.status === 200) {
      toast.success("Item deleted successfully!");
      return response;
    }
    return response;
  } catch (error) {
    console.error("Delete Item API Error:", error);
    toast.error("Error deleting item");
    return null;
  }
};
