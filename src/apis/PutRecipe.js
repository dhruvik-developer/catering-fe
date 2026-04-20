import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const updateRecipe = async (id, recipeData) => {
  try {
    const payload = {
      ingredient: recipeData.ingredient,
      quantity: recipeData.quantity,
      unit: recipeData.unit,
      person_count: recipeData.person_count,
    };
    const response = await ApiInstance.put(`/recipes/${id}/`, payload);
    if (
      response.data?.status ||
      response.status === 200 ||
      response.status === 204
    ) {
      toast.success("Recipe ingredient updated successfully!");
      return response;
    } else {
      toast.error(response.data?.message || "Failed to update recipe");
      return null;
    }
  } catch (error) {
    console.error("Update Recipe API Error:", error);
    toast.error("Failed to update recipe");
    return null;
  }
};
