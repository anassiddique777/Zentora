"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DangerZone } from "./danger-zone";
import { MembersSection } from "./members-section";
import { WorkspaceGeneralForm } from "./workspace-general-form";
import type { MemberRow, WorkspaceRole, WorkspaceSummary } from "../types";

export function SettingsDialog({
  workspace,
  members,
  currentUserId,
  currentRole,
  open,
  onClose,
}: {
  workspace: WorkspaceSummary;
  members: MemberRow[];
  currentUserId: string;
  currentRole: WorkspaceRole;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Workspace settings</DialogTitle>
          <DialogDescription>
            Manage {workspace.name} and its members.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <WorkspaceGeneralForm
            workspaceId={workspace.id}
            name={workspace.name}
            canEdit={currentRole !== "MEMBER"}
          />
          <MembersSection
            workspaceId={workspace.id}
            members={members}
            currentUserId={currentUserId}
            currentRole={currentRole}
          />
          <DangerZone
            workspaceId={workspace.id}
            workspaceName={workspace.name}
            role={currentRole}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
