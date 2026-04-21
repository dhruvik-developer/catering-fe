import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";

export const addRecipe = async (recipeData) => {
  try {
    const payload = {
      item: recipeData.item,
      ingredient: recipeData.ingredient,
      quantity: recipeData.quantity,
      unit: recipeData.unit,
      person_count: recipeData.person_count || 0,
    };
    const response = await ApiInstance.post("/recipes/", payload);
    if (
      response.data?.status ||
      response.data?.id ||
      response.status === 201 ||
      response.status === 200
    ) {
      toast.success("Recipe ingredient saved successfully!");
      return response;
    } else {
      toast.error("Failed to add recipe");
      return null;
    }
  } catch (error) {
    console.error("Add Recipe API Error:", error);
    toast.error("Error adding recipe");
    return null;
  }
};
