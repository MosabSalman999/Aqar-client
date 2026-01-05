import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActivityType = "created" | "updated" | "deleted" | "visibility_changed" | "error" | "info";

export interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  entityType: "property" | "application" | "lease" | "user" | "system";
  entityId?: number | string;
  timestamp: Date;
  isRead: boolean;
}

interface ActivityLogState {
  logs: ActivityLog[];
  unreadCount: number;
  isOpen: boolean;
}

const initialState: ActivityLogState = {
  logs: [],
  unreadCount: 0,
  isOpen: false,
};

export const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<Omit<ActivityLog, "id" | "timestamp" | "isRead">>) => {
      const newLog: ActivityLog = {
        ...action.payload,
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        isRead: false,
      };
      state.logs.unshift(newLog); // Add to beginning
      state.unreadCount += 1;
      
      // Keep only last 50 logs
      if (state.logs.length > 50) {
        state.logs = state.logs.slice(0, 50);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const log = state.logs.find((l) => l.id === action.payload);
      if (log && !log.isRead) {
        log.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.logs.forEach((log) => {
        log.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearLogs: (state) => {
      state.logs = [];
      state.unreadCount = 0;
    },
    toggleLogPanel: (state) => {
      state.isOpen = !state.isOpen;
    },
    setLogPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addLog,
  markAsRead,
  markAllAsRead,
  clearLogs,
  toggleLogPanel,
  setLogPanelOpen,
} = activityLogSlice.actions;

export default activityLogSlice.reducer;
