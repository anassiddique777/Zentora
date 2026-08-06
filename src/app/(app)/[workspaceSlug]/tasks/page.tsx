import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "@/features/tasks/constants";
import { getMyTasks } from "@/features/tasks/queries";
import { MyTasksFilters } from "@/features/tasks/components/my-tasks-filters";
import { MyTasksList } from "@/features/tasks/components/my-tasks-list";
import type { MyTasksFilters as Filters } from "@/features/tasks/types";

export const metadata: Metadata = {
  title: "My Tasks",
};

type SearchParams = {
  q?: string;
  status?: string;
  priority?: string;
  project?: string;
};

// URL params are untrusted input — only accept known enum values.
function parseFilters(params: SearchParams): Filters {
  return {
    q: params.q?.trim() || undefined,
    status: TASK_STATUSES.includes(params.status as TaskStatus)
      ? (params.status as TaskStatus)
      : undefined,
    priority: TASK_PRIORITIES.includes(params.priority as TaskPriority)
      ? (params.priority as TaskPriority)
      : undefined,
    projectId: params.project || undefined,
  };
}

export default async function TasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ workspaceSlug }, rawSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const user = await requireUser();

  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: workspaceSlug,
      members: { some: { userId: user.id } },
    },
    select: { id: true },
  });

  if (!workspace) {
    notFound();
  }

  const filters = parseFilters(rawSearchParams);

  const [tasks, projects] = await Promise.all([
    getMyTasks(workspace.id, user.id, filters),
    prisma.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const hasFilters = Boolean(
    filters.q || filters.status || filters.priority || filters.projectId,
  );

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <span className="text-sm tabular-nums text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      <MyTasksFilters projects={projects} />

      <MyTasksList
        tasks={tasks}
        workspaceSlug={workspaceSlug}
        hasFilters={hasFilters}
      />
    </div>
  );
}
