"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { randomSuffix, slugify } from "@/lib/slug";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "./schemas";

type ActionResult = { error: string };

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
