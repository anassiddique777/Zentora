"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createLabel, setTaskLabel } from "@/features/labels/actions";
import { PROJECT_COLORS } from "@/features/projects/schemas";
import type { LabelItem } from "../types";

export function LabelSection({
  taskId,
  projectId,
  workspaceId,
  labels,
  workspaceLabels,
}: {
  taskId: string;
  projectId: string;
  workspaceId: string;
  labels: LabelItem[];
  workspaceLabels: LabelItem[];
}) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(PROJECT_COLORS[1]);

  const activeIds = new Set(labels.map((label) => label.id));

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    queryClient.invalidateQueries({ queryKey: ["board", projectId] });
  }

  const toggleMutation = useMutation({
    mutationFn: setTaskLabel,
    onSuccess: (result) => {
      if ("error" in result) toast.error(result.error);
      invalidate();
    },
  });

  const createMutation = useMutation({
    mutationFn: createLabel,
    onSuccess: (result) => {
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setNewName("");
      invalidate();
    },
  });

  function onCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createMutation.mutate({ workspaceId, name: trimmed, color: newColor });
  }

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">Labels</h3>
      <div className="flex flex-wrap items-center gap-1.5">
        {labels.map((label) => (
          <Badge
            key={label.id}
            variant="outline"
            className="gap-1.5"
            style={{ borderColor: label.color }}
          >
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            {label.name}
          </Badge>
        ))}

        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 rounded-full px-2 text-xs"
              />
            }
          >
            <Plus className="size-3" aria-hidden />
            {labels.length === 0 ? "Add label" : "Edit"}
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="space-y-1">
              {workspaceLabels.length === 0 && (
                <p className="px-1 py-2 text-xs text-muted-foreground">
                  No labels in this workspace yet — create one below.
                </p>
              )}
              {workspaceLabels.map((label) => {
                const active = activeIds.has(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    onClick={() =>
                      toggleMutation.mutate({
                        taskId,
                        labelId: label.id,
                        active: !active,
                      })
                    }
                  >
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="flex-1 text-left">{label.name}</span>
                    {active && <Check className="size-4" aria-hidden />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 space-y-2 border-t pt-2">
              <Input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onCreate();
                  }
                }}
                placeholder="New label name..."
                className="h-8"
                aria-label="New label name"
              />
              <div className="flex items-center gap-1.5">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select color ${color}`}
                    aria-pressed={newColor === color}
                    onClick={() => setNewColor(color)}
                    className={cn(
                      "size-5 rounded-full transition-transform hover:scale-110",
                      newColor === color &&
                        "ring-2 ring-ring ring-offset-1 ring-offset-background",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto h-7"
                  onClick={onCreate}
                  disabled={createMutation.isPending || !newName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </section>
  );
}
