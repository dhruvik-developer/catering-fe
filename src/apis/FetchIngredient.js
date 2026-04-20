import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getIngredientCategories = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ingredients-categories/", { params });
    return response;
  } catch (error) {
    console.error("Get Ingredient Categories API Error:", error);
    toast.error("Error fetching ingredient categories");
    return null;
  }
};

export const getIngredientCategoryById = async (id) => {
  try {
    const response = await ApiInstance.get(`/ingredients-categories/${id}/`);
    return response;
  } catch (error) {
    console.error("Get Ingredient Category By ID API Error:", error);
    toast.error("Error fetching ingredient category details");
    return null;
  }
};

export const getIngredientItems = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/ingredients-items/", { params });
    return response;
  } catch (error) {
    console.error("Get Ingredient Items API Error:", error);
    toast.error("Error fetching ingredient items");
    return null;
  }
};

export const getIngredientItemById = async (id) => {
  try {
    const response = await ApiInstance.get(`/ingredients-items/${id}/`);
    return response;
  } catch (error) {
    console.error("Get Ingredient Item By ID API Error:", error);
    toast.error("Error fetching ingredient item details");
    return null;
  }
};
