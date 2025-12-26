import { createSlice } from "@reduxjs/toolkit";
import { UIState } from "../types";

const initialState: UIState = {
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
