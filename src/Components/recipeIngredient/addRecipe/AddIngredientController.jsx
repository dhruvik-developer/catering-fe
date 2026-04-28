import { useEffect, useMemo, useState } from "react";
import AddIngredientComponent from "./AddIngredientComponent";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCategories } from "../../../hooks/useCategories";
import { useIngredientItems } from "../../../hooks/useIngredientItems";
import { useCreateRecipeMutation } from "../../../hooks/useRecipeMutations";

function AddIngredientController() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredients, setIngredients] = useState([
    { ingredient: null, quantity: "", unit: "g" },
  ]);
  const [personCount, setPersonCount] = useState(100);
  const navigate = useNavigate();
  const location = useLocation();

  const predefinedItem = location.state?.predefinedItem;
  const createRecipeMutation = useCreateRecipeMutation();
  const { data: categories = [] } = useCategories();
  const items = useMemo(() => {
    return categories.flatMap((cat) => 
      (cat.items || []).map(item => ({
        ...item,
        categoryName: cat.name
      }))
    );
  }, [categories]);
  const { data: ingredientItems = [] } = useIngredientItems();

  const predefinedItemId = useMemo(() => {
    if (!predefinedItem) return null;
    const match = items.find((i) => i.name?.trim() === predefinedItem.trim());
    return match?.id || null;
  }, [items, predefinedItem]);

  useEffect(() => {
    if (predefinedItemId) {
      setSelectedItem(predefinedItemId);
    }
  }, [predefinedItemId]);

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      const isLastRow = index === updated.length - 1;
      if (isLastRow && field === "ingredient" && value) {
        updated.push({ ingredient: null, quantity: "", unit: "g" });
      }

      return updated;
    });
  };

  const handleRemoveField = (index) => {
    setIngredients((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      const lastItem = filtered[filtered.length - 1];
      if (!lastItem || lastItem.ingredient) {
        filtered.push({ ingredient: null, quantity: "", unit: "g" });
      }
      return filtered;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.ingredient && ing.quantity?.toString().trim() !== ""
    );

    if (validIngredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    try {
      await Promise.all(
        validIngredients.map((ing) =>
          createRecipeMutation.mutateAsync({
            item: selectedItem,
            ingredient: ing.ingredient,
            quantity: ing.quantity,
            unit: ing.unit || "g",
            person_count: personCount,
          })
        )
      );
      navigate(-1);
    } catch (error) {
      toast.error("Error adding recipe ingredients");
      console.error("Add Recipe API Error:", error);
    }
  };

  return (
    <div>
      <AddIngredientComponent
        items={items}
        ingredientItems={ingredientItems} selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        personCount={personCount}
        setPersonCount={setPersonCount}
        ingredients={ingredients}
        handleIngredientChange={handleIngredientChange}
        handleRemoveField={handleRemoveField}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />
    </div>
  );
}

export default AddIngredientController;
