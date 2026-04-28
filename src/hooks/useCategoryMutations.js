import {
  createCategory,
  createItem,
  swapCategories,
  updateCategory,
  updateItem,
  updateItemCosts,
} from "../api/categories";
import useApiMutation from "./useApiMutation";

const CATEGORIES_QUERY_KEYS = [["categories"]];

export const useCreateCategoryMutation = () =>
  useApiMutation({
    mutationKey: ["mutations", "create-category"],
    mutationFn: ({ categoryName, parentId }) => createCategory(categoryName, parentId),
    invalidateQueryKeys: CATEGORIES_QUERY_KEYS,
  });

export const useUpdateCategoryMutation = () =>
  useApiMutation({
    mutationKey: ["mutations", "update-category"],
    mutationFn: ({ categoryId, newName, parentId }) =>
      updateCategory(categoryId, newName, parentId),
    invalidateQueryKeys: CATEGORIES_QUERY_KEYS,
  });

export const useCreateMenuItemMutation = () =>
  useApiMutation({
    mutationKey: ["mutations", "create-menu-item"],
    mutationFn: ({ itemName, category, base_cost, selection_rate }) =>
      createItem(itemName, category, base_cost, selection_rate),
    invalidateQueryKeys: CATEGORIES_QUERY_KEYS,
  });

export const useUpdateMenuItemMutation = () =>
  useApiMutation({
    mutationKey: ["mutations", "update-menu-item"],
    mutationFn: ({ itemId, itemData }) => updateItem(itemId, itemData),
    invalidateQueryKeys: CATEGORIES_QUERY_KEYS,
  });

export const useUpdateItemCostsMutation = () =>
  useApiMutation({
    mutationKey: ["mutations", "update-item-costs"],
    mutationFn: ({ itemId, base_cost, selection_rate }) =>
      updateItemCosts(itemId, base_cost, selection_rate),
    invalidateQueryKeys: CATEGORIES_QUERY_KEYS,
  });

export const useSwapCategoriesMutation = () =>
  useApiMutation({
    mutationKey: ["mutations", "swap-categories"],
    mutationFn: ({ categoryId, position }) => swapCategories(categoryId, position),
    invalidateQueryKeys: CATEGORIES_QUERY_KEYS,
  });
