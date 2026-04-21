import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const getRecipe = async (params = {}) => {
  try {
    const response = await ApiInstance.get("/recipes/", { params });
    return response;
  } catch (error) {
    console.error("Get Recipe API Error:", error);
    toast.error("Error fetching recipe");
    return null;
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await ApiInstance.get(`/recipes/${id}/`);
    return response;
  } catch (error) {
    console.error("Get Recipe By ID API Error:", error);
    toast.error("Error fetching recipe details");
    return null;
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await ApiInstance.delete(`/recipes/${id}/`);
    return response;
  } catch (error) {
    console.error("Delete Recipe API Error:", error);
    toast.error("Error deleting recipe");
    return null;
  }
};
