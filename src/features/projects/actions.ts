"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getMembership } from "@/features/workspaces/queries";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
  type CreateProjectInput,
  type DeleteProjectInput,
  type UpdateProjectInput,
} from "./schemas";

type ActionResult = { error: string } | { success: true };

// "Marketing Website" -> "MW", "Zentora" -> "ZEN"
function keyFromName(name: string): string {
  const words = name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const key =
    words.length >= 2
      ? words.map((w) => w[0]).join("")
      : (words[0] ?? "PRJ").slice(0, 3);

  return key.slice(0, 5) || "PRJ";
}

async function generateUniqueKey(
  workspaceId: string,
  name: string,
): Promise<string> {
  const base = keyFromName(name);
  const existingKeys = new Set(
    (
      await prisma.project.findMany({
        where: { workspaceId, key: { startsWith: base } },
        select: { key: true },
      })
    ).map((p) => p.key),
  );

  if (!existingKeys.has(base)) return base;

  let counter = 2;
  while (existingKeys.has(`${base}${counter}`)) counter++;
  return `${base}${counter}`;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ActionResult> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { workspaceId, name, description, color } = parsed.data;

  // Authorization: only workspace members can create projects here.
  const membership = await getMembership(workspaceId, user.id);
  if (!membership) {
    return { error: "You don't have access to this workspace" };
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { slug: true },
  });
  if (!workspace) {
    return { error: "Workspace not found" };
  }

  const key = await generateUniqueKey(workspaceId, name);

  await prisma.project.create({
    data: { workspaceId, name, description, color, key },
  });

  revalidatePath(`/${workspace.slug}`, "layout");
  return { success: true };
}

export async function updateProject(
  input: UpdateProjectInput,
): Promise<ActionResult> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await requireUser();
  const { projectId, name, description, color } = parsed.data;

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

  await prisma.project.update({
    where: { id: projectId },
    data: { name, description, color },
  });

  revalidatePath(`/${project.workspace.slug}`, "layout");
  return { success: true };
}

export async function deleteProject(
  input: DeleteProjectInput,
): Promise<ActionResult> {
  const parsed = deleteProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const user = await requireUser();

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { workspaceId: true, workspace: { select: { slug: true } } },
  });
  if (!project) {
    return { error: "Project not found" };
  }

  // Destructive action: restricted to OWNER and ADMIN roles.
  const membership = await getMembership(project.workspaceId, user.id);
  if (!membership || membership.role === "MEMBER") {
    return { error: "Only workspace owners and admins can delete projects" };
  }

  await prisma.project.delete({ where: { id: parsed.data.projectId } });

  revalidatePath(`/${project.workspace.slug}`, "layout");
  return { success: true };
}
