import { z } from "zod";

export const PROJECT_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
] as const;

export const createProjectSchema = z.object({
  workspaceId: z.uuid(),
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(50, "Project name must be at most 50 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid color"),
});

export const updateProjectSchema = createProjectSchema
  .omit({ workspaceId: true })
  .extend({ projectId: z.uuid() });

export const deleteProjectSchema = z.object({
  projectId: z.uuid(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
