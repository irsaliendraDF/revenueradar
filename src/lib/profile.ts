import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ensures a profiles row exists for the given user. The on_auth_user_created
 * trigger should normally handle this, but this helper is defensive in case
 * the trigger fails, the user predates the trigger, or RLS blocks the
 * standard insert path. Uses the service-role client for the insert so it
 * succeeds even without the profiles_insert_own policy.
 */
export async function ensureProfile(userId: string, fullName?: string | null) {
  const supabase = await createClient();

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("[ensureProfile] select failed", { userId, error: selectError });
    return;
  }

  if (existing) return;

  const admin = createAdminClient();
  const { error: insertError } = await admin
    .from("profiles")
    .upsert(
      { user_id: userId, full_name: fullName ?? null },
      { onConflict: "user_id", ignoreDuplicates: true },
    );

  if (insertError) {
    console.error("[ensureProfile] insert failed", { userId, error: insertError });
  }
}
