import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OutreachSetupForm } from "./OutreachSetupForm";

type OutreachProfile = {
  onboarding_completed_at: string | null;
  outreach_value_prop: string | null;
  outreach_proof_points: { client?: string; outcome?: string }[] | null;
  outreach_setup_completed_at: string | null;
};

export default async function OutreachAgentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "onboarding_completed_at, outreach_value_prop, outreach_proof_points, outreach_setup_completed_at",
    )
    .eq("user_id", user.id)
    .single<OutreachProfile>();

  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/dashboard" className="brand-eyebrow text-muted hover:text-ink transition-colors">
        Back to dashboard
      </Link>

      <p className="brand-eyebrow mt-6">Outreach Agent</p>
      <h1 className="brand-display text-3xl mt-1">
        Set up <span style={{ color: "var(--gold)" }}>Outreach</span>.
      </h1>
      <p className="text-sm text-ink/70 mt-2 mb-8">
        Outreach drafts per-persona email sequences, LinkedIn messages, and call talk tracks. Tell
        it what you sell and why it works, and it grounds every message in your real outcomes.
        Nothing is sent automatically; you copy and paste from the kit.
      </p>

      <div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)]">
        <OutreachSetupForm
          defaults={{
            outreach_value_prop: profile.outreach_value_prop,
            outreach_proof_points: profile.outreach_proof_points,
          }}
        />
      </div>
    </div>
  );
}
