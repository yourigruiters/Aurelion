import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resources } from "../types";
import { ActivityLogEntry } from "./activitiesSlice";
import { ActiveResearch } from "./militarySlice";

export interface NightEvent {
  title: string;
  description: string;
  effect?: Partial<Resources>;
  // We could add more effect types like "population loss" or "morale change" later
}

export interface DailyReport {
  id: string; // unique ID (e.g. "day-5")
  day: number;
  date: string; // "Day 5" or real date if we had calendar
  resourcesGained: Partial<Resources>; // Net change (positive or negative)
  nightEvent?: NightEvent;
  activitiesCompleted: ActivityLogEntry[];
  levelInfo: {
    level: number;
    expGained: number; // XP gained THIS day
  };
  constructionQueue: string[]; // Snapshot of queue
  completedConstructions: { name: string; xp: number }[]; // Names of completed buildings
  completedResearch?: { name: string; xp: number } | null; // Name of completed research
  activeResearchSnapshot?: ActiveResearch | null; // Snapshot of active research
  read: boolean;
  starvation?: {
    type: "population" | "resources";
    message: string;
  };
}

export interface ReportsState {
  reports: DailyReport[];
  unreadCount: number;
}

const initialState: ReportsState = {
  reports: [],
  unreadCount: 0,
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    addReport: (state, action: PayloadAction<DailyReport>) => {
      // Prevent duplicates
      if (state.reports.some((r) => r.id === action.payload.id)) {
        return;
      }
      // Add to beginning of list
      state.reports.unshift(action.payload);
      // Keep only last 30 reports to save state size?
      if (state.reports.length > 30) {
        state.reports.pop();
      }
      state.unreadCount += 1;
    },
    markReportsRead: (state) => {
      state.unreadCount = 0;
      state.reports.forEach((report) => {
        report.read = true;
      });
    },
    markReportAsRead: (state, action: PayloadAction<string>) => {
      const report = state.reports.find((r) => r.id === action.payload);
      if (report && !report.read) {
        report.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    resetReports: () => initialState,
  },
});

export const { addReport, markReportsRead, markReportAsRead, resetReports } =
  reportsSlice.actions;

export default reportsSlice.reducer;
