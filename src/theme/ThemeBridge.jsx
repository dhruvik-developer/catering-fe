/* eslint-disable react/prop-types */
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./createAppTheme";

/**
 * Reads primary color + mode from Redux, builds an MUI theme, and exposes it
 * via ThemeProvider. As a bonus, it also mirrors the primary color (and its
 * contrast) to the existing --color-primary / --color-primary-contrast CSS
 * custom properties so every Tailwind page still in the app keeps rendering
 * correctly during the migration.
 */
function ThemeBridge({ children }) {
  const primaryColor = useSelector((s) => s.theme.primaryColor);
  const mode = useSelector((s) => s.theme.mode);

  const theme = useMemo(
    () => createAppTheme({ primaryColor, mode }),
    [primaryColor, mode]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", primaryColor);
    root.style.setProperty(
      "--color-primary-contrast",
      theme.palette.primary.contrastText
    );
  }, [primaryColor, theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

export default ThemeBridge;
