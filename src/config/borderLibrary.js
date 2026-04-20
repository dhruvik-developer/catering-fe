/**
 * borderLibrary.js
 *
 * Centralized registry of border styles for the Dish Tag Designer.
 * Add new border types here without touching UI components.
 */

export const borderLibrary = [
  { id: "none", label: "None", preview: "none" },
  { id: "solid", label: "Solid", preview: "2px solid #94a3b8" },
  { id: "dashed", label: "Dashed", preview: "2px dashed #94a3b8" },
  { id: "dotted", label: "Dotted", preview: "2px dotted #94a3b8" },
  { id: "double", label: "Double", preview: "4px double #94a3b8" },
  { id: "groove", label: "Groove", preview: "3px groove #94a3b8" },
  { id: "ridge", label: "Ridge", preview: "3px ridge #94a3b8" },
];

/**
 * Build the CSS border string for a given border id / width / color.
 */
export function buildBorderCss({ borderStyle, borderWidth, borderColor }) {
  if (!borderStyle || borderStyle === "none") return "none";
  return `${borderWidth}px ${borderStyle} ${borderColor}`;
}
