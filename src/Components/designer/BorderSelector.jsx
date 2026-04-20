/* eslint-disable react/prop-types */
import { borderLibrary } from "../../config/borderLibrary";

/**
 * BorderSelector
 *
 * Horizontal row of border-style preview buttons.
 * Each button shows the style name and a small visual preview line.
 *
 * Props:
 *   value     – current border style id (e.g. "solid")
 *   onChange  – (id: string) => void
 */
export default function BorderSelector({ value, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "6px",
      }}
    >
      {borderLibrary.map((border) => {
        const isSelected = border.id === value;
        return (
          <button
            key={border.id}
            type="button"
            onClick={() => onChange(border.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "6px 4px",
              borderRadius: "6px",
              border: isSelected ? "2px solid #845cbd" : "1.5px solid #e5e7eb",
              background: isSelected ? "#f5f0ff" : "#fff",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {/* Preview line */}
            <div
              style={{
                width: "36px",
                height: 0,
                border: border.preview === "none" ? "none" : border.preview,
                opacity: isSelected ? 1 : 0.6,
              }}
            />
            <span
              style={{
                fontSize: "9px",
                fontWeight: 600,
                color: isSelected ? "#845cbd" : "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {border.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
