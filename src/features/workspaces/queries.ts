import { prisma } from "@/lib/prisma";

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

// Membership row for authorization checks in server actions.
export async function getMembership(workspaceId: string, userId: string) {
  return prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
}
