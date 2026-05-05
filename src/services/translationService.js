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

// Bump the version suffix to invalidate cached entries when the sanitizer
// rules change (we did this when we found MyMemory was leaking <g id="N">
// segment-preservation tags into cached values).
const CACHE_PREFIX = "i18n_dyn_v2_";

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

// Strip artefacts MyMemory injects into its "translatedText" payload.
// Examples we've actually seen:
//   "<g id=\"1\"> ઉંધીયુ</g>"            -> segment-preservation wrapper
//   "MYMEMORY WARNING: ..."              -> rate-limit / quota notes prepended
//   "QUERY LENGTH LIMIT EXCEEDED. ..."   -> input too long
// If the cleaned result is empty or still looks like a warning, treat the
// translation as failed so the caller can fall back to the source string.
const sanitizeMyMemoryOutput = (raw) => {
  if (typeof raw !== "string") return "";
  let out = raw;

  // Drop the <g id="N">…</g> / <x …/> placeholders MyMemory wraps around segments.
  out = out.replace(/<\/?g[^>]*>/gi, "");
  out = out.replace(/<x\b[^>]*\/?>/gi, "");
  // Decode the most common HTML entities that show up in responses.
  out = out
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  out = out.trim();
  if (/^MYMEMORY WARNING/i.test(out)) return "";
  if (/QUERY LENGTH LIMIT EXCEEDED/i.test(out)) return "";
  return out;
};

// MyMemory — free, no key, ~5000 chars/day per IP. Good enough for prototyping.
async function mymemoryProvider(text, source, target) {
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}` +
    `&langpair=${source}|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = await res.json();
  const cleaned = sanitizeMyMemoryOutput(data?.responseData?.translatedText);
  if (!cleaned) throw new Error("MyMemory: empty / warning response");
  return cleaned;
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
