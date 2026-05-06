/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Loader from "../common/Loader";
import {
  APP_LANGUAGE_CHANGED_EVENT,
  readActiveLanguagePreference,
} from "../../services/languagePreference";

/**
 * Hides the page content for a brief window after every route change while
 * the user is in a non-English language, so the Google Translate widget can
 * finish translating the freshly-rendered DOM before it becomes visible.
 *
 * Without this, every navigation flashes the English source for ~150-300ms
 * before Google's DOM walker swaps in the translated text.
 *
 * Mechanic: when the route changes, we cover children with the existing
 * Loader for ~350ms (long enough for Google to translate a screenful), then
 * reveal. In English mode this gate is a passthrough — no overlay shown.
 */

const HIDE_MS = 350;

const readActiveLanguage = () => {
  return readActiveLanguagePreference("en");
};

const TranslationGate = ({ children }) => {
  const location = useLocation();
  const [lang, setLang] = useState(readActiveLanguage);
  const [hidden, setHidden] = useState(() => readActiveLanguage() !== "en");

  // Track language switches so the gate engages immediately after a swap too.
  useEffect(() => {
    const refresh = () => setLang(readActiveLanguage());
    window.addEventListener(APP_LANGUAGE_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(APP_LANGUAGE_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Cover the page on every route change while in non-English mode.
  useEffect(() => {
    if (lang === "en") {
      setHidden(false);
      return;
    }
    setHidden(true);
    const id = setTimeout(() => setHidden(false), HIDE_MS);
    return () => clearTimeout(id);
  }, [location.pathname, lang]);

  return (
    <Box sx={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, visibility: hidden ? "hidden" : "visible" }}>
        {children}
      </Box>
      {hidden ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "var(--color-primary-soft)",
            zIndex: 5,
          }}
        >
          <Loader fullScreen={false} />
        </Box>
      ) : null}
    </Box>
  );
};

export default TranslationGate;
