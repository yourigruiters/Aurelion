import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Castle,
  Wheat,
  Fish,
  Axe,
  Pickaxe,
  Hammer,
  Store,
  Shield,
} from "lucide-react";

// --- Types ---

export type BuildingId =
  | "town_keep"
  | "wheat_fields"
  | "fishermans_hut"
  | "lumberjacks_camp"
  | "deep_mine"
  | "the_forge"
  | "trade_post"
  | "garrison";

export type HouseType = "none" | "cottage" | "homestead";

export interface BuildingDefinition {
  id: BuildingId;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: Record<string, number>; // e.g. { wood: 100, stone: 50 }
  costScaling: number; // multiplier per level
  baseTime: number; // in seconds (for display mostly) - keeping for legacy or animation
  buildTimeDays: number; // New: In game days
  requiredLevel: number; // New: Player level required
  experience: number; // New: XP gained
  effectDescription: string;
  icon: any; // LucideIcon
}

export interface BuildingInstance {
  level: number;
  unlocked: boolean;
}

export interface QueuedConstruction {
  id: string;
  buildingId: string; // "town_keep" or "1" (plotId)
  type:
    | "building_upgrade"
    | "building_unlock"
    | "house_construct"
    | "house_upgrade";
  targetLevel?: number;
  targetHouseType?: HouseType;
  remainingDays: number;
  name: string;
  totalDays: number;
}

export interface BuildingsState {
  buildings: Record<BuildingId, BuildingInstance>;
  housing: Record<number, { type: HouseType; populationCap: number }>;
  constructionQueue: QueuedConstruction[];
}

// --- Data ---

export const BUILDING_DEFINITIONS: Record<BuildingId, BuildingDefinition> = {
  town_keep: {
    id: "town_keep",
    name: "Town Keep",
    description:
      "The heart of your settlement. Upgrading allows for more advanced structures.",
    maxLevel: 10,
    baseCost: { wood: 500, stone: 200, gold: 100 },
    costScaling: 1.5,
    baseTime: 60,
    buildTimeDays: 2,
    requiredLevel: 1,
    experience: 50,
    effectDescription: "Unlocks new buildings and increases global efficiency.",
    icon: Castle,
  },
  wheat_fields: {
    id: "wheat_fields",
    name: "Wheat Fields",
    description: "Expansive fields to feed your growing population.",
    maxLevel: 5,
    baseCost: { wood: 50, gold: 10 },
    costScaling: 1.4,
    baseTime: 30,
    buildTimeDays: 1,
    requiredLevel: 1,
    experience: 20,
    effectDescription: "+20% Food production per level.",
    icon: Wheat,
  },
  fishermans_hut: {
    id: "fishermans_hut",
    name: "Fisherman's Hut",
    description: "A small dock for coastal fishing.",
    maxLevel: 5,
    baseCost: { wood: 80, gold: 15 },
    costScaling: 1.4,
    baseTime: 30,
    buildTimeDays: 1,
    requiredLevel: 2,
    experience: 25,
    effectDescription: "+20% Fish production per level.",
    icon: Fish,
  },
  lumberjacks_camp: {
    id: "lumberjacks_camp",
    name: "Lumberjack's Camp",
    description: "Dedicated to felling trees and processing timber.",
    maxLevel: 5,
    baseCost: { wood: 50, food: 50 },
    costScaling: 1.4,
    baseTime: 45,
    buildTimeDays: 1,
    requiredLevel: 1,
    experience: 20,
    effectDescription: "+20% Wood production per level.",
    icon: Axe,
  },
  deep_mine: {
    id: "deep_mine",
    name: "Deep Mine",
    description: "Shafts dug deep into the earth to extract precious ores.",
    maxLevel: 5,
    baseCost: { wood: 200, food: 100 },
    costScaling: 1.6,
    baseTime: 90,
    buildTimeDays: 2,
    requiredLevel: 3,
    experience: 40,
    effectDescription: "+20% Stone and Iron production per level.",
    icon: Pickaxe,
  },
  the_forge: {
    id: "the_forge",
    name: "The Forge",
    description: "Where raw metal is shaped into tools and weapons.",
    maxLevel: 5,
    baseCost: { wood: 300, stone: 100, iron: 50 },
    costScaling: 1.5,
    baseTime: 120,
    buildTimeDays: 3,
    requiredLevel: 4,
    experience: 60,
    effectDescription:
      "Increases tool quality and military equipment production.",
    icon: Hammer,
  },
  trade_post: {
    id: "trade_post",
    name: "Trade Post",
    description: "A hub for merchants to exchange goods.",
    maxLevel: 5,
    baseCost: { wood: 400, stone: 200, gold: 200 },
    costScaling: 1.5,
    baseTime: 60,
    buildTimeDays: 2,
    requiredLevel: 3,
    experience: 45,
    effectDescription: "Improves trade rates and market access.",
    icon: Store,
  },
  garrison: {
    id: "garrison",
    name: "Garrison",
    description: "Barracks for your soldiers and guards.",
    maxLevel: 5,
    baseCost: { wood: 500, stone: 300, iron: 100 },
    costScaling: 1.5,
    baseTime: 180,
    buildTimeDays: 3,
    requiredLevel: 2,
    experience: 50,
    effectDescription: "Increases max standing army and defense.",
    icon: Shield,
  },
};

