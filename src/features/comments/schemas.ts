import { z } from "zod";

export const createCommentSchema = z.object({
  taskId: z.uuid(),
  content: z
    .string()
    .min(1, "Comment can't be empty")
    .max(2000, "Comment must be at most 2000 characters"),
});

export const deleteCommentSchema = z.object({
  commentId: z.uuid(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
