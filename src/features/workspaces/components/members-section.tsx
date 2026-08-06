"use client";

import { useState, useTransition } from "react";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMember, removeMember, updateMemberRole } from "../actions";
import type { MemberRow, WorkspaceRole } from "../types";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

function canRemove(actor: WorkspaceRole, target: MemberRow): boolean {
  if (target.role === "OWNER") return false;
  if (actor === "OWNER") return true;
  return actor === "ADMIN" && target.role === "MEMBER";
}

export function MembersSection({
  workspaceId,
  members,
  currentUserId,
  currentRole,
}: {
  workspaceId: string;
  members: MemberRow[];
  currentUserId: string;
  currentRole: WorkspaceRole;
}) {
  const [email, setEmail] = useState("");
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);
  const [isAdding, startAdd] = useTransition();
  const [isMutating, startMutate] = useTransition();

  const canManage = currentRole !== "MEMBER";

  function onAdd() {
    const trimmed = email.trim();
    if (!trimmed) return;
    startAdd(async () => {
      const result = await addMember({ workspaceId, email: trimmed });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Member added");
      setEmail("");
    });
  }

  function onRoleChange(member: MemberRow, role: "ADMIN" | "MEMBER") {
    startMutate(async () => {
      const result = await updateMemberRole({
        workspaceId,
        memberId: member.id,
        role,
      });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`${member.user.name} is now ${ROLE_LABELS[role]}`);
    });
  }

  function onRemove() {
    if (!removeTarget) return;
    startMutate(async () => {
      const result = await removeMember({
        workspaceId,
        memberId: removeTarget.id,
      });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Member removed");
      setRemoveTarget(null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {members.length} {members.length === 1 ? "person" : "people"} in this
          workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {canManage && (
          <div className="flex max-w-md items-center gap-2">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onAdd();
                }
              }}
              placeholder="colleague@company.com"
              aria-label="Email of the person to add"
            />
            <Button onClick={onAdd} disabled={isAdding || !email.trim()}>
              {isAdding ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <UserPlus aria-hidden />
              )}
              Add
            </Button>
          </div>
        )}

        <ul className="divide-y rounded-lg border">
          {members.map((member) => {
            const isSelf = member.user.id === currentUserId;
            const showRoleSelect =
              currentRole === "OWNER" && member.role !== "OWNER";
            return (
              <li
                key={member.id}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <Avatar className="size-8">
                  <AvatarImage src={member.user.avatarUrl ?? undefined} alt="" />
                  <AvatarFallback>
                    {member.user.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.user.name}
                    {isSelf && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>

                {showRoleSelect ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      onRoleChange(member, value as "ADMIN" | "MEMBER")
                    }
                  >
                    <SelectTrigger
                      size="sm"
                      aria-label={`Role for ${member.user.name}`}
                      disabled={isMutating}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={member.role === "OWNER" ? "default" : "secondary"}
                  >
                    {ROLE_LABELS[member.role]}
                  </Badge>
                )}

                {!isSelf && canRemove(currentRole, member) && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${member.user.name}`}
                    onClick={() => setRemoveTarget(member)}
                  >
                    <UserMinus className="size-4" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {removeTarget?.user.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access to this workspace and all of its projects.
              Their tasks and comments stay intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                onRemove();
              }}
              disabled={isMutating}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isMutating ? "Removing..." : "Remove member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
