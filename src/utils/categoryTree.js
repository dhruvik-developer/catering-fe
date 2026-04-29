const getPosition = (category) => {
  const position = Number(category?.positions);
  return Number.isFinite(position) ? position : Number.MAX_SAFE_INTEGER;
};

const normalizeName = (value = "") => String(value).trim().toLowerCase();

export const getSelectedItemName = (item) => {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return "";

  const name = item.name;
  if (typeof name === "string") return name;
  if (name && typeof name === "object") {
    return name.name || name.dishName || "";
  }

  return item.dishName || item.itemName || "";
};

export const getSelectedItemId = (item) => {
  if (!item || typeof item !== "object") return null;

  return item.id || item.dishId || item.itemId || item.name?.id || null;
};

export const flattenSelectedItemEntries = (selectedItems, ancestors = []) => {
  if (!selectedItems) return [];

  const categoryName = ancestors[ancestors.length - 1] || "Dishes";
  const categoryPath = ancestors.join(" > ");

  if (Array.isArray(selectedItems)) {
    return selectedItems.map((item) => ({
      categoryName,
      categoryPath,
      item,
    }));
  }

  if (typeof selectedItems !== "object") {
    return [{ categoryName, categoryPath, item: selectedItems }];
  }

  return Object.entries(selectedItems).flatMap(([key, value]) => {
    const path = [...ancestors, key];
    const childCategoryName = key || categoryName;
    const childCategoryPath = path.join(" > ");

    if (Array.isArray(value)) {
      return value.map((item) => ({
        categoryName: childCategoryName,
        categoryPath: childCategoryPath,
        item,
      }));
    }

    if (value && typeof value === "object") {
      if (getSelectedItemName(value) || getSelectedItemId(value)) {
        return [
          {
            categoryName: childCategoryName,
            categoryPath: childCategoryPath,
            item: value,
          },
        ];
      }

      return flattenSelectedItemEntries(value, path);
    }

    if (value === null || value === undefined || value === "") return [];

    return [
      {
        categoryName: childCategoryName,
        categoryPath: childCategoryPath,
        item: value,
      },
    ];
  });
};

export const sortCategoryTree = (categories = []) =>
  [...categories]
    .sort((a, b) => getPosition(a) - getPosition(b))
    .map((category) => ({
      ...category,
      subcategories: sortCategoryTree(category.subcategories || []),
    }));

export const flattenCategoryItems = (categoryOrCategories, ancestors = []) => {
  if (Array.isArray(categoryOrCategories)) {
    return sortCategoryTree(categoryOrCategories).flatMap((category) =>
      flattenCategoryItems(category, ancestors)
    );
  }

  const category = categoryOrCategories;
  if (!category) return [];

  const path = [...ancestors, category].filter(Boolean);
  const pathNames = path.map((item) => item.name).filter(Boolean);
  const categoryName = category.name || "Dishes";
  const rootCategoryName = pathNames[0] || categoryName;
  const categoryPath = pathNames.join(" > ") || categoryName;

  const ownItems = (category.items || []).map((item) => ({
    ...item,
    categoryName,
    categoryPath,
    rootCategoryName,
    categoryId: category.id,
  }));

  const childItems = sortCategoryTree(category.subcategories || []).flatMap(
    (subcategory) => flattenCategoryItems(subcategory, path)
  );

  return [...ownItems, ...childItems];
};

export const findCategoryItem = (
  categories = [],
  { id, name, categoryName } = {}
) => {
  const items = flattenCategoryItems(categories);
  const normalizedName = normalizeName(name);
  const normalizedCategoryName = normalizeName(categoryName);
  const matchesCategoryName = (item) => {
    if (!normalizedCategoryName) return true;

    return [
      item.categoryName,
      item.rootCategoryName,
      item.categoryPath,
    ].some((value) => normalizeName(value).includes(normalizedCategoryName));
  };

  if (id !== null && id !== undefined) {
    const matchById =
      items.find(
        (item) => String(item.id) === String(id) && matchesCategoryName(item)
      ) || items.find((item) => String(item.id) === String(id));
    if (matchById) return matchById;
  }

  if (!normalizedName) return null;

  return (
    items.find(
      (item) =>
        normalizeName(item.name) === normalizedName && matchesCategoryName(item)
    ) ||
    items.find((item) => normalizeName(item.name) === normalizedName) ||
    null
  );
};

export const categoryMatchesQuery = (category, query = "") => {
  const normalizedQuery = normalizeName(query);
  if (!normalizedQuery) return true;

  if (normalizeName(category?.name).includes(normalizedQuery)) return true;

  return flattenCategoryItems(category).some(
    (item) =>
      normalizeName(item.name).includes(normalizedQuery) ||
      normalizeName(item.categoryPath).includes(normalizedQuery)
  );
};
