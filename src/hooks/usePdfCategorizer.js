import { useState, useEffect } from "react";
import { useCategories } from "./useCategories";
import {
  findCategoryItem,
  flattenSelectedItemEntries,
  getSelectedItemId,
  getSelectedItemName,
} from "../utils/categoryTree";

export const usePdfCategorizer = (pdfData, isReady = true) => {
  const [categorizedData, setCategorizedData] = useState(pdfData);
  const [isCategorizing, setIsCategorizing] = useState(true);
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories({}, { enabled: isReady && Boolean(pdfData) });

  useEffect(() => {
    if (!isReady || !pdfData) {
      setCategorizedData(pdfData);
      setIsCategorizing(false);
      return;
    }

    if (isCategoriesLoading) {
      setIsCategorizing(true);
      return;
    }

    const newData = JSON.parse(JSON.stringify(pdfData));
    const itemsToProcess = Array.isArray(newData) ? newData : [newData];

    itemsToProcess.forEach((item) => {
      if (item && item.sessions && Array.isArray(item.sessions)) {
        item.sessions.forEach((session) => {
          if (session.selected_items) {
            const resolvedItems = {};

            flattenSelectedItemEntries(session.selected_items).forEach(
              ({ categoryName: key, categoryPath, item: dishObj }) => {
                const dishName = getSelectedItemName(dishObj);
                if (!dishName) return;

                const categoryHint = categoryPath || key;
                const matchedDish = findCategoryItem(categories, {
                  id: getSelectedItemId(dishObj),
                  name: dishName,
                  categoryName: categoryHint,
                });

                let foundCategoryName =
                  matchedDish?.categoryName ||
                  (key.toUpperCase() === "DISHES" ? null : key);

                if (!foundCategoryName) foundCategoryName = "Dishes";

                if (!resolvedItems[foundCategoryName]) {
                  resolvedItems[foundCategoryName] = [];
                }
                resolvedItems[foundCategoryName].push(dishObj);
              }
            );

            session.selected_items = resolvedItems;
          }
        });
      }
    });

    setCategorizedData(
      Array.isArray(newData) && !Array.isArray(pdfData) ? newData[0] : newData
    );
    setIsCategorizing(false);
  }, [categories, isCategoriesLoading, isReady, pdfData]);

  return { categorizedData, isCategorizing };
};
