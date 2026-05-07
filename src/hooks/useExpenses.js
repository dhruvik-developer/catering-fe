import { useQuery } from "@tanstack/react-query";
import { getExpenses, getExpenseCategories } from "../api/FetchExpense";
import {
  createExpense,
  createExpenseCategory,
  deleteExpense,
  updateExpense,
} from "../api/PostExpense";
import { extractArray, normalizeQueryParams } from "../utils/queryData";
import { useApiMutation } from "./useApiMutation";

// ────────────────────────────────────────────────────────────────────────────
// Expense queries + mutations
//
// Centralised so:
//   - The Expense list page reactively re-renders after create/update/delete
//     (via cache invalidation, no manual refetch).
//   - Any other screen that reads from `useExpenseCategories` (e.g. a
//     dropdown in another form) also sees a newly added category instantly.
// ────────────────────────────────────────────────────────────────────────────

const STALE_TIME = 5 * 60 * 1000;

export const EXPENSES_QUERY_KEY = ["expenses"];
export const EXPENSE_CATEGORIES_QUERY_KEY = ["expense-categories"];

const buildExpensesKey = (params = {}) => {
  const normalized = normalizeQueryParams(params);
  return Object.keys(normalized).length > 0
    ? [...EXPENSES_QUERY_KEY, normalized]
    : EXPENSES_QUERY_KEY;
};

export const useExpenses = (params = {}, options = {}) => {
  const normalized = normalizeQueryParams(params);
  return useQuery({
    queryKey: buildExpensesKey(normalized),
    queryFn: async () => {
      const response = await getExpenses(normalized);
      return extractArray(response?.data);
    },
    staleTime: STALE_TIME,
    ...options,
  });
};

export const useExpenseCategories = (options = {}) =>
  useQuery({
    queryKey: EXPENSE_CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const response = await getExpenseCategories();
      return extractArray(response?.data);
    },
    staleTime: STALE_TIME,
    ...options,
  });

// Invalidate both the list and any *params-scoped* variants when a row
// changes — Plus the categories list when category-touching mutations fire.
const expenseInvalidateKeys = [EXPENSES_QUERY_KEY];
const categoryInvalidateKeys = [
  EXPENSE_CATEGORIES_QUERY_KEY,
  EXPENSES_QUERY_KEY,
];

export const useCreateExpenseMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["expenses", "create"],
    mutationFn: createExpense,
    invalidateQueryKeys: expenseInvalidateKeys,
    ...options,
  });

export const useUpdateExpenseMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["expenses", "update"],
    mutationFn: ({ id, data }) => updateExpense(id, data),
    invalidateQueryKeys: expenseInvalidateKeys,
    ...options,
  });

export const useDeleteExpenseMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["expenses", "delete"],
    mutationFn: deleteExpense,
    invalidateQueryKeys: expenseInvalidateKeys,
    ...options,
  });

export const useCreateExpenseCategoryMutation = (options = {}) =>
  useApiMutation({
    mutationKey: ["expense-categories", "create"],
    mutationFn: createExpenseCategory,
    invalidateQueryKeys: categoryInvalidateKeys,
    ...options,
  });
