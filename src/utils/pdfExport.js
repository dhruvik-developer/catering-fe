import html2pdf from "html2pdf.js";
import {
  ensureUnicodeWebFontsReady,
  PDF_UNICODE_DEFAULT_FONT,
  prepareUnicodePdfDocument,
} from "./pdf/unicodePdfFont";

// Helper to convert modern CSS colors (oklab/oklch) to standard rgba() for html2canvas support.
const colorCanvas = document.createElement("canvas");
colorCanvas.width = 1;
colorCanvas.height = 1;

function resolveCssColor(colorStr) {
  try {
    const colorCtx = colorCanvas.getContext("2d", { willReadFrequently: true });
    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = "rgba(0,0,0,0)";
    colorCtx.fillStyle = colorStr;
    colorCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  } catch (e) {
    return colorStr; // Fallback to original string if failure
  }
}

function processColorString(value) {
  if (!value) return value;
  // If no modern color functions exist, return as-is
  if (
    !value.includes("oklch") &&
    !value.includes("oklab") &&
    !value.includes("color(")
  ) {
    return value;
  }

  // Replace all occurrences of modern function blocks with their rgba() equivalent.
  // This matches anything like oklch(0.6 0.2 300) or color(display-p3 1 0 0)
  return value.replace(/(?:oklch|oklab|color)\([^()]+\)/g, resolveCssColor);
}

function formatWhatsAppNumber(rawNumber = "") {
  let clean = rawNumber.toString().replace(/\D/g, "");

  // Convert 00-prefixed international numbers to plain country-code format.
  if (clean.startsWith("00")) clean = clean.slice(2);

  // Common India-local format like 098xxxxxx -> 91 + 98xxxxxx
  if (clean.length === 11 && clean.startsWith("0")) {
    clean = `91${clean.slice(1)}`;
  } else if (clean.length === 10) {
    clean = `91${clean}`;
  }

  return clean;
}

async function applyUnicodeFontToHtml2PdfWorker(worker) {
  const pdf = await worker.get("pdf");
  await prepareUnicodePdfDocument(pdf);
  pdf.setFont(PDF_UNICODE_DEFAULT_FONT, "normal");
}

function mergePageBreakOptions(basePagebreak = {}, customPagebreak = {}) {
  const normalizeArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const unique = (items) => [...new Set(items.filter(Boolean))];

  return {
    ...basePagebreak,
    ...customPagebreak,
    mode: unique([
      ...normalizeArray(basePagebreak.mode),
      ...normalizeArray(customPagebreak.mode),
    ]),
    avoid: unique([
      ...normalizeArray(basePagebreak.avoid),
      ...normalizeArray(customPagebreak.avoid),
    ]),
    before: unique([
      ...normalizeArray(basePagebreak.before),
      ...normalizeArray(customPagebreak.before),
    ]),
    after: unique([
      ...normalizeArray(basePagebreak.after),
      ...normalizeArray(customPagebreak.after),
    ]),
  };
}

/**
 * Shared utility for exporting a DOM element to a PDF using html2pdf.js.
 * This ensures consistent A4 sizing, handles multi-page content gracefully,
 * and polyfills modern tailwind CSS colors for html2canvas.
 *
 * @param {string} elementId - The ID of the DOM element to capture (e.g. "pdf-content")
 * @param {string} fileName - The desired file name (e.g. "Invoice-123.pdf")
 * @param {object} toast - Optional `react-hot-toast` instance to show loading/success states
 * @param {object} customOptions - Optional custom html2pdf options to merge with defaults
 */
