"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getMembership } from "@/features/workspaces/queries";
import {
  createLabelSchema,
  setTaskLabelSchema,
  type CreateLabelInput,
  type SetTaskLabelInput,
} from "./schemas";

type ActionResult = { error: string } | { success: true };

export async function createLabel(
  input: CreateLabelInput,
): Promise<ActionResult> {
  const parsed = createLabelSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId, name, color } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  const existing = await prisma.label.findUnique({
    where: { workspaceId_name: { workspaceId, name } },
    select: { id: true },
  });
  if (existing) {
    return { error: "A label with this name already exists" };
  }

  await prisma.label.create({ data: { workspaceId, name, color } });
  return { success: true };
}

export async function setTaskLabel(
  input: SetTaskLabelInput,
): Promise<ActionResult> {
  const parsed = setTaskLabelSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();
  const { taskId, labelId, active } = parsed.data;

  // Both the task and the label must belong to the same workspace
  // the user is a member of.
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { project: { select: { workspaceId: true } } },
  });
  const label = await prisma.label.findUnique({
    where: { id: labelId },
    select: { workspaceId: true },
  });
  if (!task || !label || task.project.workspaceId !== label.workspaceId) {
    return { error: "Task or label not found" };
  }

  const membership = await getMembership(label.workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  if (active) {
    await prisma.taskLabel.upsert({
      where: { taskId_labelId: { taskId, labelId } },
      update: {},
      create: { taskId, labelId },
    });
  } else {
    await prisma.taskLabel.deleteMany({ where: { taskId, labelId } });
  }

  return { success: true };
}
