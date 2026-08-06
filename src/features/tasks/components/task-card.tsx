"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CheckSquare2, Flag, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PRIORITY_CONFIG } from "../constants";
import type { BoardTask } from "../types";

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Pure presentation, shared by the sortable card and the drag overlay.
export function TaskCardContent({ task }: { task: BoardTask }) {
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground shadow-xs">
      <div className="flex items-start gap-2">
        {task.priority !== "NONE" && (
          <Flag
            className={cn("mt-0.5 size-3.5 shrink-0", priority.className)}
            aria-label={`Priority: ${priority.label}`}
          />
        )}
        <p className="line-clamp-3 text-sm font-medium leading-snug">
          {task.title}
        </p>
      </div>
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              {label.name}
            </span>
          ))}
        </div>
      )}
      {(task.dueDate ||
        task.assignee ||
        task.subtaskCount > 0 ||
        task.commentCount > 0) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" aria-hidden />
                {formatDueDate(task.dueDate)}
              </span>
            )}
            {task.subtaskCount > 0 && (
              <span
                className="flex items-center gap-1 tabular-nums"
                title={`${task.subtaskDoneCount} of ${task.subtaskCount} subtasks done`}
              >
                <CheckSquare2 className="size-3.5" aria-hidden />
                {task.subtaskDoneCount}/{task.subtaskCount}
              </span>
            )}
            {task.commentCount > 0 && (
              <span
                className="flex items-center gap-1 tabular-nums"
                title={`${task.commentCount} comments`}
              >
                <MessageSquare className="size-3.5" aria-hidden />
                {task.commentCount}
              </span>
            )}
          </div>
          {task.assignee && (
            <Avatar className="size-5" title={task.assignee.name}>
              <AvatarImage
                src={task.assignee.avatarUrl ?? undefined}
                alt={task.assignee.name}
              />
              <AvatarFallback className="text-[10px]">
                {task.assignee.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </div>
  );
}

export function TaskCard({
  task,
  onEdit,
}: {
  task: BoardTask;
  onEdit: (task: BoardTask) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
      onClick={() => onEdit(task)}
      {...attributes}
      {...listeners}
    >
      <TaskCardContent task={task} />
    </div>
  );
}
