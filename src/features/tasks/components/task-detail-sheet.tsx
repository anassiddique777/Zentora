"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Flag, Pencil, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants";
import { CommentSection } from "./comment-section";
import { LabelSection } from "./label-section";
import { SubtaskSection } from "./subtask-section";
import type { TaskDetail } from "../types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TaskDetailSheet({
  taskId,
  projectId,
  onClose,
  onEdit,
}: {
  taskId: string | null;
  projectId: string;
  onClose: () => void;
  onEdit: (taskId: string) => void;
}) {
  const { data: task, isPending } = useQuery<TaskDetail>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) throw new Error("Failed to load task");
      return response.json();
    },
    enabled: !!taskId,
  });

  return (
    <Sheet open={!!taskId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg"
      >
        {isPending || !task ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  {(() => {
                    const config = STATUS_CONFIG[task.status];
                    return (
                      <>
                        <config.icon
                          className={cn("size-3.5", config.className)}
                          aria-hidden
                        />
                        {config.label}
                      </>
                    );
                  })()}
                </Badge>
                {task.priority !== "NONE" && (
                  <Badge variant="secondary" className="gap-1.5">
                    <Flag
                      className={cn(
                        "size-3.5",
                        PRIORITY_CONFIG[task.priority].className,
                      )}
                      aria-hidden
                    />
                    {PRIORITY_CONFIG[task.priority].label}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto mr-6"
                  onClick={() => onEdit(task.id)}
                >
                  <Pencil aria-hidden />
                  Edit
                </Button>
              </div>
              <SheetTitle className="text-left text-xl leading-snug">
                {task.title}
              </SheetTitle>
              {task.description ? (
                <SheetDescription className="text-left whitespace-pre-wrap">
                  {task.description}
                </SheetDescription>
              ) : (
                <SheetDescription className="text-left italic">
                  No description
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="flex flex-col gap-5 p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" aria-hidden />
                  {task.assignee ? (
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Avatar className="size-5">
                        <AvatarImage
                          src={task.assignee.avatarUrl ?? undefined}
                          alt=""
                        />
                        <AvatarFallback className="text-[10px]">
                          {task.assignee.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {task.assignee.name}
                    </span>
                  ) : (
                    "Unassigned"
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden />
                  {task.dueDate ? (
                    <span className="text-foreground">
                      {formatDate(task.dueDate)}
                    </span>
                  ) : (
                    "No due date"
                  )}
                </div>
              </div>

              <Separator />

              <SubtaskSection
                taskId={task.id}
                projectId={projectId}
                subtasks={task.subtasks}
              />

              <Separator />

              <LabelSection
                taskId={task.id}
                projectId={projectId}
                workspaceId={task.workspaceId}
                labels={task.labels}
                workspaceLabels={task.workspaceLabels}
              />

              <Separator />

              <CommentSection
                taskId={task.id}
                projectId={projectId}
                comments={task.comments}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
