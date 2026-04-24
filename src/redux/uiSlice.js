import { createSlice } from "@reduxjs/toolkit";

/**
 * UI-only layout state — sidebar visibility and similar chrome concerns.
 * Business state (orders, vendors, etc.) stays in React Query / component
 * state; only pure UI belongs here.
 */
const initialState = {
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action) {
      state.sidebarOpen = Boolean(action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { setSidebarOpen, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
