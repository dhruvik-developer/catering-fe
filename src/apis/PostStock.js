import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const addStockCategory = async (name) => {
  try {
    const response = await ApiInstance.post("/stoke-categories/", { name });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Category added successfully!");
      return response;
    } else {
      toast.error("Failed to add category");
      return null;
    }
  } catch (error) {
    console.error("Add Category API Error:", error);
    toast.error("Failed to add category");
    return null;
  }
};

export const addStockItem = async (itemData) => {
  try {
    const response = await ApiInstance.post("/stoke-items/", itemData);
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Item added successfully!");
      return response;
    } else {
      toast.error("Failed to add item");
      return null;
    }
  } catch (error) {
    console.error("Add Stock Item API Error:", error);
    toast.error("Failed to add item");
    return null;
  }
};

export const increaseStockItem = async (stockData) => {
  try {
    const response = await ApiInstance.put("/add-stoke-item/", stockData);
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success(response.data?.message || "Stock added successfully");
      return response;
    } else {
      toast.error(response.data?.message || "Failed to add stock");
      return null;
    }
  } catch (error) {
    console.error("Increase Stock API Error:", error);
    toast.error("Failed to add stock");
    return null;
  }
};

export const decreaseStockItem = async (stockData) => {
  try {
    const response = await ApiInstance.post("/add-stoke-item/", stockData);
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success(response.data?.message || "Stock removed successfully");
      return response;
    } else {
      toast.error(response.data?.message || "Failed to remove stock");
      return null;
    }
  } catch (error) {
    console.error("Decrease Stock API Error:", error);
    toast.error("Failed to remove stock");
    return null;
  }
};
