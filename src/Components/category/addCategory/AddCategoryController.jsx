import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../apis/PostCategory";
import AddCategoryComponent from "./AddCategoryComponent";

function AddCategoryController() {
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const response = await createCategory(categoryName);
    if (response) {
      navigate("/category");
    }
  };

  return (
    <AddCategoryComponent
      categoryName={categoryName}
      setCategoryName={setCategoryName}
      navigate={navigate}
      handleSubmit={handleSubmit}
    />
  );
}

export default AddCategoryController;
