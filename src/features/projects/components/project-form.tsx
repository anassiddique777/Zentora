"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createProject, updateProject } from "../actions";
import { PROJECT_COLORS } from "../schemas";
import type { ProjectCardData } from "../types";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(50, "Project name must be at most 50 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters"),
  color: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProjectForm({
  workspaceId,
  project,
  onDone,
}: {
  workspaceId: string;
  project?: ProjectCardData;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      color: project?.color ?? PROJECT_COLORS[0],
    },
  });

  const selectedColor = watch("color");

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        name: values.name,
        description: values.description || undefined,
        color: values.color,
      };

      const result = isEditing
        ? await updateProject({ ...payload, projectId: project.id })
        : await createProject({ ...payload, workspaceId });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Project updated" : "Project created");
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="project-name">Name</Label>
        <Input
          id="project-name"
          placeholder="e.g. Marketing Website"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">
          Description{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="project-description"
          placeholder="What is this project about?"
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

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Color</legend>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Select color ${color}`}
              aria-pressed={selectedColor === color}
              onClick={() => setValue("color", color)}
              className={cn(
                "size-7 rounded-full transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selectedColor === color &&
                  "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </fieldset>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" aria-hidden />}
        {isEditing ? "Save changes" : "Create project"}
      </Button>
    </form>
  );
}
