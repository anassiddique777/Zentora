import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Kanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Project",
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
      workspace: { slug: workspaceSlug, members: { some: { userId: user.id } } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
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

      {project.description && (
        <p className="max-w-2xl text-muted-foreground">{project.description}</p>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-12 text-center">
        <Kanban className="size-10 text-muted-foreground/60" aria-hidden />
        <h2 className="text-lg font-semibold">Board coming soon</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          The Kanban board with tasks and drag &amp; drop lands in the next
          phase.
        </p>
      </div>
    </div>
  );
}
