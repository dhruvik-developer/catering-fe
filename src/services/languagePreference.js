import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from "../i18n";

export const APP_LANGUAGE_CHANGED_EVENT = "app:language-changed";

const COOKIE_NAME = "googtrans";
const FALLBACK_LANGUAGE = "en";

export const isSupportedLanguageCode = (value) => {
  const code = String(value || "").slice(0, 2).toLowerCase();
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
};

export const normalizeLanguageCode = (value, fallback = FALLBACK_LANGUAGE) => {
  const code = String(value || fallback).slice(0, 2).toLowerCase();
  return isSupportedLanguageCode(code) ? code : fallback;
};

const setGoogtransCookie = (value) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Set on every domain scope the page might be served from so navigations
  // between subdomains keep the same translation.
  const hostname = window.location.hostname;
  const cookie = `${COOKIE_NAME}=${value};path=/`;
  document.cookie = cookie;
  document.cookie = `${cookie};domain=${hostname}`;
  document.cookie = `${cookie};domain=.${hostname}`;

  const parts = hostname.split(".");
  if (parts.length > 1) {
    const parent = parts.slice(-2).join(".");
    document.cookie = `${cookie};domain=.${parent}`;
  }
};

export const triggerGoogleTranslateWidget = (target) => {
  if (typeof document === "undefined") return false;

  const select = document.querySelector("select.goog-te-combo");
  if (!select) return false;
  select.value = target === FALLBACK_LANGUAGE ? "" : target;
  select.dispatchEvent(new Event("change"));
  return true;
};

export const readActiveLanguagePreference = (
  fallback = FALLBACK_LANGUAGE
) => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isSupportedLanguageCode(stored)) {
      return normalizeLanguageCode(stored, fallback);
    }
  } catch {
    // ignore
  }

  if (typeof document !== "undefined") {
    const match = document.cookie.match(/googtrans=\/[a-z]+\/([a-z]+)/i);
    if (match?.[1] && isSupportedLanguageCode(match[1])) {
      return normalizeLanguageCode(match[1], fallback);
    }
  }

  return normalizeLanguageCode(fallback);
};

export const applyLanguagePreference = (
  target,
  {
    notify = true,
    reloadIfNeeded = false,
    retryWidget = false,
  } = {}
) => {
  const code = normalizeLanguageCode(target);
  const cookieValue =
    code === FALLBACK_LANGUAGE ? "/en/en" : `/en/${code}`;
  setGoogtransCookie(cookieValue);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    // localStorage might be disabled; the Google cookie still carries reloads.
  }

  if (notify && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(APP_LANGUAGE_CHANGED_EVENT));
  }

  const triggered = triggerGoogleTranslateWidget(code);
  if (!triggered && retryWidget && typeof window !== "undefined") {
    window.setTimeout(() => triggerGoogleTranslateWidget(code), 400);
  }

  if (!triggered && reloadIfNeeded && typeof window !== "undefined") {
    window.location.reload();
  }

  return triggered;
};
