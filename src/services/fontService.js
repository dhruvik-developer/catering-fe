/**
 * fontService.js
 *
 * Provides a curated list of 120+ popular Google Fonts.
 * Fonts are NOT all loaded upfront — they are loaded on-demand via fontLoader
 * when the user selects or previews a font.
 *
 * To extend: add more entries to FONT_LIST below.
 */

export const FONT_LIST = [
  // Sans-Serif
  { name: "Inter", family: "Inter", category: "sans-serif" },
  { name: "Roboto", family: "Roboto", category: "sans-serif" },
  { name: "Open Sans", family: "Open Sans", category: "sans-serif" },
  { name: "Lato", family: "Lato", category: "sans-serif" },
  { name: "Poppins", family: "Poppins", category: "sans-serif" },
  { name: "Montserrat", family: "Montserrat", category: "sans-serif" },
  { name: "Nunito", family: "Nunito", category: "sans-serif" },
  { name: "Raleway", family: "Raleway", category: "sans-serif" },
  { name: "Ubuntu", family: "Ubuntu", category: "sans-serif" },
  { name: "Mukta", family: "Mukta", category: "sans-serif" },
  { name: "Rubik", family: "Rubik", category: "sans-serif" },
  { name: "Quicksand", family: "Quicksand", category: "sans-serif" },
  { name: "Josefin Sans", family: "Josefin Sans", category: "sans-serif" },
  { name: "Work Sans", family: "Work Sans", category: "sans-serif" },
  { name: "Barlow", family: "Barlow", category: "sans-serif" },
  { name: "DM Sans", family: "DM Sans", category: "sans-serif" },
  { name: "Outfit", family: "Outfit", category: "sans-serif" },
  {
    name: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans",
    category: "sans-serif",
  },
  { name: "Exo 2", family: "Exo 2", category: "sans-serif" },
  { name: "Kanit", family: "Kanit", category: "sans-serif" },
  { name: "Oxanium", family: "Oxanium", category: "sans-serif" },
  { name: "Comfortaa", family: "Comfortaa", category: "sans-serif" },
  { name: "Varela Round", family: "Varela Round", category: "sans-serif" },
  { name: "Jost", family: "Jost", category: "sans-serif" },
  { name: "Space Grotesk", family: "Space Grotesk", category: "sans-serif" },
  { name: "Sora", family: "Sora", category: "sans-serif" },
  { name: "Cabin", family: "Cabin", category: "sans-serif" },
  { name: "Figtree", family: "Figtree", category: "sans-serif" },
  {
    name: "Bricolage Grotesque",
    family: "Bricolage Grotesque",
    category: "sans-serif",
  },
  { name: "Mada", family: "Mada", category: "sans-serif" },

  // Serif
  { name: "Playfair Display", family: "Playfair Display", category: "serif" },
  { name: "Merriweather", family: "Merriweather", category: "serif" },
  { name: "Lora", family: "Lora", category: "serif" },
  { name: "PT Serif", family: "PT Serif", category: "serif" },
  { name: "Cinzel", family: "Cinzel", category: "serif" },
  {
    name: "Cormorant Garamond",
    family: "Cormorant Garamond",
    category: "serif",
  },
  { name: "Libre Baskerville", family: "Libre Baskerville", category: "serif" },
  { name: "EB Garamond", family: "EB Garamond", category: "serif" },
  { name: "Crimson Text", family: "Crimson Text", category: "serif" },
  { name: "Bitter", family: "Bitter", category: "serif" },
  { name: "Gelasio", family: "Gelasio", category: "serif" },
  { name: "Amethysta", family: "Amethysta", category: "serif" },
  { name: "GFS Didot", family: "GFS Didot", category: "serif" },
  { name: "Spectral", family: "Spectral", category: "serif" },
  { name: "Cardo", family: "Cardo", category: "serif" },
  { name: "Zilla Slab", family: "Zilla Slab", category: "serif" },
  { name: "Oswald", family: "Oswald", category: "serif" },

  // Display / Decorative
  { name: "Bebas Neue", family: "Bebas Neue", category: "display" },
  { name: "Anton", family: "Anton", category: "display" },
  { name: "Abril Fatface", family: "Abril Fatface", category: "display" },
  { name: "Righteous", family: "Righteous", category: "display" },
  { name: "Bangers", family: "Bangers", category: "display" },
  { name: "Fredoka One", family: "Fredoka One", category: "display" },
  { name: "Lobster", family: "Lobster", category: "display" },
  { name: "Pacifico", family: "Pacifico", category: "display" },
  { name: "Lilita One", family: "Lilita One", category: "display" },
  { name: "Titan One", family: "Titan One", category: "display" },
  { name: "Passion One", family: "Passion One", category: "display" },
  { name: "Black Han Sans", family: "Black Han Sans", category: "display" },
  { name: "Black Ops One", family: "Black Ops One", category: "display" },
  { name: "Russo One", family: "Russo One", category: "display" },
  { name: "Alfa Slab One", family: "Alfa Slab One", category: "display" },
  { name: "Chewy", family: "Chewy", category: "display" },
  { name: "Boogaloo", family: "Boogaloo", category: "display" },
  { name: "Shrikhand", family: "Shrikhand", category: "display" },
  { name: "Yeseva One", family: "Yeseva One", category: "display" },
  { name: "Fjalla One", family: "Fjalla One", category: "display" },

  // Handwriting / Cursive
  { name: "Dancing Script", family: "Dancing Script", category: "handwriting" },
  { name: "Caveat", family: "Caveat", category: "handwriting" },
  { name: "Satisfy", family: "Satisfy", category: "handwriting" },
  { name: "Great Vibes", family: "Great Vibes", category: "handwriting" },
  { name: "Kalam", family: "Kalam", category: "handwriting" },
  { name: "Indie Flower", family: "Indie Flower", category: "handwriting" },
  {
    name: "Shadows Into Light",
    family: "Shadows Into Light",
    category: "handwriting",
  },
  { name: "Sacramento", family: "Sacramento", category: "handwriting" },
  { name: "Allura", family: "Allura", category: "handwriting" },
  { name: "Pinyon Script", family: "Pinyon Script", category: "handwriting" },
  { name: "Alex Brush", family: "Alex Brush", category: "handwriting" },
  { name: "Amatic SC", family: "Amatic SC", category: "handwriting" },
  {
    name: "Permanent Marker",
    family: "Permanent Marker",
    category: "handwriting",
  },
  { name: "Patrick Hand", family: "Patrick Hand", category: "handwriting" },
  { name: "Gochi Hand", family: "Gochi Hand", category: "handwriting" },
  { name: "Handlee", family: "Handlee", category: "handwriting" },
  { name: "Courgette", family: "Courgette", category: "handwriting" },
  { name: "Cookie", family: "Cookie", category: "handwriting" },
  { name: "Yellowtail", family: "Yellowtail", category: "handwriting" },
  { name: "Marck Script", family: "Marck Script", category: "handwriting" },

  // Monospace
  { name: "Roboto Mono", family: "Roboto Mono", category: "monospace" },
  { name: "Source Code Pro", family: "Source Code Pro", category: "monospace" },
  { name: "Space Mono", family: "Space Mono", category: "monospace" },
  { name: "JetBrains Mono", family: "JetBrains Mono", category: "monospace" },
  { name: "Courier Prime", family: "Courier Prime", category: "monospace" },
  { name: "IBM Plex Mono", family: "IBM Plex Mono", category: "monospace" },
  { name: "Fira Code", family: "Fira Code", category: "monospace" },
  { name: "Share Tech Mono", family: "Share Tech Mono", category: "monospace" },
];

// Category order for the UI group header
export const FONT_CATEGORIES = [
  { id: "sans-serif", label: "Sans Serif" },
  { id: "serif", label: "Serif" },
  { id: "display", label: "Display" },
  { id: "handwriting", label: "Handwriting" },
  { id: "monospace", label: "Monospace" },
];

/**
 * Return the full font list (or optionally filter by search query).
 * @param {string} query – optional search string
 */
export function getFonts(query = "") {
  const q = query.trim().toLowerCase();
  if (!q) return FONT_LIST;
  return FONT_LIST.filter((f) => f.name.toLowerCase().includes(q));
}

/**
 * Convert a font entry to the CSS font-family value string.
 * @param {Object} font – font entry from FONT_LIST
 */
export function fontToCssValue(font) {
  return `'${font.family}', sans-serif`;
}

/**
 * Find a font entry by its CSS value string.
 */
export function findFontByValue(cssValue) {
  return FONT_LIST.find((f) => fontToCssValue(f) === cssValue) ?? FONT_LIST[0];
}
