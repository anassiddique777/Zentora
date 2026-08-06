"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type TaskStatus } from "../constants";
import { TaskCard } from "./task-card";
import type { BoardTask } from "../types";

export function BoardColumn({
  status,
  tasks,
  onAdd,
  onEdit,
}: {
  status: TaskStatus;
  tasks: BoardTask[];
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: BoardTask) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-muted/50">
      <div className="flex items-center gap-2 p-3">
        <config.icon className={cn("size-4", config.className)} aria-hidden />
        <h2 className="text-sm font-semibold">{config.label}</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {tasks.length}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="ml-auto"
          aria-label={`Add task to ${config.label}`}
          onClick={() => onAdd(status)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <SortableContext
        id={status}
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "no-scrollbar flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-b-xl p-2 pt-0 transition-colors",
            isOver && "bg-muted",
          )}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
