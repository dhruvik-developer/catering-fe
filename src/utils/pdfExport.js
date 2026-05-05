import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import DOMPurify from "dompurify";
import { logError } from "./logger";
import {
  ensureUnicodeWebFontsReady,
  PDF_UNICODE_DEFAULT_FONT,
  prepareUnicodePdfDocument,
} from "./pdf/unicodePdfFont";
import { getPdfFormatters } from "../api/PdfFormatters";

let defaultFormatterPromise = null;

async function fetchDefaultFormatterHtml() {
  if (defaultFormatterPromise) return defaultFormatterPromise;
  defaultFormatterPromise = (async () => {
    try {
      const response = await getPdfFormatters();
      const list = response?.data || [];
      const active = list.filter((f) => f.is_active !== false);
      const chosen = active.find((f) => f.is_default) || active[0] || null;
      return chosen?.html_content || "";
    } catch {
      return "";
    }
  })();
  return defaultFormatterPromise;
}

export function clearPdfTemplateCache() {
  defaultFormatterPromise = null;
}

// DOMParser doesn't execute scripts during parse, but the moment we attach
// the parsed nodes to the live document any `<img onerror>`, `<svg onload>`
// or `<iframe srcdoc>` fires. Templates are admin-authored, but DOMPurify
// gives us a hardened, audited stripper for defense-in-depth before the tree
// touches the DOM. We allow <style> because the template ships its own page
// CSS; DOMPurify keeps it but still blocks everything dangerous.
const TEMPLATE_PURIFY_CONFIG = {
  ADD_TAGS: ["style"],
  FORBID_TAGS: ["script", "iframe", "object", "embed", "base", "meta", "link"],
};

function applyTemplateWrap(clone, templateHtml) {
  if (!templateHtml) return clone;
  const safeHtml = DOMPurify.sanitize(templateHtml, TEMPLATE_PURIFY_CONFIG);
  let parsed;
  try {
    parsed = new DOMParser().parseFromString(safeHtml, "text/html");
  } catch {
    return clone;
  }
  const page = parsed.querySelector(".page");
  const contentSlot = page?.querySelector(".content");
  if (!page || !contentSlot) return clone;

  const styleSources = Array.from(parsed.querySelectorAll("style"))
    .map((s) => s.textContent || "")
    .join("\n");

  while (contentSlot.firstChild) contentSlot.removeChild(contentSlot.firstChild);
  contentSlot.appendChild(clone);

  const wrapper = document.createElement("div");
  wrapper.className = "pdf-template-wrap";
  wrapper.style.width = "794px";
  if (styleSources) {
    const styleEl = document.createElement("style");
    styleEl.textContent = styleSources;
    wrapper.appendChild(styleEl);
  }
  wrapper.appendChild(page);
  return wrapper;
}

async function buildExportRoot(clone, useTemplate) {
  if (useTemplate === false) return clone;
  const templateHtml = await fetchDefaultFormatterHtml();
  return applyTemplateWrap(clone, templateHtml);
}

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
  } catch {
    return colorStr; // Fallback to original string if failure
  }
}

