/**
 * Runtime translation of arbitrary strings (typically API response text).
 *
 * Default provider is MyMemory — free, no API key, ~5000 chars/day per IP.
 * Swap providers by changing the `provider` constant near the bottom.
 *
 * Caching strategy:
 *   - Memory cache for the current session (instant on re-render).
 *   - localStorage cache so the same phrases don't burn quota across reloads.
 *   - In-flight dedup so concurrent requests for the same phrase make one call.
 *
 * Usage:
 *   import { translateText } from "@/services/translationService";
 *   const out = await translateText("Welcome Drinks", "en", "gu");
 *
 * For React components, prefer the `useTranslated` hook or `<TText>` wrapper.
 */

const CACHE_PREFIX = "i18n_dyn_v1_";

const cacheKey = (text, source, target) =>
  `${CACHE_PREFIX}${source}_${target}_${text}`;

const memoryCache = new Map();

const readCache = (key) => {
  if (memoryCache.has(key)) return memoryCache.get(key);
  try {
    const v = localStorage.getItem(key);
    if (v != null) memoryCache.set(key, v);
    return v;
  } catch {
    return null;
  }
};

const writeCache = (key, value) => {
  memoryCache.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage full — silent drop, memory cache still works for the session.
  }
};

// ---------- providers ----------

// MyMemory — free, no key, ~5000 chars/day per IP. Good enough for prototyping.
async function mymemoryProvider(text, source, target) {
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}` +
    `&langpair=${source}|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (!out) throw new Error("MyMemory: no translation in response");
  return out;
}

// Swap-in candidates, all match the (text, source, target) => Promise<string> shape:
//
// async function libreTranslateProvider(text, source, target) {
//   const res = await fetch("https://libretranslate.de/translate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ q: text, source, target, format: "text" }),
//   });
//   const data = await res.json();
//   return data.translatedText;
// }
//
// async function googleCloudProvider(text, source, target) {
//   const res = await fetch(
//     `https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ q: text, source, target, format: "text" }),
//     },
//   );
//   const data = await res.json();
//   return data?.data?.translations?.[0]?.translatedText;
// }

// Active provider — change this line to swap implementations.
const provider = mymemoryProvider;

// ---------- public API ----------

const inflight = new Map();

export const translateText = async (text, source = "en", target) => {
  if (!text || typeof text !== "string") return text;
  if (!target || target === source) return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // Skip pure numbers, IDs, and short codes — translating "8" or "uuid" is wasted budget.
  if (/^[\d\s\-_.+]+$/.test(trimmed)) return text;

  const key = cacheKey(trimmed, source, target);
  const cached = readCache(key);
  if (cached != null) return cached;

  if (inflight.has(key)) return inflight.get(key);

  const promise = provider(trimmed, source, target)
    .then((translated) => {
      writeCache(key, translated);
      inflight.delete(key);
      return translated;
    })
    .catch((err) => {
      inflight.delete(key);
      // Fail-open: if the provider is down or rate-limited, render the source.
      if (typeof console !== "undefined") {
        console.warn("[translation] failed, returning source:", err?.message);
      }
      return text;
    });

  inflight.set(key, promise);
  return promise;
};

export const clearTranslationCache = () => {
  memoryCache.clear();
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
};
