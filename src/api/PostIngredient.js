import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const addIngredientCategory = async (name, isCommon = false) => {
  try {
    const response = await ApiInstance.post("/ingredients-categories/", {
      name,
      is_common: isCommon,
    });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Ingredient Category added successfully!");
      return response;
    } else {
      toast.error("Failed to add ingredient category");
      return null;
    }
  } catch (error) {
    console.error("Add Category API Error:", error);
    toast.error(
      error?.response?.data
        ? JSON.stringify(error.response.data).substring(0, 100)
        : "Failed to add ingredient category"
    );
    return null;
  }
};

export const addIngredientItem = async (itemName, category) => {
  if (!itemName.trim() || !category) {
    toast.error("Ingredient Item name and category are required");
    return null;
  }

  try {
    const response = await ApiInstance.post("/ingredients-items/", {
      name: itemName,
      category,
    });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Ingredient item created successfully!");
      return response;
    } else {
      toast.error("Failed to create ingredient item");
      return null;
    }
  } catch (error) {
    console.error("Item Creation API Error:", error);
    toast.error(
      error?.response?.data
        ? JSON.stringify(error.response.data).substring(0, 100)
        : "Error creating ingredient item"
    );
    return null;
  }
};
