import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameState } from "../types";

const initialState: GameState = {
  gameStarted: false,
  cityName: "",
  region: "", // "Forest Realm", "Riverlands", "Highland pass"
  focus: "", // "Building", "Gathering", "Fighting"
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<GameState>) => {
      const { cityName, region, focus } = action.payload;
      state.gameStarted = true;
      state.cityName = cityName;
      state.region = region;
      state.focus = focus;
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const { startGame, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
