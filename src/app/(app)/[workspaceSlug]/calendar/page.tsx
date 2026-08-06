import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getWorkspaceForUser } from "@/features/workspaces/queries";
import { getCalendarTasks } from "@/features/tasks/queries";
import { CalendarView } from "@/features/tasks/components/calendar-view";

export const metadata: Metadata = {
  title: "Calendar",
};

function monthString(year: number, monthIndex: number): string {
  const normalized = new Date(Date.UTC(year, monthIndex, 1));
  return `${normalized.getUTCFullYear()}-${String(normalized.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const [{ workspaceSlug }, { month }] = await Promise.all([
    params,
    searchParams,
  ]);
  const user = await requireUser();

  const workspace = await getWorkspaceForUser(workspaceSlug, user.id);
  if (!workspace) {
    notFound();
  }

  // ?month=YYYY-MM is untrusted input — fall back to the current month.
  const now = new Date();
  const match = month?.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  const year = match ? Number(match[1]) : now.getUTCFullYear();
  const monthIndex = match ? Number(match[2]) - 1 : now.getUTCMonth();

  // Visible grid = 6 weeks starting the Sunday on or before the 1st.
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const rangeStart = new Date(first);
  rangeStart.setUTCDate(first.getUTCDate() - first.getUTCDay());
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setUTCDate(rangeStart.getUTCDate() + 42);

  const tasks = await getCalendarTasks(workspace.id, rangeStart, rangeEnd);

  const monthLabel = first.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Tasks across all projects, by due date.
        </p>
      </div>

      <CalendarView
        workspaceSlug={workspaceSlug}
        year={year}
        monthIndex={monthIndex}
        monthLabel={monthLabel}
        prevMonth={monthString(year, monthIndex - 1)}
        nextMonth={monthString(year, monthIndex + 1)}
        tasks={tasks}
      />
    </div>
  );
}
