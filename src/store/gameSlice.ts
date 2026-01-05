import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Focus, GameState, Region } from "../types";

const initialState: GameState = {
  gameStarted: false,
  cityName: "",
  region: "" as Region, // "Forest Realm", "Riverlands", "Highland pass"
  focus: "" as Focus, // "Building", "Gathering", "Fighting"
  dayTime: 0,
  level: 1,
  experience: 0,
  maxExperience: 100,
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
      state.dayTime = 0;
      state.level = 1;
      state.experience = 0;
      state.maxExperience = 100;
    },
    tickTime: (state, action: PayloadAction<number>) => {
      state.dayTime += action.payload;
    },
    resetDayTime: (state) => {
      state.dayTime = 0;
    },
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      if (state.experience >= state.maxExperience) {
        state.level += 1;
        state.experience -= state.maxExperience;
        state.maxExperience = Math.floor(state.maxExperience * 1.5);
      }
    },
    resetGame: () => {
      return initialState;
    },
  },
});

export const { startGame, tickTime, resetDayTime, resetGame } =
  gameSlice.actions;

export default gameSlice.reducer;
