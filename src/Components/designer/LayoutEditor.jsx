/* eslint-disable react/prop-types */
import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getPatternSize } from "../../config/patternLibrary";
import { getLogoFilter } from "./LogoUploader";

/**
 * LayoutEditor.jsx
 *
 * A single-tag canvas where users drag elements (Session Name, Dish Name,
 * Caterer Name, Logo) to reposition them. Positions are stored as pixel
 * offsets from the element's default position.
 *
 * Props:
 *   settings    – full settings object
 *   layout      – { dishName: {x,y}, sessionName: {x,y}, catererName: {x,y}, logo: {x,y} }
 *   onLayoutChange – (layout) => void
 *   sessionName – event_time string
 */

const DEFAULT_LAYOUT = {
  dishName: { x: 0, y: 0 },
  sessionName: { x: 0, y: 0 },
  catererName: { x: 0, y: 0 },
  logo: { x: 0, y: 0 },
};

export default function LayoutEditor({
  settings,
  layout: rawLayout,
  onLayoutChange,
  sessionName,
}) {
  const tagRef = useRef(null);
  const layout = { ...DEFAULT_LAYOUT, ...rawLayout };

  const handleDragEnd = useCallback(
    (key, _event, info) => {
      onLayoutChange({
        ...layout,
        [key]: {
          x: Math.round(layout[key].x + info.offset.x),
          y: Math.round(layout[key].y + info.offset.y),
        },
      });
    },
    [layout, onLayoutChange]
  );

  const tagStyle = {
    width: `${settings.width}px`,
    height: `${settings.height}px`,
    backgroundColor: settings.bgColor,
    backgroundImage:
      settings.pattern && settings.pattern !== "none"
        ? settings.pattern
        : "none",
    backgroundSize: getPatternSize(settings.pattern),
    border:
      settings.borderStyle && settings.borderStyle !== "none"
        ? `${settings.borderWidth}px ${settings.borderStyle} ${settings.borderColor}`
        : "none",
    color: settings.textColor,
    fontFamily: settings.fontFamily,
    textAlign: settings.textAlign,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    padding: "16px",
    boxSizing: "border-box",
    borderRadius: "8px",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  };

  const handleStyle = {
    cursor: "grab",
    userSelect: "none",
    borderRadius: "4px",
    transition: "box-shadow 0.1s",
  };

  const labelStyle = {
    position: "absolute",
    top: "-14px",
    left: "0",
    fontSize: "8px",
    fontWeight: 700,
    color: "#845cbd",
    background: "rgba(255,255,255,0.9)",
    padding: "0 3px",
    borderRadius: "2px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {/* Instructions */}
      <div
        style={{
          background: "#f5f0ff",
          border: "1px solid #e9d5ff",
          borderRadius: "8px",
          padding: "6px 12px",
          fontSize: "11px",
          fontWeight: 600,
          color: "#7c3aed",
          textAlign: "center",
        }}
      >
        🎨 Drag elements to reposition them on the tag
      </div>

      {/* Tag canvas */}
      <div ref={tagRef} style={tagStyle}>
        {/* Session Name */}
        {settings.showSession && (
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={tagRef}
            onDragEnd={(e, info) => handleDragEnd("sessionName", e, info)}
            animate={{ x: layout.sessionName.x, y: layout.sessionName.y }}
            transition={{ duration: 0 }}
            style={{
              ...handleStyle,
              position: "relative",
              fontSize: "12px",
              fontWeight: 500,
              opacity: 0.7,
              textAlign: settings.textAlign,
              margin: 0,
            }}
            whileHover={{ boxShadow: "0 0 0 2px #845cbd" }}
            whileTap={{ cursor: "grabbing" }}
          >
            <span style={labelStyle}>Session</span>
            {sessionName || "Session"}
          </motion.div>
        )}

        {/* Dish Name */}
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={tagRef}
          onDragEnd={(e, info) => handleDragEnd("dishName", e, info)}
          animate={{ x: layout.dishName.x, y: layout.dishName.y }}
          transition={{ duration: 0 }}
          style={{
            ...handleStyle,
            position: "relative",
            margin: "auto 0",
            fontSize: `${settings.fontSize}px`,
            fontWeight: 700,
            lineHeight: 1.2,
            wordBreak: "break-word",
            textAlign: settings.textAlign,
          }}
          whileHover={{ boxShadow: "0 0 0 2px #845cbd" }}
          whileTap={{ cursor: "grabbing" }}
        >
          <span style={labelStyle}>Dish Name</span>
          Sample Dish
        </motion.div>

        {/* Caterer Name */}
        {settings.showCaterer && (
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={tagRef}
            onDragEnd={(e, info) => handleDragEnd("catererName", e, info)}
            animate={{ x: layout.catererName.x, y: layout.catererName.y }}
            transition={{ duration: 0 }}
            style={{
              ...handleStyle,
              position: "relative",
              fontSize: "12px",
              fontWeight: 600,
              opacity: 0.8,
              textAlign: settings.textAlign,
              margin: 0,
            }}
            whileHover={{ boxShadow: "0 0 0 2px #845cbd" }}
            whileTap={{ cursor: "grabbing" }}
          >
            <span style={labelStyle}>Caterer</span>
            {settings.catererName}
          </motion.div>
        )}

        {/* Logo */}
        {settings.logo?.url && (
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={tagRef}
            onDragEnd={(e, info) => handleDragEnd("logo", e, info)}
            animate={{ x: layout.logo.x, y: layout.logo.y }}
            transition={{ duration: 0 }}
            style={{
              ...handleStyle,
              position: "absolute",
              top: 0,
              left: 0,
            }}
            whileHover={{ boxShadow: "0 0 0 2px #845cbd" }}
            whileTap={{ cursor: "grabbing" }}
          >
            <span style={labelStyle}>Logo</span>
            <img
              src={settings.logo.url}
              alt="Logo"
              style={{
                width: `${settings.logo.size || 100}px`,
                height: `${settings.logo.size || 100}px`,
                objectFit: "contain",
                pointerEvents: "none",
                opacity: (settings.logo.opacity ?? 50) / 100,
                filter: getLogoFilter(settings.logo.colorId),
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={() => onLayoutChange(DEFAULT_LAYOUT)}
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#6b7280",
          background: "none",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "4px 12px",
          cursor: "pointer",
        }}
      >
        Reset Positions
      </button>
    </div>
  );
}

export { DEFAULT_LAYOUT };
