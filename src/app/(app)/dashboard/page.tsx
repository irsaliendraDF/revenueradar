import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_name, onboarding_completed_at")
    .eq("user_id", user.id)
    .single<{ full_name: string | null; company_name: string | null; onboarding_completed_at: string | null }>();

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const greeting = profile.full_name || user.email;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="brand-eyebrow">Dashboard</p>
      <h1 className="brand-display text-3xl mt-1">Welcome, {greeting}.</h1>
      <p className="text-sm text-ink/70 mt-2">
        You&apos;re set up. Campaigns and the Scout Agent land in the next milestone.
        {profile.company_name ? ` Running Revenue Radar for ${profile.company_name}.` : ""}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="brand-callout">
          <p className="brand-eyebrow">Coming next</p>
          <h2 className="brand-display text-xl mt-1">Create your first campaign</h2>
          <p className="text-sm text-ink/75 mt-2">
            Scout Agent will research 20 accounts and hand 5 deep dives to the Outreach Agent.
          </p>
        </div>
        <div className="brand-callout">
          <p className="brand-eyebrow">Manage</p>
          <h2 className="brand-display text-xl mt-1">Settings</h2>
          <p className="text-sm text-ink/75 mt-2">
            Update your ICP, billing, BYOK keys, and HubSpot connection from one place.
          </p>
        </div>
      </div>
    </div>
  );
}
