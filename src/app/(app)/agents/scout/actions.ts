"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ScoutState = { error?: string; info?: string };

const ALLOWED_SIGNALS = [
  "funding",
  "leadership_change",
  "hiring_velocity",
  "tech_stack_change",
  "ma_activity",
  "expansion",
  "product_launch",
  "content_themes",
];

export async function saveScoutSetup(
  _prev: ScoutState,
  formData: FormData,
): Promise<ScoutState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const signals = formData
    .getAll("scout_default_signals")
    .map((v) => String(v))
    .filter((v) => ALLOWED_SIGNALS.includes(v));
  const exclusions = String(formData.get("scout_default_exclusions") ?? "").trim() || null;

  if (signals.length === 0) {
    return { error: "Pick at least one signal Scout should watch for." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      scout_default_signals: signals,
      scout_default_exclusions: exclusions,
      scout_setup_completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/agents/scout");
  redirect("/dashboard");
}
