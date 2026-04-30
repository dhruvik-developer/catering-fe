import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCategoryMutation } from "../../../hooks/useCategoryMutations";
import { buildMultiLangFields } from "../../../i18n/helpers";
import AddCategoryComponent from "./AddCategoryComponent";

const EMPTY = { en: "", gu: "", hi: "" };

function AddCategoryController() {
  const [categoryName, setCategoryName] = useState(EMPTY);
  const navigate = useNavigate();
  const createCategoryMutation = useCreateCategoryMutation();

  const isEmpty = !["en", "gu", "hi"].some((k) => categoryName[k]?.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty) return;

    const primary =
      categoryName.en?.trim() ||
      categoryName.gu?.trim() ||
      categoryName.hi?.trim();

    const payload = {
      categoryName: primary,
      parentId: null,
      ...buildMultiLangFields("name", categoryName),
    };

    const response = await createCategoryMutation.mutateAsync(payload);
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
      submitting={createCategoryMutation.isPending}
      disableSubmit={isEmpty}
    />
  );
}

export default AddCategoryController;
