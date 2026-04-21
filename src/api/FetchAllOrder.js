import toast from "react-hot-toast";
import ApiInstance from "../services/ApiInstance";
import { getRecipes } from "./recipes";

const inFlightAllOrderRequests = new Map();

const buildParamsKey = (params = {}) => {
  const sortedEntries = Object.entries(params).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return JSON.stringify(sortedEntries);
};

const extractArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const directCandidates = [
    value.data,
    value.results,
    value.items,
    value.list,
    value.rows,
    value.payload,
    value.data?.data,
    value.data?.results,
    value.results?.data,
    value.results?.results,
    value.payload?.data,
    value.payload?.results,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  for (const nested of Object.values(value)) {
    if (Array.isArray(nested)) return nested;
    if (nested && typeof nested === "object") {
      const deep = extractArray(nested);
      if (deep.length > 0) return deep;
    }
  }

  return [];
};

const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

const getRecipeItemName = (recipe) => {
  const rawItem =
    recipe?.item ??
    recipe?.menu_item ??
    recipe?.menuItem ??
    recipe?.item_name ??
    recipe?.itemName ??
    null;

  if (typeof rawItem === "string") return rawItem;
  if (rawItem && typeof rawItem === "object") {
    return rawItem.name ?? rawItem.item_name ?? rawItem.title ?? "";
  }

  return "";
};

const getRecipeIngredientName = (recipe) => {
  const rawIngredient =
    recipe?.ingredient ??
    recipe?.ingredient_name ??
    recipe?.ingredientName ??
    null;

  if (typeof rawIngredient === "string") return rawIngredient;
  if (rawIngredient && typeof rawIngredient === "object") {
    return (
      rawIngredient.name ??
      rawIngredient.ingredient_name ??
      rawIngredient.title ??
      ""
    );
  }

  return "";
};

const getSelectedItemName = (selectedItem) => {
  if (typeof selectedItem === "string") return selectedItem;
  if (!selectedItem || typeof selectedItem !== "object") return "";

  if (typeof selectedItem.name === "string") return selectedItem.name;
  if (selectedItem.name && typeof selectedItem.name === "object") {
    return (
      selectedItem.name.name ??
      selectedItem.name.item_name ??
      selectedItem.name.title ??
      ""
    );
  }

  return (
    selectedItem.item_name ??
    selectedItem.itemName ??
    selectedItem.title ??
    selectedItem.item?.name ??
    selectedItem.item ??
    ""
  );
};

const getSessionSelectedItemNames = (selectedItems) => {
  if (!selectedItems || typeof selectedItems !== "object") return [];

  const uniqueItems = new Map();

  Object.values(selectedItems).forEach((items) => {
    if (!Array.isArray(items)) return;

    items.forEach((selectedItem) => {
      const itemName = String(getSelectedItemName(selectedItem) || "").trim();
      const normalizedName = normalizeText(itemName);

      if (normalizedName && !uniqueItems.has(normalizedName)) {
        uniqueItems.set(normalizedName, itemName);
      }
    });
  });

  return Array.from(uniqueItems.values());
};

export const getAllOrder = async (params = {}) => {
  const requestKey = buildParamsKey(params);
  const existingRequest = inFlightAllOrderRequests.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = (async () => {
    try {
      const response = await ApiInstance.get("/event-bookings/", { params });
      return response;
    } catch {
      toast.error("Error fetching orders");
    } finally {
      inFlightAllOrderRequests.delete(requestKey);
    }
  })();

  inFlightAllOrderRequests.set(requestKey, requestPromise);

  return requestPromise;
};

export const getSingleOrder = async (id) => {
  try {
    const response = await ApiInstance.get(`/event-bookings/${id}/`);
    return response;
  } catch (error) {
    toast.error("Error fetching order details");
    console.error("API Error:", error);
  }
};

export const updateEventBooking = async (id, data) => {
  try {
    const response = await ApiInstance.put(`/event-bookings/${id}/`, data);
    return response;
  } catch (error) {
    toast.error("Error updating order");
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchEventIngredientList = async (eventId) => {
  try {
    const [response, recipeResponse] = await Promise.all([
      getSingleOrder(eventId),
      getRecipes(),
    ]);

    // Transform the response to match the expected format
    if (response?.data?.status) {
      const eventData = response.data?.data;
      const recipes = extractArray(recipeResponse?.data);

      // Convert response object into grouped category format expected by component
      const categoryMap = {};
      const recipeItemIngredientMap = new Map();

      recipes.forEach((recipe) => {
        const itemName = normalizeText(getRecipeItemName(recipe));
        const ingredientName = normalizeText(getRecipeIngredientName(recipe));

        if (!itemName || !ingredientName) return;

        if (!recipeItemIngredientMap.has(itemName)) {
          recipeItemIngredientMap.set(itemName, new Set());
        }

        recipeItemIngredientMap.get(itemName).add(ingredientName);
      });

      const sessions = eventData?.sessions || [];

      sessions.forEach((session, sessionIndex) => {
        const ingredientsRequired = session.ingredients_required || {};
        const sessionLabel = session.event_time
          ? ` (Session: ${session.event_time})`
          : ` (Session ${sessionIndex + 1})`;
        const sessionSelectedItems = getSessionSelectedItemNames(
          session.selected_items
        );

        Object.entries(ingredientsRequired).forEach(
          ([ingredientName, info]) => {
            let quantity = "";
            let category = "Uncategorized";
            let availableStock = "0";
            let stockType = "";

            if (typeof info === "string") {
              quantity = info;
            } else if (info && typeof info === "object") {
              quantity = info.quantity || "";
              category = info.category || category;
              // Use available_stock and stock_type directly from the API response
              availableStock = info.available_stock || "0";
              stockType = info.stock_type || "";
            }

            const useItems = [];
            if (quantity) {
              const usedInItems = info.used_in || sessionSelectedItems.filter((selectedItem) =>
                recipeItemIngredientMap
                  .get(normalizeText(selectedItem))
                  ?.has(normalizeText(ingredientName))
              );

              useItems.push({
                item_name: ingredientName + sessionLabel, // Differentiate usage per session
                item_category: category,
                quantity: quantity,
                used_in_items: usedInItems,
                session_id: session.id,
              });
            }

            if (!categoryMap[category]) {
              categoryMap[category] = {};
            }

            if (!categoryMap[category][ingredientName]) {
              categoryMap[category][ingredientName] = {
                item: ingredientName,
                quantity: "", // Will be dynamically summed by ViewIngredientComponent
                godown_quantity: parseFloat(availableStock) || 0,
                godown_quantity_type: stockType, // e.g. "KG", "L", ""
                quantity_type: "",
                use_item: [...useItems],
              };
            } else {
              categoryMap[category][ingredientName].use_item.push(...useItems);
            }
          }
        );
      });

      // Convert map of maps to the array format expected by the component
      const transformedData = Object.entries(categoryMap).map(
        ([catName, itemsMap]) => ({
          name: catName,
          data: Object.values(itemsMap),
        })
      );

      return {
        status: true,
        data: {
          data: transformedData,
        },
      };
    }

    return response;
  } catch (error) {
    toast.error("Error fetching event ingredient list");
    console.error("Error fetching event ingredient list:", error);
    return null;
  }
};
