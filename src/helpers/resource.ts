import { FullResources, Region, Focus } from "../types";

export const getResourceDetails = (
  region: Region,
  focus: Focus
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
