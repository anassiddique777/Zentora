import { z } from "zod";

export const createLabelSchema = z.object({
  workspaceId: z.uuid(),
  name: z
    .string()
    .min(1, "Label name is required")
    .max(30, "Label name must be at most 30 characters"),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid color"),
});

export const setTaskLabelSchema = z.object({
  taskId: z.uuid(),
  labelId: z.uuid(),
  active: z.boolean(),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type SetTaskLabelInput = z.infer<typeof setTaskLabelSchema>;
