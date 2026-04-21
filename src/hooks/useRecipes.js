import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../api/recipes";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const RECIPES_STALE_TIME = 5 * 60 * 1000;

export const getRecipesQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["recipes", normalizedParams]
    : ["recipes"];
};

export const useRecipes = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getRecipesQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getRecipes(normalizedParams);
      return extractArray(response?.data);
    },
    staleTime: RECIPES_STALE_TIME,
    ...options,
  });
};

export default useRecipes;
