/**
 * designOptions.js
 *
 * Centralized design configuration for the Dish Tag Designer.
 * Import from this module instead of hardcoding values in components.
 *
 * To add new fonts, patterns, or borders in the future, just add items to
 * the relevant array here — no UI code changes required.
 */

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Each entry has the display name and the CSS font-family string.
// These fonts are loaded on-demand via fontLoader.js.
export const fonts = [
  { name: "Inter", family: "Inter", value: "'Inter', sans-serif" },
  { name: "Roboto", family: "Roboto", value: "'Roboto', sans-serif" },
  {
    name: "Playfair Display",
    family: "Playfair Display",
    value: "'Playfair Display', serif",
  },
  {
    name: "Dancing Script",
    family: "Dancing Script",
    value: "'Dancing Script', cursive",
  },
  { name: "Poppins", family: "Poppins", value: "'Poppins', sans-serif" },
  {
    name: "Montserrat",
    family: "Montserrat",
    value: "'Montserrat', sans-serif",
  },
  { name: "Oswald", family: "Oswald", value: "'Oswald', sans-serif" },
  { name: "Lora", family: "Lora", value: "'Lora', serif" },
  { name: "Pacifico", family: "Pacifico", value: "'Pacifico', cursive" },
  { name: "Caveat", family: "Caveat", value: "'Caveat', cursive" },
  { name: "Cinzel", family: "Cinzel", value: "'Cinzel', serif" },
];

// ─── Background Patterns ──────────────────────────────────────────────────────
// Each entry has:
//   id    – stable identifier
//   label – display name shown in the selector
//   css   – the CSS backgroundImage value
//   size  – optional backgroundSize value (defaults to "auto" if omitted)
export const backgroundPatterns = [
  {
    id: "none",
    label: "None",
    css: "none",
  },
  {
    id: "dots",
    label: "Subtle Dots",
    css: "radial-gradient(#e5e7eb 1.5px, transparent 1.5px)",
    size: "15px 15px",
  },
  {
    id: "gradient",
    label: "Gradient",
    css: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)",
  },
  {
    id: "diagonal-lines",
    label: "Diagonal Lines",
    css: "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 8px)",
    size: "20px 20px",
  },
  {
    id: "h-stripes",
    label: "Horizontal Stripes",
    css: "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 10px)",
    size: "20px 20px",
  },
  {
    id: "grid",
    label: "Square Grid",
    css: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
  },
  {
    id: "zigzag",
    label: "Zig Zag",
    css: "linear-gradient(135deg, rgba(0,0,0,0.03) 25%, transparent 25%) -10px 0, linear-gradient(225deg, rgba(0,0,0,0.03) 25%, transparent 25%) -10px 0, linear-gradient(315deg, rgba(0,0,0,0.03) 25%, transparent 25%), linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%)",
    size: "20px 20px",
  },
  {
    id: "soft-glow",
    label: "Soft Glow",
    css: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0.05) 100%)",
  },
];

// ─── Border Styles ────────────────────────────────────────────────────────────
export const borderStyles = [
  { id: "none", label: "None" },
  { id: "solid", label: "Solid" },
  { id: "dashed", label: "Dashed" },
  { id: "double", label: "Double" },
];

// ─── Helper: resolve a pattern's backgroundSize ───────────────────────────────
// Returns the backgroundSize CSS value for a given pattern css string.
// Useful for components that derived backgroundSize from the css value before.
export function getPatternSize(patternCss) {
  const found = backgroundPatterns.find((p) => p.css === patternCss);
  return found?.size ?? "auto";
}
