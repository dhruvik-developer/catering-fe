import { useQuery } from "@tanstack/react-query";
import { getItem, getItemById } from "../api/FetchItem";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const BRANCH_ITEMS_STALE_TIME = 5 * 60 * 1000;

export const getBranchItemsQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["branch-items", normalizedParams]
    : ["branch-items"];
};

export const useBranchItems = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getBranchItemsQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getItem(normalizedParams);
      return extractArray(response?.data ?? response);
    },
    staleTime: BRANCH_ITEMS_STALE_TIME,
    ...options,
  });
};

export const getBranchItemByIdQueryKey = (id) => ["branch-items", "by-id", id];

export const useBranchItemById = (id, options = {}) =>
  useQuery({
    queryKey: getBranchItemByIdQueryKey(id),
    queryFn: async () => {
      const response = await getItemById(id);
      return response?.data?.data || response?.data || null;
    },
    staleTime: BRANCH_ITEMS_STALE_TIME,
    enabled: Boolean(id),
    ...options,
  });

export default useBranchItems;
