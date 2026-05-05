import { useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { FiGlobe, FiCheck, FiChevronDown } from "react-icons/fi";
import {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "../../i18n";
import { APP_LANGUAGE_CHANGED_EVENT } from "../../hooks/useTranslated";

/**
 * Language switcher backed by Google's page-translation widget.
 *
 * The widget script is loaded in index.html. It honours a `googtrans` cookie
 * of the form `/<source>/<target>` (e.g. `/en/gu`). Setting the cookie and
 * reloading lets Google walk the DOM on load and translate every text node —
 * including API-derived content (category names, status badges, role labels).
 *
 * For the active session we also try to flip the hidden `<select>` the widget
 * injects, which translates without a reload. If the widget hasn't finished
 * booting we fall back to a reload so the cookie kicks in.
 */

const COOKIE_NAME = "googtrans";

const setGoogtransCookie = (value) => {
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

const triggerWidget = (target) => {
  const select = document.querySelector("select.goog-te-combo");
  if (!select) return false;
  select.value = target === "en" ? "" : target;
  select.dispatchEvent(new Event("change"));
  return true;
};

const switchLanguage = (target) => {
  const cookieValue = target === "en" ? "/en/en" : `/en/${target}`;
  setGoogtransCookie(cookieValue);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, target);
  } catch {
    // localStorage might be disabled — cookie is still set, reload will pick it up.
  }

  // Notify in-page hooks (useTranslated, helpers) so they re-render without
  // waiting for a reload.
  window.dispatchEvent(new CustomEvent(APP_LANGUAGE_CHANGED_EVENT));

  // Try the in-page swap first; reload is the reliable fallback.
  if (!triggerWidget(target)) {
    window.location.reload();
  }
};

const readActiveLanguage = () => {
  // Prefer localStorage (set when the user picked something), fall back to
  // parsing the googtrans cookie that Google leaves behind.
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return stored.slice(0, 2);
  } catch {
    // ignore
  }
  const match = document.cookie.match(/googtrans=\/[a-z]+\/([a-z]+)/i);
  return match ? match[1].slice(0, 2) : "en";
};

const LanguageSwitcher = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCode, setCurrentCode] = useState(() => readActiveLanguage());

  useEffect(() => {
    const stored = readActiveLanguage();
    setCurrentCode(stored);

    // If the user previously chose a non-English language but the googtrans
    // cookie is missing (cleared, new browser session, etc.), restore it so
    // the widget picks up the choice on this load.
    if (stored !== "en") {
      const cookieMatch = document.cookie.match(/googtrans=\/[a-z]+\/([a-z]+)/i);
      const cookieLang = cookieMatch ? cookieMatch[1].slice(0, 2) : null;
      if (cookieLang !== stored) {
        setGoogtransCookie(`/en/${stored}`);
        // Try the in-page swap; if the widget hasn't booted yet, the cookie
        // we just set will take effect on the next reload the user triggers.
        triggerWidget(stored);
      }
    }
  }, []);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) ||
    SUPPORTED_LANGUAGES[0];

  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  const handleSelect = (code) => {
    close();
    if (code === currentCode) return;
    setCurrentCode(code);
    switchLanguage(code);
  };

  return (
    <>
      <Button
        size="small"
        variant="text"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={<FiGlobe size={14} />}
        endIcon={
          <FiChevronDown
            size={12}
            style={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        }
        sx={{
          borderRadius: 999,
          minWidth: 0,
          color: "inherit",
          bgcolor: "rgba(255,255,255,0.15)",
          border: "1px solid",
          borderColor: "rgba(255,255,255,0.2)",
          fontWeight: 600,
          "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
        }}
      >
        <span className="notranslate" translate="no">
          {current.native}
        </span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 160,
              bgcolor: "var(--app-surface-strong)",
              border: "1px solid var(--app-border)",
              boxShadow: "var(--app-shadow)",
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const selected = lang.code === currentCode;
          return (
            <MenuItem
              key={lang.code}
              selected={selected}
              onClick={() => handleSelect(lang.code)}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                {selected ? <FiCheck size={14} /> : null}
              </ListItemIcon>
              <Typography
                variant="body2"
                className="notranslate"
                translate="no"
                sx={{ fontWeight: selected ? 700 : 500 }}
              >
                {lang.native}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
