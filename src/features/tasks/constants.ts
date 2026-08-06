import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Eye,
  type LucideIcon,
} from "lucide-react";

export const TASK_STATUSES = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = [
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  BACKLOG: {
    label: "Backlog",
    icon: CircleDashed,
    className: "text-muted-foreground",
  },
  TODO: { label: "Todo", icon: Circle, className: "text-muted-foreground" },
  IN_PROGRESS: {
    label: "In Progress",
    icon: CircleDot,
    className: "text-blue-500",
  },
  IN_REVIEW: { label: "In Review", icon: Eye, className: "text-violet-500" },
  DONE: { label: "Done", icon: CircleCheck, className: "text-emerald-500" },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  NONE: { label: "No priority", className: "text-muted-foreground" },
  LOW: { label: "Low", className: "text-blue-500" },
  MEDIUM: { label: "Medium", className: "text-yellow-500" },
  HIGH: { label: "High", className: "text-orange-500" },
  URGENT: { label: "Urgent", className: "text-red-500" },
};
