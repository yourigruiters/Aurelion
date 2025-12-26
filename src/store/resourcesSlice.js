import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  population: 0,
  resources: {
    food: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    gold: 0,
  },
  daysPassed: 0,
  gameStartTime: null,
  rates: {
    population: 0,
    food: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    gold: 0,
  },
  modifiers: {
    food: 1,
    wood: 1,
    stone: 1,
    iron: 1,
    gold: 1,
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
      // Simulate resource generation based on rates and modifiers
      Object.keys(state.resources).forEach((key) => {
        if (state.rates[key]) {
          const modifier = state.modifiers[key] || 1;
          state.resources[key] += state.rates[key] * modifier;
        }
      });
      // Population growth if rate exists
      if (state.rates.population) {
        state.population += state.rates.population;
      }
    },
    initializeResources: (state, action) => {
      const { region, bonus } = action.payload;

      // Set initial base values
      state.population = 10; // Default starting pop
      state.resources = {
        food: 100,
        wood: 100,
        stone: 50,
        iron: 0,
        gold: 50,
      };
      state.rates = {
        population: 0,
        food: 10,
        wood: 5,
        stone: 0,
        iron: 0,
        gold: 0,
      };
      state.gameStartTime = Date.now();

      // Apply Bonus
      if (bonus === "Building") {
        state.resources.food += 100;
        state.resources.wood += 100;
        state.resources.stone += 100;
      } else if (bonus === "Gathering") {
        state.population += 15;
      } else if (bonus === "Fighting") {
        state.resources.iron += 50;
        state.resources.gold += 50;
      }

      // Apply Region Modifiers
      if (region === "Forest Realm") {
        state.modifiers.wood = 1.25;
      } else if (region === "Riverlands") {
        state.modifiers.food = 1.25;
      } else if (region === "Highland pass") {
        state.modifiers.stone = 1.15;
        state.modifiers.iron = 1.15;
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
    resetResources: () => initialState,
  },
});

export const {
  updateResource,
  tickResources,
  advanceDay,
  setRate,
  initializeResources,
  resetResources,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
