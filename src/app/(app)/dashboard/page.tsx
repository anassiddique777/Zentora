import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getUserWorkspaces } from "@/features/workspaces/queries";

// Entry point after login: sends the user to their first workspace,
// or to onboarding if they don't have one yet.
export default async function DashboardResolverPage() {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);

  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  redirect(`/${workspaces[0].slug}/dashboard`);
}
