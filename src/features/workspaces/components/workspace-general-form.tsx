"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { updateWorkspace } from "../actions";
import { createWorkspaceSchema, type CreateWorkspaceInput } from "../schemas";

export function WorkspaceGeneralForm({
  workspaceId,
  name,
  canEdit,
}: {
  workspaceId: string;
  name: string;
  canEdit: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name },
  });

  function onSubmit(values: CreateWorkspaceInput) {
    startTransition(async () => {
      const result = await updateWorkspace({ workspaceId, ...values });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Workspace updated");
      form.reset(values);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>
          {canEdit
            ? "Rename your workspace. The URL stays the same."
            : "Only owners and admins can change these settings."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-w-md items-end gap-2"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input
              id="workspace-name"
              disabled={!canEdit || isPending}
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          {canEdit && (
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending && <Loader2 className="animate-spin" aria-hidden />}
              Save
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
