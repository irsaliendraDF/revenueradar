import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type DashboardProfile = {
  full_name: string | null;
  company_name: string | null;
  onboarding_completed_at: string | null;
  scout_setup_completed_at: string | null;
  outreach_setup_completed_at: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, company_name, onboarding_completed_at, scout_setup_completed_at, outreach_setup_completed_at",
    )
    .eq("user_id", user.id)
    .single<DashboardProfile>();

  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  const scoutReady = Boolean(profile.scout_setup_completed_at);
  const outreachReady = Boolean(profile.outreach_setup_completed_at);
  const bothReady = scoutReady && outreachReady;
  const greeting = profile.full_name || user.email;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="brand-eyebrow">Dashboard</p>
      <h1 className="brand-display text-3xl mt-1">Welcome, {greeting}.</h1>
      <p className="text-sm text-ink/70 mt-2">
        {bothReady
          ? "Both agents are ready. Spin up your first campaign whenever you are."
          : "Set up each agent below. They share what you taught them in onboarding and add their own specifics."}
        {profile.company_name ? ` Running Revenue Radar for ${profile.company_name}.` : ""}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <AgentCard
          eyebrow="Agent 01"
          name="Scout Agent"
          tagline="Account intelligence with cited sources."
          body="Researches accounts using Exa, Firecrawl, BuiltWith, and public job boards. Returns firmographics, signals, and a fit score with every claim carrying a source URL."
          ready={scoutReady}
          setupHref="/agents/scout"
        />
        <AgentCard
          eyebrow="Agent 02"
          name="Outreach Agent"
          tagline="Personalized first-touch sequences."
          body="Drafts per-persona email sequences, LinkedIn messages, and call talk tracks, calibrated to your Fish, Dolphin, or Whale motion. Generation only. You send."
          ready={outreachReady}
          setupHref="/agents/outreach"
        />
      </div>

      <div className="mt-8">
        <CampaignCta enabled={bothReady} />
      </div>
    </div>
  );
}

function AgentCard({
  eyebrow,
  name,
  tagline,
  body,
  ready,
  setupHref,
}: {
  eyebrow: string;
  name: string;
  tagline: string;
  body: string;
  ready: boolean;
  setupHref: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-warm-white p-6 shadow-[var(--shadow-soft)] flex flex-col"
      style={{ borderColor: ready ? "var(--leaf)" : "var(--border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="brand-eyebrow">{eyebrow}</p>
          <h2 className="brand-display text-2xl mt-1">{name}</h2>
          <p className="text-sm text-ink/70 mt-1">{tagline}</p>
        </div>
        {ready ? (
          <span
            className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ background: "var(--cream)", color: "var(--forest)" }}
          >
            Ready
          </span>
        ) : (
          <span
            className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ background: "var(--cream)", color: "var(--muted)" }}
          >
            Not set up
          </span>
        )}
      </div>

      <p className="text-sm text-ink/75 mt-4 flex-1">{body}</p>

      <Link
        href={setupHref}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)]"
        style={{ background: "var(--gradient-sunset)" }}
      >
        {ready ? `Edit ${name.split(" ")[0]} setup` : `Set up ${name.split(" ")[0]}`}
      </Link>
    </div>
  );
}

function CampaignCta({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-warm-white/50 p-6 text-center">
        <p className="brand-eyebrow text-muted">Locked until both agents are ready</p>
        <h3 className="brand-display text-xl mt-1 text-ink/60">Create your first campaign</h3>
        <p className="text-sm text-ink/55 mt-2 max-w-md mx-auto">
          Finish Scout and Outreach setup above. We'll unlock campaign creation when both are
          ready.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 text-center"
      style={{ borderColor: "var(--gold)", background: "var(--cream)" }}
    >
      <p className="brand-eyebrow">Now you can</p>
      <h3 className="brand-display text-2xl mt-1">Create your first campaign</h3>
      <p className="text-sm text-ink/75 mt-2 max-w-md mx-auto">
        Hand Scout an ICP and a tier. It returns 20 researched accounts and tees up 5 deep dives
        for Outreach.
      </p>
      <Link
        href="/campaigns/new"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)]"
        style={{ background: "var(--gradient-sunset)" }}
      >
        Start a campaign
      </Link>
    </div>
  );
}
