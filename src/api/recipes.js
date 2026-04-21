import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import {
  ensureSuccessfulResponse,
  getApiErrorMessage,
} from "../utils/apiResponse";

const handleQueryError = (errorLabel, fallbackMessage, error) => {
  console.error(errorLabel, error);
  toast.error(fallbackMessage);
  return null;
};

const handleMutationError = (errorLabel, fallbackMessage, error) => {
  console.error(errorLabel, error);
  toast.error(getApiErrorMessage(error, fallbackMessage));
  return null;
};

const buildCreateRecipePayload = (recipeData) => ({
  item: recipeData.item,
  ingredient: recipeData.ingredient,
  quantity: recipeData.quantity,
  unit: recipeData.unit,
  person_count: recipeData.person_count || 0,
});

const buildUpdateRecipePayload = (recipeData) => ({
  ingredient: recipeData.ingredient,
  quantity: recipeData.quantity,
  unit: recipeData.unit,
  person_count: recipeData.person_count,
});

export const getRecipes = async (params = {}) => {
  try {
    return await ApiInstance.get("/recipes/", { params });
  } catch (error) {
    return handleQueryError("Get Recipe API Error:", "Error fetching recipe", error);
  }
};

export const getRecipeById = async (id) => {
  try {
    return await ApiInstance.get(`/recipes/${id}/`);
  } catch (error) {
    return handleQueryError(
      "Get Recipe By ID API Error:",
      "Error fetching recipe details",
      error
    );
  }
};

export const createRecipe = async (recipeData) => {
  try {
    const response = await ApiInstance.post(
      "/recipes/",
      buildCreateRecipePayload(recipeData)
    );

    ensureSuccessfulResponse(response, "Failed to add recipe");
    toast.success("Recipe ingredient saved successfully!");
    return response;
  } catch (error) {
    return handleMutationError(
      "Add Recipe API Error:",
      "Error adding recipe",
      error
    );
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await ApiInstance.put(
      `/recipes/${id}/`,
      buildUpdateRecipePayload(recipeData)
    );

    ensureSuccessfulResponse(response, "Failed to update recipe");
    toast.success("Recipe ingredient updated successfully!");
    return response;
  } catch (error) {
    return handleMutationError(
      "Update Recipe API Error:",
      "Failed to update recipe",
      error
    );
  }
};

export const deleteRecipe = async (id) => {
  try {
    return await ApiInstance.delete(`/recipes/${id}/`);
  } catch (error) {
    return handleMutationError(
      "Delete Recipe API Error:",
      "Error deleting recipe",
      error
    );
  }
};
