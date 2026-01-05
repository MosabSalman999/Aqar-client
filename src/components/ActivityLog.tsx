"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Edit,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import {
  ActivityLog as ActivityLogType,
  ActivityType,
  markAsRead,
  markAllAsRead,
  clearLogs,
  toggleLogPanel,
  setLogPanelOpen,
} from "@/state/activityLog";
import { formatDistanceToNow } from "date-fns";

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "created":
      return <Plus className="w-4 h-4 text-green-500" />;
    case "updated":
      return <Edit className="w-4 h-4 text-blue-500" />;
    case "deleted":
      return <Trash2 className="w-4 h-4 text-red-500" />;
    case "visibility_changed":
      return <Eye className="w-4 h-4 text-yellow-500" />;
    case "error":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "info":
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "created":
      return "bg-green-50 border-green-200";
    case "updated":
      return "bg-blue-50 border-blue-200";
    case "deleted":
      return "bg-red-50 border-red-200";
    case "visibility_changed":
      return "bg-yellow-50 border-yellow-200";
    case "error":
      return "bg-red-50 border-red-300";
    case "info":
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const ActivityLogItem = ({ log }: { log: ActivityLogType }) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!log.isRead) {
      dispatch(markAsRead(log.id));
    }
  };

  const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={handleClick}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${getActivityColor(
        log.type
      )} ${log.isRead ? "opacity-60" : "opacity-100"}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getActivityIcon(log.type)}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${log.isRead ? "text-gray-600" : "text-gray-900 font-medium"}`}>
            {log.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
        {!log.isRead && (
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
        )}
      </div>
    </motion.div>
  );
};

export const ActivityLogPanel = () => {
  const dispatch = useAppDispatch();
  const { logs, isOpen } = useAppSelector((state) => state.activityLog);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="font-semibold">Activity Log</h2>
        </div>
        <button
          onClick={() => dispatch(setLogPanelOpen(false))}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Actions */}
      <div className="p-2 border-b flex gap-2">
        <button
          onClick={() => dispatch(markAllAsRead())}
          className="flex-1 text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center gap-1"
        >
          <CheckCircle2 className="w-3 h-3" />
          Mark all read
        </button>
        <button
          onClick={() => dispatch(clearLogs())}
          className="flex-1 text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear all
        </button>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No activity yet</p>
            </div>
          ) : (
            logs.map((log) => <ActivityLogItem key={log.id} log={log} />)
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const ActivityLogButton = () => {
  const dispatch = useAppDispatch();
  const { unreadCount, isOpen } = useAppSelector((state) => state.activityLog);

  return (
    <button
      onClick={() => dispatch(toggleLogPanel())}
      className={`relative p-2 rounded-full transition-colors ${
        isOpen ? "bg-primary-100 text-primary-700" : "hover:bg-gray-100 text-gray-600"
      }`}
      title="Activity Log"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ActivityLogPanel;
