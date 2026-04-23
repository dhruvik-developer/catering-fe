/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FiX, FiLayout, FiGrid } from "react-icons/fi";
import "./DishTagModal.css";
import { FONT_LIST, fontToCssValue } from "../../services/fontService";
import { getPatternSize } from "../../config/patternLibrary";
import { getScaledFontSize } from "../../utils/autoTextScale";
import FontSelector from "../designer/FontSelector";
import BorderSelector from "../designer/BorderSelector";
import ColorPalette from "../designer/ColorPalette";
import LogoUploader, { getLogoFilter } from "../designer/LogoUploader";
import LayoutEditor, { DEFAULT_LAYOUT } from "../designer/LayoutEditor";
import { PrintLayout } from "../common/pdfPages/dishTagEngine/PrintLayout";
import { getA4TagLayout } from "../common/pdfPages/dishTagEngine/printLayoutUtils";

export default function DishTagModal({
  session,
  isOpen,
  onClose,
  catererNameProfile,
}) {
  const [settings, setSettings] = useState({
    width: 300,
    height: 200,
    fontSize: 24,
    fontFamily: fontToCssValue(FONT_LIST[0]),
    textColor: "#1f2937",
    bgColor: "#ffffff",
    pattern: "none",
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    showCaterer: false,
    catererName: catererNameProfile || "radha Catering",
    showSession: false,
    // New: layout positions + logo
    layout: { ...DEFAULT_LAYOUT },
    logo: null,
  });

  const [viewMode, setViewMode] = useState("layout"); // "preview" | "layout"

  // Update default caterer name if profile changes
  useEffect(() => {
    if (catererNameProfile && settings.catererName === "radha Catering") {
      setSettings((s) => ({ ...s, catererName: catererNameProfile }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catererNameProfile]);

  if (!isOpen || !session) return null;

  // Collect all unique dishes across categories
  const allDishes = [];
  if (session.selected_items) {
    Object.values(session.selected_items).forEach((items) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          allDishes.push(typeof item === "object" ? item.name : item);
        });
      }
    });
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrint = () => {
    document.body.classList.add("dish-tag-print");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("dish-tag-print");
    }, 1000);
  };

  // Tag padding for text scale calculations
  const TAG_PADDING = 32; // 16px * 2 sides
  const maxTextWidth = settings.width - TAG_PADDING;
  const printLayout = getA4TagLayout(settings.width, settings.height);
  const totalPages = Math.max(
    1,
    Math.ceil(allDishes.length / printLayout.tagsPerPage)
  );

  const getTagStyle = () => ({
    width: `${settings.width}px`,
    height: `${settings.height}px`,
    backgroundColor: settings.bgColor,
    backgroundImage: settings.pattern !== "none" ? settings.pattern : "none",
    backgroundSize: getPatternSize(settings.pattern),
    border:
      settings.borderStyle !== "none"
        ? `${settings.borderWidth}px ${settings.borderStyle} ${settings.borderColor}`
        : "none",
    color: settings.textColor,
    fontFamily: settings.fontFamily,
    textAlign: settings.textAlign,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "16px",
    boxSizing: "border-box",
    borderRadius: "8px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    position: "relative",
    overflow: "hidden",
  });

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-900 bg-opacity-50 sm:p-4 print:static print:h-auto print:p-0 print:bg-transparent print:overflow-visible print:block">
      <div className="flex flex-col w-full bg-white sm:rounded-2xl shadow-xl overflow-hidden relative print:static print:h-auto print:overflow-visible print:shadow-none print:rounded-none print:w-auto print:block">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 print:hidden sm:flex">
          <h2 className="text-xl font-bold tracking-tight text-gray-800">
            Customize Dish Tags –{" "}
            <span className="text-[var(--color-primary)]">
              {session.event_time || "Session"}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-text)] transition"
            >
              <span className="font-semibold text-sm">
                Print Tags ({allDishes.length})
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-1 overflow-hidden flex-col sm:flex-row print:hidden">
          {/* Left: Controls */}
          <div className="w-full sm:w-90 shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50/50 p-6 space-y-6">
            {/* Size Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Dimensions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    name="width"
                    min="150"
                    max="600"
                    value={settings.width}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary-tint)]0 focus:ring-[var(--color-primary-tint)]0 text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    name="height"
                    min="100"
                    max="400"
                    value={settings.height}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary-tint)]0 focus:ring-[var(--color-primary-tint)]0 text-sm p-2"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                A4 fit: {printLayout.tagsPerRow} x {printLayout.tagsPerColumn} =
                {" "}
                {printLayout.tagsPerPage} tags per page
                {allDishes.length > 0 ? ` (${totalPages} page${totalPages > 1 ? "s" : ""} for ${allDishes.length} tags)` : ""}
              </p>
            </div>

            {/* Typography */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Typography
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Font Family
                </label>
                <FontSelector
                  value={settings.fontFamily}
                  onChange={(val) =>
                    setSettings((s) => ({ ...s, fontFamily: val }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Base Font Size
                  </label>
                  <input
                    type="number"
                    name="fontSize"
                    min="12"
                    max="100"
                    value={settings.fontSize}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary-tint)]0 focus:ring-[var(--color-primary-tint)]0 text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Alignment
                  </label>
                  <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {["left", "center", "right"].map((align) => (
                      <button
                        key={align}
                        className={`flex-1 py-2 text-xs font-medium capitalize ${settings.textAlign === align ? "bg-[var(--color-primary)] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={() =>
                          setSettings((s) => ({ ...s, textAlign: align }))
                        }
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">
                💡 Long dish names auto-shrink to fit the tag width
              </p>
            </div>

            {/* Color Palette */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Color Palette
              </h3>
              <ColorPalette
                textColor={settings.textColor}
                bgColor={settings.bgColor}
                borderColor={settings.borderColor}
                onChange={({ textColor, bgColor, borderColor }) =>
                  setSettings((s) => ({
                    ...s,
                    textColor,
                    bgColor,
                    borderColor,
                  }))
                }
              />
            </div>

            {/* Border */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Border
              </h3>
              <BorderSelector
                value={settings.borderStyle}
                onChange={(id) =>
                  setSettings((s) => ({ ...s, borderStyle: id }))
                }
              />
              {settings.borderStyle !== "none" && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="range"
                    name="borderWidth"
                    min="1"
                    max="10"
                    value={settings.borderWidth}
                    onChange={handleChange}
                    className="flex-1"
                    style={{ accentColor: "var(--color-primary)" }}
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {settings.borderWidth}px
                  </span>
                </div>
              )}
            </div>

            {/* Logo Upload */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Logo / Branding
              </h3>
              <LogoUploader
                logo={settings.logo}
                onChange={(logo) => setSettings((s) => ({ ...s, logo }))}
              />
            </div>

            {/* Content Toggles */}
            <div className="space-y-4 pt-4 border-t border-gray-200 pb-8">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Content
              </h3>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    name="showCaterer"
                    checked={settings.showCaterer}
                    onChange={handleChange}
                    className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm text-gray-700">
                    Show Caterer Name
                  </span>
                </label>
                {settings.showCaterer && (
                  <input
                    type="text"
                    name="catererName"
                    value={settings.catererName}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary-tint)]0 focus:ring-[var(--color-primary-tint)]0 text-sm p-2"
                    placeholder="Caterer Name"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right: Preview / Layout Editor */}
          <div className="flex-1 bg-gray-200 overflow-y-auto relative inner-shadow flex flex-col">
            {/* View mode toggle */}
            <div className="sticky top-0 z-10 flex items-center justify-center gap-2 py-3 bg-gray-200/90 backdrop-blur-sm border-b border-gray-300">
              <button
                onClick={() => setViewMode("layout")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${viewMode === "layout" ? "bg-[var(--color-primary)] text-white shadow-md" : "bg-white text-gray-600 border border-gray-300"}`}
              >
                <FiLayout size={13} /> Layout Editor
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${viewMode === "preview" ? "bg-[var(--color-primary)] text-white shadow-md" : "bg-white text-gray-600 border border-gray-300"}`}
              >
                <FiGrid size={13} /> Preview ({allDishes.length})
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-8 flex flex-col items-center">
              {viewMode === "layout" ? (
                /* Layout Editor — single tag with draggable elements */
                <LayoutEditor
                  settings={settings}
                  layout={settings.layout}
                  onLayoutChange={(layout) =>
                    setSettings((s) => ({ ...s, layout }))
                  }
                  sessionName={session.event_time}
                />
              ) : (
                /* Multi-tag Preview */
                <>
                  {allDishes.length === 0 ? (
                    <div className="m-auto text-gray-500 font-medium h-full flex items-center justify-center">
                      No dishes found in this session.
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-6 pb-8 w-full">
                      {allDishes.map((dish, index) => {
                        const scaledSize = getScaledFontSize(
                          dish,
                          maxTextWidth,
                          settings.fontSize,
                          settings.fontFamily
                        );
                        return (
                          <div
                            key={index}
                            style={getTagStyle()}
                            className="transition-transform hover:-translate-y-1 hover:shadow-lg"
                          >
                            {/* Logo — centered, 50% opacity */}
                            {settings.logo?.url && (
                              <img
                                src={settings.logo.url}
                                alt=""
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  transform: `translate(${settings.layout?.logo?.x || 0}px, ${settings.layout?.logo?.y || 0}px)`,
                                  width: `${settings.logo.size || 100}px`,
                                  height: `${settings.logo.size || 100}px`,
                                  objectFit: "contain",
                                  opacity: (settings.logo.opacity ?? 50) / 100,
                                  pointerEvents: "none",
                                  filter: getLogoFilter(settings.logo.colorId),
                                }}
                              />
                            )}

                            {/* Top: Session Name */}
                            <div
                              className="text-xs sm:text-sm font-medium opacity-70"
                              style={{
                                visibility: settings.showSession
                                  ? "visible"
                                  : "hidden",
                                transform: `translate(${settings.layout?.sessionName?.x || 0}px, ${settings.layout?.sessionName?.y || 0}px)`,
                              }}
                            >
                              {session.event_time || "Session"}
                            </div>

                            {/* Center: Dish Name — auto-scaled */}
                            <div
                              className="font-bold my-auto"
                              style={{
                                fontSize: `${scaledSize}px`,
                                lineHeight: 1.2,
                                wordBreak: "break-word",
                                transform: `translate(${settings.layout?.dishName?.x || 0}px, ${settings.layout?.dishName?.y || 0}px)`,
                              }}
                            >
                              {dish}
                            </div>

                            {/* Bottom: Caterer Name */}
                            <div
                              className="text-xs sm:text-sm font-semibold opacity-80"
                              style={{
                                visibility: settings.showCaterer
                                  ? "visible"
                                  : "hidden",
                                transform: `translate(${settings.layout?.catererName?.x || 0}px, ${settings.layout?.catererName?.y || 0}px)`,
                              }}
                            >
                              {settings.catererName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-[var(--color-primary)] text-white font-bold rounded-lg"
          >
            Print Tags
          </button>
        </div>
      </div>

      {/* Actual Print Layout - hidden natively, shown only via CSS in print */}
      <div className="hidden print:block absolute -left-2499.75 top-0 print:static print:auto w-full">
        <PrintLayout
          dishes={allDishes.map((name, index) => ({
            id: index + 1,
            name: typeof name === "string" ? name : name?.name || "Unknown",
            caterer: settings.catererName || "radha Catering",
          }))}
          config={{
            width: Number(settings.width) || 300,
            height: Number(settings.height) || 200,
            fontFamily: settings.fontFamily,
            fontSize: Number(settings.fontSize) || 24,
            alignment: settings.textAlign || "center",
            backgroundColor: settings.bgColor,
            textColor: settings.textColor,
            border: settings.borderStyle || "solid",
            borderColor: settings.borderColor,
            borderWidth: Number(settings.borderWidth) || 2,
            showCaterer: settings.showCaterer,
            pattern: settings.pattern,
            layout: settings.layout,
            logo: settings.logo,
            sessionName: session?.event_time,
            showSession: settings.showSession,
          }}
        />
      </div>
    </div>
  );
}
