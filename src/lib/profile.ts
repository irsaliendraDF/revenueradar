import { createClient } from "@/lib/supabase/server";

/**
 * Ensures a profiles row exists for the given user. The on_auth_user_created
 * trigger should normally handle this, but this helper is defensive in case
 * the trigger fails or the user predates the trigger.
 */
export async function ensureProfile(userId: string, fullName?: string | null) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return;

  await supabase
    .from("profiles")
    .insert({ user_id: userId, full_name: fullName ?? null });
}
