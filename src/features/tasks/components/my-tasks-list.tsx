"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Flag, ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants";
import { TaskDetailSheet } from "./task-detail-sheet";
import type { MyTaskItem } from "../types";

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isOverdue(task: MyTaskItem): boolean {
  if (!task.dueDate || task.status === "DONE") return false;
  return new Date(task.dueDate).getTime() < Date.now();
}

export function MyTasksList({
  tasks,
  workspaceSlug,
  hasFilters,
}: {
  tasks: MyTaskItem[];
  workspaceSlug: string;
  hasFilters: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<MyTaskItem | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
        <ListTodo className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">
          {hasFilters ? "No tasks match your filters" : "No tasks assigned to you"}
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          {hasFilters
            ? "Try adjusting or clearing the filters above."
            : "Tasks assigned to you across all projects will show up here."}
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y rounded-lg border">
        {tasks.map((task) => {
          const status = STATUS_CONFIG[task.status];
          const overdue = isOverdue(task);
          return (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => setSelected(task)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
              >
                <status.icon
                  className={cn("size-4 shrink-0", status.className)}
                  aria-label={status.label}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {task.title}
                </span>
                {task.priority !== "NONE" && (
                  <Flag
                    className={cn(
                      "size-3.5 shrink-0",
                      PRIORITY_CONFIG[task.priority].className,
                    )}
                    aria-label={`Priority: ${PRIORITY_CONFIG[task.priority].label}`}
                  />
                )}
                {task.dueDate && (
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 text-xs",
                      overdue
                        ? "font-medium text-red-500"
                        : "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="size-3.5" aria-hidden />
                    {formatDueDate(task.dueDate)}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className="hidden shrink-0 gap-1.5 font-normal sm:flex"
                >
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ backgroundColor: task.project.color }}
                  />
                  {task.project.key}
                </Badge>
              </button>
            </li>
          );
        })}
      </ul>

      <TaskDetailSheet
        taskId={selected?.id ?? null}
        projectId={selected?.project.id ?? ""}
        onClose={() => {
          setSelected(null);
          // List data comes from the server component, not TanStack Query —
          // refresh picks up any changes made inside the sheet.
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
