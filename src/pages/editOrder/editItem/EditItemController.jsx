/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCategory } from "../../../api/FetchCategory";
import EditItemComponent from "./EditItemComponent";

function EditItemController() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemData = location?.state;
  const [categories, setCategories] = useState([]);
  const [selectedItemsState, setSelectedItemsState] = useState({});
  const [formData, setFormData] = useState({});
  const [combinedFormData, setCombinedFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(null);
  const isFetched = useRef(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchCategories();
      isFetched.current = true;
    }
  }, []);

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

  // const handleItemSelect = (categoryId, itemId, itemName, categoryName) => {
  //     setSelectedItemsState((prev) => {
  //         const categoryData = prev[categoryId] || { categoryName, items: [] };
  //         const updatedItems = categoryData.items.some((item) => item.id === itemId)
  //             ? categoryData.items.filter((item) => item.id !== itemId)
  //             : [...categoryData.items, { id: itemId, name: itemName }];

  //             const updatedSelectedItems = {
  //                 ...prev,
  //                 [categoryId]: { categoryName, items: updatedItems },
  //             };

  //             const updatedCombinedFormData = { itemData, dishData: updatedSelectedItems };

  //             setFormData(updatedItems);
  //             setCombinedFormData(updatedCombinedFormData);

  //     return updatedSelectedItems;
  //     });
  // };

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
          // Deselect item
          updatedItems = existingCategory.items.filter(
            (item) => item.id !== itemId
          );
          updatedPositions = existingCategory.positions; // 👈 Keep old positions
        } else {
          // Select new item
          updatedItems = [
            ...existingCategory.items,
            { id: itemId, name: itemName },
          ];
          updatedPositions = existingCategory.positions || categoryPosition; // 👈 Keep old if exists, else set new
        }
      } else {
        // First time selecting anything from this category
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

      console.log("Updated:", updatedSelectedItems[categoryId]);

      setFormData(updatedItems);
      setCombinedFormData({ itemData, dishData: updatedSelectedItems });

      return updatedSelectedItems;
    });
  };

  const generatePDF = () => {
    let finalDishData = combinedFormData.dishData;

    if (!Object.keys(combinedFormData.dishData || {}).length) {
      if (Object.keys(selectedItemsState || {}).length) {
        finalDishData = selectedItemsState; // ✅ Use existing data
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
