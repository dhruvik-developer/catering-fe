import { createSlice } from "@reduxjs/toolkit";

/**
 * UI-only theme state. The primary color is mirrored here from the business
 * profile API (see App.jsx applyPrimaryColor), and also propagated to the
 * --color-primary CSS custom property so existing Tailwind pages keep working
 * during the MUI migration.
 */
const DEFAULT_PRIMARY_COLOR = "#845cbd";

const initialState = {
  primaryColor: DEFAULT_PRIMARY_COLOR,
  mode: "light", // "light" | "dark"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setPrimaryColor(state, action) {
      state.primaryColor = action.payload || DEFAULT_PRIMARY_COLOR;
    },
    setMode(state, action) {
      state.mode = action.payload === "dark" ? "dark" : "light";
    },
    toggleMode(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { setPrimaryColor, setMode, toggleMode } = themeSlice.actions;
export { DEFAULT_PRIMARY_COLOR };
export default themeSlice.reducer;
