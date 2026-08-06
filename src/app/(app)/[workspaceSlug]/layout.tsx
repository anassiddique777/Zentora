import { notFound } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getMembership,
  getUserWorkspaces,
  getWorkspaceForUser,
  getWorkspaceMembers,
} from "@/features/workspaces/queries";
import type { SessionUser } from "@/types/user";

export default async function WorkspaceLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}>) {
  const { workspaceSlug } = await params;
  const user = await requireUser();

  // Membership check: non-members get a 404, as if the workspace
  // doesn't exist at all.
  const workspace = await getWorkspaceForUser(workspaceSlug, user.id);
  if (!workspace) {
    notFound();
  }

  const [workspaces, profile, membership, members] = await Promise.all([
    getUserWorkspaces(user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true, avatarUrl: true },
    }),
    getMembership(workspace.id, user.id),
    // Settings dialog data — revalidatePath keeps it fresh after actions.
    getWorkspaceMembers(workspace.id),
  ]);

  if (!membership) {
    notFound();
  }

  const sessionUser: SessionUser = {
    id: user.id,
    name: profile?.name ?? user.email?.split("@")[0] ?? "User",
    email: profile?.email ?? user.email ?? "",
    avatarUrl: profile?.avatarUrl ?? null,
  };

  return (
    <SidebarProvider>
      <AppSidebar
        user={sessionUser}
        workspaces={workspaces}
        activeWorkspace={workspace}
        members={members}
        currentRole={membership.role}
      />
      <SidebarInset className="h-svh min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
