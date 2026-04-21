import { useQuery } from "@tanstack/react-query";
import { getIngredientCategories } from "../api/vendors";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const INGREDIENT_CATEGORIES_STALE_TIME = 5 * 60 * 1000;

export const getIngredientCategoriesQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["ingredient-categories", normalizedParams]
    : ["ingredient-categories"];
};

export const useIngredientCategories = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getIngredientCategoriesQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getIngredientCategories(normalizedParams);
      return extractArray(response);
    },
    staleTime: INGREDIENT_CATEGORIES_STALE_TIME,
    ...options,
  });
};

export default useIngredientCategories;
