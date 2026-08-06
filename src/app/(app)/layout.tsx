import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types/user";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards these routes; this is a defense-in-depth check.
  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, avatarUrl: true },
  });

  const sessionUser: SessionUser = {
    id: user.id,
    name: profile?.name ?? user.email?.split("@")[0] ?? "User",
    email: profile?.email ?? user.email ?? "",
    avatarUrl: profile?.avatarUrl ?? null,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={sessionUser} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
