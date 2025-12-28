import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resources } from "../types";

export type ActivityType = "safe" | "risky";

export interface ActivityTemplate {
  name: string;
  description: string;
  baseReward: Partial<Resources>;
  riskLevel?: number; // 0 for safe
  enemyPower?: number; // For risky
}

export interface ActivityInstance extends ActivityTemplate {
  id: string; // unique ID for the day
  type: ActivityType;
  isCompleted: boolean;
  result?: "success" | "failure";
  rewardClaimed?: boolean;
}

export interface ActivitiesState {
  dailyActivities: ActivityInstance[];
  lastGenerationDay: number;
}

const SAFE_TEMPLATES: ActivityTemplate[] = [
  {
    name: "Gather Berries",
    description: "Collect wild berries from the forest edge.",
    baseReward: { food: 15 },
  },
  {
    name: "Mend Fences",
    description: "Repair damages to the village perimeter.",
    baseReward: { wood: 10 },
  },
  {
    name: "Help the Mason",
    description: "Assist in moving heavy stones.",
    baseReward: { stone: 5 },
  },
  {
    name: "Forage Herbs",
    description: "Find medicinal plants.",
    baseReward: { food: 10, wood: 5 },
  },
  {
    name: "Clear Debris",
    description: "Clear rubble from the mines.",
    baseReward: { stone: 8, iron: 1 },
  },
];

const RISKY_TEMPLATES: ActivityTemplate[] = [
  {
    name: "Raid Bandit Camp",
    description: "Attack a nearby bandit outpost.",
    baseReward: { gold: 50, food: 50 },
    riskLevel: 30,
    enemyPower: 20,
  },
  {
    name: "Explore Ancient Ruin",
    description: "Search for lost treasures in the ruins.",
    baseReward: { gold: 100, iron: 20 },
    riskLevel: 60,
    enemyPower: 50,
  },
  {
    name: "Hunt Wild Beast",
    description: "Track down a dangerous predator.",
    baseReward: { food: 100, gold: 20 },
    riskLevel: 40,
    enemyPower: 30,
  },
  {
    name: "Defense Patrol",
    description: "Patrol the dangerous borders.",
    baseReward: { gold: 30, iron: 5 },
    riskLevel: 20,
    enemyPower: 15,
  },
  {
    name: "Raid Rival Caravan",
    description: "Ambush a passing trade caravan.",
    baseReward: { gold: 150, wood: 50 },
    riskLevel: 80,
    enemyPower: 80,
  },
];

const initialState: ActivitiesState = {
  dailyActivities: [],
  lastGenerationDay: -1,
};

export const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    generateDailyActivities: (
      state,
      action: PayloadAction<{ day: number }>
    ) => {
      const { day } = action.payload;
      if (day <= state.lastGenerationDay) return;

      // Generate 3 Safe, 2 Risky
      const activities: ActivityInstance[] = [];
      const usedSafe = new Set<number>();
      const usedRisky = new Set<number>();

      // Safe
      while (activities.length < 3) {
        const idx = Math.floor(Math.random() * SAFE_TEMPLATES.length);
        if (!usedSafe.has(idx)) {
          usedSafe.add(idx);
          activities.push({
            ...SAFE_TEMPLATES[idx],
            id: `safe-${day}-${idx}`,
            type: "safe",
            isCompleted: false,
          });
        }
      }

      // Risky
      while (activities.length < 5) {
        const idx = Math.floor(Math.random() * RISKY_TEMPLATES.length);
        if (!usedRisky.has(idx)) {
          usedRisky.add(idx);
          activities.push({
            ...RISKY_TEMPLATES[idx],
            id: `risky-${day}-${idx}`,
            type: "risky",
            isCompleted: false,
          });
        }
      }

      state.dailyActivities = activities;
      state.lastGenerationDay = day;
    },
    completeActivity: (
      state,
      action: PayloadAction<{ id: string; success: boolean }>
    ) => {
      const { id, success } = action.payload;
      const activity = state.dailyActivities.find((a) => a.id === id);
      if (activity) {
        activity.isCompleted = true;
        activity.result = success ? "success" : "failure";
      }
    },
  },
});

export const { generateDailyActivities, completeActivity } =
  activitiesSlice.actions;

export default activitiesSlice.reducer;
