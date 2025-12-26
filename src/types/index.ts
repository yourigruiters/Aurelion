export interface Resources {
  food: number;
  wood: number;
  stone: number;
  iron: number;
  gold: number;
}

export interface Rates extends Resources {
  population: number;
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
  rates: Rates;
  modifiers: Resources;
  assignments: Record<string, number>;
}

export interface GameState {
  gameStarted: boolean;
  cityName: string;
  region: string;
  bonus: string;
  mode: string;
  speed: string;
}

export interface UIState {
  isSettingsOpen: boolean;
}
