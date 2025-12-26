import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameState } from "../types";

const initialState: GameState = {
  gameStarted: false,
  cityName: "",
  region: "", // "Forest Realm", "Riverlands", "Highland pass"
  bonus: "", // "Building", "Gathering", "Fighting"
  mode: "", // "Friendly", "Aggressive"
  speed: "", // "Active", "Regular", "Idle"
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<GameState>) => {
      const { cityName, region, bonus, mode, speed } = action.payload;
      state.gameStarted = true;
      state.cityName = cityName;
      state.region = region;
      state.bonus = bonus;
      state.mode = mode;
      state.speed = speed;
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const { startGame, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
