import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getWorkspaceForUser } from "@/features/workspaces/queries";
import { getProjects } from "@/features/projects/queries";
import { CreateProjectButton } from "@/features/projects/components/create-project-button";
import { ProjectCard } from "@/features/projects/components/project-card";
import type { ProjectCardData } from "@/features/projects/types";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const user = await requireUser();

  const workspace = await getWorkspaceForUser(workspaceSlug, user.id);
  if (!workspace) {
    notFound();
  }

  const projects = await getProjects(workspace.id);

  const cards: ProjectCardData[] = projects.map((project) => ({
    id: project.id,
    name: project.name,
    key: project.key,
    description: project.description,
    color: project.color,
    taskCount: project._count.tasks,
  }));

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            {projects.length === 0
              ? "Create your first project to get started."
              : `${projects.length} ${projects.length === 1 ? "project" : "projects"} in ${workspace.name}`}
          </p>
        </div>
        <CreateProjectButton workspaceId={workspace.id} />
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-12 text-center">
          <FolderKanban
            className="size-10 text-muted-foreground/60"
            aria-hidden
          />
          <h2 className="text-lg font-semibold">No projects yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            A project groups related tasks together — like a website redesign,
            a product launch, or a sprint.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              workspaceId={workspace.id}
              workspaceSlug={workspace.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