const initialState: BuildingsState = {
  buildings: {
    town_keep: { level: 1, unlocked: true },
    wheat_fields: { level: 1, unlocked: true },
    fishermans_hut: { level: 1, unlocked: true },
    lumberjacks_camp: { level: 1, unlocked: true },
    deep_mine: { level: 1, unlocked: false },
    the_forge: { level: 1, unlocked: false },
    trade_post: { level: 1, unlocked: false },
    garrison: { level: 1, unlocked: false },
  },
  housing: {
    1: { type: "cottage", populationCap: 4 },
    2: { type: "none", populationCap: 0 },
    3: { type: "none", populationCap: 0 },
    4: { type: "none", populationCap: 0 },
  },
  constructionQueue: [],
};

export const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {
    upgradeBuilding: (state, action: PayloadAction<BuildingId>) => {
      const id = action.payload;
      const building = state.buildings[id];
      if (building && building.level < BUILDING_DEFINITIONS[id].maxLevel) {
        building.level += 1;
      }
    },
    constructHouse: (
      state,
      action: PayloadAction<{ plotId: number; type: HouseType }>
    ) => {
      const { plotId, type } = action.payload;
      if (state.housing[plotId]) {
        state.housing[plotId].type = type;
        // Set caps based on type
        if (type === "cottage") state.housing[plotId].populationCap = 4;
        if (type === "homestead") state.housing[plotId].populationCap = 10;
        if (type === "none") state.housing[plotId].populationCap = 0;
      }
    },
    upgradeHouse: (state, action: PayloadAction<number>) => {
      const plotId = action.payload;
      if (state.housing[plotId] && state.housing[plotId].type === "cottage") {
        state.housing[plotId].type = "homestead";
        state.housing[plotId].populationCap = 10;
      }
    },
    unlockBuilding: (state, action: PayloadAction<BuildingId>) => {
      const id = action.payload;
      if (state.buildings[id]) {
        state.buildings[id].unlocked = true;
      }
    },
    addToQueue: (state, action: PayloadAction<QueuedConstruction>) => {
      state.constructionQueue.push(action.payload);
    },
    updateQueueItem: (
      state,
      action: PayloadAction<{ id: string; remainingDays: number }>
    ) => {
      const { id, remainingDays } = action.payload;
      const index = state.constructionQueue.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.constructionQueue[index].remainingDays = remainingDays;
      }
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.constructionQueue = state.constructionQueue.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  upgradeBuilding,
  constructHouse,
  upgradeHouse,
  unlockBuilding,
  addToQueue,
  updateQueueItem,
  removeFromQueue,
} = buildingsSlice.actions;

export default buildingsSlice.reducer;
