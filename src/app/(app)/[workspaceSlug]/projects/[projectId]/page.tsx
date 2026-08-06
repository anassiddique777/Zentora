import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBoardTasks } from "@/features/tasks/queries";
import { Board } from "@/features/tasks/components/board";
import type { MemberOption } from "@/features/tasks/types";

export const metadata: Metadata = {
  title: "Board",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;
  const user = await requireUser();

  // Single query: project must exist in this workspace AND the user
  // must be a member of that workspace.
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspace: {
        slug: workspaceSlug,
        members: { some: { userId: user.id } },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const [tasks, memberRows] = await Promise.all([
    getBoardTasks(project.id),
    prisma.workspaceMember.findMany({
      where: { workspaceId: project.workspaceId },
      select: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
  ]);

  const members: MemberOption[] = memberRows.map((row) => row.user);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="size-3 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        <Badge variant="outline" className="font-mono text-xs">
          {project.key}
        </Badge>
      </div>

      <Board projectId={project.id} initialTasks={tasks} members={members} />
    </div>
  );
}
