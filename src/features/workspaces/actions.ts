"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { randomSuffix, slugify } from "@/lib/slug";
import { getMembership } from "./queries";
import {
  addMemberSchema,
  createWorkspaceSchema,
  deleteWorkspaceSchema,
  leaveWorkspaceSchema,
  removeMemberSchema,
  updateMemberRoleSchema,
  updateWorkspaceSchema,
  type AddMemberInput,
  type CreateWorkspaceInput,
  type DeleteWorkspaceInput,
  type LeaveWorkspaceInput,
  type RemoveMemberInput,
  type UpdateMemberRoleInput,
  type UpdateWorkspaceInput,
} from "./schemas";

type ActionResult = { error: string } | { success: true };

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "workspace";
  const existing = await prisma.workspace.findUnique({
    where: { slug: base },
    select: { id: true },
  });
  return existing ? `${base}-${randomSuffix()}` : base;
}

export async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<ActionResult> {
  const parsed = createWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const slug = await generateUniqueSlug(parsed.data.name);

  // Workspace and its OWNER membership are created atomically —
  // a workspace without an owner must never exist.
  await prisma.workspace.create({
    data: {
      name: parsed.data.name,
      slug,
      members: {
        create: { userId: user.id, role: "OWNER" },
      },
    },
  });

  revalidatePath("/", "layout");
  redirect(`/${slug}/dashboard`);
}

export async function updateWorkspace(
  input: UpdateWorkspaceInput,
): Promise<ActionResult> {
  const parsed = updateWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId, name } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership || membership.role === "MEMBER") {
    return { error: "Only owners and admins can rename the workspace" };
  }

  // Slug stays stable on purpose — renaming must not break existing URLs.
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { name },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

export async function addMember(input: AddMemberInput): Promise<ActionResult> {
  const parsed = addMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId, email } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership || membership.role === "MEMBER") {
    return { error: "Only owners and admins can add members" };
  }

  const invitee = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  if (!invitee) {
    return {
      error: "No account found with this email — ask them to sign up first",
    };
  }

  const existing = await getMembership(workspaceId, invitee.id);
  if (existing) {
    return { error: "This person is already a member" };
  }

  await prisma.workspaceMember.create({
    data: { workspaceId, userId: invitee.id, role: "MEMBER" },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateMemberRole(
  input: UpdateMemberRoleInput,
): Promise<ActionResult> {
  const parsed = updateMemberRoleSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId, memberId, role } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership || membership.role !== "OWNER") {
    return { error: "Only the owner can change roles" };
  }

  const target = await prisma.workspaceMember.findFirst({
    where: { id: memberId, workspaceId },
    select: { role: true },
  });
  if (!target) {
    return { error: "Member not found" };
  }
  if (target.role === "OWNER") {
    return { error: "The owner's role can't be changed" };
  }

  await prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

export async function removeMember(
  input: RemoveMemberInput,
): Promise<ActionResult> {
  const parsed = removeMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId, memberId } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership || membership.role === "MEMBER") {
    return { error: "Only owners and admins can remove members" };
  }

  const target = await prisma.workspaceMember.findFirst({
    where: { id: memberId, workspaceId },
    select: { role: true, userId: true },
  });
  if (!target) {
    return { error: "Member not found" };
  }
  if (target.userId === user.id) {
    return { error: "Use \u201cLeave workspace\u201d to remove yourself" };
  }
  if (target.role === "OWNER") {
    return { error: "The owner can't be removed" };
  }
  // Admins manage members, but not other admins.
  if (membership.role === "ADMIN" && target.role === "ADMIN") {
    return { error: "Only the owner can remove admins" };
  }

  await prisma.workspaceMember.delete({ where: { id: memberId } });

  revalidatePath("/", "layout");
  return { success: true };
}

export async function leaveWorkspace(
  input: LeaveWorkspaceInput,
): Promise<ActionResult> {
  const parsed = leaveWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership) {
    return { error: "You're not a member of this workspace" };
  }

  // A workspace must never be left without an owner.
  if (membership.role === "OWNER") {
    return {
      error:
        "Owners can't leave their workspace — delete it instead",
    };
  }

  await prisma.workspaceMember.delete({ where: { id: membership.id } });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function deleteWorkspace(
  input: DeleteWorkspaceInput,
): Promise<ActionResult> {
  const parsed = deleteWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId } = parsed.data;

  const membership = await getMembership(workspaceId, user.id);
  if (!membership || membership.role !== "OWNER") {
    return { error: "Only the owner can delete the workspace" };
  }

  // Cascade deletes take care of members, projects, tasks, etc.
  await prisma.workspace.delete({ where: { id: workspaceId } });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
