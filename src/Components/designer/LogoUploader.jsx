/* eslint-disable react/prop-types */
import { useRef } from "react";

/**
 * LogoUploader.jsx
 *
 * Upload PNG/SVG/JPG logo for dish tags.
 * - Default size: 100px (adjustable with slider +/-)
 * - Position: 9 positions (3×3 grid)
 * - 50% opacity
 * - Color tint option with precomputed CSS filters
 *
 * Props:
 *   logo      – { url, size, colorId, position } | null
 *   onChange  – (logo) => void
 */

// Precomputed CSS filter strings that actually tint the image to the color.
const LOGO_COLORS = [
  { id: "none", label: "Original", hex: null, filter: "none" },
  {
    id: "black",
    label: "Black",
    hex: "#000000",
    filter: "brightness(0) saturate(100%)",
  },
  {
    id: "white",
    label: "White",
    hex: "#ffffff",
    filter: "brightness(0) saturate(100%) invert(1)",
  },
  {
    id: "gold",
    label: "Gold",
    hex: "#d4af37",
    filter:
      "invert(69%) sepia(67%) saturate(459%) hue-rotate(11deg) brightness(95%) contrast(88%)",
  },
  {
    id: "purple",
    label: "Purple",
    hex: "#845cbd",
    filter:
      "invert(38%) sepia(27%) saturate(1316%) hue-rotate(227deg) brightness(91%) contrast(89%)",
  },
  {
    id: "red",
    label: "Red",
    hex: "#dc2626",
    filter:
      "invert(14%) sepia(95%) saturate(6083%) hue-rotate(358deg) brightness(97%) contrast(84%)",
  },
  {
    id: "blue",
    label: "Blue",
    hex: "#2563eb",
    filter:
      "invert(30%) sepia(93%) saturate(2459%) hue-rotate(215deg) brightness(98%) contrast(90%)",
  },
  {
    id: "green",
    label: "Green",
    hex: "#16a34a",
    filter:
      "invert(51%) sepia(35%) saturate(1651%) hue-rotate(104deg) brightness(89%) contrast(85%)",
  },
  {
    id: "orange",
    label: "Orange",
    hex: "#f97316",
    filter:
      "invert(52%) sepia(97%) saturate(2250%) hue-rotate(345deg) brightness(101%) contrast(96%)",
  },
  {
    id: "pink",
    label: "Pink",
    hex: "#ec4899",
    filter:
      "invert(53%) sepia(50%) saturate(7186%) hue-rotate(315deg) brightness(99%) contrast(100%)",
  },
  {
    id: "cyan",
    label: "Cyan",
    hex: "#06b6d4",
    filter:
      "invert(61%) sepia(85%) saturate(2250%) hue-rotate(151deg) brightness(102%) contrast(98%)",
  },
  {
    id: "gray",
    label: "Gray",
    hex: "#6b7280",
    filter:
      "invert(49%) sepia(5%) saturate(302%) hue-rotate(182deg) brightness(95%) contrast(88%)",
  },
];

/**
 * Get the CSS filter string for a given colorId.
 */
export function getLogoFilter(colorId) {
  const found = LOGO_COLORS.find((c) => c.id === colorId);
  return found?.filter || "none";
}

export default function LogoUploader({ logo, onChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({
        url: ev.target.result,
        size: logo?.size || 100,
        opacity: logo?.opacity ?? 50,
        colorId: logo?.colorId || "none",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const currentFilter = getLogoFilter(logo?.colorId || "none");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Upload area */}
      {!logo?.url ? (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "14px 10px",
            border: "2px dashed #d1d5db",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#f9fafb",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#845cbd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L8 8m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
            />
          </svg>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280" }}>
            Upload Logo (PNG/SVG/JPG)
          </span>
          <span style={{ fontSize: "9px", color: "#9ca3af" }}>
            Custom opacity · Default 100px
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </label>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Logo thumbnail + actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f9fafb",
              }}
            >
              <img
                src={logo.url}
                alt="Logo"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: currentFilter,
                }}
              />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}
              >
                {logo.size || 100}px · {logo.opacity ?? 50}% opacity
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#845cbd",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Change
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    style={{ display: "none" }}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRemove}
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Size Slider */}
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              Logo Size
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...logo,
                    size: Math.max(20, (logo.size || 100) - 10),
                  })
                }
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                −
              </button>
              <input
                type="range"
                min="20"
                max="1000"
                value={logo.size || 100}
                onChange={(e) =>
                  onChange({ ...logo, size: Number(e.target.value) })
                }
                style={{ flex: 1, accentColor: "#845cbd" }}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...logo,
                    size: Math.min(1000, (logo.size || 100) + 10),
                  })
                }
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                +
              </button>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6b7280",
                  minWidth: "36px",
                  textAlign: "right",
                }}
              >
                {logo.size || 100}px
              </span>
            </div>
          </div>

          {/* Opacity Slider */}
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              Logo Opacity
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="range"
                min="0"
                max="100"
                value={logo.opacity ?? 50}
                onChange={(e) =>
                  onChange({ ...logo, opacity: Number(e.target.value) })
                }
                style={{ flex: 1, accentColor: "#845cbd" }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6b7280",
                  minWidth: "36px",
                  textAlign: "right",
                }}
              >
                {logo.opacity ?? 50}%
              </span>
            </div>
          </div>

          {/* Logo Color */}
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              Logo Color
            </div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {LOGO_COLORS.map((c) => {
                const isActive = (logo.colorId || "none") === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    onClick={() => onChange({ ...logo, colorId: c.id })}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: isActive
                        ? "2px solid #845cbd"
                        : "1.5px solid #d1d5db",
                      background:
                        c.hex ||
                        "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                      cursor: "pointer",
                      outline: isActive ? "2px solid #845cbd" : "none",
                      outlineOffset: "1px",
                      transition: "all 0.1s",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
