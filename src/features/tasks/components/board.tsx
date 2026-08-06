"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { moveTask } from "../actions";
import { TASK_STATUSES, type TaskStatus } from "../constants";
import { BoardColumn } from "./board-column";
import { TaskCardContent } from "./task-card";
import { TaskFormDialog } from "./task-form-dialog";
import type { BoardTask, MemberOption } from "../types";

type DialogState =
  | { mode: "closed" }
  | { mode: "create"; status: TaskStatus }
  | { mode: "edit"; task: BoardTask };

// Where should the dragged card land, and what fractional position
// keeps it there? `column` must NOT contain the dragged task.
function computePosition(column: BoardTask[], insertIndex: number): number {
  if (column.length === 0) return 1024;
  if (insertIndex <= 0) return column[0].position / 2;
  if (insertIndex >= column.length) {
    return column[column.length - 1].position + 1024;
  }
  return (column[insertIndex - 1].position + column[insertIndex].position) / 2;
}

export function Board({
  projectId,
  initialTasks,
  members,
}: {
  projectId: string;
  initialTasks: BoardTask[];
  members: MemberOption[];
}) {
  const queryClient = useQueryClient();
  const queryKey = ["board", projectId];

  const { data: tasks } = useQuery<BoardTask[]>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      if (!response.ok) throw new Error("Failed to load tasks");
      return response.json();
    },
    initialData: initialTasks,
  });

  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });

  const sensors = useSensors(
    // distance: 5px — clicks open the task, drags start after movement.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const columns = useMemo(() => {
    const grouped = Object.fromEntries(
      TASK_STATUSES.map((status) => [status, [] as BoardTask[]]),
    ) as Record<TaskStatus, BoardTask[]>;
    for (const task of tasks) {
      grouped[task.status]?.push(task);
    }
    for (const status of TASK_STATUSES) {
      grouped[status].sort((a, b) => a.position - b.position);
    }
    return grouped;
  }, [tasks]);

  const moveMutation = useMutation({
    mutationFn: moveTask,
    onMutate: async (input) => {
      // Optimistic update: apply the move locally before the server confirms.
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardTask[]>(queryKey);
      queryClient.setQueryData<BoardTask[]>(queryKey, (old) =>
        (old ?? []).map((task) =>
          task.id === input.taskId
            ? { ...task, status: input.status, position: input.position }
            : task,
        ),
      );
      return { previous };
    },
    onError: (_error, _input, context) => {
      // Roll back to the snapshot taken in onMutate.
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Failed to move task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((task) => task.id === event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    // Dropped either on a card (sortable data available) or on a column.
    const sortable = over.data.current?.sortable as
      | { containerId: TaskStatus; index: number }
      | undefined;

    const targetStatus = sortable?.containerId ?? (over.id as TaskStatus);
    if (!TASK_STATUSES.includes(targetStatus)) return;

    const columnWithoutTask = columns[targetStatus].filter(
      (t) => t.id !== task.id,
    );
    const insertIndex = sortable?.index ?? columnWithoutTask.length;

    const position = computePosition(columnWithoutTask, insertIndex);
    if (task.status === targetStatus && task.position === position) return;

    moveMutation.mutate({ taskId: task.id, status: targetStatus, position });
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="no-scrollbar flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
          {TASK_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={columns[status]}
              onAdd={(s) => setDialog({ mode: "create", status: s })}
              onEdit={(t) => setDialog({ mode: "edit", task: t })}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="rotate-2">
              <TaskCardContent task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        key={
          dialog.mode === "edit"
            ? dialog.task.id
            : dialog.mode === "create"
              ? `create-${dialog.status}`
              : "closed"
        }
        open={dialog.mode !== "closed"}
        onClose={() => setDialog({ mode: "closed" })}
        projectId={projectId}
        members={members}
        task={dialog.mode === "edit" ? dialog.task : undefined}
        defaultStatus={dialog.mode === "create" ? dialog.status : undefined}
      />
    </>
  );
}
