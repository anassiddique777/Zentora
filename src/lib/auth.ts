import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Single place to resolve the authenticated user on the server.
// Redirects to login if the session is missing or invalid.
export async function requireUser(): Promise<SupabaseUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
