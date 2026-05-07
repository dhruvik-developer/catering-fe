import { useQuery } from "@tanstack/react-query";
import { getBranches, getBranchById, getBranchUsers } from "../api/branches";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const BRANCHES_STALE_TIME = 5 * 60 * 1000;

export const getBranchesQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);
  return Object.keys(normalizedParams).length > 0
    ? ["branches", normalizedParams]
    : ["branches"];
};

export const useBranches = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);
  return useQuery({
    queryKey: getBranchesQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getBranches(normalizedParams);
      return extractArray(response);
    },
    staleTime: BRANCHES_STALE_TIME,
    ...options,
  });
};

export const useBranchById = (id, options = {}) =>
  useQuery({
    queryKey: ["branches", "by-id", id],
    queryFn: async () => {
      const response = await getBranchById(id);
      return response?.data || response || null;
    },
    staleTime: BRANCHES_STALE_TIME,
    enabled: Boolean(id),
    ...options,
  });

export const useBranchUsers = (branchId, options = {}) =>
  useQuery({
    queryKey: ["branches", "users", branchId],
    queryFn: async () => {
      const response = await getBranchUsers(branchId);
      return extractArray(response);
    },
    staleTime: BRANCHES_STALE_TIME,
    enabled: Boolean(branchId),
    ...options,
  });

export default useBranches;
