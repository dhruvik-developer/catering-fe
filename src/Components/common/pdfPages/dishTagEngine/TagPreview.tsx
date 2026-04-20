import React from "react";
import { Dish, TagConfig } from "./types";

interface TagPreviewProps {
  dish: Dish;
  config: TagConfig;
  layout?: any; // To support DishTagModal's LayoutEditor positioning
  logo?: any;
  sessionName?: string;
  showSession?: boolean;
}

import { getLogoFilter } from "../../../designer/LogoUploader";

export const TagPreview: React.FC<TagPreviewProps> = ({
  dish,
  config,
  layout = {},
  logo,
  sessionName,
  showSession,
}) => {
  const {
    width,
    height,
    fontFamily,
    fontSize,
    alignment,
    backgroundColor,
    textColor,
    border,
    borderColor = "#e5e7eb",
    borderWidth = 2,
    showCaterer = true,
    pattern = "none", // missing previously
  } = config as any;

  const tagStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor,
    backgroundImage: pattern !== "none" ? pattern : "none",
    backgroundSize: "100px 100px", // simplified fallback for patternSize
    color: textColor,
    fontFamily,
    textAlign: alignment,
    border:
      border !== "none" ? `${borderWidth}px ${border} ${borderColor}` : "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // centered by default, layout positioning overrides per element
    alignItems: "center",
    padding: "16px",
    boxSizing: "border-box",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  return (
    <div style={tagStyle} className="shadow-sm">
      {logo?.url && (
        <img
          src={logo.url}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${layout.logo?.x || 0}px, ${layout.logo?.y || 0}px)`,
            width: `${logo.size || 100}px`,
            height: `${logo.size || 100}px`,
            objectFit: "contain",
            opacity: (logo.opacity ?? 50) / 100,
            pointerEvents: "none",
            filter: getLogoFilter(logo.colorId),
          }}
        />
      )}

      {/* Session Name */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          opacity: 0.7,
          visibility: showSession ? "visible" : "hidden",
          transform: `translate(${layout.sessionName?.x || 0}px, ${layout.sessionName?.y || 0}px)`,
          position: layout.sessionName ? "absolute" : "static",
        }}
      >
        {sessionName || "Session"}
      </div>

      <div
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
          lineHeight: 1.2,
          wordBreak: "break-word",
          marginBottom:
            !layout.dishName && showCaterer && dish.caterer ? "8px" : "0",
          transform: `translate(${layout.dishName?.x || 0}px, ${layout.dishName?.y || 0}px)`,
          position: layout.dishName ? "absolute" : "static",
        }}
      >
        {dish.name}
      </div>

      {showCaterer && dish.caterer && (
        <div
          style={{
            fontSize: `${Math.max(10, fontSize * 0.45)}px`,
            fontWeight: 600,
            opacity: 0.8,
            transform: `translate(${layout.catererName?.x || 0}px, ${layout.catererName?.y || 0}px)`,
            position: layout.catererName ? "absolute" : "static",
          }}
        >
          {dish.caterer}
        </div>
      )}
    </div>
  );
};
