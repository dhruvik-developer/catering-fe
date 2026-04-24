import { createTheme } from "@mui/material/styles";

/**
 * Build an MUI theme from a primary hex color and mode.
 *
 * - MUI auto-generates `light`, `dark`, and `contrastText` shades for the
 *   palette.primary entry, so the caller only needs to supply `main`.
 * - Border radius, shadows and spacing stay consistent across the app by
 *   defining them here once.
 */
export function createAppTheme({ primaryColor = "#845cbd", mode = "light" } = {}) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: isLight ? "#f5f5f5" : "#0f172a",
        paper: isLight ? "#ffffff" : "#1e293b",
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: [
        "Inter",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ].join(","),
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    shadows: [
      "none",
      "0 1px 2px 0 rgba(0,0,0,0.04)",
      "0 2px 6px -1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      "0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
      "0 6px 16px -4px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
      // MUI expects 25 shadows; re-use the last one for the rest.
      ...Array(20).fill(
        "0 10px 24px -8px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)"
      ),
    ],
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingInline: 16,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${isLight ? "#f1f5f9" : "#334155"}`,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 1,
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
          variant: "outlined",
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  });
}

export default createAppTheme;