export async function exportToPDF(
  elementId,
  fileName = "download.pdf",
  toast = null,
  customOptions = {}
) {
  const originalElement = document.getElementById(elementId);

  if (!originalElement) {
    if (toast?.error) toast.error("PDF content not found.");
    console.error(`Export failed: Element with ID '${elementId}' not found.`);
    return;
  }

  const toastId = toast?.loading ? toast.loading("Generating PDF...") : null;
  let wrapper = null;

  try {
    // We create a clone of the original element to safely apply inline style fixes safely without breaking the UI.
    const clone = originalElement.cloneNode(true);
    clone.classList.add("pdf-unicode-content");
    clone.style.boxSizing = "border-box";
    if (originalElement.dataset.pdfPaddingTop) {
      clone.style.paddingTop = originalElement.dataset.pdfPaddingTop;
    }
    if (originalElement.dataset.pdfPaddingBottom) {
      clone.style.paddingBottom = originalElement.dataset.pdfPaddingBottom;
    }

    await ensureUnicodeWebFontsReady();

    // We must append the clone to the document body momentarily with visibility hidden.
    // This allows getComputedStyle to work accurately.
    wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.width = originalElement.offsetWidth + "px"; // Match width for styling
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Recursively apply computed RGB strings directly into style to polyfill oklab errors
    const originalNodes = [
      originalElement,
      ...originalElement.querySelectorAll("*"),
    ];
    const cloneNodes = [clone, ...clone.querySelectorAll("*")];

    const propsToFix = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "textDecorationColor",
      "outlineColor",
      "boxShadow",
      "backgroundImage",
    ];

    for (let i = 0; i < originalNodes.length; i++) {
      const oNode = originalNodes[i];
      const cNode = cloneNodes[i];
      const computedStyle = window.getComputedStyle(oNode);

      for (const prop of propsToFix) {
        const val = computedStyle[prop];
        if (
          val &&
          (val.includes("oklch") ||
            val.includes("oklab") ||
            val.includes("color("))
        ) {
          cNode.style[prop] = processColorString(val);
        }
      }
    }

    // Default config optimized for EXACT A4 preview matching
    const basePagebreak = {
      mode: ["css", "legacy"],
      avoid: [".page-break-inside-avoid"],
    };

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: "jpeg", quality: 1.0 }, // Maximum quality
      html2canvas: {
        scale: 2, // High DPI clone
        useCORS: true,
        windowWidth: 794, // Lock the capture viewport strictly to our A4 width
        scrollY: 0,
      },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" }, // Use explicit pixels instead of mm so browsers can't fraction-warp the dimensions
      ...customOptions,
    };
    opt.pagebreak = mergePageBreakOptions(basePagebreak, customOptions.pagebreak);

    const worker = html2pdf().set(opt).from(clone).toPdf();
    await applyUnicodeFontToHtml2PdfWorker(worker);
    await worker.save();

    if (toast?.success && toastId) {
      toast.success("PDF downloaded successfully!", { id: toastId });
    }
  } catch (err) {
    console.error("PDF generation failed:", err);
    if (toast?.error && toastId) {
      toast.error("Failed to generate PDF.", { id: toastId });
    }
  } finally {
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}

export async function generatePdfBlob(
  elementId,
  customOptions = {}
) {
  const originalElement = document.getElementById(elementId);

  if (!originalElement) {
    console.error(`Preview failed: Element with ID '${elementId}' not found.`);
    return null;
  }

  let wrapper = null;

  try {
    const clone = originalElement.cloneNode(true);
    clone.classList.add("pdf-unicode-content");
    clone.style.boxSizing = "border-box";
    if (originalElement.dataset.pdfPaddingTop) {
      clone.style.paddingTop = originalElement.dataset.pdfPaddingTop;
    }
    if (originalElement.dataset.pdfPaddingBottom) {
      clone.style.paddingBottom = originalElement.dataset.pdfPaddingBottom;
    }

    await ensureUnicodeWebFontsReady();

    wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.width = originalElement.offsetWidth + "px";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const originalNodes = [
      originalElement,
      ...originalElement.querySelectorAll("*"),
    ];
    const cloneNodes = [clone, ...clone.querySelectorAll("*")];

    const propsToFix = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "textDecorationColor",
      "outlineColor",
      "boxShadow",
      "backgroundImage",
    ];

    for (let i = 0; i < originalNodes.length; i++) {
      const oNode = originalNodes[i];
      const cNode = cloneNodes[i];
      const computedStyle = window.getComputedStyle(oNode);

      for (const prop of propsToFix) {
        const val = computedStyle[prop];
        if (
          val &&
          (val.includes("oklch") ||
            val.includes("oklab") ||
            val.includes("color("))
        ) {
          cNode.style[prop] = processColorString(val);
        }
      }
    }

    const basePagebreak = {
      mode: ["css", "legacy"],
      avoid: [".page-break-inside-avoid"],
    };

    const opt = {
      margin: 0,
      filename: "preview.pdf",
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowWidth: 794,
        scrollY: 0,
      },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
      ...customOptions,
    };
    opt.pagebreak = mergePageBreakOptions(basePagebreak, customOptions.pagebreak);

    const worker = html2pdf().set(opt).from(clone).toPdf();
    await applyUnicodeFontToHtml2PdfWorker(worker);
    return await worker.output("blob");
  } catch (err) {
    console.error("PDF preview generation failed:", err);
    return null;
  } finally {
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}

/**
 * Generates and shares a PDF to WhatsApp.
 * Tries Web Share API first (great for mobile/supported OS), falls back to downloading and opening WhatsApp Web.
 */
