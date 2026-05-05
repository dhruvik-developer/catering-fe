import { LANGUAGE_STORAGE_KEY } from "./index";

const FALLBACK = "en";

const normalize = (lang) => (lang || FALLBACK).slice(0, 2).toLowerCase();

// User-selected language now lives in localStorage (LanguageSwitcher writes it)
// because i18next is pinned to English — live UI translation is handled by the
// Google Translate widget. Helpers that pick from stored multi-lang fields
// should still honour the user's choice.
const getActiveLanguage = () => {
  try {
    return normalize(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return FALLBACK;
  }
};

/**
 * Pick a localized value from API data.
 * Supports two storage shapes:
 *   1. Multi-column:  { name_en, name_gu, name_hi }   → pickLocalized(item, "name")
 *   2. JSON object:   { name: { en, gu, hi } }        → pickLocalized(item.name)
 * Falls back to English, then any non-empty value, then "".
 */
export const pickLocalized = (source, field) => {
  if (source == null) return "";
  const lang = getActiveLanguage();

  if (typeof source === "string") return source;

  // Shape 1: object with name_en, name_gu, name_hi
  if (field) {
    const exact = source[`${field}_${lang}`];
    if (exact) return exact;
    const en = source[`${field}_en`];
    if (en) return en;
    const plain = source[field];
    if (plain) return typeof plain === "object" ? pickLocalized(plain) : plain;
    return "";
  }

  // Shape 2: { en, gu, hi }
  return source[lang] || source[FALLBACK] || Object.values(source).find(Boolean) || "";
};

/**
 * Hook-style version that re-renders when the language changes.
 * Use inside React components instead of pickLocalized.
 */
export const useLocalized = () => {
  const lang = getActiveLanguage();

  return (source, field) => {
    if (source == null) return "";
    if (typeof source === "string") return source;

    if (field) {
      return (
        source[`${field}_${lang}`] ||
        source[`${field}_en`] ||
        source[field] ||
        ""
      );
    }
    return (
      source[lang] ||
      source[FALLBACK] ||
      Object.values(source).find(Boolean) ||
      ""
    );
  };
};

/**
 * Build a multi-lang field object suitable for API submission.
 * buildMultiLang({ en: "Paneer", gu: "પનીર", hi: "पनीर" })
 *   → { name_en: "Paneer", name_gu: "પનીર", name_hi: "पनीर" }
 */
export const buildMultiLangFields = (field, values = {}) => ({
  [`${field}_en`]: values.en || "",
  [`${field}_gu`]: values.gu || "",
  [`${field}_hi`]: values.hi || "",
});
