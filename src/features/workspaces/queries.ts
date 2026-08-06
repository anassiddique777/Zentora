import { prisma } from "@/lib/prisma";
import type { MemberRow } from "./types";

// All workspaces the user belongs to (for the switcher and resolver).
export async function getUserWorkspaces(userId: string) {
  return prisma.workspace.findMany({
    where: { members: { some: { userId } } },
    orderBy: { createdAt: "asc" },
  });
}

// Loads a workspace by slug ONLY if the user is a member.
// Returning null for non-members means outsiders can't even
// discover that the workspace exists.
export async function getWorkspaceForUser(slug: string, userId: string) {
  return prisma.workspace.findFirst({
    where: { slug, members: { some: { userId } } },
  });
}

// All members of a workspace for the settings page.
export async function getWorkspaceMembers(
  workspaceId: string,
): Promise<MemberRow[]> {
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    // Owner first, then admins, then by join date.
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      role: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });

  return members.map(({ createdAt, ...member }) => ({
    ...member,
    joinedAt: createdAt.toISOString(),
  }));
}

// Membership row for authorization checks in server actions.
export async function getMembership(workspaceId: string, userId: string) {
  return prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
}
