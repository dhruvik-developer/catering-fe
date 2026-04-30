import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { FiGlobe, FiCheck, FiChevronDown } from "react-icons/fi";
import { SUPPORTED_LANGUAGES } from "../../i18n";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const currentCode = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) ||
    SUPPORTED_LANGUAGES[0];

  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    close();
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
        {current.native}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            bgcolor: "var(--app-surface-strong)",
            border: "1px solid var(--app-border)",
            boxShadow: "var(--app-shadow)",
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
