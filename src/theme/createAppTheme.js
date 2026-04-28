import { createTheme } from "@mui/material/styles";

/**
 * Build an MUI theme from a primary hex color and mode.
 *
 * - MUI auto-generates `light`, `dark`, and `contrastText` shades for the
 *   palette.primary entry, so the caller only needs to supply `main`.
 * - Border radius, shadows and spacing stay consistent across the app by
 *   defining them here once.
 */
export function createAppTheme({
  primaryColor = "#845cbd",
  mode = "light",
} = {}) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: isLight ? "#f6f8fb" : "#0f172a",
        paper: isLight ? "rgba(255,255,255,0.92)" : "#1e293b",
      },
      divider: isLight ? "rgba(148, 163, 184, 0.24)" : "#334155",
      action: {
        hover: isLight ? "rgba(248,250,252,0.86)" : "rgba(255,255,255,0.08)",
        selected: isLight ? "rgba(241,245,249,0.92)" : "rgba(255,255,255,0.12)",
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
            border: `1px solid ${
              isLight ? "rgba(148, 163, 184, 0.24)" : "#334155"
            }`,
            boxShadow: isLight
              ? "0 16px 36px -30px rgba(15, 23, 42, 0.55)"
              : "0 10px 24px -8px rgba(0,0,0,0.35)",
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 1,
        },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backdropFilter: isLight ? "blur(14px)" : undefined,
          },
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
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&.Mui-disabled": {
              WebkitTextFillColor: isLight ? "#000000" : "#ffffff",
              color: isLight ? "#000000" : "#ffffff",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: isLight ? "rgba(0, 0, 0, 0.87)" : "rgba(255, 255, 255, 0.87)",
            },
          },
        },
      },
    },
  });
}

export default createAppTheme;
