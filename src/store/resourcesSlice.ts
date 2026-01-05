import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResourcesState, Resources, Region, Focus } from "../types";
import { getResourceDetails } from "../helpers/resource";

const initialState: ResourcesState = {
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
    updateResource: (
      state,
      action: PayloadAction<{ resource: keyof Resources; amount: number }>
    ) => {
      const { resource, amount } = action.payload;
      if (state.resources[resource] !== undefined) {
        state.resources[resource] += amount;
      }
    },
    initializeResources: (
      state,
      action: PayloadAction<{ region: Region; focus: Focus }>
    ) => {
      const { region, focus } = action.payload;

      const resourceDetails = getResourceDetails(region, focus);

      state.population = resourceDetails.population;
      state.resources = resourceDetails.resources;
      state.modifiers = resourceDetails.modifiers;
      state.rates = resourceDetails.rates;
      state.gameStartTime = Date.now();
    },
    advanceDay: (state) => {
      state.daysPassed += 1;

      (Object.keys(state.resources) as Array<keyof Resources>).forEach(
        (key) => {
          if (state.rates[key]) {
            // @ts-ignore
            const modifier = state.modifiers[key] || 1;
            console.log(
              state.rates[key],
              modifier,
              state.rates[key] * modifier
            );
            state.resources[key] += state.rates[key] * modifier;
          }
        }
      );
    },
    setRate: (
      state,
      action: PayloadAction<{ resource: keyof Resources; rate: number }>
    ) => {
      const { resource, rate } = action.payload;
      if (state.rates[resource] !== undefined) {
        state.rates[resource] = rate;
      }
    },
    resetResources: () => initialState,
    setAssignments: (state, action: PayloadAction<Record<string, number>>) => {
      const newAssignments = action.payload; // { farmer: 5, miner: 2, ... }
      state.assignments = newAssignments;

      // Recalculate Rates based on assignments
      // Base rates per role
      const ROLE_RATES: Record<string, any> = {
        Farmer: { resource: "food", amount: 12 }, // +12 Food/day
        Fisher: { resource: "food", amount: 8 }, // +8 Food/day
        Woodcutter: { resource: "wood", amount: 10 },
        Miner: {
          resource: "stone",
          amount: 5,
          resource2: "iron",
          amount2: 1,
        },
        // Builder: Construction Speed
        // Blacksmith: Tools
        Merchant: { resource: "gold", amount: 5 },
      };

      // Reset rates to base
      let newRates: Resources = {
        food: 0,
        wood: 0,
        stone: 0,
        iron: 0,
        gold: 0,
      };

      Object.entries(newAssignments).forEach(([role, count]) => {
        const rateConfig = ROLE_RATES[role];
        if (rateConfig) {
          if (rateConfig.resource) {
            // @ts-ignore
            newRates[rateConfig.resource] += rateConfig.amount * count;
          }
          if (rateConfig.resource2) {
            // @ts-ignore
            newRates[rateConfig.resource2] += rateConfig.amount2 * count;
          }
        }
      });

      state.rates = newRates;
    },
    tradeResource: (
      state,
      action: PayloadAction<{
        type: "buy" | "sell";
        resource: keyof Resources | "population";
        amount: number;
        cost: number;
      }>
    ) => {
      const { type, resource, amount, cost } = action.payload;

      if (type === "buy") {
        if (state.resources.gold >= cost) {
          state.resources.gold -= cost;
          if (resource === "population") {
            state.population += amount;
          } else {
            // @ts-ignore
            state.resources[resource] += amount;
          }
        }
      } else if (type === "sell") {
        let currentAmount = 0;
        if (resource === "population") {
          currentAmount = state.population;
        } else {
          // @ts-ignore
          currentAmount = state.resources[resource];
        }

        if (currentAmount >= amount) {
          if (resource === "population") {
            state.population -= amount;
          } else {
            // @ts-ignore
            state.resources[resource] -= amount;
          }
          state.resources.gold += cost;
        }
      }
    },
    deductResources: (state, action: PayloadAction<Partial<Resources>>) => {
      const costs = action.payload;
      Object.entries(costs).forEach(([resource, amount]) => {
        if (state.resources[resource as keyof Resources] !== undefined) {
          // @ts-ignore
          state.resources[resource as keyof Resources] -= amount;
        }
      });
    },
  },
});

export const {
  updateResource,
  advanceDay,
  setRate,
  initializeResources,
  resetResources,
  setAssignments,
  tradeResource,
  deductResources,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
