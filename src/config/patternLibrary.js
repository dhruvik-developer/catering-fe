/**
 * patternLibrary.js
 *
 * Centralized registry of all background patterns available in the Dish Tag Designer.
 * Add new patterns here — no UI code changes required.
 *
 * Each entry:
 *   id     – stable unique identifier (used as React key and for equality checks)
 *   label  – display name in the picker
 *   css    – CSS backgroundImage value applied to the tag
 *   size   – CSS backgroundSize (optional, defaults to "auto")
 */

export const patternLibrary = [
  {
    id: "none",
    label: "None",
    css: "none",
  },

  // ── Dots ──────────────────────────────────────────────────────
  {
    id: "dots-subtle",
    label: "Subtle Dots",
    css: "radial-gradient(#e5e7eb 1.5px, transparent 1.5px)",
    size: "15px 15px",
  },
  {
    id: "dots-dark",
    label: "Dark Dots",
    css: "radial-gradient(#94a3b8 2px, transparent 2px)",
    size: "18px 18px",
  },
  {
    id: "dots-large",
    label: "Large Dots",
    css: "radial-gradient(#cbd5e1 3px, transparent 3px)",
    size: "24px 24px",
  },

  // ── Lines ──────────────────────────────────────────────────────
  {
    id: "h-stripes",
    label: "Horizontal Stripes",
    css: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 12px)",
    size: "100% 12px",
  },
  {
    id: "v-stripes",
    label: "Vertical Stripes",
    css: "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 12px)",
    size: "12px 100%",
  },
  {
    id: "diagonal-lines",
    label: "Diagonal Lines",
    css: "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 10px)",
    size: "14px 14px",
  },
  {
    id: "diagonal-lines-rev",
    label: "Diagonal Lines ↗",
    css: "repeating-linear-gradient(-45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 10px)",
    size: "14px 14px",
  },

  // ── Grids ──────────────────────────────────────────────────────
  {
    id: "grid",
    label: "Square Grid",
    css: "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
    size: "20px 20px",
  },
  {
    id: "grid-large",
    label: "Large Grid",
    css: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
    size: "40px 40px",
  },
  {
    id: "crosshatch",
    label: "Crosshatch",
    css: "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 0, transparent 50%)",
    size: "12px 12px",
  },

  // ── Zigzag & Chevron ───────────────────────────────────────────
  {
    id: "zigzag",
    label: "Zig Zag",
    css: "linear-gradient(135deg, rgba(0,0,0,0.04) 25%, transparent 25%) -10px 0, linear-gradient(225deg, rgba(0,0,0,0.04) 25%, transparent 25%) -10px 0, linear-gradient(315deg, rgba(0,0,0,0.04) 25%, transparent 25%), linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%)",
    size: "20px 20px",
  },
  {
    id: "chevron",
    label: "Chevron",
    css: "repeating-linear-gradient(120deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 50%), repeating-linear-gradient(60deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 50%)",
    size: "20px 35px",
  },

  // ── Gradients ──────────────────────────────────────────────────
  {
    id: "gradient-light",
    label: "Subtle Gradient",
    css: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.06) 100%)",
  },
  {
    id: "gradient-warm",
    label: "Warm Glow",
    css: "radial-gradient(ellipse at top left, rgba(251,191,36,0.12) 0%, rgba(249,115,22,0.06) 60%, transparent 100%)",
  },
  {
    id: "gradient-cool",
    label: "Cool Glow",
    css: "radial-gradient(ellipse at top right, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.06) 60%, transparent 100%)",
  },
  {
    id: "soft-glow",
    label: "Soft Glow",
    css: "radial-gradient(circle at center, rgba(255,255,255,0.85) 0%, rgba(0,0,0,0.06) 100%)",
  },
  {
    id: "gradient-sunset",
    label: "Sunset",
    css: "linear-gradient(135deg, rgba(251,113,133,0.1) 0%, rgba(253,186,116,0.1) 100%)",
  },
  {
    id: "gradient-ocean",
    label: "Ocean",
    css: "linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(99,102,241,0.1) 100%)",
  },
  {
    id: "gradient-mint",
    label: "Mint",
    css: "linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(16,185,129,0.06) 100%)",
  },
  {
    id: "gradient-lavender",
    label: "Lavender",
    css: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(196,181,253,0.08) 100%)",
  },

  // ── Textures ───────────────────────────────────────────────────
  {
    id: "noise-soft",
    label: "Linen",
    css: "repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.015) 0, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px)",
    size: "4px 4px",
  },
  {
    id: "weave",
    label: "Woven",
    css: "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 6px)",
    size: "8px 8px",
  },
  {
    id: "pinstripe",
    label: "Pinstripe",
    css: "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 6px)",
    size: "6px 100%",
  },

  // ── Geometric ─────────────────────────────────────────────────
  {
    id: "diamonds",
    label: "Diamonds",
    css: "linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.04) 75%), linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.04) 75%)",
    size: "20px 20px",
  },
  {
    id: "triangles",
    label: "Triangles",
    css: "linear-gradient(120deg, rgba(0,0,0,0.04) 33.33%, transparent 33.33%) 0 0, linear-gradient(-120deg, rgba(0,0,0,0.04) 33.33%, transparent 33.33%) 0 0",
    size: "30px 50px",
  },
];

/**
 * Returns the backgroundSize for a given pattern's css value.
 * Falls back to "auto" if the pattern is not found.
 */
export function getPatternSize(patternCss) {
  const found = patternLibrary.find((p) => p.css === patternCss);
  return found?.size ?? "auto";
}

/**
 * Returns a pattern entry by its id.
 */
export function getPatternById(id) {
  return patternLibrary.find((p) => p.id === id) ?? patternLibrary[0];
}
