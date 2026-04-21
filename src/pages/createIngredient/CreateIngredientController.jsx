/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmation from "../../Components/common/DeleteConfirmation";
import { getIngredientCategories } from "../../api/vendors";
import Swal from "sweetalert2";
import { addIngredientCategory } from "../../api/PostIngredient";
import { useNavigate } from "react-router-dom";
import CreateIngredientComponent from "./CreateIngredientComponent";

function CreateIngredientController() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);
  const navigate = useNavigate();

  const fetchIngredientItems = async () => {
    try {
      const categoriesResponse = await getIngredientCategories();

      const data = categoriesResponse?.data;
      const categoriesData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setCategories(
        categoriesData.map((category) => ({
          ...category,
          items: category.items || [],
        }))
      );
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchIngredientItems();
      isFetched.current = true;
    }
  }, []);

  // Handle Add Ingredient
  const handleAddCategory = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Ingredient Category",
      html: `
                <div style="text-align: left; padding: 0 10px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333; font-size: 14px;">Category Name</label>
                    <input id="swal-category-name" class="swal2-input custom-stock-swal-input" placeholder="Please Enter Category Name" style="width: 100%; margin: 0 0 20px 0; box-sizing: border-box;" />
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-top: 1px solid #eee;">
                        <label style="font-weight: 600; color: #333; font-size: 14px;">Is Common</label>
                        <label style="position: relative; display: inline-block; width: 48px; height: 26px; cursor: pointer;">
                            <input type="checkbox" id="swal-is-common" style="opacity: 0; width: 0; height: 0;" />
                            <span id="swal-toggle-track" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 26px; transition: background-color 0.3s;"></span>
                            <span id="swal-toggle-thumb" style="position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
                        </label>
                    </div>
                </div>
            `,
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "#845cbd",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const checkbox = document.getElementById("swal-is-common");
        const track = document.getElementById("swal-toggle-track");
        const thumb = document.getElementById("swal-toggle-thumb");
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            track.style.backgroundColor = "#845cbd";
            thumb.style.transform = "translateX(22px)";
          } else {
            track.style.backgroundColor = "#ccc";
            thumb.style.transform = "translateX(0)";
          }
        });
      },
      preConfirm: () => {
        const name = document.getElementById("swal-category-name").value;
        const isCommon = document.getElementById("swal-is-common").checked;
        if (!name) {
          Swal.showValidationMessage("Category name is required");
          return false;
        }
        return { name, isCommon };
      },
    });

    if (formValues) {
      const formattedName = formValues.name
        .trim()
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
        )
        .join(" ");

      const isDuplicate = categories.some(
        (cat) =>
          cat.name && cat.name.toLowerCase() === formattedName.toLowerCase()
      );

      if (isDuplicate) {
        toast.error("Category name already exists");
        return;
      }

      const response = await addIngredientCategory(
        formattedName,
        formValues.isCommon
      );
      if (response) {
        fetchIngredientItems();
        Swal.close();
      }
    }
  };

  // Handle Delete Ingredient Item
  const handleDeleteSubCategory = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/ingredients-items",
      name: "ingredient item",
      successMessage: "Ingredient item deleted successfully!",
      onSuccess: fetchIngredientItems,
    });
  };

  // Handle Delete Ingredient Category
  const handleDeleteIngredient = (id) => {
    DeleteConfirmation({
      id,
      apiEndpoint: "/ingredients-categories",
      name: "ingredient category",
      successMessage: "Ingredient category deleted successfully!",
      onSuccess: fetchIngredientItems,
    });
  };

  return (
    <CreateIngredientComponent
      categories={categories}
      items={items}
      onAddCategory={handleAddCategory}
      onSubCategoryDelete={handleDeleteSubCategory}
      onIngredientDelete={handleDeleteIngredient}
      loading={loading}
      navigate={navigate}
      onRefresh={fetchIngredientItems}
    />
  );
}

export default CreateIngredientController;
