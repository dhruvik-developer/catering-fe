import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CategoryComponent from "./CategoryComponent";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import { getCategory } from "../../apis/FetchCategory";
import { getRecipe } from "../../apis/FetchRecipe";
import Swal from "sweetalert2";
import { createCategory, swapCategories } from "../../apis/PostCategory";
import { editCategory } from "../../apis/PutCategory";
import { useNavigate } from "react-router-dom";

function CategoryController() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);
  const navigate = useNavigate();

  const extractArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];

    const directCandidates = [
      value.data,
      value.results,
      value.items,
      value.list,
      value.rows,
      value.payload,
      value.data?.data,
      value.data?.results,
      value.results?.data,
      value.results?.results,
      value.payload?.data,
      value.payload?.results,
    ];

    for (const candidate of directCandidates) {
      if (Array.isArray(candidate)) return candidate;
    }

    for (const nested of Object.values(value)) {
      if (Array.isArray(nested)) return nested;
      if (nested && typeof nested === "object") {
        const deep = extractArray(nested);
        if (deep.length > 0) return deep;
      }
    }

    return [];
  };

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

  const fetchItems = async () => {
    try {
      const [categoriesResponse, recipesResponse] = await Promise.all([
        getCategory(),
        getRecipe(),
      ]);

      const recipes = extractArray(recipesResponse?.data);

      const recipeItemIds = new Set(
        recipes
          .map((r) => getRecipeItemId(r))
          .filter((v) => v !== undefined && v !== null)
          .map((v) => String(v))
      );

      const recipeItemNames = new Set(
        recipes
          .map((r) => getRecipeItemName(r))
          .filter((v) => typeof v === "string" && v.trim() !== "")
          .map((v) => v.trim().toLowerCase())
      );

      const categoriesData = extractArray(categoriesResponse?.data);

      const categoriesWithRecipeInfo = categoriesData.map((category) => {
        const itemsWithRecipeInfo = (category.items || []).map((item) => {
          const itemId = String(item?.id ?? "");
          const itemName = String(item?.name ?? "")
            .trim()
            .toLowerCase();
          const hasRecipe =
            recipeItemIds.has(itemId) ||
            (itemName !== "" && recipeItemNames.has(itemName));
          return { ...item, has_recipe: hasRecipe };
        });

        return {
          ...category,
          items: itemsWithRecipeInfo,
        };
      });

      const sortedCategories = [...categoriesWithRecipeInfo].sort(
        (a, b) => (a.positions || 0) - (b.positions || 0)
      );

      setCategories(sortedCategories);
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchItems();
      isFetched.current = true;
    }
  }, []);

  // Handle Add Category
  const handleAddCategory = async () => {
    const { value: name } = await Swal.fire({
      title: "Create Category",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Please Enter Category Name",
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "#845cbd",
      cancelButtonText: "Cancel",
      customClass: {
        inputLabel: "custom-stock-input-label",
        input: "custom-stock-swal-input",
      },

      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage("Category name is required");
        }
        return value;
      },
    });

    if (name) {
      const formattedName = name
        .trim()
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
        )
        .join(" ");

      const isDuplicate = categories.some(
        (cat) => cat.name?.toLowerCase() === formattedName.toLowerCase()
      );
      if (isDuplicate) {
        toast.error("Category name already exists");
        return;
      }

      const response = await createCategory(formattedName);
      if (response) {
        fetchItems();
        Swal.close();
      }
    }
  };

  // Handle Edit Category
  const handleEditCategory = async (categoryId, oldName) => {
    const { value: name } = await Swal.fire({
      title: "Edit Category Name",
      input: "text",
      inputLabel: "Category Name",
      inputValue: oldName || "",
      inputPlaceholder: "Please Enter Category Name",
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#845cbd",
      cancelButtonText: "Cancel",
      customClass: {
        inputLabel: "custom-stock-input-label",
        input: "custom-stock-swal-input",
      },

      preConfirm: async (value) => {
        if (!value || !value.trim()) {
          Swal.showValidationMessage("Category name is required");
        }
        return value;
      },
    });

    if (name && name.trim() !== oldName) {
      const formattedName = name
        .trim()
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
        )
        .join(" ");

      const isDuplicate = categories.some(
        (cat) =>
          cat.id !== categoryId &&
          cat.name?.toLowerCase() === formattedName.toLowerCase()
      );
      if (isDuplicate) {
        toast.error("Category name already exists");
        return;
      }

      const response = await editCategory(categoryId, formattedName);
      if (response) {
        fetchItems();
        Swal.close();
      }
    }
  };

  // Handle Delete Item (sub-item of category)
  const handleDeleteSubCategory = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/items",
      name: "item",
      successMessage: "Item deleted successfully!",
      onSuccess: fetchItems,
    });
  };

  // Handle Delete Category
  const handleDeleteItem = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/categories",
      name: "category",
      successMessage: "Category deleted successfully!",
      onSuccess: fetchItems,
    });
  };

  // Handle Swapping Categories
  const handleSwappingCategory = async (categoryId, categoryName) => {
    const { value: position } = await Swal.fire({
      title: `<p class="text-left">Change Number Of Category</p>`,
      input: "number",
      inputLabel: `Are you sure want to change position of category '${categoryName}'?`,
      inputPlaceholder: "Please Enter Position Of Category",
      showCancelButton: true,
      confirmButtonText: "Done",
      confirmButtonColor: "#845cbd",
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
      const response = await swapCategories(categoryId, position);
      if (response) {
        fetchItems();
        Swal.close();
      }
    }
  };

  return (
    <CategoryComponent
      categories={categories}
      items={items}
      onAddCategory={handleAddCategory}
      onEditCategory={handleEditCategory}
      onSubCategoryDelete={handleDeleteSubCategory}
      onItemDelete={handleDeleteItem}
      onSwappingCategory={handleSwappingCategory}
      loading={loading}
      navigate={navigate}
      onRefresh={fetchItems}
    />
  );
}

export default CategoryController;
