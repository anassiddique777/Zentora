"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createSubtask, deleteTask, toggleSubtask } from "../actions";
import type { SubtaskItem } from "../types";

export function SubtaskSection({
  taskId,
  projectId,
  subtasks,
}: {
  taskId: string;
  projectId: string;
  subtasks: SubtaskItem[];
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    queryClient.invalidateQueries({ queryKey: ["board", projectId] });
  }

  const addMutation = useMutation({
    mutationFn: createSubtask,
    onSuccess: (result) => {
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setTitle("");
      invalidate();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleSubtask,
    onSuccess: (result) => {
      if ("error" in result) toast.error(result.error);
      invalidate();
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (result) => {
      if ("error" in result) toast.error(result.error);
      invalidate();
    },
  });

  const doneCount = subtasks.filter((subtask) => subtask.done).length;

  function onAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    addMutation.mutate({ parentId: taskId, title: trimmed });
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">Subtasks</h3>
        {subtasks.length > 0 && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {doneCount}/{subtasks.length}
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <ul className="space-y-1">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="group flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-muted/50"
            >
              <Checkbox
                checked={subtask.done}
                onCheckedChange={(checked) =>
                  toggleMutation.mutate({
                    taskId: subtask.id,
                    done: checked === true,
                  })
                }
                aria-label={`Mark "${subtask.title}" as ${subtask.done ? "not done" : "done"}`}
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  subtask.done && "text-muted-foreground line-through",
                )}
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                aria-label={`Delete subtask "${subtask.title}"`}
                onClick={() => removeMutation.mutate({ taskId: subtask.id })}
              >
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder="Add a subtask..."
          className="h-8"
          aria-label="New subtask title"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={onAdd}
          disabled={addMutation.isPending || !title.trim()}
        >
          <Plus aria-hidden />
          Add
        </Button>
      </div>
    </section>
  );
}
