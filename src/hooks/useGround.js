import { useQuery } from "@tanstack/react-query";
import {
  createGroundCategory,
  createGroundItem,
  deleteGroundCategory,
  deleteGroundItem,
  getGroundCategories,
  getGroundItems,
  updateGroundCategory,
  updateGroundItem,
} from "../api/GroundApis";
import { extractArray, normalizeQueryParams } from "../utils/queryData";
import { useApiMutation } from "./useApiMutation";

// Single source of truth for ground categories + items. Switching the master
// pages to these hooks gives us automatic cache invalidation across the
// app — including dropdowns inside session/event forms that pick from the
// same data.

const STALE_TIME = 5 * 60 * 1000;

export const GROUND_CATEGORIES_QUERY_KEY = ["ground-categories"];
export const GROUND_ITEMS_QUERY_KEY = ["ground-items"];

export const useGroundCategories = (params = {}, options = {}) => {
  const normalized = normalizeQueryParams(params);
  return useQuery({
    queryKey: Object.keys(normalized).length > 0
      ? [...GROUND_CATEGORIES_QUERY_KEY, normalized]
      : GROUND_CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getGroundCategories(normalized);
      return extractArray(response?.data);
    },
    staleTime: STALE_TIME,
    ...options,
  });
};

export const useGroundItems = (params = {}, options = {}) => {
  const normalized = normalizeQueryParams(params);
  return useQuery({
    queryKey: Object.keys(normalized).length > 0
      ? [...GROUND_ITEMS_QUERY_KEY, normalized]
      : GROUND_ITEMS_QUERY_KEY,
    queryFn: async () => {
      const response = await getGroundItems(normalized);
      return extractArray(response?.data);
    },
    staleTime: STALE_TIME,
    ...options,
  });
};

// A category mutation also affects the items list (items embed category
// names) so we invalidate both keys together.
const categoryInvalidate = [GROUND_CATEGORIES_QUERY_KEY, GROUND_ITEMS_QUERY_KEY];
const itemInvalidate = [GROUND_ITEMS_QUERY_KEY];

export const useCreateGroundCategoryMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["ground-categories", "create"],
    mutationFn: createGroundCategory,
    invalidateQueryKeys: categoryInvalidate,
    ...options,
  });

export const useUpdateGroundCategoryMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["ground-categories", "update"],
    mutationFn: ({ id, data }) => updateGroundCategory(id, data),
    invalidateQueryKeys: categoryInvalidate,
    ...options,
  });

export const useDeleteGroundCategoryMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["ground-categories", "delete"],
    mutationFn: deleteGroundCategory,
    invalidateQueryKeys: categoryInvalidate,
    ...options,
  });

export const useCreateGroundItemMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["ground-items", "create"],
    mutationFn: createGroundItem,
    invalidateQueryKeys: itemInvalidate,
    ...options,
  });

export const useUpdateGroundItemMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["ground-items", "update"],
    mutationFn: ({ id, data }) => updateGroundItem(id, data),
    invalidateQueryKeys: itemInvalidate,
    ...options,
  });

export const useDeleteGroundItemMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["ground-items", "delete"],
    mutationFn: deleteGroundItem,
    invalidateQueryKeys: itemInvalidate,
    ...options,
  });
