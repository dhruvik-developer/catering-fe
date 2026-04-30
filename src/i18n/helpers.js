import i18n from "./index";

const FALLBACK = "en";

const normalize = (lang) => (lang || FALLBACK).slice(0, 2).toLowerCase();

/**
 * Pick a localized value from API data.
 * Supports two storage shapes:
 *   1. Multi-column:  { name_en, name_gu, name_hi }   → pickLocalized(item, "name")
 *   2. JSON object:   { name: { en, gu, hi } }        → pickLocalized(item.name)
 * Falls back to English, then any non-empty value, then "".
 */
export const pickLocalized = (source, field) => {
  if (source == null) return "";
  const lang = normalize(i18n.resolvedLanguage || i18n.language);

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
import { useTranslation } from "react-i18next";
export const useLocalized = () => {
  const { i18n: i18nInstance } = useTranslation();
  const lang = normalize(i18nInstance.resolvedLanguage || i18nInstance.language);

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
