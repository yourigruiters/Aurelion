import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  population: 10,
  resources: {
    food: 100,
    wood: 100,
    stone: 50,
    iron: 0,
    gold: 50,
  },
  daysPassed: 0,
  rates: {
    population: 0,
    food: 10,
    wood: 5,
    stone: 0,
    iron: 0,
    gold: 0,
  },
};

export const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    updateResource: (state, action) => {
      const { resource, amount } = action.payload;
      if (state.resources[resource] !== undefined) {
        state.resources[resource] += amount;
      }
    },
    tickResources: (state) => {
      // Simulate resource generation based on rates
      Object.keys(state.resources).forEach((key) => {
        if (state.rates[key]) {
          state.resources[key] += state.rates[key];
        }
      });
      // Population growth if rate exists
      if (state.rates.population) {
        state.population += state.rates.population;
      }
    },
    advanceDay: (state) => {
      state.daysPassed += 1;
    },
    setRate: (state, action) => {
      const { resource, rate } = action.payload;
      if (state.rates[resource] !== undefined) {
        state.rates[resource] = rate;
      }
    },
  },
});

export const { updateResource, tickResources, advanceDay, setRate } =
  resourcesSlice.actions;

export default resourcesSlice.reducer;
