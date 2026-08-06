import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be at most 50 characters"),
});

export const updateWorkspaceSchema = z.object({
  workspaceId: z.uuid(),
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be at most 50 characters"),
});

export const deleteWorkspaceSchema = z.object({
  workspaceId: z.uuid(),
});

export const addMemberSchema = z.object({
  workspaceId: z.uuid(),
  email: z.email("Enter a valid email address"),
});

export const updateMemberRoleSchema = z.object({
  workspaceId: z.uuid(),
  memberId: z.uuid(),
  role: z.enum(["ADMIN", "MEMBER"]), // OWNER is transferred, never assigned
});

export const removeMemberSchema = z.object({
  workspaceId: z.uuid(),
  memberId: z.uuid(),
});

export const leaveWorkspaceSchema = z.object({
  workspaceId: z.uuid(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export type LeaveWorkspaceInput = z.infer<typeof leaveWorkspaceSchema>;
