/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditItemComponent from "./EditItemComponent";
import { useCategories } from "../../../hooks/useCategories";

function EditItemController() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemData = location?.state;
  const { data: categories = [], isLoading: loading } = useCategories();
  const [selectedItemsState, setSelectedItemsState] = useState({});
  const [formData, setFormData] = useState({});
  const [combinedFormData, setCombinedFormData] = useState({});
  const [pdfPreview, setPdfPreview] = useState(null);

  useEffect(() => {
    if (itemData?.selected_items && categories.length > 0) {
      const preSelectedItems = Object.entries(itemData.selected_items).reduce(
        (acc, [categoryName, items]) => {
          const category = categories.find((cat) => cat.name === categoryName);
          if (category) {
            const matchedItems = items.map((item) => {
              const matched = category.items.find((i) => i.name === item.name);
              return matched
                ? { id: matched.id, name: matched.name }
                : { id: item.name, name: item.name };
            });

            acc[category.id] = {
              categoryName,
              items: matchedItems,
              positions: category.positions,
            };
          }
          return acc;
        },
        {}
      );
      setSelectedItemsState(preSelectedItems);
    }
  }, [itemData, categories]);

  const handleItemSelect = (
    categoryId,
    itemId,
    itemName,
    categoryName,
    categoryPosition
  ) => {
    setSelectedItemsState((prev) => {
      const existingCategory = prev[categoryId];

      let updatedItems = [];
      let updatedPositions;

      if (existingCategory) {
        const isAlreadySelected = existingCategory.items.some(
          (item) => item.id === itemId
        );

        if (isAlreadySelected) {
          updatedItems = existingCategory.items.filter(
            (item) => item.id !== itemId
          );
          updatedPositions = existingCategory.positions;
        } else {
          updatedItems = [
            ...existingCategory.items,
            { id: itemId, name: itemName },
          ];
          updatedPositions = existingCategory.positions || categoryPosition;
        }
      } else {
        updatedItems = [{ id: itemId, name: itemName }];
        updatedPositions = categoryPosition;
      }

      const updatedSelectedItems = {
        ...prev,
        [categoryId]: {
          categoryName,
          items: updatedItems,
          positions: updatedPositions,
        },
      };

      setFormData(updatedItems);
      setCombinedFormData({ itemData, dishData: updatedSelectedItems });

      return updatedSelectedItems;
    });
  };

  const generatePDF = () => {
    let finalDishData = combinedFormData.dishData;

    if (!Object.keys(combinedFormData.dishData || {}).length) {
      if (Object.keys(selectedItemsState || {}).length) {
        finalDishData = selectedItemsState;
      } else {
        toast.error(
          "Please select at least one item before generating the PDF."
        );
        return;
      }
    }

    const finalCombinedFormData = { itemData, dishData: finalDishData };
    navigate("/edit-order-pdf", { state: finalCombinedFormData });
  };

  return (
    <EditItemComponent
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

export default EditItemController;
