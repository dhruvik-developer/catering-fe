/**
 * fontLoader.js
 *
 * Utility to dynamically load Google Fonts via a <link> tag injection.
 * Avoids pulling in webfontloader (extra package) while keeping it
 * easy to swap in the future.
 *
 * Usage:
 *   import { loadFonts } from "@/utils/fontLoader";
 *   loadFonts(fonts);   // pass the fonts array from designOptions.js
 */

const LOADED_FAMILIES = new Set();

/**
 * Inject a Google Fonts stylesheet for every font in `fontList` that
 * has not yet been loaded.
 *
 * @param {Array<{family: string}>} fontList - Array of font config objects from designOptions.js
 */
export function loadFonts(fontList = []) {
  const toLoad = fontList
    .map((f) => f.family)
    .filter((family) => !LOADED_FAMILIES.has(family));

  if (toLoad.length === 0) return;

  const families = toLoad
    .map((f) => `family=${f.replace(/ /g, "+")}`)
    .join("&");
  const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;

  // Check if link already exists (e.g. from SSR or previous render)
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  toLoad.forEach((family) => LOADED_FAMILIES.add(family));
}
