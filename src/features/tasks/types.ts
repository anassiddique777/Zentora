import type { TaskPriority, TaskStatus } from "./constants";

export type BoardTask = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  dueDate: string | null; // ISO string, serializable for client components
  assignee: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
};

export type MemberOption = {
  id: string;
  name: string;
  avatarUrl: string | null;
};
