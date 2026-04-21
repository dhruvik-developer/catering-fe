/* eslint-disable react-hooks/rules-of-hooks */
import RecipeIngredientComponent from "./RecipeIngredientComponent";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../../hooks/useRecipes";

function recipeIngredientController() {
  const navigate = useNavigate();
  const { data: recipe = [], isLoading: loading } = useRecipes();

  return (
    <RecipeIngredientComponent
      loading={loading}
      navigate={navigate}
      recipe={recipe}
    />
  );
}

export default recipeIngredientController;
