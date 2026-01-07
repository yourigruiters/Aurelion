import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TechId =
  | "basic_weaponry"
  | "leather_armor"
  | "warrior_training" // Renamed from archery
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
    attackBonus?: number; // Per population
    defenseBonus?: number; // Flat
  };
  requires?: TechId[]; // Strict sequence
  researchTimeDays: number; // In game days
  requiredLevel?: number; // Player level
  experience: number; // XP gained
}

export const MILITARY_TECHS: Record<TechId, TechDefinition> = {
  basic_weaponry: {
    id: "basic_weaponry",
    name: "Basic Weaponry",
    description: "Equip your militia with simple swords and spears.",
    cost: { wood: 100, stone: 50 },
    effects: { attackBonus: 1 },
    researchTimeDays: 1,
    requiredLevel: 1,
    experience: 20,
  },
  leather_armor: {
    id: "leather_armor",
    name: "Leather Armor",
    description: "Basic protection for your troops.",
    cost: { wood: 50 },
    effects: { defenseBonus: 30 },
    requires: ["basic_weaponry"],
    researchTimeDays: 1,
    requiredLevel: 1,
    experience: 20,
  },
  warrior_training: {
    id: "warrior_training",
    name: "Warrior Training",
    description: "Advanced combat drills to improve effectiveness.",
    cost: { wood: 200 },
    effects: { attackBonus: 2 },
    requires: ["leather_armor"],
    researchTimeDays: 2,
    requiredLevel: 2,
    experience: 30,
  },
  iron_forging: {
    id: "iron_forging",
    name: "Iron Forging",
    description: "Smith capable iron weapons and tools.",
    cost: { wood: 300, iron: 100 },
    effects: { attackBonus: 3 },
    requires: ["warrior_training"],
    researchTimeDays: 3,
    requiredLevel: 3,
    experience: 50,
  },
  fortifications: {
    id: "fortifications",
    name: "Fortifications",
    description: "Build walls and defensive structures.",
    cost: { stone: 500, iron: 200 },
    effects: { defenseBonus: 50 },
    requires: ["iron_forging"],
    researchTimeDays: 4,
    requiredLevel: 4,
    experience: 80,
  },
};

export interface ActiveResearch {
  techId: TechId;
  remainingDays: number;
  totalDays: number;
}

interface MilitaryState {
  unlockedTechs: TechId[];
  activeResearch: ActiveResearch | null;
  // Stats are calculated derived, but we can store them if cached.
  // For now, let's keep them here as processed values for easy access,
  // BUT the attack depends on population which varies dynamically.
  // So 'attackBonus' and 'defenseBonus' total is better stored here,
  // or just compute it in selectors/activites.
  // User asked for "Left sidebar" calculation.
  // Let's store the TOTAL multipliers here for easy access.
  totalAttackBonus: number; // Sum of all flat bonuses per pop
  totalDefenseBonus: number; // Sum of all flat defense
}

const initialState: MilitaryState = {
  unlockedTechs: [],
  activeResearch: null,
  totalAttackBonus: 0,
  totalDefenseBonus: 0,
};

const calculateStats = (unlockedTechs: TechId[]) => {
  let attackBonus = 0;
  let defenseBonus = 0;
  unlockedTechs.forEach((id) => {
    const tech = MILITARY_TECHS[id];
    if (tech.effects.attackBonus) attackBonus += tech.effects.attackBonus;
    if (tech.effects.defenseBonus) defenseBonus += tech.effects.defenseBonus;
  });
  return { attackBonus, defenseBonus };
};

const militarySlice = createSlice({
  name: "military",
  initialState,
  reducers: {
    startResearch: (state, action: PayloadAction<TechId>) => {
      const techId = action.payload;
      const tech = MILITARY_TECHS[techId];
      // Validation should be done in Thunk, but double check here
      if (!state.activeResearch && !state.unlockedTechs.includes(techId)) {
        state.activeResearch = {
          techId,
          remainingDays: tech.researchTimeDays,
          totalDays: tech.researchTimeDays,
        };
      }
    },
    progressResearch: (state) => {
      if (state.activeResearch) {
        state.activeResearch.remainingDays -= 1;
      }
    },
    completeResearch: (state) => {
      if (state.activeResearch) {
        state.unlockedTechs.push(state.activeResearch.techId);

        // Recalculate
        const stats = calculateStats(state.unlockedTechs);
        state.totalAttackBonus = stats.attackBonus;
        state.totalDefenseBonus = stats.defenseBonus;

        state.activeResearch = null;
      }
    },
    // Debug/Cheat
    instantUnlock: (state, action: PayloadAction<TechId>) => {
      if (!state.unlockedTechs.includes(action.payload)) {
        state.unlockedTechs.push(action.payload);
        const stats = calculateStats(state.unlockedTechs);
        state.totalAttackBonus = stats.attackBonus;
        state.totalDefenseBonus = stats.defenseBonus;
      }
    },
  },
});

export const {
  startResearch,
  progressResearch,
  completeResearch,
  instantUnlock,
} = militarySlice.actions;
export default militarySlice.reducer;
