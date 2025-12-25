import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  population: 10,
  happiness: 100,
  resources: {
    food: 100,
    wood: 100,
    stone: 50,
    iron: 0,
    gold: 50,
  },
  rates: {
    food: 0,
    wood: 0,
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
    },
    setRate: (state, action) => {
      const { resource, rate } = action.payload;
      if (state.rates[resource] !== undefined) {
        state.rates[resource] = rate;
      }
    },
  },
});

export const { updateResource, tickResources, setRate } =
  resourcesSlice.actions;

export default resourcesSlice.reducer;
