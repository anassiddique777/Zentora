"use client";

import { useState, useTransition } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteWorkspace, leaveWorkspace } from "../actions";
import type { WorkspaceRole } from "../types";

export function DangerZone({
  workspaceId,
  workspaceName,
  role,
}: {
  workspaceId: string;
  workspaceName: string;
  role: WorkspaceRole;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const isOwner = role === "OWNER";

  function onDelete() {
    startTransition(async () => {
      const result = await deleteWorkspace({ workspaceId });
      // On success the action redirects, so we only ever see errors here.
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  }

  function onLeave() {
    startTransition(async () => {
      const result = await leaveWorkspace({ workspaceId });
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          {isOwner
            ? "Deleting a workspace removes all of its projects, tasks, and members. There is no undo."
            : "Leaving removes your access to this workspace. An owner or admin can add you back later."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
        >
          {isOwner ? "Delete workspace" : "Leave workspace"}
        </Button>
      </CardContent>

      <AlertDialog
        open={showConfirm}
        onOpenChange={(open) => {
          setShowConfirm(open);
          if (!open) setConfirmText("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isOwner
                ? `Delete ${workspaceName}?`
                : `Leave ${workspaceName}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isOwner
                ? "This permanently deletes the workspace with all projects, tasks, comments, and memberships. This action cannot be undone."
                : "You will lose access immediately. Your tasks and comments stay in the workspace."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isOwner && (
            <div className="space-y-2">
              <Label htmlFor="confirm-name">
                Type <span className="font-semibold">{workspaceName}</span> to
                confirm
              </Label>
              <Input
                id="confirm-name"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                autoComplete="off"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                if (isOwner) onDelete();
                else onLeave();
              }}
              disabled={isPending || (isOwner && confirmText !== workspaceName)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending
                ? isOwner
                  ? "Deleting..."
                  : "Leaving..."
                : isOwner
                  ? "Delete workspace"
                  : "Leave workspace"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
