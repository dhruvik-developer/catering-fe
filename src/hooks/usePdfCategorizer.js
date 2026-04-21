import { useState, useEffect } from "react";
import { getCategory } from "../api/FetchCategory";

export const usePdfCategorizer = (pdfData, isReady = true) => {
  const [categorizedData, setCategorizedData] = useState(pdfData);
  const [isCategorizing, setIsCategorizing] = useState(true);

  useEffect(() => {
    if (!isReady || !pdfData) {
      setCategorizedData(pdfData);
      setIsCategorizing(false);
      return;
    }

    let isMounted = true;
    setIsCategorizing(true);

    const processCategories = async () => {
      try {
        const res = await getCategory();
        const categories = res?.data?.data || [];

        // Deep clone pdfData to avoid mutating original state props
        const newData = JSON.parse(JSON.stringify(pdfData));

        // Process single item or array based on how it's passed
        const itemsToProcess = Array.isArray(newData) ? newData : [newData];

        itemsToProcess.forEach((item) => {
          if (item && item.sessions && Array.isArray(item.sessions)) {
            item.sessions.forEach((session) => {
              if (session.selected_items) {
                const resolvedItems = {};

                Object.entries(session.selected_items).forEach(
                  ([key, items]) => {
                    if (!items || !Array.isArray(items)) return;

                    items.forEach((dishObj) => {
                      const dishName =
                        typeof dishObj === "string"
                          ? dishObj
                          : dishObj?.name || dishObj?.dishName || "";
                      if (!dishName) return;

                      // Only re-map if the name is literally 'Dishes' or 'DISHES'
                      // Otherwise, it was probably meant to be a custom name we can keep.
                      let foundCategoryName =
                        key.toUpperCase() === "DISHES" ? null : key;

                      if (!foundCategoryName) {
                        for (const cat of categories) {
                          const match = cat.items?.find(
                            (d) => d.name === dishName
                          );
                          if (match) {
                            foundCategoryName = cat.name;
                            break;
                          }
                        }
                      }

                      // Fallback if not found in db categories
                      if (!foundCategoryName) foundCategoryName = "Dishes";

                      if (!resolvedItems[foundCategoryName]) {
                        resolvedItems[foundCategoryName] = [];
                      }
                      resolvedItems[foundCategoryName].push(dishObj);
                    });
                  }
                );

                session.selected_items = resolvedItems;
              }
            });
          }
        });

        if (isMounted) {
          setCategorizedData(
            Array.isArray(newData) && !Array.isArray(pdfData)
              ? newData[0]
              : newData
          );
          setIsCategorizing(false);
        }
      } catch (err) {
        console.error("Error categorizing pdf data:", err);
        if (isMounted) {
          setCategorizedData(pdfData);
          setIsCategorizing(false);
        }
      }
    };

    processCategories();

    return () => {
      isMounted = false;
    };
  }, [pdfData, isReady]);

  return { categorizedData, isCategorizing };
};
