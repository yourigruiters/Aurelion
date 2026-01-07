import { AppThunk } from "./store";
import {
  advanceDay,
  deductResources,
  updateResource,
  updatePopulation,
  setAssignments,
} from "./resourcesSlice";
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
  BUILDING_DEFINITIONS,
} from "./buildingsSlice";
import { setRightSidebarOpen } from "./gameSlice";
import {
  progressResearch,
  completeResearch,
  MILITARY_TECHS,
} from "./militarySlice";

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
  const completedConstructions: { name: string; xp: number }[] = [];

  // Track research completion for report
  let completedResearchInfo: { name: string; xp: number } | null = null;

  // Helper: Process Population Loss with Priority (Idle -> Warrior -> Random)
  const processPopulationLoss = (amount: number) => {
    // We must fetch FRESH state because this might run after consumption/other updates
    const currentState = getState();
    const currentPop = currentState.resources.population;
    const currentAssignments = { ...currentState.resources.assignments };

    const actualLoss = Math.min(amount, currentPop);
    if (actualLoss <= 0) return 0;

    // First, calculate how much population is currently assigned
    const totalAssigned = Object.values(currentAssignments).reduce(
      (sum, val) => sum + val,
      0
    );
    const idleCount = currentPop - totalAssigned;

    // Remaining loss after taking from idle
    // Logical Step: We update total population at the end.
    // If we lose 5 people and have 10 idle, we just reduce total pop by 5. Assignments untouched.
    // If we lose 5 people and have 2 idle, we reduce total pop by 5. We must reduce assignments by 3.
    let assignmentsToRemove = Math.max(0, actualLoss - idleCount);

    if (assignmentsToRemove > 0) {
      // 1. Remove Warriors first
      const warriorCount = currentAssignments["Warrior"] || 0;
      const warriorsRemoved = Math.min(assignmentsToRemove, warriorCount);
      if (warriorsRemoved > 0) {
        currentAssignments["Warrior"] -= warriorsRemoved;
        assignmentsToRemove -= warriorsRemoved;
      }

      // 2. Remove Random others if needed
      while (assignmentsToRemove > 0) {
        const availableRoles = Object.keys(currentAssignments).filter(
          (r) => currentAssignments[r] > 0
        );

        if (availableRoles.length === 0) break; // Should not happen if logic matches

        const randomRole =
          availableRoles[Math.floor(Math.random() * availableRoles.length)];
        currentAssignments[randomRole] -= 1;
        assignmentsToRemove -= 1;
      }

      // Update assignments only if changed
      dispatch(setAssignments(currentAssignments));
    }

    // Always update total population
    dispatch(updatePopulation(-actualLoss));

    return actualLoss;
  };

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

      const enemyPower =
        activeRiskyActivity.actualEnemyPower ||
        activeRiskyActivity.enemyPower ||
        0;

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
        // Failure - Lose 10% of Population
        // "Lose 10% of population (floored) when failing"
        const currentPop = getState().resources.population; // Get fresh pop in case of weirdness

        let rawLoss = Math.floor(currentPop * 0.1);
        // Ensure at least 1 loss if pop > 0
        if (rawLoss === 0 && currentPop > 0) {
          rawLoss = 1;
        }

        const populationLost = processPopulationLoss(rawLoss);

        const logEntry: ActivityLogEntry = {
          id: activeRiskyActivity.id,
          name: activeRiskyActivity.name,
          day: daysPassed,
          type: "risky",
          result: "failure",
          rewards: {},
          losses: {},
          populationLost,
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
      let xpGained = 0;
      // Construction Complete!
      if (item.type === "building_upgrade") {
        dispatch(upgradeBuilding(item.buildingId as BuildingId));
        // Add XP for upgrade
        const def = BUILDING_DEFINITIONS[item.buildingId as BuildingId];
        if (def) xpGained = def.experience;
      } else if (item.type === "building_unlock") {
        dispatch(unlockBuilding(item.buildingId as BuildingId));
        // Add XP for unlock
        const def = BUILDING_DEFINITIONS[item.buildingId as BuildingId];
        if (def) xpGained = def.experience;
      } else if (item.type === "house_construct") {
        dispatch(
          constructHouse({
            plotId: parseInt(item.buildingId),
            type: item.targetHouseType!,
          })
        );
        // Add XP for house construct (Small amount?)
        xpGained = 5;
      } else if (item.type === "house_upgrade") {
        dispatch(upgradeHouse(parseInt(item.buildingId)));
        // Add XP for house upgrade
        xpGained = 10;
      }

      if (xpGained > 0) {
        dispatch(addExperience(xpGained));
      }

      completedConstructions.push({ name: item.name, xp: xpGained });
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

      const xpGained = tech.experience || 0;
      completedResearchInfo = { name: tech.name, xp: xpGained };

      if (xpGained > 0) {
        dispatch(addExperience(xpGained));
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

  // 6. Starvation Logic
  // Check fresh state after advanceDay
  const stateAfterAdvance = getState();
  const currentFood = stateAfterAdvance.resources.resources.food;
  const currentPop = stateAfterAdvance.resources.population;
  let starvationEvent: DailyReport["starvation"] | undefined = undefined;

  if (currentFood < 0) {
    // Reset food to 0? Or leave it negative?
    // User didn't specify, but usually we reset if we apply penalty.
    // Let's reset food to 0 to prevent death spiral accumulation,
    // as the penalty is the "cost".
    // Reset food to 0? Or leave it negative?
    // User requested food should go under 0.
    // We do NOT reset it.

    if (currentPop > 0) {
      // Scenario 1: Remove Population
      // Use helper to prioritize warriors/assignments
      processPopulationLoss(1);

      starvationEvent = {
        type: "population",
        message: "A villager died of starvation.",
      };
    } else {
      // Scenario 2: Remove Random Resources (if Pop is 0)
      // "resources (even gold) randomly selected by a logical percentage"
      const availableResources = Object.entries(
        stateAfterAdvance.resources.resources
      ).filter(([key, val]) => val > 0 && key !== "food"); // Exclude food as it's 0 (or negative we just fixed)

      if (availableResources.length > 0) {
        const randomRes =
          availableResources[
            Math.floor(Math.random() * availableResources.length)
          ];
        const resKey = randomRes[0] as keyof Resources;
        const resVal = randomRes[1];
        const lossAmount = Math.ceil(resVal * 0.2); // 20% loss

        if (lossAmount > 0) {
          dispatch(updateResource({ resource: resKey, amount: -lossAmount }));
          starvationEvent = {
            type: "resources",
            message: `Starvation caused chaos! Lost ${lossAmount} ${resKey}.`,
          };
        }
      } else {
        starvationEvent = {
          type: "resources",
          message: "Starvation persists, but there is nothing left to lose.",
        };
      }
    }
  }

  // 7. Generate New Activities
  dispatch(generateDailyActivities({ day: daysPassed + 1 }));

  // 8. Generate Report
  // Calculate Deltas from snapshot vs FINAL state
  // We need to compare stateAfterAdvance (plus penalties) vs prevResources
  // But wait, `resourceGained` is usually calculated based on `advanceDay` production.
  // If we subtract penalties, our `resourcesGained` might show negative or less positive.
  // That is correct.

  const finalState = getState();
  const finalResources = finalState.resources.resources;
  const resourcesGained: Partial<Resources> = {};

  (Object.keys(finalResources) as Array<keyof Resources>).forEach((key) => {
    // We compare against the very start of the tick `prevResources`
    const diff = finalResources[key] - prevResources[key];
    if (diff !== 0) {
      resourcesGained[key] = diff;
    }
  });

  const newLevel = finalState.game.level;
  const newExp = finalState.game.experience;

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
    completedResearch: completedResearchInfo,
    activeResearchSnapshot: getState().military.activeResearch,
    starvation: starvationEvent,
  };

  dispatch(addReport(report));
};
