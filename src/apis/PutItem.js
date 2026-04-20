import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const updateItemCosts = async (itemId, base_cost, selection_rate) => {
  try {
    const response = await ApiInstance.put(`/items/${itemId}/`, {
      base_cost,
      selection_rate,
    });
    if (
      response.data?.status ||
      response.status === 200 ||
      response.status === 204
    ) {
      toast.success("Prices updated successfully!");
      return response;
    } else {
      toast.error("Failed to update prices.");
      return null;
    }
  } catch (error) {
    console.error("Update Item Costs API Error:", error);
    toast.error("Error updating prices.");
    return null;
  }
};

export const updateItem = async (itemId, itemData) => {
  try {
    const response = await ApiInstance.put(`/items/${itemId}/`, itemData);
    if (
      response.data?.status ||
      response.status === 200 ||
      response.status === 204
    ) {
      toast.success("Item updated successfully!");
      return response;
    } else {
      toast.error("Failed to update item.");
      return null;
    }
  } catch (error) {
    console.error("Update Item API Error:", error);
    toast.error("Error updating item.");
    return null;
  }
};
