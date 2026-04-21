import { useState } from "react";
import EditIngredientComponent from "./EditIngredientComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteConfirmation from "../../common/DeleteConfirmation";
import { updateRecipe } from "../../../api/PutRecipe";

function EditIngredientController() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Convert ingredients from object to entries array for editing
  const initialIngredients = location.state?.ingredients || {};
  const initialEntries =
    typeof initialIngredients === "object" && !Array.isArray(initialIngredients)
      ? Object.entries(initialIngredients).map(([name, quantity]) => ({
          name,
          quantity,
        }))
      : Array.isArray(initialIngredients)
        ? initialIngredients.map((name) => ({ name, quantity: "" }))
        : [];

  const [recipe, setRecipe] = useState(
    location.state || {
      item: { name: "" },
      ingredients: {},
      person_count: 100,
    }
  );
  // Always keep an empty row at the end for easy input
  const [ingredientsList, setIngredientsList] = useState([
    ...initialEntries,
    { name: "", quantity: "" },
  ]);
  const [personCount, setPersonCount] = useState(
    location.state?.person_count || 100
  );

  // Handle ingredient field change with auto-add new row
  const handleIngredientChange = (index, field, value) => {
    setIngredientsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // If the user is editing the last row's name field and it now has content,
      // auto-add a new empty row
      const isLastRow = index === updated.length - 1;
      if (isLastRow && field === "name" && value.trim() !== "") {
        updated.push({ name: "", quantity: "" });
      }

      return updated;
    });
  };

  // Handle ingredient deletion
  const handleDeleteIngredient = (index) => {
    setIngredientsList((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Ensure there's always at least one empty row at the end
      const lastItem = filtered[filtered.length - 1];
      if (!lastItem || lastItem.name.trim() !== "") {
        filtered.push({ name: "", quantity: "" });
      }
      return filtered;
    });
  };

  // Handle Delete item
  const handleDeleteItem = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/recipes",
      name: "item",
      successMessage: "Item deleted successfully!",
      onSuccess: () => navigate(-1),
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Convert entries array back to object format { "name": "quantity" }
    // Filter out empty rows
    const ingredientsObj = {};
    ingredientsList.forEach((ing) => {
      if (ing.name.trim() !== "") {
        ingredientsObj[ing.name.trim()] = ing.quantity?.trim() || "0g";
      }
    });

    if (Object.keys(ingredientsObj).length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    const response = await updateRecipe(id, ingredientsObj, personCount);
    if (response) {
      navigate(-1);
    }
  };

  return (
    <EditIngredientComponent
      navigate={navigate}
      recipe={recipe}
      ingredientsList={ingredientsList}
      personCount={personCount}
      setPersonCount={setPersonCount}
      handleSubmit={handleSubmit}
      handleDeleteItem={handleDeleteItem}
      handleIngredientChange={handleIngredientChange}
      handleDeleteIngredient={handleDeleteIngredient}
    />
  );
}

export default EditIngredientController;
