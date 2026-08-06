import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ListTodo,
  Percent,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getWorkspaceForUser } from "@/features/workspaces/queries";
import { getWorkspaceAnalytics } from "@/features/analytics/queries";
import { CreatedArea } from "@/features/analytics/components/created-area";
import { PriorityBar } from "@/features/analytics/components/priority-bar";
import { ProjectBar } from "@/features/analytics/components/project-bar";
import { StatusDonut } from "@/features/analytics/components/status-donut";

export const metadata: Metadata = {
  title: "Analytics",
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className={`size-5 ${accent ?? "text-muted-foreground"}`} aria-hidden />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AnalyticsPage({
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

  const analytics = await getWorkspaceAnalytics(workspace.id);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          How work is moving across {workspace.name}.
        </p>
      </div>

      {analytics.total === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-20 text-center">
          <BarChart3 className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">No data yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Create a few tasks and charts will light up here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={ListTodo}
              label="Total tasks"
              value={String(analytics.total)}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={String(analytics.done)}
              accent="text-emerald-500"
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue"
              value={String(analytics.overdue)}
              accent={analytics.overdue > 0 ? "text-red-500" : undefined}
            />
            <StatCard
              icon={Percent}
              label="Completion rate"
              value={`${analytics.completionRate}%`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <StatusDonut data={analytics.byStatus} total={analytics.total} />
            <PriorityBar data={analytics.byPriority} />
            <ProjectBar data={analytics.byProject} />
            <CreatedArea data={analytics.createdPerDay} />
          </div>
        </>
      )}
    </div>
  );
}
