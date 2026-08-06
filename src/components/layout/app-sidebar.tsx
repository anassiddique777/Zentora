"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesColumn,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/layout/nav-user";
import { ProfileDialog } from "@/components/layout/profile-dialog";
import { SettingsDialog } from "@/features/workspaces/components/settings-dialog";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { logout } from "@/features/auth/actions";
import type {
  MemberRow,
  WorkspaceRole,
  WorkspaceSummary,
} from "@/features/workspaces/types";
import type { SessionUser } from "@/types/user";

const NAV_MAIN = [
  { title: "Dashboard", segment: "dashboard", icon: LayoutDashboard },
  { title: "My Tasks", segment: "tasks", icon: ListTodo },
  { title: "Projects", segment: "projects", icon: FolderKanban },
  { title: "Calendar", segment: "calendar", icon: CalendarDays },
  { title: "Analytics", segment: "analytics", icon: ChartNoAxesColumn },
] as const;

// Slightly larger than the sidebar's text-sm default.
const NAV_TEXT = "text-[15px] [&_svg:not([class*='size-'])]:size-4.5";

export function AppSidebar({
  user,
  workspaces,
  activeWorkspace,
  members,
  currentRole,
}: {
  user: SessionUser;
  workspaces: WorkspaceSummary[];
  activeWorkspace: WorkspaceSummary;
  members: MemberRow[];
  currentRole: WorkspaceRole;
}) {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  function hrefFor(segment: string): string {
    return `/${activeWorkspace.slug}/${segment}`;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_MAIN.map((item) => (
                <SidebarMenuItem key={item.segment}>
                  <SidebarMenuButton
                    render={<Link href={hrefFor(item.segment)} />}
                    tooltip={item.title}
                    isActive={pathname.startsWith(hrefFor(item.segment))}
                    className={NAV_TEXT}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={user}
          onOpenProfile={() => setShowProfile(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
          <SidebarMenuButton
            onClick={() => logout()}
            tooltip="Log out"
            className={`${NAV_TEXT} flex-1 text-destructive hover:text-destructive`}
          >
            <LogOut />
            <span>Log out</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            onClick={() => setShowSettings(true)}
            tooltip="Settings"
            aria-label="Settings"
            className={`${NAV_TEXT} w-8 flex-none justify-center`}
          >
            <Settings />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>

      <ProfileDialog
        user={user}
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />
      <SettingsDialog
        workspace={activeWorkspace}
        members={members}
        currentUserId={user.id}
        currentRole={currentRole}
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </Sidebar>
  );
}
