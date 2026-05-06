import { useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { FiGlobe, FiCheck, FiChevronDown } from "react-icons/fi";
import { SUPPORTED_LANGUAGES } from "../../i18n";
import {
  applyLanguagePreference,
  isSupportedLanguageCode,
  normalizeLanguageCode,
  readActiveLanguagePreference,
} from "../../services/languagePreference";
import {
  getBusinessLanguage,
  updateBusinessLanguage,
} from "../../api/BusinessProfile";
import { isPlatformAdminHost } from "../../services/tenantRuntime";
import { logError } from "../../utils/logger";

/**
 * Language switcher backed by Google's page-translation widget.
 *
 * The selected language is now stored per tenant in the backend and mirrored
 * into localStorage + the googtrans cookie because the Google widget reads
 * from the browser, not directly from our API.
 */

const readActiveLanguage = () => readActiveLanguagePreference("en");

const LanguageSwitcher = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCode, setCurrentCode] = useState(() => readActiveLanguage());

  useEffect(() => {
    const stored = readActiveLanguage();
    setCurrentCode(stored);

    if (stored !== "en") {
      applyLanguagePreference(stored, {
        notify: false,
        reloadIfNeeded: false,
        retryWidget: true,
      });
    }

    if (isPlatformAdminHost()) return undefined;

    let cancelled = false;
    getBusinessLanguage()
      .then((response) => {
        if (cancelled) return;

        const savedLanguage = response?.data?.selected_language;
        if (!isSupportedLanguageCode(savedLanguage)) return;

        const normalizedLanguage = normalizeLanguageCode(savedLanguage);
        setCurrentCode(normalizedLanguage);
        if (normalizedLanguage !== stored) {
          applyLanguagePreference(normalizedLanguage, {
            reloadIfNeeded: false,
            retryWidget: true,
          });
        }
      })
      .catch((error) => {
        logError("Business language load error:", error);
      });

    return () => {
      cancelled = true;
    };
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
    const widgetTriggered = applyLanguagePreference(code, {
      reloadIfNeeded: false,
    });
    const persistLanguage = isPlatformAdminHost()
      ? Promise.resolve()
      : updateBusinessLanguage(code);

    if (!widgetTriggered) {
      persistLanguage.finally(() => window.location.reload());
    }
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
