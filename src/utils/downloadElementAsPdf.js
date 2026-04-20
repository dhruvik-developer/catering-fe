import { exportToPDF } from "./pdfExport";

/**
 * Legacy helper kept for backward compatibility.
 * Uses the shared HTML-to-PDF pipeline (no image-based export).
 */
export async function downloadElementAsPdf(elementId, fileName, toast) {
  await exportToPDF(elementId, fileName, toast, {
    margin: 0,
    html2canvas: {
      scale: 3,
      useCORS: true,
      logging: false,
      letterRendering: true,
      windowWidth: 794,
      scrollY: 0,
    },
    jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  });
}
