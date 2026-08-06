import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  getMembership,
  getWorkspaceForUser,
  getWorkspaceMembers,
} from "@/features/workspaces/queries";
import { DangerZone } from "@/features/workspaces/components/danger-zone";
import { MembersSection } from "@/features/workspaces/components/members-section";
import { WorkspaceGeneralForm } from "@/features/workspaces/components/workspace-general-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const user = await requireUser();

  const workspace = await getWorkspaceForUser(workspaceSlug, user.id);
  if (!workspace) {
    notFound();
  }

  const [membership, members] = await Promise.all([
    getMembership(workspace.id, user.id),
    getWorkspaceMembers(workspace.id),
  ]);

  if (!membership) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace and its members.
        </p>
      </div>

      <WorkspaceGeneralForm
        workspaceId={workspace.id}
        name={workspace.name}
        canEdit={membership.role !== "MEMBER"}
      />

      <MembersSection
        workspaceId={workspace.id}
        members={members}
        currentUserId={user.id}
        currentRole={membership.role}
      />

      <DangerZone
        workspaceId={workspace.id}
        workspaceName={workspace.name}
        role={membership.role}
      />
    </div>
  );
}
