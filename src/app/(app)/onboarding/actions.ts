"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type StepState = { error?: string };

async function getCurrentUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return { supabase, userId: user.id };
}

function parseCustomers(text: string): { name: string }[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}

export async function saveCompanyBasics(
  _prev: StepState,
  formData: FormData,
): Promise<StepState> {
  const { supabase, userId } = await getCurrentUserId();

  const company_name = String(formData.get("company_name") ?? "").trim();
  const company_website = String(formData.get("company_website") ?? "").trim() || null;
  const product_one_liner = String(formData.get("product_one_liner") ?? "").trim();
  const deal_min = formData.get("typical_deal_size_min");
  const deal_max = formData.get("typical_deal_size_max");

  if (!company_name) return { error: "Company name is required." };
  if (!product_one_liner) return { error: "A one-line product description is required." };

  const typical_deal_size_min = deal_min ? Number(deal_min) : null;
  const typical_deal_size_max = deal_max ? Number(deal_max) : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      company_name,
      company_website,
      product_one_liner,
      typical_deal_size_min,
      typical_deal_size_max,
    })
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/onboarding");
  return {};
}

export async function saveIcp(
  _prev: StepState,
  formData: FormData,
): Promise<StepState> {
  const { supabase, userId } = await getCurrentUserId();

  const current_icp = String(formData.get("current_icp") ?? "").trim();
  const dream_text = String(formData.get("dream_customers") ?? "");
  const bad_text = String(formData.get("bad_fit_customers") ?? "");

  if (!current_icp) return { error: "Describe your current ICP to continue." };

  const dream_customers = parseCustomers(dream_text);
  const bad_fit_customers = parseCustomers(bad_text);

  const { error } = await supabase
    .from("profiles")
    .update({
      current_icp,
      dream_customers,
      bad_fit_customers,
    })
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/onboarding");
  return {};
}

export async function saveFdwTiers(
  _prev: StepState,
  formData: FormData,
): Promise<StepState> {
  const { supabase, userId } = await getCurrentUserId();

  const tiers = formData.getAll("fdw_target_tiers").map((v) => String(v));
  const sales_motion = String(formData.get("sales_motion") ?? "") || null;

  if (tiers.length === 0) {
    return { error: "Pick at least one tier you sell into." };
  }

  const allowed = ["fish", "dolphin", "whale"];
  const filtered = tiers.filter((t) => allowed.includes(t));

  const motionAllowed = ["founder_led", "small_team", "full_team"];
  const finalMotion = sales_motion && motionAllowed.includes(sales_motion) ? sales_motion : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      fdw_target_tiers: filtered,
      sales_motion: finalMotion,
    })
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/onboarding");
  return {};
}

export async function completeOnboarding(): Promise<void> {
  const { supabase, userId } = await getCurrentUserId();

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
