import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resources } from "../types";

export type ActivityType = "safe" | "risky";

export interface ActivityTemplate {
  name: string;
  description: string;
  baseReward: Partial<Resources>;
  riskLevel?: number; // 0 for safe
  enemyPower?: number; // For risky
  xp?: number;
  durationDays?: number;
}

export interface ActivityInstance extends ActivityTemplate {
  id: string; // unique ID for the day
  type: ActivityType;
  isCompleted: boolean;
  result?: "success" | "failure";
  rewardClaimed?: boolean;
  remainingDays?: number;
  dayCompleted?: number; // Day number when it finished
}

export interface ActivityLogEntry {
  id: string;
  name: string;
  day: number;
  type: ActivityType;
  result: "success" | "failure";
  rewards: Partial<Resources>;
  losses?: Partial<Resources>; // For risky failures
}

export interface ActivitiesState {
  dailyActivities: ActivityInstance[];
  activeSafeActivity?: ActivityInstance;
  activeRiskyActivity?: ActivityInstance;
  activityLog: ActivityLogEntry[];
}

const SAFE_TEMPLATES: ActivityTemplate[] = [
  {
    name: "Gather Berries",
    description: "Collect wild berries from the forest edge.",
    baseReward: { food: 15 },
    xp: 5,
  },
  {
    name: "Mend Fences",
    description: "Repair damages to the village perimeter.",
    baseReward: { wood: 10 },
    xp: 8,
  },
  {
    name: "Help the Mason",
    description: "Assist in moving heavy stones.",
    baseReward: { stone: 5 },
    xp: 10,
  },
  {
    name: "Forage Herbs",
    description: "Find medicinal plants.",
    baseReward: { food: 10, wood: 5 },
    xp: 7,
  },
  {
    name: "Clear Debris",
    description: "Clear rubble from the mines.",
    baseReward: { stone: 8, iron: 1 },
    xp: 12,
  },
];

const RISKY_TEMPLATES: ActivityTemplate[] = [
  {
    name: "Raid Bandit Camp",
    description: "Attack a nearby bandit outpost.",
    baseReward: { gold: 50, food: 50 },
    riskLevel: 30,
    enemyPower: 20,
    xp: 30,
    durationDays: 2,
  },
  {
    name: "Explore Ancient Ruin",
    description: "Search for lost treasures in the ruins.",
    baseReward: { gold: 100, iron: 20 },
    riskLevel: 60,
    enemyPower: 50,
    xp: 50,
    durationDays: 3,
  },
  {
    name: "Hunt Wild Beast",
    description: "Track down a dangerous predator.",
    baseReward: { food: 100, gold: 20 },
    riskLevel: 40,
    enemyPower: 30,
    xp: 25,
    durationDays: 1,
  },
  {
    name: "Defense Patrol",
    description: "Patrol the dangerous borders.",
    baseReward: { gold: 30, iron: 5 },
    riskLevel: 20,
    enemyPower: 15,
    xp: 15,
    durationDays: 1,
  },
  {
    name: "Raid Rival Caravan",
    description: "Ambush a passing trade caravan.",
    baseReward: { gold: 150, wood: 50 },
    riskLevel: 80,
    enemyPower: 80,
    xp: 80,
    durationDays: 4,
  },
];

const initialState: ActivitiesState = {
  dailyActivities: [],
  activityLog: [],
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

      // Risky - Only generate if no active risky activity is running
      if (!state.activeRiskyActivity) {
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
      }

      // Reset active safe activity on new day generation?
      // User said "remembered in the state for in the future when using it to provide daily information."
      // But typically "Daily" activities reset. We'll keep the activeSafeActivity until it's seemingly replaced or day ends.
      // Actually, let's clear daily selections when generating new ones.
      state.activeSafeActivity = undefined;

      state.dailyActivities = activities;
    },
    startActivity: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const activity = state.dailyActivities.find((a) => a.id === id);
      if (!activity) return;

      if (activity.type === "safe") {
        if (!state.activeSafeActivity) {
          state.activeSafeActivity = activity;
          // Mark as "running" visually? Or just mapped to this state variable.
        }
      } else {
        if (!state.activeRiskyActivity) {
          state.activeRiskyActivity = {
            ...activity,
            remainingDays: activity.durationDays || 1,
            isCompleted: false, // Ensure not completed
          };
        }
      }
    },
    advanceActivityProgress: (state) => {
      if (state.activeRiskyActivity) {
        if (
          state.activeRiskyActivity.remainingDays &&
          state.activeRiskyActivity.remainingDays > 0
        ) {
          state.activeRiskyActivity.remainingDays -= 1;
        }
      }
    },
    completeActivity: (
      state,
      action: PayloadAction<{ id: string; success: boolean }>
    ) => {
      const { id, success } = action.payload;
      // Check active risky
      if (state.activeRiskyActivity && state.activeRiskyActivity.id === id) {
        state.activeRiskyActivity.isCompleted = true;
        state.activeRiskyActivity.result = success ? "success" : "failure";
        state.activeRiskyActivity.remainingDays = 0;
        return;
      }

      // Check daily list (mostly for instant safe ones if we kept old logic, but now safe ones just stick)
      const activity = state.dailyActivities.find((a) => a.id === id);
      if (activity) {
        activity.isCompleted = true;
        activity.result = success ? "success" : "failure";
      }
    },
    addToHistory: (state, action: PayloadAction<ActivityLogEntry>) => {
      state.activityLog.unshift(action.payload); // Add new entry to top
    },
    clearActiveSafeActivity: (state) => {
      state.activeSafeActivity = undefined;
    },
    updateRiskyActivityStatus: (
      state,
      action: PayloadAction<{
        isCompleted?: boolean;
        result?: "success" | "failure";
        remainingDays?: number;
      }>
    ) => {
      if (state.activeRiskyActivity) {
        if (action.payload.isCompleted !== undefined)
          state.activeRiskyActivity.isCompleted = action.payload.isCompleted;
        if (action.payload.result !== undefined)
          state.activeRiskyActivity.result = action.payload.result;
        if (action.payload.remainingDays !== undefined)
          state.activeRiskyActivity.remainingDays =
            action.payload.remainingDays;
      }
    },
    // Clear risky activity from active slot (e.g. after it's done and logged)
    clearActiveRiskyActivity: (state) => {
      state.activeRiskyActivity = undefined;
    },
  },
});

export const {
  generateDailyActivities,
  completeActivity,
  startActivity,
  advanceActivityProgress,
  addToHistory,
  clearActiveSafeActivity,
  updateRiskyActivityStatus,
  clearActiveRiskyActivity,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;
