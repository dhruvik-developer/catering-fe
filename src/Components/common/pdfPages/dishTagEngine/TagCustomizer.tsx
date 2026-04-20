import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { Dish, TagConfig } from "./types";
import { TagPreview } from "./TagPreview";
import { PrintLayout } from "./PrintLayout";
import {
  ensureUnicodeWebFontsReady,
  PDF_UNICODE_DEFAULT_FONT,
  prepareUnicodePdfDocument,
} from "../../../../utils/pdf/unicodePdfFont";

interface TagCustomizerProps {
  dishes: Dish[];
  onBack?: () => void;
  sessionName?: string;
}

const DEFAULT_CONFIG: TagConfig = {
  width: 300,
  height: 200,
  fontFamily: "sans-serif",
  fontSize: 24,
  alignment: "center",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  border: "solid",
  borderColor: "#e5e7eb",
  borderWidth: 2,
  showCaterer: true,
};

export const TagCustomizer: React.FC<TagCustomizerProps> = ({
  dishes,
  onBack,
  sessionName,
}) => {
  const [config, setConfig] = useState<TagConfig>(DEFAULT_CONFIG);

  const handlePrint = () => {
    document.body.classList.add("dish-tag-print");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("dish-tag-print");
    }, 1000);
  };

  const handleExportPdf = async () => {
    const element = document.getElementById("print-area");
    if (!element) return;

    // Create a temporary clone to ensure it's fully visible and ready for html2canvas
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.opacity = "1";
    clone.style.zIndex = "-9999";
    clone.style.width = "794px"; // Force A4 width for PDF measuring
    clone.classList.add("pdf-unicode-content");
    clone.className = clone.className
      .replace(/hidden/g, "")
      .replace(/print:py-0/g, "")
      .replace(/print:bg-white/g, "");

    document.body.appendChild(clone);

    try {
      await ensureUnicodeWebFontsReady();

      const opt = {
        margin: 0,
        filename: "dish-tags.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 794 },
        jsPDF: { unit: "px", format: "a4", orientation: "portrait" as const },
      };

      const worker = html2pdf().from(clone).set(opt).toPdf();
      await worker.get("pdf").then(async (pdf) => {
        await prepareUnicodePdfDocument(pdf);
        pdf.setFont(PDF_UNICODE_DEFAULT_FONT, "normal");
      });
      await worker.save();
    } finally {
      if (clone.parentNode) {
        document.body.removeChild(clone);
      }
    }
  };

  const previewDish: Dish =
    dishes.length > 0
      ? dishes[0]
      : { id: 1, name: "Sample Dish Name", caterer: "radha Catering" };

  return (
    <div className="flex w-full h-full min-h-screen bg-gray-50 font-sans">
      {/* Settings Sidebar - hidden in print */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto print:hidden shadow-lg flex flex-col z-10 md:flex">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Tag Designer</h2>
            {onBack && (
              <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1 border rounded"
              >
                Back
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {dishes.length} items to print
          </p>
          {sessionName && (
            <p className="text-xs text-indigo-600 font-semibold mt-1">
              {sessionName}
            </p>
          )}
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Dimensions
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={config.width}
                  onChange={(e) =>
                    setConfig({ ...config, width: Number(e.target.value) })
                  }
                  min={100}
                  max={600}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={config.height}
                  onChange={(e) =>
                    setConfig({ ...config, height: Number(e.target.value) })
                  }
                  min={50}
                  max={400}
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Typography
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={config.fontFamily}
                onChange={(e) =>
                  setConfig({ ...config, fontFamily: e.target.value })
                }
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 flex justify-between">
                <span>Font Size (px)</span>
                <span>{config.fontSize}px</span>
              </label>
              <input
                type="range"
                className="w-full"
                value={config.fontSize}
                onChange={(e) =>
                  setConfig({ ...config, fontSize: Number(e.target.value) })
                }
                min={12}
                max={60}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                Alignment
              </label>
              <div className="flex justify-between gap-2">
                {["left", "center", "right"].map((align) => (
                  <button
                    key={align}
                    className={`flex-1 py-1.5 px-3 text-sm border rounded capitalize transition-colors ${config.alignment === align ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-medium" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    onClick={() =>
                      setConfig({ ...config, alignment: align as any })
                    }
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Appearance
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bg Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    className="p-0 border-0 h-8 w-8 rounded cursor-pointer"
                    value={config.backgroundColor}
                    onChange={(e) =>
                      setConfig({ ...config, backgroundColor: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="w-full border rounded-r p-1.5 ml-1 text-xs uppercase text-gray-600 outline-none"
                    value={config.backgroundColor}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    className="p-0 border-0 h-8 w-8 rounded cursor-pointer"
                    value={config.textColor}
                    onChange={(e) =>
                      setConfig({ ...config, textColor: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="w-full border rounded-r p-1.5 ml-1 text-xs uppercase text-gray-600 outline-none"
                    value={config.textColor}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Border */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Style Option
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Border Style
              </label>
              <select
                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 mb-3"
                value={config.border}
                onChange={(e) =>
                  setConfig({ ...config, border: e.target.value as any })
                }
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
              {config.border !== "none" && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Border Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0"
                        value={config.borderColor}
                        onChange={(e) =>
                          setConfig({ ...config, borderColor: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="w-full border rounded-r p-1.5 ml-1 text-xs uppercase text-gray-600 outline-none"
                        value={config.borderColor}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded p-1.5 text-sm"
                      value={config.borderWidth}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          borderWidth: Number(e.target.value),
                        })
                      }
                      min={1}
                      max={10}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="showCaterer"
                checked={config.showCaterer}
                onChange={(e) =>
                  setConfig({ ...config, showCaterer: e.target.checked })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="showCaterer"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Show Caterer Name
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
          <button
            onClick={handlePrint}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow transition-colors focus:ring-4 focus:ring-indigo-200"
          >
            Print Tags
          </button>
          <button
            onClick={handleExportPdf}
            className="w-full py-2.5 px-4 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-colors focus:ring-4 focus:ring-gray-100"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Preview Area - hidden in print */}
      <div className="flex-1 flex flex-col print:hidden bg-slate-100 overflow-hidden relative">
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y4ZmFmYyI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0iI2UyZThmMCI+PC9jaXJjbGU+Cjwvc3ZnPg==')]">
          <div className="flex flex-col items-center max-w-2xl w-full">
            <div className="mb-6 text-center bg-white border border-gray-200 py-1.5 px-4 rounded-full shadow-sm text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Live Preview
            </div>
            <div className="p-12 rounded-2xl flex items-center justify-center transition-all relative">
              <TagPreview dish={previewDish} config={config} />
            </div>
          </div>
        </div>
      </div>

      {/* Actual Print Layout - hidden natively, shown only via CSS in print or when cloned for PDF */}
      <div className="hidden print:block absolute -left-2499.75 top-0 print:static print:auto w-full">
        <PrintLayout dishes={dishes} config={config} />
      </div>
    </div>
  );
};
