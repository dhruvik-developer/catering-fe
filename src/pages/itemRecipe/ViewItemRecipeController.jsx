import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ViewItemRecipeComponent from "./ViewItemRecipeComponent";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../../hooks/useRecipes";

import { useIngredientItems } from "../../hooks/useIngredientItems";
import { useUpdateItemCostsMutation } from "../../hooks/useCategoryMutations";
import { logError } from "../../utils/logger";
import {
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useUpdateRecipeMutation,
} from "../../hooks/useRecipeMutations";

function ViewItemRecipeController({
  itemId,
  itemName,
  baseCost,
  selectionRate,
  onClose,
  disableItemDetailsFetch = false,
}) {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);
  const {
    data: recipeEntries = [],
    isLoading: isRecipesLoading,
    refetch: refetchRecipes,
  } = useRecipes(
    { item_id: itemId },
    {
      enabled: Boolean(itemId),
    }
  );

  const [currentBaseCost, setCurrentBaseCost] = useState(baseCost);
  const [currentSelectionRate, setCurrentSelectionRate] =
    useState(selectionRate);

  // --- Edit Mode State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editIngredientsList, setEditIngredientsList] = useState([]);
  const [editPersonCount, setEditPersonCount] = useState(100);
  const [saving, setSaving] = useState(false);
  const updateItemCostsMutation = useUpdateItemCostsMutation();
  const createRecipeMutation = useCreateRecipeMutation();
  const updateRecipeMutation = useUpdateRecipeMutation();
  const deleteRecipeMutation = useDeleteRecipeMutation();
  const { data: ingredientOptions = [], isLoading: isIngredientOptionsLoading } =
    useIngredientItems();


  // --- Add Mode State (when no recipe exists) ---
  const [isAdding, setIsAdding] = useState(false);
  const [addIngredientsList, setAddIngredientsList] = useState([
    { ingredientId: null, name: "", quantity: "", unit: "g" },
  ]);
  const [addPersonCount, setAddPersonCount] = useState(100);
  const [addSaving, setAddSaving] = useState(false);

  const handleEditCosts = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Item Costs",
      html: `
                <div style="text-align: left; margin-bottom: 12px;">
                    <label for="swal-base-cost" style="display: block; font-weight: 500; font-size: 14px; color: #4b5563; margin-bottom: 6px;">Base Cost (₹)</label>
                    <input id="swal-base-cost" type="number" step="0.01" class="swal2-input" style="width: 100%; box-sizing: border-box; margin: 0; font-size: 15px;" placeholder="0.00" value="${currentBaseCost || 0}" />
                </div>
                <div style="text-align: left;">
                    <label for="swal-sel-rate" style="display: block; font-weight: 500; font-size: 14px; color: #4b5563; margin-bottom: 6px;">Selection Rate (₹)</label>
                    <input id="swal-sel-rate" type="number" step="0.01" class="swal2-input" style="width: 100%; box-sizing: border-box; margin: 0; font-size: 15px;" placeholder="0.00" value="${currentSelectionRate || 0}" />
                </div>
            `,
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      confirmButtonText: "Save Changes",
      focusConfirm: false,
      preConfirm: () => {
        const bc = document.getElementById("swal-base-cost").value;
        const sr = document.getElementById("swal-sel-rate").value;
        if (
          !bc ||
          !sr ||
          isNaN(bc) ||
          isNaN(sr) ||
          parseFloat(bc) < 0 ||
          parseFloat(sr) < 0
        ) {
          Swal.showValidationMessage(
            "Please enter valid positive numbers for both fields."
          );
          return false;
        }
        if (parseFloat(sr) < parseFloat(bc)) {
          Swal.showValidationMessage(
            "Selection Rate cannot be lower than Base Cost!"
          );
          return false;
        }
        return { baseCost: parseFloat(bc), selectionRate: parseFloat(sr) };
      },
    });

    if (formValues) {
      const response = await updateItemCostsMutation.mutateAsync({
        itemId,
        base_cost: formValues.baseCost,
        selection_rate: formValues.selectionRate,
      });
      if (response) {
        setCurrentBaseCost(formValues.baseCost);
        setCurrentSelectionRate(formValues.selectionRate);
      }
    }
  };

  // --- Edit Mode Handlers ---
  const handleStartEdit = () => {
    const getIngredientId = (entry) => {
      if (entry?.ingredient?.id) return entry.ingredient.id;
      if (typeof entry?.ingredient === "number") return entry.ingredient;
      const ingredientName = entry?.ingredient?.name || entry?.ingredient || "";
      if (!ingredientName) return null;
      const matched = ingredientOptions.find(
        (opt) =>
          String(opt?.name || "").toLowerCase() ===
          String(ingredientName).toLowerCase()
      );
      return matched?.id ?? null;
    };

    const entries = recipeEntries.map((entry) => ({
      id: entry.id,
      name: entry.ingredient?.name || entry.ingredient || "",
      ingredientId: getIngredientId(entry),
      quantity: entry.quantity || "",
      unit: entry.unit || "",
      person_count: entry.person_count || 100,
    }));

    const fallbackPersonCount = recipeEntries[0]?.person_count || 100;

    entries.push({
      id: null,
      name: "",
      ingredientId: null,
      quantity: "",
      unit: "g",
      person_count: fallbackPersonCount,
    });

    setEditIngredientsList(entries);
    setEditPersonCount(fallbackPersonCount);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIngredientsList([]);
  };

  const handleEditIngredientChange = (index, field, value) => {
    setEditIngredientsList((prev) => {
      const updated = [...prev];
      if (field === "ingredientId") {
        const selectedIngredient = ingredientOptions.find(
          (opt) => opt.id === value
        );
        updated[index] = {
          ...updated[index],
          ingredientId: value,
          name: selectedIngredient?.name || "",
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      // Auto-add new row if editing last row's ingredient
      const isLastRow = index === updated.length - 1;
      if (isLastRow && field === "ingredientId" && value) {
        updated.push({
          id: null,
          name: "",
          ingredientId: null,
          quantity: "",
          unit: "g",
          person_count: editPersonCount,
        });
      }
      return updated;
    });
  };

  const handleDeleteEditIngredient = async (index) => {
    const deletedRow = editIngredientsList[index];
    if (deletedRow?.id) {
      await deleteRecipeMutation.mutateAsync(deletedRow.id);
      await refetchRecipes();
      setIsEditing(false);
      return;
    }

    setEditIngredientsList((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      const lastItem = filtered[filtered.length - 1];
      if (!lastItem || lastItem.ingredientId) {
        filtered.push({
          id: null,
          name: "",
          ingredientId: null,
          quantity: "",
          unit: "g",
          person_count: editPersonCount,
        });
      }
      return filtered;
    });
  };

  const handleSaveEdit = async () => {
    const validRows = editIngredientsList.filter(
      (ing) =>
        ing.ingredientId && ing.quantity?.toString().trim() !== ""
    );

    if (validRows.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    const hasInvalidIngredientId = validRows.some((ing) =>
      Number.isNaN(Number(ing.ingredientId))
    );
    if (hasInvalidIngredientId) {
      toast.error("Please re-select ingredient from dropdown");
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        validRows.map(async (ing) => {
          const nowPayload = {
            item: itemId,
            ingredient: Number(ing.ingredientId),
            quantity: ing.quantity,
            unit: ing.unit || "g",
            person_count: editPersonCount,
          };

          if (ing.id) {
            return updateRecipeMutation.mutateAsync({
              id: ing.id,
              recipeData: nowPayload,
            });
          }
          return createRecipeMutation.mutateAsync(nowPayload);
        })
      );

      await refetchRecipes();
      setEditIngredientsList([]);
      setIsEditing(false);
    } catch (error) {
      logError("Save Edit Recipe API Error:", error);
      toast.error("Error updating recipe ingredients");
    } finally {
      setSaving(false);
    }
  };

  // --- Add Mode Handlers ---
  const handleStartAdd = () => {
    setAddIngredientsList([
      { ingredientId: null, name: "", quantity: "", unit: "g" },
    ]);
    setAddPersonCount(100);
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setAddIngredientsList([
      { ingredientId: null, name: "", quantity: "", unit: "g" },
    ]);
  };

  const handleAddIngredientChange = (index, field, value) => {
    setAddIngredientsList((prev) => {
      const updated = [...prev];
      if (field === "ingredientId") {
        const selectedIngredient = ingredientOptions.find(
          (opt) => opt.id === value
        );
        updated[index] = {
          ...updated[index],
          ingredientId: value,
          name: selectedIngredient?.name || "",
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      const isLastRow = index === updated.length - 1;
      if (isLastRow && field === "ingredientId" && value) {
        updated.push({ ingredientId: null, name: "", quantity: "", unit: "g" });
      }
      return updated;
    });
  };

  const handleDeleteAddIngredient = (index) => {
    setAddIngredientsList((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      const lastItem = filtered[filtered.length - 1];
      if (!lastItem || lastItem.ingredientId) {
        filtered.push({ ingredientId: null, name: "", quantity: "", unit: "g" });
      }
      return filtered;
    });
  };

  const handleSaveAdd = async () => {
    const validRows = addIngredientsList.filter(
      (ing) =>
        ing.ingredientId && ing.quantity?.toString().trim() !== ""
    );

    if (validRows.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    const hasInvalidIngredientId = validRows.some((ing) =>
      Number.isNaN(Number(ing.ingredientId))
    );
    if (hasInvalidIngredientId) {
      toast.error("Please select valid ingredients from dropdown");
      return;
    }

    setAddSaving(true);
    try {
      await Promise.all(
        validRows.map((ing) =>
          createRecipeMutation.mutateAsync({
            item: itemId,
            ingredient: Number(ing.ingredientId),
            quantity: ing.quantity,
            unit: ing.unit || "g",
            person_count: addPersonCount,
          })
        )
      );
      await refetchRecipes();
      setIsAdding(false);
    } catch (error) {
      logError("Add Recipe API Error:", error);
      toast.error("Error adding recipe ingredient");
    } finally {
      setAddSaving(false);
    }
  };

  useEffect(() => {
    const ingredientMap = {};

    recipeEntries.forEach((recipe) => {
      const ingredientName = recipe.ingredient?.name || recipe.ingredient || "";
      const quantity = recipe.quantity || "";
      const unit = recipe.unit ? ` ${recipe.unit}` : "";

      if (ingredientName) {
        ingredientMap[ingredientName] = `${quantity}${unit}`;
      }
    });

    if (Object.keys(ingredientMap).length > 0) {
      setRecipeData({
        id: null,
        item: { id: itemId, name: itemName },
        person_count: recipeEntries[0]?.person_count || 100,
        ingredients: ingredientMap,
      });
      return;
    }

    setRecipeData(null);
  }, [itemId, itemName, recipeEntries]);

  return (
    <ViewItemRecipeComponent
      loading={
        isRecipesLoading ||
        isIngredientOptionsLoading
      }
      navigate={navigate}
      recipeData={recipeData}
      itemName={itemName}
      baseCost={currentBaseCost} selectionRate={currentSelectionRate}
      handleEditCosts={handleEditCosts}
      onClose={onClose}
      // Edit mode props
      isEditing={isEditing}
      editIngredientsList={editIngredientsList}
      ingredientOptions={ingredientOptions}
      editPersonCount={editPersonCount}
      setEditPersonCount={setEditPersonCount}
      saving={saving}
      onStartEdit={handleStartEdit}
      onCancelEdit={handleCancelEdit}
      onEditIngredientChange={handleEditIngredientChange}
      onDeleteEditIngredient={handleDeleteEditIngredient}
      onSaveEdit={handleSaveEdit}
      // Add mode props
      isAdding={isAdding}
      addIngredientsList={addIngredientsList}
      addPersonCount={addPersonCount}
      setAddPersonCount={setAddPersonCount}
      addSaving={addSaving}
      onStartAdd={handleStartAdd}
      onCancelAdd={handleCancelAdd}
      onAddIngredientChange={handleAddIngredientChange}
      onDeleteAddIngredient={handleDeleteAddIngredient}
      onSaveAdd={handleSaveAdd}
    />
  );
}

export default ViewItemRecipeController;
