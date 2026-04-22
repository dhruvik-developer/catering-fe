/* eslint-disable react/prop-types */

/**
 * ColorPalette.jsx
 *
 * One-click color theme presets + complementary color swatches.
 * Replaces the manual text/bg/border color pickers with a richer UI.
 *
 * Props:
 *   textColor   – current text color hex
 *   bgColor     – current background color hex
 *   borderColor – current border color hex
 *   onChange     – ({ textColor, bgColor, borderColor }) => void
 */

// ─── Color Theme Presets ────────────────────────────────────────────────────
const THEMES = [
  {
    id: "light",
    label: "Light",
    emoji: "☀️",
    text: "#1f2937",
    bg: "#ffffff",
    border: "#e5e7eb",
  },
  {
    id: "dark",
    label: "Dark",
    emoji: "🌙",
    text: "#f9fafb",
    bg: "#1f2937",
    border: "#374151",
  },
  {
    id: "pastel",
    label: "Pastel",
    emoji: "🎀",
    text: "#6b21a8",
    bg: "var(--color-primary-tint)",
    border: "#e9d5ff",
  },
  {
    id: "wedding",
    label: "Wedding",
    emoji: "💒",
    text: "#78350f",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    id: "elegant",
    label: "Elegant",
    emoji: "✨",
    text: "#d4af37",
    bg: "#1a1a2e",
    border: "#d4af37",
  },
  {
    id: "festive",
    label: "Festive",
    emoji: "🎉",
    text: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
  },
  {
    id: "ocean",
    label: "Ocean",
    emoji: "🌊",
    text: "#0c4a6e",
    bg: "#f0f9ff",
    border: "#7dd3fc",
  },
  {
    id: "forest",
    label: "Forest",
    emoji: "🌿",
    text: "#14532d",
    bg: "#f0fdf4",
    border: "#86efac",
  },
  {
    id: "royal",
    label: "Royal",
    emoji: "👑",
    text: "#fbbf24",
    bg: "#312e81",
    border: "#6366f1",
  },
  {
    id: "minimal",
    label: "Minimal",
    emoji: "⬜",
    text: "#404040",
    bg: "#fafafa",
    border: "#d4d4d4",
  },
];

// ─── Complementary Swatch Generator ─────────────────────────────────────────
function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 50 };
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateSwatches(baseHex) {
  const { h, s, l } = hexToHSL(baseHex);
  return [
    { label: "Complement", hex: hslToHex((h + 180) % 360, s, l) },
    { label: "Analogous +30", hex: hslToHex((h + 30) % 360, s, l) },
    { label: "Analogous −30", hex: hslToHex((h + 330) % 360, s, l) },
    { label: "Lighter", hex: hslToHex(h, s, Math.min(l + 20, 95)) },
    { label: "Darker", hex: hslToHex(h, s, Math.max(l - 20, 5)) },
    { label: "Triadic +120", hex: hslToHex((h + 120) % 360, s, l) },
  ];
}

export default function ColorPalette({
  textColor,
  bgColor,
  borderColor,
  onChange,
}) {
  const swatches = generateSwatches(bgColor);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* ── Theme Presets ─────────────────────────── */}
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Quick Themes
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "5px",
          }}
        >
          {THEMES.map((t) => {
            const isActive =
              t.text === textColor &&
              t.bg === bgColor &&
              t.border === borderColor;
            return (
              <button
                key={t.id}
                type="button"
                title={t.label}
                onClick={() =>
                  onChange({
                    textColor: t.text,
                    bgColor: t.bg,
                    borderColor: t.border,
                  })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  padding: "5px 2px",
                  borderRadius: "8px",
                  border: isActive
                    ? "2px solid var(--color-primary)"
                    : "1.5px solid #e5e7eb",
                  background: isActive ? "#f5f0ff" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {/* Mini preview */}
                <div
                  style={{
                    width: "28px",
                    height: "18px",
                    borderRadius: "4px",
                    background: t.bg,
                    border: `2px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "7px",
                    fontWeight: 800,
                    color: t.text,
                  }}
                >
                  Aa
                </div>
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: 600,
                    color: isActive ? "var(--color-primary)" : "#9ca3af",
                  }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Complementary Swatches ──────────────── */}
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Color Harmony (based on background)
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {swatches.map((sw, i) => (
            <button
              key={i}
              type="button"
              title={`${sw.label}: ${sw.hex}`}
              onClick={() =>
                onChange({ textColor, bgColor: sw.hex, borderColor })
              }
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border:
                  sw.hex === bgColor
                    ? "2px solid var(--color-primary)"
                    : "1.5px solid #d1d5db",
                background: sw.hex,
                cursor: "pointer",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.9)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Manual Color Pickers ───────────────── */}
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          Custom Colors
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#9ca3af",
                display: "block",
                marginBottom: "2px",
              }}
            >
              Text
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) =>
                onChange({ textColor: e.target.value, bgColor, borderColor })
              }
              style={{
                width: "100%",
                height: "28px",
                borderRadius: "4px",
                cursor: "pointer",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#9ca3af",
                display: "block",
                marginBottom: "2px",
              }}
            >
              Background
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) =>
                onChange({ textColor, bgColor: e.target.value, borderColor })
              }
              style={{
                width: "100%",
                height: "28px",
                borderRadius: "4px",
                cursor: "pointer",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#9ca3af",
                display: "block",
                marginBottom: "2px",
              }}
            >
              Border
            </label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) =>
                onChange({ textColor, bgColor, borderColor: e.target.value })
              }
              style={{
                width: "100%",
                height: "28px",
                borderRadius: "4px",
                cursor: "pointer",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
