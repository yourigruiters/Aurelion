import { AppThunk } from "./store";
import { advanceDay, updateResource } from "./resourcesSlice";
import { resetDayTime, addExperience } from "./gameSlice";
import {
  generateDailyActivities,
  addToHistory,
  clearActiveSafeActivity,
  updateRiskyActivityStatus,
  clearActiveRiskyActivity,
  ActivityLogEntry,
} from "./activitiesSlice";
import { addReport, DailyReport, NightEvent } from "./reportsSlice";
import { Resources } from "../types";

// Simple Night Event Generator
const generateNightEvent = (): NightEvent | undefined => {
  const roll = Math.random();
  if (roll < 0.7) return undefined; // 70% chance of quiet night

  if (roll < 0.8) {
    return {
      title: "Minor Storm",
      description: "A storm passed through, damaging some supplies.",
      effect: { wood: -5 },
    };
  } else if (roll < 0.9) {
    return {
      title: "Wandering Trader",
      description: "A trader left some goods behind.",
      effect: { gold: 10 },
    };
  } else {
    return {
      title: "Wolf Attack",
      description: "Wolves attacked the food stores.",
      effect: { food: -10 },
    };
  }
};

export const handleDayRollover = (): AppThunk => (dispatch, getState) => {
  // 0. Snapshot State & Setup
  const state = getState();
  const prevResources = { ...state.resources.resources };
  const prevLevel = state.game.level;
  const prevExp = state.game.experience;
  const { activeSafeActivity, activeRiskyActivity } = state.activities;
  const { daysPassed, assignments } = state.resources;
  const completedActivities: ActivityLogEntry[] = [];

  // 1. Process Active Safe Activity
  if (activeSafeActivity) {
    // Safe activities are always successful at end of day
    // Add Rewards
    Object.entries(activeSafeActivity.baseReward).forEach(([key, amount]) => {
      dispatch(updateResource({ resource: key as keyof Resources, amount }));
    });

    // Add XP
    if (activeSafeActivity.xp) {
      dispatch(addExperience(activeSafeActivity.xp));
    }

    // Log History
    const logEntry: ActivityLogEntry = {
      id: activeSafeActivity.id,
      name: activeSafeActivity.name,
      day: daysPassed, // Completed on this day
      type: "safe",
      result: "success",
      rewards: activeSafeActivity.baseReward,
    };
    dispatch(addToHistory(logEntry));
    completedActivities.push(logEntry);

    // Clear
    dispatch(clearActiveSafeActivity());
  }

  // 2. Process Active Risky Activity
  if (activeRiskyActivity) {
    const newRemaining = (activeRiskyActivity.remainingDays || 0) - 1;

    if (newRemaining > 0) {
      // Just update remaining days
      dispatch(updateRiskyActivityStatus({ remainingDays: newRemaining }));
    } else {
      // Expedition Finished - Calculate Outcome

      // Calculate User Power (Warrior * 10) - duplicating logic from Activities.tsx roughly
      const warriorCount = assignments["Warrior"] || 0;
      const userPower = warriorCount * 10;
      const enemyPower = activeRiskyActivity.enemyPower || 0;

      let winChance = 0;
      if (userPower >= enemyPower) winChance = 0.95;
      else if (userPower > 0) winChance = userPower / enemyPower;

      // RNG Roll
      const roll = Math.random();
      const success = roll < winChance;

      if (success) {
        // Grant Rewards
        Object.entries(activeRiskyActivity.baseReward).forEach(
          ([key, amount]) => {
            dispatch(
              updateResource({ resource: key as keyof Resources, amount })
            );
          }
        );

        // Add XP
        if (activeRiskyActivity.xp) {
          dispatch(addExperience(activeRiskyActivity.xp));
        }

        const logEntry: ActivityLogEntry = {
          id: activeRiskyActivity.id,
          name: activeRiskyActivity.name,
          day: daysPassed,
          type: "risky",
          result: "success",
          rewards: activeRiskyActivity.baseReward,
        };
        dispatch(addToHistory(logEntry));
        completedActivities.push(logEntry);
      } else {
        // Failure
        const logEntry: ActivityLogEntry = {
          id: activeRiskyActivity.id,
          name: activeRiskyActivity.name,
          day: daysPassed,
          type: "risky",
          result: "failure",
          rewards: {},
          losses: {},
        };
        dispatch(addToHistory(logEntry));
        completedActivities.push(logEntry);
      }

      // Clear Active Risky
      dispatch(clearActiveRiskyActivity());
    }
  }

  // 3. Night Event
  const nightEvent = generateNightEvent();
  if (nightEvent && nightEvent.effect) {
    Object.entries(nightEvent.effect).forEach(([key, amount]) => {
      dispatch(updateResource({ resource: key as keyof Resources, amount }));
    });
  }

  // 4. Advance Day (Production)
  dispatch(advanceDay());
  dispatch(resetDayTime());

  // 5. Generate New Activities
  dispatch(generateDailyActivities({ day: daysPassed + 1 }));

  // 6. Generate Report
  // Calculate Deltas
  const newState = getState();
  const newResources = newState.resources.resources;
  const resourcesGained: Partial<Resources> = {};

  (Object.keys(newResources) as Array<keyof Resources>).forEach((key) => {
    const diff = newResources[key] - prevResources[key];
    if (diff !== 0) {
      resourcesGained[key] = diff;
    }
  });

  // Calculate XP gained
  // Note: if level up happened, exp might calculate negatively if we just do new - old.
  // Proper way needs to account for level up, but for now let's just show raw exp difference or just current level
  // Actually the requirement is "Level gain information"
  const newLevel = newState.game.level;
  const newExp = newState.game.experience;
  // A simple approximation if level didn't change: new - old.
  // If level changed, it's harder. Let's just track level.

  const report: DailyReport = {
    id: `day-${daysPassed + 1}`,
    day: daysPassed + 1,
    date: `Day ${daysPassed + 1}`,
    resourcesGained,
    nightEvent,
    activitiesCompleted: completedActivities,
    levelInfo: {
      level: newLevel,
      expGained: newLevel > prevLevel ? 0 : newExp - prevExp, // Simplified
    },
    constructionQueue: [], // Mock for now
    read: false,
  };

  dispatch(addReport(report));
};
