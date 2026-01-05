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
import { Resources } from "../types";

export const handleDayRollover = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { activeSafeActivity, activeRiskyActivity } = state.activities;
  const { daysPassed, assignments } = state.resources;

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

        dispatch(
          addToHistory({
            id: activeRiskyActivity.id,
            name: activeRiskyActivity.name,
            day: daysPassed,
            type: "risky",
            result: "success",
            rewards: activeRiskyActivity.baseReward,
          })
        );
      } else {
        // Failure - Potential Consequences
        // Logic: 10% chance to lose a warrior?
        // For now, just log failure.
        dispatch(
          addToHistory({
            id: activeRiskyActivity.id,
            name: activeRiskyActivity.name,
            day: daysPassed,
            type: "risky",
            result: "failure",
            rewards: {},
            losses: {}, // Could add params later
          })
        );
      }

      // Clear Active Risky
      dispatch(clearActiveRiskyActivity());
    }
  }

  // 3. Advance Day
  dispatch(advanceDay());
  dispatch(resetDayTime());

  // 4. Generate New Activities
  // Pass next day
  dispatch(generateDailyActivities({ day: daysPassed + 1 }));
};
