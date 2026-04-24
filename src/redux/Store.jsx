import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./FormSlice";
import themeReducer from "./themeSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    theme: themeReducer,
    ui: uiReducer,
  },
});
