import { useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CategoryComponent from "./CategoryComponent";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import usePermissions from "../../hooks/usePermissions";
import {
  useSwapCategoriesMutation,
  useUpdateCategoryMutation,
} from "../../hooks/useCategoryMutations";
import useConfirmationMutation from "../../hooks/useConfirmationMutation";
import { useCategories } from "../../hooks/useCategories";
import { useRecipes } from "../../hooks/useRecipes";

function CategoryController() {
  const { hasPermission } = usePermissions();
  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useCategories();
  const {
    data: recipes = [],
    isLoading: isRecipesLoading,
    refetch: refetchRecipes,
  } = useRecipes();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const swapCategoriesMutation = useSwapCategoriesMutation();
  const deleteCategoryMutation = useConfirmationMutation({
    invalidateQueryKeys: [["categories"]],
  });
  const deleteItemMutation = useConfirmationMutation({
    invalidateQueryKeys: [["categories"]],
  });

  const getRecipeItemId = (recipe) => {
    const rawItem =
      recipe?.item ??
      recipe?.item_id ??
      recipe?.itemId ??
      recipe?.menu_item ??
      recipe?.menuItem ??
      null;

    if (rawItem && typeof rawItem === "object") {
      return (
        rawItem.id ??
        rawItem.pk ??
        rawItem.item_id ??
        rawItem.itemId ??
        rawItem.menu_item_id ??
        null
      );
    }

    return rawItem;
  };

  const getRecipeItemName = (recipe) => {
    const rawItem =
      recipe?.item ??
      recipe?.menu_item ??
      recipe?.menuItem ??
      recipe?.item_name ??
      recipe?.itemName ??
      null;

    if (typeof rawItem === "string") return rawItem;
    if (rawItem && typeof rawItem === "object") {
      return rawItem.name ?? rawItem.item_name ?? rawItem.title ?? "";
    }

    return "";
  };

  const categories = useMemo(() => {
    const recipeItemIds = new Set(
      recipes
        .map((recipe) => getRecipeItemId(recipe))
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value))
    );

    const recipeItemNames = new Set(
      recipes
        .map((recipe) => getRecipeItemName(recipe))
        .filter((value) => typeof value === "string" && value.trim() !== "")
        .map((value) => value.trim().toLowerCase())
    );

    const processCategory = (category) => ({
      ...category,
      items: (category.items || []).map((item) => {
        const itemId = String(item?.id ?? "");
        const itemName = String(item?.name ?? "").trim().toLowerCase();
        const hasRecipe =
          recipeItemIds.has(itemId) ||
          (itemName !== "" && recipeItemNames.has(itemName));

        return { ...item, has_recipe: hasRecipe };
      }),
      subcategories: (category.subcategories || [])
        .map(processCategory)
        .sort((a, b) => (a.positions || 0) - (b.positions || 0)),
    });

    return [...categoriesData]
      .map(processCategory)
      .sort((a, b) => (a.positions || 0) - (b.positions || 0));
  }, [categoriesData, recipes]);

  const refreshData = async () => {
    await Promise.all([refetchCategories(), refetchRecipes()]);
  };

  const handleEditCategory = async (categoryId, oldName) => {
    if (!hasPermission("categories.update")) {
      toast.error("You do not have permission to update categories.");
      return;
    }

    const category = categories.find(c => c.id === categoryId) || 
                     categories.flatMap(c => c.subcategories || []).find(s => s.id === categoryId);

    const { value: formValues } = await Swal.fire({
      title: "Edit Category",
      html:
        `<div class="text-left mb-2"><label class="block text-sm font-medium text-gray-700">Category Name</label></div>` +
        `<input id="swal-input1" class="swal2-input mt-0 w-full" value="${oldName || ""}">` +
        `<div class="text-left mt-4 mb-2"><label class="block text-sm font-medium text-gray-700">Parent Category</label></div>` +
        `<select id="swal-input2" class="swal2-input mt-0 w-full">
          <option value="">None (Top Level)</option>
          ${categories
            .filter(c => c.id !== categoryId)
            .map(c => `<option value="${c.id}" ${category?.parent === c.id ? 'selected' : ''}>${c.name}</option>`)
            .join('')}
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "var(--color-primary)",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (formValues) {
      const [name, parentId] = formValues;
      const formattedName = name
        .trim()
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
        )
        .join(" ");

      const response = await updateCategoryMutation.mutateAsync({
        categoryId,
        newName: formattedName,
        parentId: parentId || null,
      });
      if (response) {
        refreshData();
        Swal.close();
      }
    }
  };

  const handleDeleteItem = (id) => {
    if (!hasPermission("categories.delete")) {
      toast.error("You do not have permission to delete items.");
      return;
    }

    DeleteConfirmation({
      id,
      apiEndpoint: "/items",
      name: "item",
      successMessage: "Item deleted successfully!",
      onSuccess: refreshData,
      executeRequest: deleteItemMutation.mutateAsync,
    });
  };

  const handleDeleteCategory = (id) => {
    if (!hasPermission("categories.delete")) {
      toast.error("You do not have permission to delete categories.");
      return;
    }

    DeleteConfirmation({
      id,
      apiEndpoint: "/categories",
      name: "category",
      successMessage: "Category deleted successfully!",
      onSuccess: refreshData,
      executeRequest: deleteCategoryMutation.mutateAsync,
    });
  };

  const handleSwappingCategory = async (categoryId, categoryName) => {
    if (!hasPermission("categories.update")) {
      toast.error("You do not have permission to update category positions.");
      return;
    }

    const { value: position } = await Swal.fire({
      title: `<p class="text-left">Change Number Of Category</p>`,
      input: "number",
      inputLabel: `Are you sure want to change position of category '${categoryName}'?`,
      inputPlaceholder: "Please Enter Position Of Category",
      showCancelButton: true,
      confirmButtonText: "Done",
      confirmButtonColor: "var(--color-primary)",
      cancelButtonText: "Cancel",
      customClass: {
        inputLabel: "custom-stock-input-label",
        input: "custom-stock-swal-input",
      },
      inputAttributes: {
        min: 1,
        step: 1,
      },
      didOpen: () => {
        const inputField = document.querySelector(".swal2-input");
        if (inputField) {
          inputField.addEventListener("input", (event) => {
            event.target.value = event.target.value.replace(/[^0-9]/g, "");
          });
        }
      },
      preConfirm: async (value) => {
        const intValue = parseInt(value, 10);
        if (!intValue || intValue < 1) {
          Swal.showValidationMessage("Category position is required");
        }
        return intValue;
      },
    });

    if (position) {
      const response = await swapCategoriesMutation.mutateAsync({
        categoryId,
        position,
      });
      if (response) {
        refreshData();
        Swal.close();
      }
    }
  };

  return (
    <CategoryComponent
      categories={categories}
      items={[]}
      onEditCategory={handleEditCategory}
      onCategoryDelete={handleDeleteCategory}
      onItemDelete={handleDeleteItem}
      onSwappingCategory={handleSwappingCategory}
      loading={isCategoriesLoading || isRecipesLoading}
      onRefresh={refreshData}
    />
  );
}

export default CategoryController;
