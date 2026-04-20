/**
 * autoTextScale.js
 *
 * Calculates an optimal font size so that `text` fits within `maxWidth` pixels.
 * Uses an off-screen <canvas> for fast text measurement — no DOM reflow.
 *
 * Usage:
 *   import { getScaledFontSize } from "@/utils/autoTextScale";
 *   const size = getScaledFontSize("Very Long Dish Name", 250, 24, "'Inter', sans-serif");
 */

let _canvas = null;

function getCanvas() {
  if (!_canvas) {
    _canvas = document.createElement("canvas");
  }
  return _canvas;
}

/**
 * @param {string}  text         – the text to measure
 * @param {number}  maxWidth     – available width in px (tag width minus padding)
 * @param {number}  baseFontSize – the user's chosen font size
 * @param {string}  fontFamily   – CSS font-family string
 * @param {number}  minFontSize  – floor so text stays readable (default 10)
 * @returns {number} optimal font size (px)
 */
export function getScaledFontSize(
  text,
  maxWidth,
  baseFontSize,
  fontFamily = "sans-serif",
  minFontSize = 10
) {
  if (!text || maxWidth <= 0) return baseFontSize;

  const ctx = getCanvas().getContext("2d");
  let size = baseFontSize;

  while (size > minFontSize) {
    ctx.font = `bold ${size}px ${fontFamily}`;
    const measured = ctx.measureText(text).width;
    if (measured <= maxWidth) break;
    size -= 1;
  }

  return Math.max(size, minFontSize);
}
