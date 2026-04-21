import { useQuery } from "@tanstack/react-query";
import { getVendorById, getVendors } from "../api/vendors";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const VENDORS_STALE_TIME = 5 * 60 * 1000;

export const getVendorsQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["vendors", normalizedParams]
    : ["vendors"];
};

export const useVendors = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getVendorsQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getVendors(normalizedParams);
      return extractArray(response);
    },
    staleTime: VENDORS_STALE_TIME,
    ...options,
  });
};

export const getVendorByIdQueryKey = (id) => ["vendors", "by-id", id];

export const useVendorById = (id, options = {}) =>
  useQuery({
    queryKey: getVendorByIdQueryKey(id),
    queryFn: async () => {
      const response = await getVendorById(id);
      return response?.data || response || null;
    },
    staleTime: VENDORS_STALE_TIME,
    enabled: Boolean(id),
    ...options,
  });

export default useVendors;
