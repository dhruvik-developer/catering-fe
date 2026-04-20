/* eslint-disable react/prop-types */
import { patternLibrary } from "../../config/patternLibrary";

/**
 * PatternSelector
 *
 * Visual grid picker — each tile shows a live preview of the CSS pattern.
 * Selected tile gets a purple ring highlight.
 *
 * Props:
 *   value     – current pattern CSS string (e.g. "radial-gradient(...)")
 *   bgColor   – current tag background color (for preview accuracy)
 *   onChange  – (css: string, size: string) => void
 */
export default function PatternSelector({
  value,
  bgColor = "#ffffff",
  onChange,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "6px",
      }}
    >
      {patternLibrary.map((pattern) => {
        const isSelected = pattern.css === value;
        return (
          <button
            key={pattern.id}
            type="button"
            title={pattern.label}
            onClick={() => onChange(pattern.css, pattern.size ?? "auto")}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: "6px",
              border: isSelected ? "2px solid #845cbd" : "1.5px solid #e5e7eb",
              cursor: "pointer",
              background: bgColor,
              backgroundImage: pattern.css === "none" ? "none" : pattern.css,
              backgroundSize: pattern.size ?? "auto",
              outline: isSelected ? "2px solid #845cbd" : "none",
              outlineOffset: "2px",
              transition: "border-color 0.15s, outline 0.15s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* "None" label */}
            {pattern.css === "none" && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                None
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
