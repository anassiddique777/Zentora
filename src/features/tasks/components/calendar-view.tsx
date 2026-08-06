"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskDetailSheet } from "./task-detail-sheet";
import type { CalendarTask } from "../types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_CHIPS_PER_DAY = 3;

type DayCell = {
  key: string; // YYYY-MM-DD
  dayOfMonth: number;
  inMonth: boolean;
};

// 42 cells (6 weeks), starting from the Sunday on or before the 1st.
// All math in UTC — due dates are stored as date-only UTC midnights.
function buildGrid(year: number, monthIndex: number): DayCell[] {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const gridStart = new Date(first);
  gridStart.setUTCDate(first.getUTCDate() - first.getUTCDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + i);
    return {
      key: date.toISOString().slice(0, 10),
      dayOfMonth: date.getUTCDate(),
      inMonth: date.getUTCMonth() === monthIndex,
    };
  });
}

export function CalendarView({
  workspaceSlug,
  year,
  monthIndex,
  monthLabel,
  prevMonth,
  nextMonth,
  tasks,
}: {
  workspaceSlug: string;
  year: number;
  monthIndex: number; // 0-based
  monthLabel: string;
  prevMonth: string; // "YYYY-MM"
  nextMonth: string;
  tasks: CalendarTask[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<CalendarTask | null>(null);

  // Set after mount so server and client HTML always match.
  const [todayKey, setTodayKey] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setTodayKey(`${y}-${m}-${d}`);
  }, []);

  const cells = useMemo(() => buildGrid(year, monthIndex), [year, monthIndex]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, CalendarTask[]>();
    for (const task of tasks) {
      const key = task.dueDate.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(task);
      map.set(key, list);
    }
    return map;
  }, [tasks]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous month"
            render={<Link href={`${pathname}?month=${prevMonth}`} />}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={pathname} />}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next month"
            render={<Link href={`${pathname}?month=${nextMonth}`} />}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-lg border text-sm">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="border-b bg-muted/50 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {cells.map((cell, index) => {
          const dayTasks = tasksByDay.get(cell.key) ?? [];
          const overflow = dayTasks.length - MAX_CHIPS_PER_DAY;
          const isToday = cell.key === todayKey;
          return (
            <div
              key={cell.key}
              className={cn(
                "flex min-h-24 flex-col gap-1 border-b p-1.5",
                index % 7 !== 0 && "border-l",
                index >= 35 && "border-b-0",
                !cell.inMonth && "bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                  !cell.inMonth && "text-muted-foreground",
                  isToday && "bg-primary font-semibold text-primary-foreground",
                )}
              >
                {cell.dayOfMonth}
              </span>

              {dayTasks.slice(0, MAX_CHIPS_PER_DAY).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelected(task)}
                  title={task.title}
                  className={cn(
                    "flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left text-xs transition-colors hover:bg-muted",
                    task.status === "DONE" &&
                      "text-muted-foreground line-through",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: task.project.color }}
                  />
                  <span className="truncate">{task.title}</span>
                </button>
              ))}

              {overflow > 0 && (
                <span className="px-1.5 text-xs text-muted-foreground">
                  +{overflow} more
                </span>
              )}
            </div>
          );
        })}
      </div>

      <TaskDetailSheet
        taskId={selected?.id ?? null}
        projectId={selected?.project.id ?? ""}
        onClose={() => {
          setSelected(null);
          router.refresh();
        }}
        onEdit={() => {
          if (selected) {
            router.push(`/${workspaceSlug}/projects/${selected.project.id}`);
          }
        }}
      />
    </>
  );
}
