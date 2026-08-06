import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "./constants";

export const createTaskSchema = z.object({
  projectId: z.uuid(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  assigneeId: z.uuid().nullable(),
  dueDate: z.iso.date().nullable(), // "YYYY-MM-DD"
});

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .extend({ taskId: z.uuid() });

export const moveTaskSchema = z.object({
  taskId: z.uuid(),
  status: z.enum(TASK_STATUSES),
  position: z.number().finite(),
});

export const deleteTaskSchema = z.object({
  taskId: z.uuid(),
});

export const createSubtaskSchema = z.object({
  parentId: z.uuid(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
});

export const toggleSubtaskSchema = z.object({
  taskId: z.uuid(),
  done: z.boolean(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type ToggleSubtaskInput = z.infer<typeof toggleSubtaskSchema>;
