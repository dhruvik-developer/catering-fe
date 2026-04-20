import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCategory } from "../../../apis/FetchCategory";
import { createItem } from "../../../apis/PostCategory";
import AddItemComponent from "./AddItemComponent";

function AddItemController() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [baseCost, setBaseCost] = useState("");
  const [selectionRate, setSelectionRate] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategory();
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
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const parsedBaseCost = Number(baseCost) || 0;
    const parsedSelectionRate = Number(selectionRate) || 0;

    if (parsedSelectionRate < parsedBaseCost) {
      toast.error("Selection Rate cannot be lower than Base Cost!");
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
      toast.error("Item name already exists");
      return;
    }

    const response = await createItem(
      formattedName,
      category,
      Number(baseCost) || 0,
      Number(selectionRate) || 0
    );
    if (response) {
      navigate("/category");
    }
  };

  return (
    <AddItemComponent
      categories={categories}
      category={category}
      setCategory={setCategory}
      itemName={itemName}
      setItemName={setItemName}
      baseCost={baseCost}
      setBaseCost={setBaseCost}
      selectionRate={selectionRate}
      setSelectionRate={setSelectionRate}
      navigate={navigate}
      handleSubmit={handleSubmit}
    />
  );
}

export default AddItemController;
