"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getMembership } from "@/features/workspaces/queries";
import {
  createTaskSchema,
  deleteTaskSchema,
  moveTaskSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type DeleteTaskInput,
  type MoveTaskInput,
  type UpdateTaskInput,
} from "./schemas";

type ActionResult = { error: string } | { success: true };

// Resolves the workspace a task belongs to, for authorization
// and cache revalidation.
async function getTaskContext(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    select: {
      project: {
        select: { workspaceId: true, workspace: { select: { slug: true } } },
      },
    },
  });
}

export async function createTask(
  input: CreateTaskInput,
): Promise<ActionResult> {
  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { projectId, title, description, status, priority, assigneeId, dueDate } =
    parsed.data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true, workspace: { select: { slug: true } } },
  });
  if (!project) {
    return { error: "Project not found" };
  }

  const membership = await getMembership(project.workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  // New tasks go to the bottom of their column.
  const last = await prisma.task.findFirst({
    where: { projectId, status },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.task.create({
    data: {
      projectId,
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
      creatorId: user.id,
      position: (last?.position ?? 0) + 1024,
    },
  });

  revalidatePath(`/${project.workspace.slug}`, "layout");
  return { success: true };
}

export async function updateTask(
  input: UpdateTaskInput,
): Promise<ActionResult> {
  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { taskId, title, description, status, priority, assigneeId, dueDate } =
    parsed.data;

  const context = await getTaskContext(taskId);
  if (!context) {
    return { error: "Task not found" };
  }

  const membership = await getMembership(context.project.workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath(`/${context.project.workspace.slug}`, "layout");
  return { success: true };
}

export async function moveTask(input: MoveTaskInput): Promise<ActionResult> {
  const parsed = moveTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();
  const { taskId, status, position } = parsed.data;

  const context = await getTaskContext(taskId);
  if (!context) {
    return { error: "Task not found" };
  }

  const membership = await getMembership(context.project.workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status, position },
  });

  revalidatePath(`/${context.project.workspace.slug}`, "layout");
  return { success: true };
}

export async function deleteTask(
  input: DeleteTaskInput,
): Promise<ActionResult> {
  const parsed = deleteTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();

  const context = await getTaskContext(parsed.data.taskId);
  if (!context) {
    return { error: "Task not found" };
  }

  const membership = await getMembership(context.project.workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  await prisma.task.delete({ where: { id: parsed.data.taskId } });

  revalidatePath(`/${context.project.workspace.slug}`, "layout");
  return { success: true };
}
