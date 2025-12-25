import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSettingsOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
  },
});

export const { toggleSettings } = uiSlice.actions;

export default uiSlice.reducer;
