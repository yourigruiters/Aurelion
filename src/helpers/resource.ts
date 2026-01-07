import { FullResources, Region, Focus } from "../types";

export const getResourceDetails = (
  region?: Region,
  focus?: Focus
): FullResources => {
  const resources: FullResources = {
    population: 3,
    resources: { food: 100, wood: 100, stone: 50, iron: 0, gold: 50 },
    modifiers: { food: 1, wood: 1, stone: 1, iron: 1, gold: 1 },
    rates: {
      food: 0,
      wood: 0,
      stone: 0,
      iron: 0,
      gold: 0,
    },
    bonuses: ["Select your region..", "Select your focus.."],
  };

  if (!region && !focus) {
    return resources;
  }

  resources["bonuses"] = [];

  // Determine modifiers for display textual
  if (region === "Forest Realm") {
    resources.modifiers.wood = 1.25;
    resources.bonuses.push("+25% Wood production");
  } else if (region === "Riverlands") {
    resources.modifiers.food = 1.25;
    resources.bonuses.push("+25% Food production");
  } else if (region === "Highland pass") {
    resources.modifiers.stone = 1.15;
    resources.modifiers.iron = 1.15;
    resources.bonuses.push("+15% Stone & Iron production");
  } else {
    resources.bonuses.push("Select your region..");
  }

  // Apply Base Bonus from selection
  if (focus === "Building") {
    resources.resources.food += 100;
    resources.resources.wood += 100;
    resources.resources.stone += 100;
    resources.bonuses.push("Start with 100 extra Food, Wood and Stone");
  } else if (focus === "Gathering") {
    resources.population += 3;
    resources.bonuses.push("Start with a homestead and 6 population");
  } else if (focus === "Fighting") {
    resources.resources.iron += 50;
    resources.resources.gold += 50;
    resources.bonuses.push("Start with 50 extra Iron & Gold");
  } else {
    resources.bonuses.push("Select your focus..");
  }

  return resources;
};

export const RESOURCE_ORDER = ["gold", "food", "wood", "stone", "iron"];

export const calculateBuildingModifiers = (
  buildings: Record<string, { level: number; unlocked: boolean }>
) => {
  const modifiers: Record<string, number> = {
    food: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    gold: 0,
  };

  // Wheat Fields: +20% Food per level > 1
  if (
    buildings["wheat_fields"]?.unlocked &&
    buildings["wheat_fields"].level > 1
  ) {
    modifiers.food += (buildings["wheat_fields"].level - 1) * 0.2;
  }

  // Fisherman's Hut: +20% Food per level > 1
  if (
    buildings["fishermans_hut"]?.unlocked &&
    buildings["fishermans_hut"].level > 1
  ) {
    modifiers.food += (buildings["fishermans_hut"].level - 1) * 0.2;
  }

  // Lumberjack's Camp: +20% Wood per level > 1
  if (
    buildings["lumberjacks_camp"]?.unlocked &&
    buildings["lumberjacks_camp"].level > 1
  ) {
    modifiers.wood += (buildings["lumberjacks_camp"].level - 1) * 0.2;
  }

  // Deep Mine: +20% Stone & Iron per level > 1
  if (buildings["deep_mine"]?.unlocked && buildings["deep_mine"].level > 1) {
    modifiers.stone += (buildings["deep_mine"].level - 1) * 0.2;
    modifiers.iron += (buildings["deep_mine"].level - 1) * 0.2;
  }

  // Trade Post: +5% Gold per level > 1
  if (buildings["trade_post"]?.unlocked && buildings["trade_post"].level > 1) {
    modifiers.gold += (buildings["trade_post"].level - 1) * 0.05;
  }

  return modifiers;
};
