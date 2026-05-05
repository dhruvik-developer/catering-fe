/**
 * Extract a representative palette of distinct colors from a logo image.
 *
 * The earlier version only tracked pixel frequency and downscaled to 100px,
 * which made vivid strokes (gold, green, blue) lose to washed-out edge pixels
 * and to one dominant hue repeated as five near-duplicates. This version:
 *   - samples at higher resolution so vivid pixels survive,
 *   - filters in HSL so washed-out / near-white / near-black pixels do not
 *     drown out brand colors,
 *   - buckets pixels by hue so similar shades collapse into one entry,
 *   - greedily picks colors with a minimum hue gap so the result spans every
 *     distinct hue in the logo (purple, pink, orange, gold, green, blue, ...).
 */

const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");

const rgbToHsl = (r, g, b) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
};

const hueDistance = (a, b) => {
  const d = Math.abs(a - b);
  return d > 180 ? 360 - d : d;
};

/**
 * @param {string|File} source  An image URL or File/Blob.
 * @param {number} colorCount   Maximum number of swatches to return.
 * @returns {Promise<string[]>} Hex color strings, ordered by visual prominence.
 */
export const extractColorsFromImage = async (source, colorCount = 8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        // 240px keeps detail (small thumbnails blur vivid strokes into greys)
        // while staying fast enough for an instant UX after upload.
        const MAX_SIZE = 240;
        const ratio = Math.min(
          MAX_SIZE / img.width,
          MAX_SIZE / img.height,
          1,
        );
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const data = ctx.getImageData(0, 0, width, height).data;
        const vivid = new Map(); // key: hueSlot-lightSlot
        const neutrals = new Map(); // hex -> count, for whites/greys/blacks

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 200) continue; // skip transparent edges

          const { h, s, l } = rgbToHsl(r, g, b);

          // Quantize lightly so close shades collapse but separate hues stay distinct.
          const q = 16;
          const qr = Math.round(r / q) * q;
          const qg = Math.round(g / q) * q;
          const qb = Math.round(b / q) * q;
          const hex = rgbToHex(
            Math.min(255, qr),
            Math.min(255, qg),
            Math.min(255, qb),
          );

          // Low-saturation or extreme lightness => background paper, ink, page edges.
          if (s < 0.18 || l < 0.08 || l > 0.94) {
            neutrals.set(hex, (neutrals.get(hex) || 0) + 1);
            continue;
          }

          // Bucket vivid pixels by 12° hue slot + lightness band.
          const hueSlot = Math.floor(h / 12);
          const lightSlot = Math.floor(l * 8);
          const key = `${hueSlot}-${lightSlot}`;
          const existing = vivid.get(key);
          if (!existing) {
            vivid.set(key, { hex, h, s, l, count: 1 });
          } else {
            existing.count += 1;
            // Keep the most saturated representative of the bucket.
            if (s > existing.s) {
              existing.hex = hex;
              existing.h = h;
              existing.s = s;
              existing.l = l;
            }
          }
        }

        // Weight pixel count by saturation so vivid strokes outrank pale fills
        // even if the pale fill covers slightly more area.
        const ranked = [...vivid.values()]
          .map((entry) => ({ ...entry, score: entry.count * (0.5 + entry.s) }))
          .sort((a, b) => b.score - a.score);

        // Greedy pick with a hue gap so we don't return five shades of one hue.
        const picks = [];
        const MIN_HUE_GAP = 18;
        for (const candidate of ranked) {
          if (picks.length >= colorCount) break;
          const tooClose = picks.some(
            (p) =>
              hueDistance(p.h, candidate.h) < MIN_HUE_GAP &&
              Math.abs(p.l - candidate.l) < 0.15,
          );
          if (!tooClose) picks.push(candidate);
        }

        // If the logo had fewer distinct hues than colorCount, top up with the
        // most common neutrals so the user can still pick a paper / ink swatch.
        if (picks.length < colorCount) {
          const topNeutrals = [...neutrals.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, colorCount - picks.length);
          for (const [hex] of topNeutrals) picks.push({ hex });
        }

        resolve(picks.map((p) => p.hex));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(err);

    if (typeof source === "string") {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
};
