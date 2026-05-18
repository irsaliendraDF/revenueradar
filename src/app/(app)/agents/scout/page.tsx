import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoutSetupForm } from "./ScoutSetupForm";

type ScoutProfile = {
  onboarding_completed_at: string | null;
  scout_default_signals: string[] | null;
  scout_default_exclusions: string | null;
  scout_setup_completed_at: string | null;
};

export default async function ScoutAgentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "onboarding_completed_at, scout_default_signals, scout_default_exclusions, scout_setup_completed_at",
    )
    .eq("user_id", user.id)
    .single<ScoutProfile>();

  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/dashboard" className="brand-eyebrow text-muted hover:text-ink transition-colors">
        Back to dashboard
      </Link>

      <p className="brand-eyebrow mt-6">Scout Agent</p>
      <h1 className="brand-display text-3xl mt-1">
        Set up <span style={{ color: "var(--gold)" }}>Scout</span>.
      </h1>
      <p className="text-sm text-ink/70 mt-2 mb-8">
        Scout researches accounts using Exa, Firecrawl, BuiltWith, and public job boards. Every
        claim it returns carries a source URL and a timestamp. Pick which signals it should
        prioritize and which patterns it should exclude.
      </p>

      <div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)]">
        <ScoutSetupForm
          defaults={{
            scout_default_signals: profile.scout_default_signals,
            scout_default_exclusions: profile.scout_default_exclusions,
          }}
        />
      </div>
    </div>
  );
}
