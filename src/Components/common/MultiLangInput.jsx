import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { SUPPORTED_LANGUAGES } from "../../i18n";

/**
 * MultiLangInput
 * -----------------
 * Renders one input per supported language inside a tabbed UI so users can
 * enter the same field (e.g. dish name) in English / Gujarati / Hindi.
 *
 * value:    { en: "...", gu: "...", hi: "..." }
 * onChange: (next) => void   // called with the full updated object
 *
 * Submit shape: when the form is sent to the API, transform with
 * buildMultiLangFields("name", value) to get { name_en, name_gu, name_hi }.
 */
const MultiLangInput = ({
  label,
  value = {},
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  placeholder,
  error = false,
  helperText = "",
  fullWidth = true,
}) => {
  const { t, i18n } = useTranslation();

  const initialTab = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const startTab = SUPPORTED_LANGUAGES.find((l) => l.code === initialTab)
    ? initialTab
    : "en";

  const [activeTab, setActiveTab] = useState(startTab);

  const handleChange = (code, text) => {
    onChange({ ...value, [code]: text });
  };

  const filledCount = SUPPORTED_LANGUAGES.filter(
    (l) => (value[l.code] || "").trim().length > 0
  ).length;

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", mb: 0.75 }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {label}
            {required && (
              <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>
                *
              </Box>
            )}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            ({filledCount}/{SUPPORTED_LANGUAGES.length})
          </Typography>
        </Stack>
      )}

      <Box
        sx={{
          border: "1px solid",
          borderColor: error ? "error.main" : "var(--app-border)",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "var(--app-surface-strong)",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            borderBottom: "1px solid var(--app-border)",
            "& .MuiTab-root": {
              minHeight: 36,
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
            },
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const filled = (value[lang.code] || "").trim().length > 0;
            return (
              <Tab
                key={lang.code}
                value={lang.code}
                label={
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: "center" }}
                  >
                    <span>{lang.native}</span>
                    {filled && (
                      <Box
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "success.main",
                        }}
                      />
                    )}
                  </Stack>
                }
              />
            );
          })}
        </Tabs>

        <Box sx={{ p: 1.25 }}>
          <TextField
            value={value[activeTab] || ""}
            onChange={(e) => handleChange(activeTab, e.target.value)}
            placeholder={
              placeholder ||
              t("multilang.namePlaceholder", {
                language:
                  SUPPORTED_LANGUAGES.find((l) => l.code === activeTab)
                    ?.native || activeTab,
              })
            }
            multiline={multiline}
            rows={multiline ? rows : undefined}
            fullWidth
            size="small"
            variant="outlined"
            inputProps={{
              lang: activeTab,
              dir: "ltr",
            }}
          />
        </Box>
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error.main" : "text.disabled"}
          sx={{ mt: 0.5, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

MultiLangInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({
    en: PropTypes.string,
    gu: PropTypes.string,
    hi: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default MultiLangInput;
