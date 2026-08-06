import { prisma } from "@/lib/prisma";

// Projects of a workspace with task counts for the list page.
export async function getProjects(workspaceId: string) {
  return prisma.project.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tasks: true } },
    },
  });
}

export type ProjectWithTaskCount = Awaited<
  ReturnType<typeof getProjects>
>[number];
