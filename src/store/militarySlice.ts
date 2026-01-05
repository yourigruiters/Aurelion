import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TechId =
  | "basic_weaponry"
  | "leather_armor"
  | "archery"
  | "iron_forging"
  | "fortifications";

export interface TechDefinition {
  id: TechId;
  name: string;
  description: string;
  cost: {
    wood?: number;
    stone?: number;
    iron?: number;
    food?: number;
    gold?: number;
  };
  effects: {
    power?: number;
    defense?: number;
  };
  requires?: TechId[];
  researchTimeDays?: number; // In game days
  requiredLevel?: number; // Player level
  experience?: number; // XP gained
}

export const MILITARY_TECHS: Record<TechId, TechDefinition> = {
  basic_weaponry: {
    id: "basic_weaponry",
    name: "Basic Weaponry",
    description: "Equip your militia with simple swords and spears.",
    cost: { wood: 100, stone: 50 },
    effects: { power: 5 },
    researchTimeDays: 1,
    requiredLevel: 1,
    experience: 20,
  },
  leather_armor: {
    id: "leather_armor",
    name: "Leather Armor",
    description: "Basic protection for your troops.",
    cost: { food: 150, wood: 50 },
    effects: { defense: 5 },
    researchTimeDays: 1,
    requiredLevel: 1,
    experience: 20,
  },
  archery: {
    id: "archery",
    name: "Archery",
    description: "Train archers to strike from a distance.",
    cost: { wood: 200 },
    effects: { power: 10 },
    researchTimeDays: 2,
    requiredLevel: 2,
    experience: 30,
  },
  iron_forging: {
    id: "iron_forging",
    name: "Iron Forging",
    description: "Smith capable iron weapons and tools.",
    cost: { wood: 300, iron: 100 },
    effects: { power: 20 },
    requires: ["basic_weaponry"],
    researchTimeDays: 3,
    requiredLevel: 3,
    experience: 50,
  },
  fortifications: {
    id: "fortifications",
    name: "Fortifications",
    description: "Build walls and defensive structures.",
    cost: { stone: 500, iron: 200 },
    effects: { defense: 50 },
    requires: ["iron_forging"],
    researchTimeDays: 4,
    requiredLevel: 4,
    experience: 80,
  },
};

interface MilitaryState {
  unlockedTechs: TechId[];
  militaryPower: number;
  defense: number;
}

const initialState: MilitaryState = {
  unlockedTechs: [],
  militaryPower: 0,
  defense: 0,
};

// Helper to calculate totals based on unlocked techs
const calculateStats = (unlockedTechs: TechId[]) => {
  let power = 0;
  let defense = 0;
  unlockedTechs.forEach((id) => {
    const tech = MILITARY_TECHS[id];
    if (tech.effects.power) power += tech.effects.power;
    if (tech.effects.defense) defense += tech.effects.defense;
  });
  return { power, defense };
};

const militarySlice = createSlice({
  name: "military",
  initialState,
  reducers: {
    unlockTech: (state, action: PayloadAction<TechId>) => {
      const techId = action.payload;
      if (!state.unlockedTechs.includes(techId)) {
        state.unlockedTechs.push(techId);
        // Recalculate stats
        const stats = calculateStats(state.unlockedTechs);
        state.militaryPower = stats.power;
        state.defense = stats.defense;
      }
    },
  },
});

export const { unlockTech } = militarySlice.actions;
export default militarySlice.reducer;
