export const extractArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const directCandidates = [
    value.data,
    value.results,
    value.items,
    value.list,
    value.rows,
    value.payload,
    value.data?.data,
    value.data?.results,
    value.results?.data,
    value.results?.results,
    value.payload?.data,
    value.payload?.results,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  for (const nested of Object.values(value)) {
    if (Array.isArray(nested)) return nested;
    if (nested && typeof nested === "object") {
      const deep = extractArray(nested);
      if (deep.length > 0) return deep;
    }
  }

  return [];
};

export const normalizeQueryParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        !(typeof value === "string" && value.trim() === "")
    )
  );
