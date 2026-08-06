"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTask, deleteTask, updateTask } from "../actions";
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "../constants";
import type { BoardTask, MemberOption } from "../types";

const UNASSIGNED = "unassigned";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters"),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  assigneeId: z.string(),
  dueDate: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function TaskFormDialog({
  open,
  onClose,
  projectId,
  members,
  task,
  defaultStatus,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
  members: MemberOption[];
  task?: BoardTask;
  defaultStatus?: TaskStatus;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!task;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? defaultStatus ?? "TODO",
      priority: task?.priority ?? "NONE",
      assigneeId: task?.assignee?.id ?? UNASSIGNED,
      dueDate: task?.dueDate?.slice(0, 10) ?? "",
    },
  });

  function invalidateBoard() {
    queryClient.invalidateQueries({ queryKey: ["board", projectId] });
  }

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        status: values.status,
        priority: values.priority,
        assigneeId:
          values.assigneeId === UNASSIGNED ? null : values.assigneeId,
        dueDate: values.dueDate || null,
      };
      return isEditing
        ? updateTask({ ...payload, taskId: task.id })
        : createTask({ ...payload, projectId });
    },
    onSuccess: (result) => {
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      invalidateBoard();
      toast.success(isEditing ? "Task updated" : "Task created");
      onClose();
    },
    onError: () => toast.error("Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => deleteTask({ taskId: task!.id }),
    onSuccess: (result) => {
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      invalidateBoard();
      toast.success("Task deleted");
      setShowDeleteConfirm(false);
      onClose();
    },
    onError: () => toast.error("Something went wrong"),
  });

  const statusItems = TASK_STATUSES.map((status) => ({
    value: status,
    label: STATUS_CONFIG[status].label,
  }));
  const priorityItems = TASK_PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_CONFIG[priority].label,
  }));
  const assigneeItems = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...members.map((member) => ({ value: member.id, label: member.name })),
  ];

  const isPending = saveMutation.isPending || deleteMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit task" : "Create task"}</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="What needs to be done?"
                autoComplete="off"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="task-description"
                placeholder="Add more details..."
                rows={3}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  items={statusItems}
                  value={watch("status")}
                  onValueChange={(value) =>
                    setValue("status", value as TaskStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  items={priorityItems}
                  value={watch("priority")}
                  onValueChange={(value) =>
                    setValue("priority", value as TaskPriority)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  items={assigneeItems}
                  value={watch("assigneeId")}
                  onValueChange={(value) =>
                    setValue("assigneeId", value as string)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assigneeItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due date</Label>
                <Input id="task-due-date" type="date" {...register("dueDate")} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isEditing ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={isPending}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 aria-hidden />
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" disabled={isPending}>
                {saveMutation.isPending && (
                  <Loader2 className="animate-spin" aria-hidden />
                )}
                {isEditing ? "Save changes" : "Create task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the task and its comments and
              attachments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
