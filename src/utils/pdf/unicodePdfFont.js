export const PDF_UNICODE_FONT_FAMILIES = {
  devanagari: "NotoSansDevanagari",
  gujarati: "NotoSansGujarati",
};

export const PDF_UNICODE_DEFAULT_FONT = PDF_UNICODE_FONT_FAMILIES.devanagari;

const PDF_UNICODE_FONT_FILES = {
  devanagari: "NotoSansDevanagari-Variable.ttf",
  gujarati: "NotoSansGujarati-Variable.ttf",
};

const DEVANAGARI_REGEX = /[\u0900-\u097F]/u;
const GUJARATI_REGEX = /[\u0A80-\u0AFF]/u;

const registeredDocs = new WeakSet();
const patchedDocs = new WeakSet();
let embeddedFontPromise = null;
let webFontReadyPromise = null;

const normalizeText = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(normalizeText).join(" ");
  if (typeof value === "object") {
    if ("content" in value) return normalizeText(value.content);
    if ("text" in value) return normalizeText(value.text);
    return "";
  }
  return String(value);
};

export const resolveUnicodePdfFont = (value) => {
  const text = normalizeText(value);
  if (!text) return null;
  if (GUJARATI_REGEX.test(text)) return PDF_UNICODE_FONT_FAMILIES.gujarati;
  if (DEVANAGARI_REGEX.test(text)) return PDF_UNICODE_FONT_FAMILIES.devanagari;
  return null;
};

const loadEmbeddedFonts = async () => {
  if (!embeddedFontPromise) {
    embeddedFontPromise = Promise.all([
      import("../../assets/fonts/base64/NotoSansDevanagari-Variable.base64.js"),
      import("../../assets/fonts/base64/NotoSansGujarati-Variable.base64.js"),
    ]).then(([devanagari, gujarati]) => [
      {
        fileName: PDF_UNICODE_FONT_FILES.devanagari,
        fontName: PDF_UNICODE_FONT_FAMILIES.devanagari,
        base64: devanagari.default,
      },
      {
        fileName: PDF_UNICODE_FONT_FILES.gujarati,
        fontName: PDF_UNICODE_FONT_FAMILIES.gujarati,
        base64: gujarati.default,
      },
    ]);
  }

  return embeddedFontPromise;
};

export const registerUnicodePdfFonts = async (doc) => {
  if (!doc || registeredDocs.has(doc)) return;

  const fonts = await loadEmbeddedFonts();
  fonts.forEach(({ fileName, fontName, base64 }) => {
    doc.addFileToVFS(fileName, base64);
    doc.addFont(fileName, fontName, "normal");
  });

  registeredDocs.add(doc);
};

const withUnicodeAwareFont = (doc, value, render) => {
  const unicodeFont = resolveUnicodePdfFont(value);
  if (!unicodeFont) return render();

  const previousFont = doc.getFont?.();
  try {
    doc.setFont(unicodeFont, "normal");
    return render();
  } finally {
    if (previousFont?.fontName) {
      doc.setFont(previousFont.fontName, previousFont.fontStyle || "normal");
    }
  }
};

export const enableUnicodeTextFallback = (doc) => {
  if (!doc || patchedDocs.has(doc)) return doc;

  const originalText = doc.text.bind(doc);
  doc.text = function patchedText(value, ...args) {
    return withUnicodeAwareFont(this, value, () => originalText(value, ...args));
  };

  if (typeof doc.splitTextToSize === "function") {
    const originalSplitTextToSize = doc.splitTextToSize.bind(doc);
    doc.splitTextToSize = function patchedSplitTextToSize(value, ...args) {
      return withUnicodeAwareFont(this, value, () =>
        originalSplitTextToSize(value, ...args)
      );
    };
  }

  patchedDocs.add(doc);
  return doc;
};

export const prepareUnicodePdfDocument = async (doc) => {
  await registerUnicodePdfFonts(doc);
  enableUnicodeTextFallback(doc);
  return doc;
};

export const applyUnicodeFontToAutoTableCell = (cellData) => {
  const cellValue = cellData?.cell?.raw ?? cellData?.cell?.text;
  const unicodeFont = resolveUnicodePdfFont(cellValue);
  if (!unicodeFont || !cellData?.cell?.styles) return;

  cellData.cell.styles.font = unicodeFont;
  cellData.cell.styles.fontStyle = "normal";
};

export const ensureUnicodeWebFontsReady = async () => {
  if (typeof document === "undefined" || !document.fonts?.load) return;

  if (!webFontReadyPromise) {
    webFontReadyPromise = Promise.all([
      document.fonts.load('400 14px "Noto Sans Devanagari PDF"'),
      document.fonts.load('400 14px "Noto Sans Gujarati PDF"'),
    ])
      .catch(() => undefined)
      .then(() => document.fonts.ready)
      .catch(() => undefined);
  }

  await webFontReadyPromise;
};
