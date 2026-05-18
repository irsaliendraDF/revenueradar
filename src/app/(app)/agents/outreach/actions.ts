"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OutreachState = { error?: string };

type ProofPoint = { client: string; outcome: string };

export async function saveOutreachSetup(
  _prev: OutreachState,
  formData: FormData,
): Promise<OutreachState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const value_prop = String(formData.get("outreach_value_prop") ?? "").trim();
  if (!value_prop) return { error: "A value proposition is required." };

  const proofs: ProofPoint[] = [];
  for (let i = 0; i < 3; i++) {
    const client = String(formData.get(`proof_client_${i}`) ?? "").trim();
    const outcome = String(formData.get(`proof_outcome_${i}`) ?? "").trim();
    if (client || outcome) {
      proofs.push({ client, outcome });
    }
  }

  if (proofs.length === 0) {
    return { error: "Add at least one proof point (client + outcome) so Outreach can ground its claims." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      outreach_value_prop: value_prop,
      outreach_proof_points: proofs,
      outreach_setup_completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/agents/outreach");
  redirect("/dashboard");
}
