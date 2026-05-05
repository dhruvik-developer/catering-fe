import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

/**
 * i18next is now used only as the source-string layer for legacy `t(key)`
 * calls — it always returns English. Live translation into Gujarati / Hindi
 * is performed by the Google Translate page widget loaded in index.html
 * (see Components/common/LanguageSwitcher.jsx for how the language is
 * applied at runtime).
 *
 * Why this split:
 *   - Static UI text wrapped in `t(key)` resolves through en.json as before
 *     (no per-component sweep required).
 *   - The Google widget walks the DOM and translates every visible text node,
 *     including API-derived content (category names, role labels, status
 *     badges). That gives us "translate everything" without wrapping each
 *     component.
 *
 * Adding a language: extend SUPPORTED_LANGUAGES and add the language code to
 * the widget's `includedLanguages` list in index.html. No JSON file needed.
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export const LANGUAGE_STORAGE_KEY = "radha_lang";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
