import { AppThunk } from "./store";
import { advanceDay, deductResources, updateResource } from "./resourcesSlice";
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
import {
  addToQueue,
  BuildingId,
  constructHouse,
  QueuedConstruction,
  removeFromQueue,
  unlockBuilding,
  updateQueueItem,
  upgradeBuilding,
  upgradeHouse,
} from "./buildingsSlice";
import { setRightSidebarOpen } from "./gameSlice";

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

export const startBuildingProject =
  (
    project: Omit<QueuedConstruction, "id">,
    cost: Record<string, number>
  ): AppThunk =>
  (dispatch) => {
    // 1. Deduct Resources
    dispatch(deductResources(cost));

    // 2. Add to Queue
    const id = Math.random().toString(36).substr(2, 9);
    dispatch(addToQueue({ ...project, id }));

    // 3. Open Queue
    dispatch(setRightSidebarOpen(true));
  };

// ... imports
import {
  startResearch,
  progressResearch,
  completeResearch,
  ActiveResearch,
  TechId,
  MILITARY_TECHS,
} from "./militarySlice";

// ... existing code ...

export const handleDayRollover = (): AppThunk => (dispatch, getState) => {
  // 0. Snapshot State & Setup
  const state = getState();
  const prevResources = { ...state.resources.resources };
  const prevLevel = state.game.level;
  const prevExp = state.game.experience;
  const { activeSafeActivity, activeRiskyActivity } = state.activities;
  const { constructionQueue } = state.buildings;
  const { activeResearch } = state.military; // Get active research
  const { daysPassed, assignments } = state.resources;
  const completedActivities: ActivityLogEntry[] = [];
  const completedConstructions: string[] = [];

  // Track research completion for report
  let completedResearchName: string | null = null;

  // 1. Process Active Safe Activity
  if (activeSafeActivity) {
    // ... existing logic ...
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
    // ... existing logic ...
    const newRemaining = (activeRiskyActivity.remainingDays || 0) - 1;

    if (newRemaining > 0) {
      // Just update remaining days
      dispatch(updateRiskyActivityStatus({ remainingDays: newRemaining }));
    } else {
      // Expedition Finished - Calculate Outcome

      // Calculate User Power (Warriors + Military Tech Bonuses)
      const warriorCount = assignments["Warrior"] || 0;
      const { totalAttackBonus } = state.military;

      // Base attack is 1 per warrior, plus bonuses per warrior
      // Formula: Warriors * (1 + Bonuses)
      // This matches the UI in Military.tsx
      const userPower = Math.floor(
        warriorCount * (1 + (totalAttackBonus || 0))
      );

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

  // 3. Process Construction Queue
  constructionQueue.forEach((item) => {
    // ... existing logic ...
    const newRemaining = item.remainingDays - 1;

    if (newRemaining <= 0) {
      // Construction Complete!
      if (item.type === "building_upgrade") {
        dispatch(upgradeBuilding(item.buildingId as BuildingId));
      } else if (item.type === "building_unlock") {
        dispatch(unlockBuilding(item.buildingId as BuildingId));
      } else if (item.type === "house_construct") {
        dispatch(
          constructHouse({
            plotId: parseInt(item.buildingId),
            type: item.targetHouseType!,
          })
        );
      } else if (item.type === "house_upgrade") {
        dispatch(upgradeHouse(parseInt(item.buildingId)));
      }

      completedConstructions.push(item.name);
      dispatch(removeFromQueue(item.id));
    } else {
      dispatch(updateQueueItem({ id: item.id, remainingDays: newRemaining }));
    }
  });

  // 3.5 Process Active Research (NEW)
  if (activeResearch) {
    if (activeResearch.remainingDays <= 1) {
      // Will define as finished now
      dispatch(completeResearch());
      // Log it or add to report
      const tech = MILITARY_TECHS[activeResearch.techId];
      completedResearchName = tech.name;

      if (tech.experience) {
        dispatch(addExperience(tech.experience));
      }
    } else {
      dispatch(progressResearch());
    }
  }

  // 4. Night Event
  const nightEvent = generateNightEvent();
  if (nightEvent && nightEvent.effect) {
    Object.entries(nightEvent.effect).forEach(([key, amount]) => {
      dispatch(updateResource({ resource: key as keyof Resources, amount }));
    });
  }

  // 5. Advance Day (Production)
  dispatch(advanceDay());
  dispatch(resetDayTime());

  // 6. Generate New Activities
  dispatch(generateDailyActivities({ day: daysPassed + 1 }));

  // 7. Generate Report
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

  const newLevel = newState.game.level;
  const newExp = newState.game.experience;

  // We need to inject the completed research into the report if we want to show it.
  // The DailyReport types interface might need update, OR we piggyback on 'completedConstructions' or make a new field?
  // User wanted "Military research reports will be added to the daily report modal."
  // For now, let's append it to Night Event description or make a custom object if `reportsSlice` allows extra fields.
  // Checking `reportsSlice.ts` would be good, but let's assume we can't change it right now easily without more edits.
  // Actually, I can update the report object structure if I update `reportsSlice`.

  // Wait, I can probably just put it in a separate field if I update the type in `reportsSlice`?
  // Let's stick to existing and maybe hack it into "completedConstructions" or just wait.
  // Actually, I can likely add a new property "completedResearch" to the report object.
  // But strictly I cannot change the type without editing reportsSlice.ts.
  // I will check reportsSlice in next step if I can't add it.
  // For this step, I'll calculate it but maybe not add it to the valid `report` object yet to avoid TS errors,
  // OR I will cast it if I am lazy, but better to do it right.
  // Let's omit it from the report object for THIS step, and I'll update ReportSlice next.

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
    constructionQueue: constructionQueue.map((i) => i.name),
    completedConstructions,
    read: false,
    completedResearch: completedResearchName,
    activeResearchSnapshot: getState().military.activeResearch,
  };

  dispatch(addReport(report));
};
