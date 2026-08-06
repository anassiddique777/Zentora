import { prisma } from "@/lib/prisma";
import type { BoardTask, TaskDetail } from "./types";

// Top-level tasks of a project for the Kanban board (subtasks excluded).
export async function getBoardTasks(projectId: string): Promise<BoardTask[]> {
  const tasks = await prisma.task.findMany({
    where: { projectId, parentId: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      position: true,
      dueDate: true,
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      labels: {
        select: {
          label: { select: { id: true, name: true, color: true } },
        },
      },
      subtasks: { select: { status: true } },
      _count: { select: { comments: true } },
    },
  });

  // Dates must be serialized to cross the server/client boundary.
  return tasks.map(({ labels, subtasks, _count, ...task }) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
    labels: labels.map((entry) => entry.label),
    subtaskCount: subtasks.length,
    subtaskDoneCount: subtasks.filter((s) => s.status === "DONE").length,
    commentCount: _count.comments,
  }));
}

// Full task detail for the side panel.
export async function getTaskDetail(
  taskId: string,
  currentUserId: string,
): Promise<TaskDetail | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      project: { select: { workspaceId: true } },
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      subtasks: {
        orderBy: { position: "asc" },
        select: { id: true, title: true, status: true },
      },
      labels: {
        select: {
          label: { select: { id: true, name: true, color: true } },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!task) return null;

  const workspaceLabels = await prisma.label.findMany({
    where: { workspaceId: task.project.workspaceId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, color: true },
  });

  return {
    id: task.id,
    projectId: task.projectId,
    workspaceId: task.project.workspaceId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    assignee: task.assignee,
    subtasks: task.subtasks.map((subtask) => ({
      id: subtask.id,
      title: subtask.title,
      done: subtask.status === "DONE",
    })),
    labels: task.labels.map((entry) => entry.label),
    workspaceLabels,
    comments: task.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      isOwn: comment.author.id === currentUserId,
      author: comment.author,
    })),
  };
}
