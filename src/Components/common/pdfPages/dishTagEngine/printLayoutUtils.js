export const A4_PAGE = {
  width: 794,
  height: 1123,
};

export const PRINT_LAYOUT = {
  margin: 32,
  gap: 12,
};

export function getA4TagLayout(width, height) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);

  const usableWidth = A4_PAGE.width - PRINT_LAYOUT.margin * 2;
  const usableHeight = A4_PAGE.height - PRINT_LAYOUT.margin * 2;

  const tagsPerRow = Math.max(
    1,
    Math.floor((usableWidth + PRINT_LAYOUT.gap) / (safeWidth + PRINT_LAYOUT.gap))
  );
  const tagsPerColumn = Math.max(
    1,
    Math.floor((usableHeight + PRINT_LAYOUT.gap) / (safeHeight + PRINT_LAYOUT.gap))
  );
  const tagsPerPage = Math.max(1, tagsPerRow * tagsPerColumn);

  const usedWidth =
    tagsPerRow * safeWidth + Math.max(0, tagsPerRow - 1) * PRINT_LAYOUT.gap;
  const usedHeight =
    tagsPerColumn * safeHeight +
    Math.max(0, tagsPerColumn - 1) * PRINT_LAYOUT.gap;

  return {
    safeWidth,
    safeHeight,
    usableWidth,
    usableHeight,
    tagsPerRow,
    tagsPerColumn,
    tagsPerPage,
    contentWidth: usedWidth,
    contentHeight: usedHeight,
  };
}

export function paginateDishes(dishes, tagsPerPage) {
  const pages = [];

  for (let index = 0; index < dishes.length; index += tagsPerPage) {
    pages.push(dishes.slice(index, index + tagsPerPage));
  }

  return pages;
}