function processColorString(value) {
  if (!value) return value;
  // If no modern color functions exist, return as-is
  if (
    !value.includes("oklch") &&
    !value.includes("oklab") &&
    !value.includes("color-mix") &&
    !value.includes("color(")
  ) {
    return value;
  }

  // Replace all occurrences of modern function blocks with their rgba() equivalent.
  // This matches anything like oklch(0.6 0.2 300) or color(display-p3 1 0 0)
  return value.replace(
    /(?:color-mix|oklch|oklab|color)\((?:[^()]|\([^()]*\))*\)/g,
    resolveCssColor
  );
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

function splitPdfOptions(customOptions = {}) {
  const { repeatingHeaderFooter, ...html2pdfOptions } = customOptions || {};
  return { repeatingHeaderFooter, html2pdfOptions };
}

function normalizePdfMargin(margin = 0) {
  if (Array.isArray(margin)) {
    if (margin.length === 4) return margin;
    if (margin.length === 2) return [margin[0], margin[1], margin[0], margin[1]];
    if (margin.length === 1) return [margin[0], margin[0], margin[0], margin[0]];
  }

  return [margin, margin, margin, margin];
}

function getPdfPageSize(pdf) {
  const pageSize = pdf.internal.pageSize;
  return {
    width: pageSize.getWidth ? pageSize.getWidth() : pageSize.width,
    height: pageSize.getHeight ? pageSize.getHeight() : pageSize.height,
  };
}

async function renderElementToPng(element, html2canvasOptions = {}) {
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  try {
    const canvas = await html2canvas(element, {
      ...html2canvasOptions,
      backgroundColor: null,
      logging: false,
    });

    return {
      dataUrl: canvas.toDataURL("image/png"),
      height: Math.ceil(rect.height),
    };
  } catch {
    return null;
  }
}

async function prepareRepeatingHeaderFooter(clone, opt, config = {}) {
  const headerElement = config.headerSelector
    ? clone.querySelector(config.headerSelector)
    : null;
  const footerElement = config.footerSelector
    ? clone.querySelector(config.footerSelector)
    : null;
  const canvasOptions = {
    ...(opt.html2canvas || {}),
    width: clone.offsetWidth,
    windowWidth: opt.html2canvas?.windowWidth || clone.offsetWidth,
  };

  const [header, footer] = await Promise.all([
    renderElementToPng(headerElement, canvasOptions),
    renderElementToPng(footerElement, canvasOptions),
  ]);

  if (config.removeOriginal !== false) {
    if (header) headerElement?.remove();
    if (footer) footerElement?.remove();
  }

  const margin = normalizePdfMargin(opt.margin);
  const topGap = config.topGap ?? 0;
  const bottomGap = config.bottomGap ?? 0;

  opt.margin = [
    margin[0] + (header?.height || 0) + topGap,
    margin[1],
    margin[2] + (footer?.height || 0) + bottomGap,
    margin[3],
  ];

  return {
    header,
    footer,
  };
}

function addRepeatingHeaderFooterToPdf(pdf, assets) {
  if (!assets?.header && !assets?.footer) return;

  const { width, height } = getPdfPageSize(pdf);
  const pageCount = pdf.getNumberOfPages
    ? pdf.getNumberOfPages()
    : pdf.internal.getNumberOfPages();

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    pdf.setPage(pageNumber);

    if (assets.header?.dataUrl && assets.header.height) {
      pdf.addImage(assets.header.dataUrl, "PNG", 0, 0, width, assets.header.height);
    }

    if (assets.footer?.dataUrl && assets.footer.height) {
      pdf.addImage(
        assets.footer.dataUrl,
        "PNG",
        0,
        height - assets.footer.height,
        width,
        assets.footer.height
      );
    }
  }
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
  const { repeatingHeaderFooter, html2pdfOptions } =
    splitPdfOptions(customOptions);
  const useTemplate = customOptions.useTemplate !== false;

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

    const exportRoot = await buildExportRoot(clone, useTemplate);

    // We must append the clone to the document body momentarily with visibility hidden.
    // This allows getComputedStyle to work accurately.
    wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.width = originalElement.offsetWidth + "px"; // Match width for styling
    wrapper.appendChild(exportRoot);
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
      ...html2pdfOptions,
    };
    opt.pagebreak = mergePageBreakOptions(
      basePagebreak,
      html2pdfOptions.pagebreak
    );

    const repeatingAssets = repeatingHeaderFooter
      ? await prepareRepeatingHeaderFooter(exportRoot, opt, repeatingHeaderFooter)
      : null;

    const worker = html2pdf().set(opt).from(exportRoot).toPdf();
    await applyUnicodeFontToHtml2PdfWorker(worker);
    const pdf = await worker.get("pdf");
    addRepeatingHeaderFooterToPdf(pdf, repeatingAssets);
    await worker.save();

    if (toast?.success && toastId) {
      toast.success("PDF downloaded successfully!", { id: toastId });
    }
  } catch (err) {
    logError("PDF generation failed:", err);
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
  const useTemplate = customOptions.useTemplate !== false;

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

    const exportRoot = await buildExportRoot(clone, useTemplate);

    wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.width = originalElement.offsetWidth + "px";
    wrapper.appendChild(exportRoot);
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

    const worker = html2pdf().set(opt).from(exportRoot).toPdf();
    await applyUnicodeFontToHtml2PdfWorker(worker);
    return await worker.output("blob");
  } catch (err) {
    logError("PDF preview generation failed:", err);
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
  const useTemplate = customOptions.useTemplate !== false;

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

    const exportRoot = await buildExportRoot(clone, useTemplate);

    wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    wrapper.style.width = originalElement.offsetWidth + "px";
    wrapper.appendChild(exportRoot);
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
    const downloadWorker = html2pdf().set(opt).from(exportRoot).toPdf();
    await applyUnicodeFontToHtml2PdfWorker(downloadWorker);
    await downloadWorker.save();

    if (isMobile && navigator.canShare) {
      // Only try to use the native share drawer on mobile devices
      const shareWorker = html2pdf().set(opt).from(exportRoot).toPdf();
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
    logError("WhatsApp share failed:", err);
    if (toast?.error && toastId) {
      toast.error("Failed to share PDF.", { id: toastId });
    }
  } finally {
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}