export async function shareToWhatsApp(
  elementId,
  fileName = "document.pdf",
  mobileNo = "",
  toast = null,
  customOptions = {},
  prefilledText = ""
) {
  const originalElement = document.getElementById(elementId);

  if (!originalElement) {
    if (toast?.error) toast.error("PDF content not found.");
    console.error(`Share failed: Element with ID '${elementId}' not found.`);
    return;
  }

  const toastId = toast?.loading
    ? toast.loading("Generating PDF for WhatsApp...")
    : null;
  let wrapper = null;

  try {
    const clone = originalElement.cloneNode(true);
    clone.classList.add("pdf-unicode-content");
    clone.style.boxSizing = "border-box";
    if (originalElement.dataset.pdfPaddingTop) {
      clone.style.paddingTop = originalElement.dataset.pdfPaddingTop;
    }
    if (originalElement.dataset.pdfPaddingBottom) {
      clone.style.paddingBottom = originalElement.dataset.pdfPaddingBottom;
    }

    await ensureUnicodeWebFontsReady();

    wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.width = originalElement.offsetWidth + "px";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const originalNodes = [
      originalElement,
      ...originalElement.querySelectorAll("*"),
    ];
    const cloneNodes = [clone, ...clone.querySelectorAll("*")];

    const propsToFix = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "textDecorationColor",
      "outlineColor",
      "boxShadow",
      "backgroundImage",
    ];

    for (let i = 0; i < originalNodes.length; i++) {
      const val = window.getComputedStyle(originalNodes[i])[propsToFix[0]]; // just checking first to optimize? No, keep it same
    }
    // proper loop:
    for (let i = 0; i < originalNodes.length; i++) {
      const oNode = originalNodes[i];
      const cNode = cloneNodes[i];
      const computedStyle = window.getComputedStyle(oNode);

      for (const prop of propsToFix) {
        const val = computedStyle[prop];
        if (
          val &&
          (val.includes("oklch") ||
            val.includes("oklab") ||
            val.includes("color("))
        ) {
          cNode.style[prop] = processColorString(val);
        }
      }
    }

    const basePagebreak = {
      mode: ["css", "legacy"],
      avoid: [".page-break-inside-avoid"],
    };

    const opt = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      ...customOptions,
    };
    opt.pagebreak = mergePageBreakOptions(basePagebreak, customOptions.pagebreak);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const formattedNumber = formatWhatsAppNumber(mobileNo || "");
    const messageText = prefilledText?.trim() || "";

    // Build a robust direct-chat URL. `web.whatsapp.com/send` is more reliable
    // on desktop than wa.me redirects for prefilled vendor messages.
    const params = new URLSearchParams();
    if (formattedNumber) params.set("phone", formattedNumber);
    if (messageText) params.set("text", messageText);
    params.set("type", "phone_number");
    params.set("app_absent", "0");

    const whatsappUrl = formattedNumber
      ? `${isMobile ? "https://api.whatsapp.com/send" : "https://web.whatsapp.com/send"}?${params.toString()}`
      : `https://wa.me/${messageText ? `?text=${encodeURIComponent(messageText)}` : ""}`;

    // Always download the PDF first so the user has the file ready to attach
    const downloadWorker = html2pdf().set(opt).from(clone).toPdf();
    await applyUnicodeFontToHtml2PdfWorker(downloadWorker);
    await downloadWorker.save();

    if (isMobile && navigator.canShare) {
      // Only try to use the native share drawer on mobile devices
      const shareWorker = html2pdf().set(opt).from(clone).toPdf();
      await applyUnicodeFontToHtml2PdfWorker(shareWorker);
      const pdfBlob = await shareWorker.output("blob");
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      if (navigator.canShare({ files: [file] })) {
        if (toast?.success && toastId)
          toast.success("PDF Downloaded. Opening share...", { id: toastId });
        try {
          await navigator.share({
            title: fileName,
            text: "Please find the document attached.",
            files: [file],
          });
        } catch (err) {
          if (err.name !== "AbortError") {
            window.open(whatsappUrl, "_blank");
          }
        }
      } else {
        if (toast?.success && toastId)
          toast.success(
            "PDF Downloaded. Please attach it in WhatsApp manually.",
            { id: toastId }
          );
        window.open(whatsappUrl, "_blank");
      }
    } else {
      // On Desktop, bypass the native share popup completely
      if (toast?.success && toastId)
        toast.success("PDF Downloaded. Opening WhatsApp Web...", {
          id: toastId,
        });
      window.open(whatsappUrl, "_blank");
    }
  } catch (err) {
    console.error("WhatsApp share failed:", err);
    if (toast?.error && toastId) {
      toast.error("Failed to share PDF.", { id: toastId });
    }
  } finally {
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}
