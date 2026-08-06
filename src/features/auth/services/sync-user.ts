import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

// Keeps our public "users" table in sync with Supabase Auth.
// Called after signup confirmation and on login.
export async function syncUserProfile(user: SupabaseUser): Promise<void> {
  if (!user.email) return;

  const name =
    (user.user_metadata.name as string | undefined) ??
    user.email.split("@")[0];

  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email, name },
    create: { id: user.id, email: user.email, name },
  });
}
