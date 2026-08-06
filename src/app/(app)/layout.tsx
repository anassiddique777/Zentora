import { requireUser } from "@/lib/auth";

// Auth gate for the whole app area. The sidebar shell lives one
// level deeper in [workspaceSlug]/layout.tsx because it needs to
// know the active workspace; onboarding renders without a shell.
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireUser();
  return <>{children}</>;
}
