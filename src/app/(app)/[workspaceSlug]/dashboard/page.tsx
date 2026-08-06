import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWorkspaceForUser } from "@/features/workspaces/queries";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
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

  const [profile, projectCount, openTaskCount, memberCount, recentProjects] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true },
      }),
      prisma.project.count({ where: { workspaceId: workspace.id } }),
      prisma.task.count({
        where: {
          project: { workspaceId: workspace.id },
          assigneeId: user.id,
          status: { not: "DONE" },
        },
      }),
      prisma.workspaceMember.count({ where: { workspaceId: workspace.id } }),
      prisma.project.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, name: true, key: true, color: true },
      }),
    ]);

  const stats = [
    {
      title: "Projects",
      value: projectCount,
      description: `In ${workspace.name}`,
      icon: FolderKanban,
    },
    {
      title: "Open tasks",
      value: openTaskCount,
      description: "Assigned to you",
      icon: ListTodo,
    },
    {
      title: "Team members",
      value: memberCount,
      description: "In this workspace",
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {profile?.name ?? "there"}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in {workspace.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>{stat.title}</CardDescription>
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl tabular-nums">
                {stat.value}
              </CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {recentProjects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-12 text-center">
          <FolderKanban
            className="size-10 text-muted-foreground/60"
            aria-hidden
          />
          <h2 className="text-lg font-semibold">No projects yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Head over to Projects to create your first one.
          </p>
          <Link
            href={`/${workspace.slug}/projects`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Go to Projects
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent projects</h2>
            <Link
              href={`/${workspace.slug}/projects`}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              View all
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="divide-y rounded-xl border">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/${workspace.slug}/projects/${project.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50"
              >
                <span
                  aria-hidden
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-medium">{project.name}</span>
                <Badge variant="outline" className="ml-auto font-mono text-xs">
                  {project.key}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
