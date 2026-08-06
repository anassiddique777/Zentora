import { prisma } from "@/lib/prisma";
import type { BoardTask } from "./types";

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
    },
  });

  // Dates must be serialized to cross the server/client boundary.
  return tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
  }));
}
