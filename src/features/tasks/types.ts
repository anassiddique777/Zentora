import type { TaskPriority, TaskStatus } from "./constants";

export type LabelItem = {
  id: string;
  name: string;
  color: string;
};

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
  labels: LabelItem[];
  subtaskCount: number;
  subtaskDoneCount: number;
  commentCount: number;
};

export type MemberOption = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type SubtaskItem = {
  id: string;
  title: string;
  done: boolean;
};

export type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type MyTaskItem = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  project: {
    id: string;
    name: string;
    key: string;
    color: string;
  };
};

export type MyTasksFilters = {
  q?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
};

export type TaskDetail = {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  assignee: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  subtasks: SubtaskItem[];
  labels: LabelItem[];
  workspaceLabels: LabelItem[];
  comments: CommentItem[];
};
