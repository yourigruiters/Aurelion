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
  assignments: {
    Farmer: 0,
    Fisher: 0,
    Woodcutter: 0,
    Miner: 0,
    Builder: 0,
    Blacksmith: 0,
    Merchant: 0,
    Warrior: 0,
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
    setAssignments: (state, action) => {
      const newAssignments = action.payload; // { farmer: 5, miner: 2, ... }
      state.assignments = newAssignments;

      // Recalculate Rates based on assignments
      // Base rates per role (can be moved to constants later)
      const ROLE_RATES = {
        Farmer: { resource: "food", amount: 1.2 }, // +1.2 Food/tick
        Fisher: { resource: "food", amount: 0.8 }, // +0.8 Food/tick (example)
        Woodcutter: { resource: "wood", amount: 1.0 },
        Miner: {
          resource: "stone",
          amount: 0.5,
          resource2: "iron",
          amount2: 0.1,
        }, // Miner yields stone and some iron
        // Builder: Special case (increases construction speed? for now ignoring or just placeholders)
        // Blacksmith: Tools?
        // Merchant: Gold
        Merchant: { resource: "gold", amount: 0.5 },
      };

      // Reset rates to base (or 0) before applying role rates
      // Assuming base rates (natural generation) are 0 for now, or we preserve them?
      // For simplicity, let's assume rates are purely driven by population for now,
      // EXCEPT maybe base town center production.
      // To play safe, we'll zero them out and re-add.

      let newRates = {
        population: 0,
        food: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        gold: 0,
      };

      // Add base generation (Town Center)?
      // Let's assume some base values if needed, but per user request, it's about roles.
      // We will iterate assignments and sum up.

      Object.entries(newAssignments).forEach(([role, count]) => {
        const rateConfig = ROLE_RATES[role];
        if (rateConfig) {
          if (rateConfig.resource) {
            newRates[rateConfig.resource] += rateConfig.amount * count;
          }
          if (rateConfig.resource2) {
            newRates[rateConfig.resource2] += rateConfig.amount2 * count;
          }
        }
      });

      state.rates = newRates;
    },
  },
});

export const {
  updateResource,
  tickResources,
  advanceDay,
  setRate,
  initializeResources,
  resetResources,
  setAssignments,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
