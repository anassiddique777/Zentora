"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/format";
import { createComment, deleteComment } from "@/features/comments/actions";
import type { CommentItem } from "../types";

export function CommentSection({
  taskId,
  projectId,
  comments,
}: {
  taskId: string;
  projectId: string;
  comments: CommentItem[];
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    queryClient.invalidateQueries({ queryKey: ["board", projectId] });
  }

  const addMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (result) => {
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setContent("");
      invalidate();
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (result) => {
      if ("error" in result) toast.error(result.error);
      invalidate();
    },
  });

  function onSubmit() {
    const trimmed = content.trim();
    if (!trimmed) return;
    addMutation.mutate({ taskId, content: trimmed });
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">
        Comments{" "}
        {comments.length > 0 && (
          <span className="font-normal text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </h3>

      {comments.length > 0 && (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="group flex gap-3">
              <Avatar className="size-7">
                <AvatarImage
                  src={comment.author.avatarUrl ?? undefined}
                  alt=""
                />
                <AvatarFallback className="text-xs">
                  {comment.author.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">
                    {comment.author.name}
                  </span>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={comment.createdAt}
                  >
                    {formatRelativeTime(comment.createdAt)}
                  </time>
                  {comment.isOwn && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      aria-label="Delete comment"
                      onClick={() =>
                        removeMutation.mutate({ commentId: comment.id })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap text-foreground/90">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment..."
          rows={2}
          aria-label="New comment"
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              onSubmit();
            }
          }}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={addMutation.isPending || !content.trim()}
          >
            {addMutation.isPending && (
              <Loader2 className="animate-spin" aria-hidden />
            )}
            Comment
          </Button>
        </div>
      </div>
    </section>
  );
}
