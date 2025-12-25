import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "overview", // for left sidebar
  isSettingsOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
  },
});

export const { setActiveTab, toggleSettings } = uiSlice.actions;

export default uiSlice.reducer;
