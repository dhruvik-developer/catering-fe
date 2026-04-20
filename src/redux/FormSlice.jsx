import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dishData: null,
  selectedItems: {},
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setDishData: (state, action) => {
      state.dishData = action.payload;
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
  },
});

export const { setDishData, setSelectedItems } = formSlice.actions;
export default formSlice.reducer;
