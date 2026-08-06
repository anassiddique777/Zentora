"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesColumn,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
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
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import type { WorkspaceSummary } from "@/features/workspaces/types";
import type { SessionUser } from "@/types/user";

const NAV_MAIN = [
  { title: "Dashboard", segment: "dashboard", icon: LayoutDashboard },
  { title: "My Tasks", segment: "tasks", icon: ListTodo },
  { title: "Projects", segment: "projects", icon: FolderKanban },
  { title: "Calendar", segment: "calendar", icon: CalendarDays },
  { title: "Analytics", segment: "analytics", icon: ChartNoAxesColumn },
] as const;

const NAV_SECONDARY = [
  { title: "Settings", segment: "settings", icon: Settings },
] as const;

export function AppSidebar({
  user,
  workspaces,
  activeWorkspace,
}: {
  user: SessionUser;
  workspaces: WorkspaceSummary[];
  activeWorkspace: WorkspaceSummary;
}) {
  const pathname = usePathname();

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
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_SECONDARY.map((item) => (
                <SidebarMenuItem key={item.segment}>
                  <SidebarMenuButton
                    render={<Link href={hrefFor(item.segment)} />}
                    tooltip={item.title}
                    isActive={pathname.startsWith(hrefFor(item.segment))}
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
