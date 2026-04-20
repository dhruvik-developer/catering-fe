/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import {
  getFonts,
  fontToCssValue,
  FONT_CATEGORIES,
} from "../../services/fontService";
import { loadFonts } from "../../utils/fontLoader";

/**
 * FontSelector
 *
 * Searchable font picker that renders each option in its own typeface.
 * Fonts are loaded lazily — only loaded when the dropdown is opened.
 *
 * Props:
 *   value      – current CSS font-family string  (e.g. "'Roboto', sans-serif")
 *   onChange   – (cssValue: string) => void
 */
export default function FontSelector({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadedFamilies, setLoadedFamilies] = useState(new Set());
  const containerRef = useRef(null);

  const allFonts = getFonts(query);
  const byCategory = FONT_CATEGORIES.map((cat) => ({
    ...cat,
    fonts: allFonts.filter((f) => f.category === cat.id),
  })).filter((cat) => cat.fonts.length > 0);

  // ── Find display name of currently selected font ──────────────
  const selectedName = (() => {
    const match = getFonts("").find((f) => fontToCssValue(f) === value);
    return match ? match.name : value;
  })();

  // ── Load a font on hover to pre-render the preview text ───────
  const handleMouseEnter = (font) => {
    if (!loadedFamilies.has(font.family)) {
      loadFonts([font]);
      setLoadedFamilies((prev) => new Set(prev).add(font.family));
    }
  };

  // ── Close on outside click ────────────────────────────────────
  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", userSelect: "none" }}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "7px 10px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          background: "#fff",
          cursor: "pointer",
          fontSize: "13px",
          fontFamily: value,
          textAlign: "left",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedName}
        </span>
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            maxHeight: "320px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #f3f4f6",
              position: "sticky",
              top: 0,
              background: "#fff",
            }}
          >
            <input
              autoFocus
              type="text"
              placeholder="Search fonts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Font list grouped by category */}
          {byCategory.length === 0 && (
            <div
              style={{
                padding: "12px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "12px",
              }}
            >
              No fonts found
            </div>
          )}
          {byCategory.map((cat) => (
            <div key={cat.id}>
              <div
                style={{
                  padding: "4px 10px 2px",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#845cbd",
                  background: "#f9f5ff",
                  borderTop: "1px solid #f3e8ff",
                }}
              >
                {cat.label}
              </div>
              {cat.fonts.map((font) => {
                const cssVal = fontToCssValue(font);
                const isSelected = cssVal === value;
                return (
                  <button
                    key={font.family}
                    type="button"
                    onMouseEnter={() => handleMouseEnter(font)}
                    onClick={() => {
                      onChange(cssVal);
                      loadFonts([font]);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      border: "none",
                      background: isSelected ? "#f5f0ff" : "transparent",
                      color: isSelected ? "#845cbd" : "#1f2937",
                      fontSize: "14px",
                      fontFamily: cssVal,
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseUp={(e) =>
                      (e.currentTarget.style.background = isSelected
                        ? "#f5f0ff"
                        : "transparent")
                    }
                  >
                    {font.name}
                    {isSelected && (
                      <span
                        style={{
                          float: "right",
                          color: "#845cbd",
                          fontSize: "12px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
