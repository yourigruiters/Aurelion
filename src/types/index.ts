export interface Resources {
  food: number;
  wood: number;
  stone: number;
  iron: number;
  gold: number;
}

export interface FullResources {
  population: number;
  resources: Resources;
  modifiers: Resources;
  rates: Resources;
  bonuses: string[];
}

export type Role =
  | "Farmer"
  | "Fisher"
  | "Woodcutter"
  | "Miner"
  | "Builder"
  | "Blacksmith"
  | "Merchant"
  | "Warrior";

export interface ResourcesState {
  population: number;
  resources: Resources;
  daysPassed: number;
  gameStartTime: number | null;
  rates: Resources;
  modifiers: Resources;
  assignments: Record<string, number>;
}

export type Region = "Forest Realm" | "Riverlands" | "Highland pass";

export type Focus = "Building" | "Gathering" | "Fighting";

export interface GameState {
  gameStarted: boolean;
  cityName: string;
  region: Region;
  focus: Focus;
  dayTime: number;
}

export interface UIState {
  isSettingsOpen: boolean;
}
