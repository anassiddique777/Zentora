import { prisma } from "@/lib/prisma";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "@/features/tasks/constants";

export type WorkspaceAnalytics = {
  total: number;
  done: number;
  overdue: number;
  completionRate: number; // 0–100
  byStatus: { status: TaskStatus; count: number }[];
  byPriority: { priority: TaskPriority; count: number }[];
  byProject: { name: string; color: string; count: number }[];
  createdPerDay: { date: string; count: number }[]; // last 30 days
};

const TREND_DAYS = 30;

// Local YYYY-MM-DD key so day buckets match the user's calendar.
function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getWorkspaceAnalytics(
  workspaceId: string,
): Promise<WorkspaceAnalytics> {
  // Subtasks are excluded everywhere so numbers match the board.
  const where = { project: { workspaceId }, parentId: null };

  const trendStart = new Date();
  trendStart.setHours(0, 0, 0, 0);
  trendStart.setDate(trendStart.getDate() - (TREND_DAYS - 1));

  const [statusGroups, priorityGroups, overdue, projects, recentTasks] =
    await Promise.all([
      // Aggregation happens in the database — we never load full task rows.
      prisma.task.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
      }),
      prisma.task.groupBy({
        by: ["priority"],
        where,
        _count: { _all: true },
      }),
      prisma.task.count({
        where: { ...where, status: { not: "DONE" }, dueDate: { lt: new Date() } },
      }),
      prisma.project.findMany({
        where: { workspaceId },
        select: {
          name: true,
          color: true,
          _count: { select: { tasks: { where: { parentId: null } } } },
        },
        orderBy: { tasks: { _count: "desc" } },
      }),
      prisma.task.findMany({
        where: { ...where, createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
    ]);

  const statusCounts = new Map(
    statusGroups.map((group) => [group.status, group._count._all]),
  );
  const priorityCounts = new Map(
    priorityGroups.map((group) => [group.priority, group._count._all]),
  );

  const total = [...statusCounts.values()].reduce((sum, n) => sum + n, 0);
  const done = statusCounts.get("DONE") ?? 0;

  const perDay = new Map<string, number>();
  for (const task of recentTasks) {
    const key = dayKey(task.createdAt);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const createdPerDay = Array.from({ length: TREND_DAYS }, (_, i) => {
    const date = new Date(trendStart);
    date.setDate(trendStart.getDate() + i);
    const key = dayKey(date);
    return { date: key, count: perDay.get(key) ?? 0 };
  });

  return {
    total,
    done,
    overdue,
    completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    byStatus: TASK_STATUSES.map((status) => ({
      status,
      count: statusCounts.get(status) ?? 0,
    })),
    byPriority: TASK_PRIORITIES.map((priority) => ({
      priority,
      count: priorityCounts.get(priority) ?? 0,
    })),
    byProject: projects.map((project) => ({
      name: project.name,
      color: project.color,
      count: project._count.tasks,
    })),
    createdPerDay,
  };
}
