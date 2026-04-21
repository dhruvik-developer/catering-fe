import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const CATEGORIES_STALE_TIME = 5 * 60 * 1000;

export const getCategoriesQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["categories", normalizedParams]
    : ["categories"];
};

export const useCategories = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getCategoriesQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getCategories(normalizedParams);
      return extractArray(response?.data);
    },
    staleTime: CATEGORIES_STALE_TIME,
    ...options,
  });
};

export default useCategories;
