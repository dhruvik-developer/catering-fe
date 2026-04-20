import React, { useMemo } from "react";
import { Dish, TagConfig } from "./types";
import { TagPreview } from "./TagPreview";
import {
  A4_PAGE,
  PRINT_LAYOUT,
  getA4TagLayout,
  paginateDishes,
} from "./printLayoutUtils";

interface PrintLayoutProps {
  dishes: Dish[];
  config: TagConfig;
}

export const PrintLayout: React.FC<PrintLayoutProps> = React.memo(
  ({ dishes, config }) => {
    const { layout, pages } = useMemo(() => {
      const layout = getA4TagLayout(config.width, config.height);
      const pages = paginateDishes(dishes, layout.tagsPerPage);
      return { layout, pages };
    }, [config.width, config.height, dishes]);

    const pageStyle = (isLastPage: boolean): React.CSSProperties => ({
      width: `${A4_PAGE.width}px`,
      minHeight: `${A4_PAGE.height}px`,
      background: "#fff",
      padding: `${PRINT_LAYOUT.margin}px`,
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: `repeat(${layout.tagsPerRow}, ${layout.safeWidth}px)`,
      gridAutoRows: `${layout.safeHeight}px`,
      gap: `${PRINT_LAYOUT.gap}px`,
      justifyContent: "center",
      alignContent: "center",
      pageBreakAfter: isLastPage ? "avoid" : "always",
      breakInside: "avoid",
      overflow: "hidden",
      position: "relative",
      margin: "0 auto",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginBottom: isLastPage ? "0" : "20px",
    });

    return (
      <div
        id="print-area"
        className="w-full bg-gray-200 py-8 print:py-0 print:bg-white flex flex-col items-center"
      >
        {pages.map((pageDishes, pageIndex) => (
          <div
            key={pageIndex}
            className="print-page bg-white print:m-0 print:shadow-none"
            style={pageStyle(pageIndex === pages.length - 1)}
          >
            {pageDishes.map((dish, index) => (
              <div
                key={`${dish.id}-${index}`}
                className="break-inside-avoid page-break-inside-avoid"
                style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
              >
                <TagPreview
                  dish={dish}
                  config={config}
                  layout={(config as any).layout}
                  logo={(config as any).logo}
                  sessionName={(config as any).sessionName}
                  showSession={(config as any).showSession}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
);

PrintLayout.displayName = "PrintLayout";
