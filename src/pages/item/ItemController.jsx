/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ItemComponent from "./ItemComponent";
import { useCategories } from "../../hooks/useCategories";

function ItemController() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemData = location?.state;
  const { data: categories = [], isLoading: loading } = useCategories();
  const [selectedItemsState, setSelectedItemsState] = useState({});
  const [formData, setFormData] = useState({});
  const [combinedFormData, setCombinedFormData] = useState({});
  const [pdfPreview, setPdfPreview] = useState(null);

  const handleItemSelect = (
    categoryId,
    itemId,
    itemName,
    categoryName,
    categoryPosition
  ) => {
    setSelectedItemsState((prev) => {
      const categoryData = prev[categoryId] || {
        categoryName,
        items: [],
        positions: categoryPosition,
      };
      const updatedItems = categoryData.items.some((item) => item.id === itemId)
        ? categoryData.items.filter((item) => item.id !== itemId)
        : [...categoryData.items, { id: itemId, name: itemName }];

      const updatedSelectedItems = {
        ...prev,
        [categoryId]: {
          categoryName,
          items: updatedItems,
          positions: categoryPosition,
        },
      };

      setFormData(updatedItems);
      setCombinedFormData({ itemData, dishData: updatedSelectedItems });

      return updatedSelectedItems;
    });
  };

  const generatePDF = () => {
    if (!Object.keys(combinedFormData.dishData || {}).length) {
      toast.error("Please select at least one item before generating the PDF.");
      return;
    }
    navigate("/pdf", { state: combinedFormData });
  };

  return (
    <ItemComponent
      categories={categories}
      selectedItemsState={selectedItemsState}
      loading={loading}
      navigate={navigate}
      pdfPreview={pdfPreview}
      generatePDF={generatePDF}
      handleItemSelect={handleItemSelect}
      setPdfPreview={setPdfPreview}
    />
  );
}

export default ItemController;
