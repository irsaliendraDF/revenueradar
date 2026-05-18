import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type SettingsProfile = {
  full_name: string | null;
  company_name: string | null;
  company_website: string | null;
  product_one_liner: string | null;
  subscription_tier: string | null;
  hubspot_portal_id: string | null;
  scout_setup_completed_at: string | null;
  outreach_setup_completed_at: string | null;
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, company_name, company_website, product_one_liner, subscription_tier, hubspot_portal_id, scout_setup_completed_at, outreach_setup_completed_at",
    )
    .eq("user_id", user.id)
    .single<SettingsProfile>();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div>
        <p className="brand-eyebrow">Settings</p>
        <h1 className="brand-display text-3xl mt-1">Your account.</h1>
        <p className="text-sm text-ink/70 mt-2">
          Manage your profile, subscription, and integrations. Detailed editing for company info
          and ICP comes in the next milestone.
        </p>
      </div>

      <section className="bg-warm-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
        <p className="brand-eyebrow">Profile</p>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="text-muted">Email</dt>
          <dd className="text-ink">{user.email}</dd>
          <dt className="text-muted">Full name</dt>
          <dd className="text-ink">{profile?.full_name ?? <span className="text-muted">Not set</span>}</dd>
          <dt className="text-muted">Company</dt>
          <dd className="text-ink">{profile?.company_name ?? <span className="text-muted">Not set</span>}</dd>
          <dt className="text-muted">Website</dt>
          <dd className="text-ink">{profile?.company_website ?? <span className="text-muted">Not set</span>}</dd>
          <dt className="text-muted">Product</dt>
          <dd className="text-ink">{profile?.product_one_liner ?? <span className="text-muted">Not set</span>}</dd>
        </dl>
        <p className="text-xs text-muted mt-4">
          To re-edit company info or ICP, re-run onboarding (coming soon as an editable wizard).
        </p>
      </section>

      <section className="bg-warm-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
        <p className="brand-eyebrow">Agents</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between items-center">
            <span className="text-ink">Scout Agent</span>
            <StatusPill ready={Boolean(profile?.scout_setup_completed_at)} />
          </li>
          <li className="flex justify-between items-center">
            <span className="text-ink">Outreach Agent</span>
            <StatusPill ready={Boolean(profile?.outreach_setup_completed_at)} />
          </li>
        </ul>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex h-9 items-center rounded-full border border-border bg-cream px-4 text-sm font-medium text-ink transition-colors hover:bg-warm-white"
        >
          Manage from dashboard
        </Link>
      </section>

      <section className="bg-warm-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
        <p className="brand-eyebrow">Subscription</p>
        <p className="text-sm text-ink mt-2">
          {profile?.subscription_tier
            ? `Current tier: ${profile.subscription_tier}`
            : "No active subscription."}
        </p>
        <p className="text-xs text-muted mt-2">
          Stripe self-serve billing unlocks once the DigitalFlow Consulting Inc. Stripe account is
          live (Chase business account in progress).
        </p>
      </section>

      <section className="bg-warm-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
        <p className="brand-eyebrow">Integrations</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between items-center">
            <span className="text-ink">HubSpot</span>
            {profile?.hubspot_portal_id ? (
              <span className="font-mono text-xs text-forest">Connected ({profile.hubspot_portal_id})</span>
            ) : (
              <span className="font-mono text-xs text-muted">Not connected</span>
            )}
          </li>
          <li className="flex justify-between items-center">
            <span className="text-ink">Apollo / Hunter / Clay / Sales Nav</span>
            <span className="font-mono text-xs text-muted">Tier 2+</span>
          </li>
        </ul>
        <p className="text-xs text-muted mt-3">
          HubSpot OAuth lands in the next milestone. BYOK keys unlock at Growth and above.
        </p>
      </section>
    </div>
  );
}

function StatusPill({ ready }: { ready: boolean }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
      style={{
        background: "var(--cream)",
        color: ready ? "var(--forest)" : "var(--muted)",
      }}
    >
      {ready ? "Ready" : "Not set up"}
    </span>
  );
}
