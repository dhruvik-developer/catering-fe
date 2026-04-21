import { useState, useEffect } from "react";
import { useCategories } from "./useCategories";

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

            Object.entries(session.selected_items).forEach(([key, items]) => {
              if (!items || !Array.isArray(items)) return;

              items.forEach((dishObj) => {
                const dishName =
                  typeof dishObj === "string"
                    ? dishObj
                    : dishObj?.name || dishObj?.dishName || "";
                if (!dishName) return;

                let foundCategoryName =
                  key.toUpperCase() === "DISHES" ? null : key;

                if (!foundCategoryName) {
                  for (const category of categories) {
                    const match = category.items?.find((dish) => dish.name === dishName);
                    if (match) {
                      foundCategoryName = category.name;
                      break;
                    }
                  }
                }

                if (!foundCategoryName) foundCategoryName = "Dishes";

                if (!resolvedItems[foundCategoryName]) {
                  resolvedItems[foundCategoryName] = [];
                }
                resolvedItems[foundCategoryName].push(dishObj);
              });
            });

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
