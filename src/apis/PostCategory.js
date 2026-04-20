import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const createCategory = async (categoryName) => {
  try {
    const response = await ApiInstance.post("/categories/", {
      name: categoryName,
    });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Category created successfully!");
      return response;
    } else {
      toast.error("Failed to create category");
      return null;
    }
  } catch (error) {
    console.error("Category Creation API Error:", error);
    toast.error("Error creating category");
    return null;
  }
};

export const createItem = async (
  itemName,
  category,
  base_cost = 0,
  selection_rate = 0
) => {
  if (!itemName.trim() || !category) {
    toast.error("Item name and category are required");
    return null;
  }

  try {
    const response = await ApiInstance.post("/items/", {
      name: itemName,
      category,
      base_cost,
      selection_rate,
    });
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Item created successfully!");
      return response;
    } else {
      toast.error("Failed to create item");
      return null;
    }
  } catch (error) {
    console.error("Item Creation API Error:", error);
    toast.error("Error creating item");
    return null;
  }
};

export const swapCategories = async (categoryId, position) => {
  if (!position) {
    toast.error("Category position is required");
    return null;
  }

  try {
    const response = await ApiInstance.post(
      `/category-positions-changes/${categoryId}/`,
      { positions: position }
    );
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success(response.data?.message || "Category position updated");
      return response;
    } else {
      toast.error("Failed to update category position");
      return null;
    }
  } catch (error) {
    console.error("Category Position Change API Error:", error);
    toast.error("Error updating category position");
    return null;
  }
};
