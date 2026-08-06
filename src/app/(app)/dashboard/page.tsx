import type { Metadata } from "next";
import { FolderKanban, ListTodo, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true },
      })
    : null;

  const firstName = profile?.name.split(" ")[0] ?? "there";

  const stats = [
    {
      title: "Projects",
      value: 0,
      description: "Across your workspaces",
      icon: FolderKanban,
    },
    {
      title: "Open tasks",
      value: 0,
      description: "Assigned to you",
      icon: ListTodo,
    },
    {
      title: "Team members",
      value: 1,
      description: "In your workspaces",
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening across your projects.
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

      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-12 text-center">
        <FolderKanban
          className="size-10 text-muted-foreground/60"
          aria-hidden
        />
        <h2 className="text-lg font-semibold">No projects yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Projects will appear here once we build workspaces and projects in
          the next phase.
        </p>
      </div>
    </div>
  );
}
