import { useEffect, useState } from "react";
import { translateText } from "../services/translationService";
import {
  APP_LANGUAGE_CHANGED_EVENT,
  readActiveLanguagePreference,
} from "../services/languagePreference";

/**
 * Translate any string into the user's active language at render time.
 *
 * Reads the active language from localStorage (where LanguageSwitcher writes
 * it) — i18next is pinned to English now, so we can't rely on i18n.language.
 *
 * Returns the source string synchronously, then swaps in the translated value
 * once the provider responds. Cached translations return on the next tick.
 *
 * Use this for any text where Google's DOM-walking translator is unreliable
 * — typically anything React re-renders frequently (breadcrumbs, dynamic
 * lists, anything memoised on route state). Google would translate the DOM
 * once, then React's re-render replaces the translated text with the source
 * again. Going through this hook keeps the translated value in component
 * state so React re-renders preserve it.
 */

const readActiveLanguage = (fallback = "en") => {
  return readActiveLanguagePreference(fallback);
};

export const useTranslated = (text, sourceLang = "en") => {
  const [target, setTarget] = useState(() => readActiveLanguage(sourceLang));
  const [output, setOutput] = useState(text);

  // Re-read localStorage when language changes, in this tab or another.
  useEffect(() => {
    const refresh = () => setTarget(readActiveLanguage(sourceLang));
    window.addEventListener(APP_LANGUAGE_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(APP_LANGUAGE_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [sourceLang]);

  useEffect(() => {
    if (!text || target === sourceLang) {
      setOutput(text);
      return;
    }
    let cancelled = false;
    Promise.resolve(translateText(text, sourceLang, target)).then((value) => {
      if (!cancelled) setOutput(value);
    });
    return () => {
      cancelled = true;
    };
  }, [text, target, sourceLang]);

  return output;
};
