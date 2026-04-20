import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getIngredientCategories } from "../../../apis/FetchIngredient";
import AddIngredientItemComponent from "./AddIngredientItemComponent";
import { addIngredientItem } from "../../../apis/PostIngredient";

function AddIngredientItemController() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngredientCategories = async () => {
      try {
        const response = await getIngredientCategories();
        if (response.data.status) {
          setCategories(response.data.data);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        toast.error("Error fetching categories");
        console.error("API Error:", error);
      }
    };
    fetchIngredientCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    if (!category) {
      toast.error("Please select an ingredient category");
      return;
    }

    const formattedName = itemName
      .trim()
      .split(" ")
      .map((word) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
      )
      .join(" ");

    const isDuplicate = categories.some(
      (cat) =>
        cat.items &&
        cat.items.some(
          (item) =>
            item.name && item.name.toLowerCase() === formattedName.toLowerCase()
        )
    );

    if (isDuplicate) {
      toast.error("Ingredient item name already exists");
      return;
    }

    const response = await addIngredientItem(formattedName, category);
    if (response) {
      navigate("/create-recipe-ingredient");
    }
  };

  return (
    <AddIngredientItemComponent
      categories={categories}
      category={category}
      setCategory={setCategory}
      itemName={itemName}
      setItemName={setItemName}
      navigate={navigate}
      handleSubmit={handleSubmit}
    />
  );
}

export default AddIngredientItemController;
