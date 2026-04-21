import { useQuery } from "@tanstack/react-query";
import { getIngredientItems } from "../api/vendors";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const INGREDIENT_ITEMS_STALE_TIME = 5 * 60 * 1000;

export const getIngredientItemsQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["ingredient-items", normalizedParams]
    : ["ingredient-items"];
};

export const useIngredientItems = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getIngredientItemsQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getIngredientItems(normalizedParams);
      return extractArray(response);
    },
    staleTime: INGREDIENT_ITEMS_STALE_TIME,
    ...options,
  });
};

export default useIngredientItems;
