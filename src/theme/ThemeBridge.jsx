/* eslint-disable react/prop-types */
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./createAppTheme";
import { BASE_PATH } from "../utils/Config";

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

    // Dynamically update favicon color
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Tint the image
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Force favicon refresh by removing the old link and adding a new one
      const oldLinks = document.querySelectorAll("link[rel~='icon']");
      oldLinks.forEach((link) => document.head.removeChild(link));

      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.type = "image/png";
      newLink.href = canvas.toDataURL("image/png");
      document.head.appendChild(newLink);
    };

    // Use absolute URL to be safe, including BASE_PATH if it exists
    img.src = window.location.origin + BASE_PATH + "/food.png";
  }, [primaryColor, theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

export default ThemeBridge;
