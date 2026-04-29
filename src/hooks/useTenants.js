import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../api/TenancyApis";
import { extractArray, normalizeQueryParams } from "../utils/queryData";

const TENANTS_STALE_TIME = 5 * 60 * 1000;

export const getTenantsQueryKey = (params = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return Object.keys(normalizedParams).length > 0
    ? ["tenants", normalizedParams]
    : ["tenants"];
};

export const useTenants = (params = {}, options = {}) => {
  const normalizedParams = normalizeQueryParams(params);

  return useQuery({
    queryKey: getTenantsQueryKey(normalizedParams),
    queryFn: async () => {
      const response = await getTenants(normalizedParams);
      return extractArray(response);
    },
    staleTime: TENANTS_STALE_TIME,
    ...options,
  });
};

export default useTenants;
