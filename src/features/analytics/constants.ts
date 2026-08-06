import type { TaskPriority, TaskStatus } from "@/features/tasks/constants";

// Chart fill colors, aligned with the status/priority icon colors.
export const STATUS_CHART_COLORS: Record<TaskStatus, string> = {
  BACKLOG: "#9ca3af",
  TODO: "#6b7280",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#8b5cf6",
  DONE: "#10b981",
};

export const PRIORITY_CHART_COLORS: Record<TaskPriority, string> = {
  NONE: "#9ca3af",
  LOW: "#3b82f6",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  URGENT: "#ef4444",
};
