/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ItemComponent from "./ItemComponent";
import toast from "react-hot-toast";
import { getCategory } from "../../api/FetchCategory";

function ItemController() {
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

  // const handleItemSelect = (categoryId, itemId, itemName, categoryName) => {
  //         setSelectedItemsState((prev) => {
  //                 const categoryItems = prev[categoryId] || [];
  //                 const updatedSelectedItems = categoryItems.includes(itemId)
  //                         ? categoryItems.filter((id) => id !== itemId)
  //                         : [...categoryItems, itemId];

  //                 const updatedDishData = {
  //                         ...prev,
  //                         [categoryId]: {
  //                                 categoryName,
  //                                 items: updatedSelectedItems.map(id => {
  //                                         const category = categories.find(cat => cat.id === categoryId);
  //                                         const item = category?.items.find(it => it.id === id);
  //                                         return item ? { id: item.id, name: item.name } : null;
  //                                 }).filter(Boolean)
  //                         }
  //                 };

  //                 setFormData(updatedSelectedItems);
  //                 console.log("Updated Selected Items:", updatedDishData);
  //                 setCombinedFormData({ itemData, dishData: updatedDishData });

  //                 return updatedDishData;
  //         });
  // };

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
