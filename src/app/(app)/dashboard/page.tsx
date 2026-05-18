import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="brand-eyebrow">Dashboard</p>
      <h1 className="brand-display text-3xl mt-1">
        Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}.
      </h1>
      <p className="text-sm text-ink/70 mt-2">
        You&apos;re signed in. Phase 1 ships the foundation; onboarding, campaigns, and the Scout Agent
        land in the next milestones.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="brand-callout">
          <p className="brand-eyebrow">Up next</p>
          <h2 className="brand-display text-xl mt-1">Finish onboarding</h2>
          <p className="text-sm text-ink/75 mt-2">
            Tell us about your company, your ICP, and which Fish/Dolphin/Whale tier you sell into.
            Coming in the next deploy.
          </p>
        </div>
        <div className="brand-callout">
          <p className="brand-eyebrow">Coming soon</p>
          <h2 className="brand-display text-xl mt-1">Run your first campaign</h2>
          <p className="text-sm text-ink/75 mt-2">
            Scout Agent will research 20 accounts at a time and hand off 5 deep dives to the Outreach Agent.
          </p>
        </div>
      </div>
    </div>
  );
}
