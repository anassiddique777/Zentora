"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getMembership } from "@/features/workspaces/queries";
import {
  createCommentSchema,
  deleteCommentSchema,
  type CreateCommentInput,
  type DeleteCommentInput,
} from "./schemas";

type ActionResult = { error: string } | { success: true };

export async function createComment(
  input: CreateCommentInput,
): Promise<ActionResult> {
  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { taskId, content } = parsed.data;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { project: { select: { workspaceId: true } } },
  });
  if (!task) {
    return { error: "Task not found" };
  }

  const membership = await getMembership(task.project.workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  await prisma.comment.create({
    data: { taskId, content, authorId: user.id },
  });

  return { success: true };
}

export async function deleteComment(
  input: DeleteCommentInput,
): Promise<ActionResult> {
  const parsed = deleteCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();

  const comment = await prisma.comment.findUnique({
    where: { id: parsed.data.commentId },
    select: {
      authorId: true,
      task: { select: { project: { select: { workspaceId: true } } } },
    },
  });
  if (!comment) {
    return { error: "Comment not found" };
  }

  const membership = await getMembership(
    comment.task.project.workspaceId,
    user.id,
  );
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  // Authors can delete their own comments; owners/admins can moderate any.
  const canDelete =
    comment.authorId === user.id || membership.role !== "MEMBER";
  if (!canDelete) {
    return { error: "You can only delete your own comments" };
  }

  await prisma.comment.delete({ where: { id: parsed.data.commentId } });
  return { success: true };
}
