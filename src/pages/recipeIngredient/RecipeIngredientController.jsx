/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import RecipeIngredientComponent from "./RecipeIngredientComponent";
import { getRecipe } from "../../api/FetchRecipe";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function recipeIngredientController() {
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState([]);
  const navigate = useNavigate();

  const fetchRecipe = async () => {
    try {
      const response = await getRecipe();
      const data = response?.data;
      const recipeList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setRecipe(recipeList);
    } catch (error) {
      toast.error("Error fetching recipe");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  return (
    <RecipeIngredientComponent
      loading={loading}
      navigate={navigate}
      recipe={recipe}
    />
  );
}

export default recipeIngredientController;
