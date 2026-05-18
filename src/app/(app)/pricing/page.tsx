import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Tier = {
  id: "starter" | "growth" | "scale";
  eyebrow: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "starter",
    eyebrow: "Tier 01",
    name: "Starter",
    price: "$39",
    cadence: "CAD / month",
    blurb: "For founders running their first systematic outbound motion.",
    features: [
      "20 researched accounts per month",
      "3 deep dives with named decision makers",
      "3 outreach kits, full persona breakdown",
      "xlsx + docx + pdf downloads",
      "Source citations on every data point",
    ],
  },
  {
    id: "growth",
    eyebrow: "Tier 02",
    name: "Growth",
    price: "$129",
    cadence: "CAD / month",
    blurb: "Scale your prospecting and unlock the Signal Layer.",
    features: [
      "50 researched accounts per month",
      "5 deep dives with named decision makers",
      "5 outreach kits per cycle",
      "Quarterly signal refresh on tracked accounts",
      "BYOK: Apollo, Hunter, Clay, Sales Navigator",
      "Everything in Starter",
    ],
    highlight: true,
  },
  {
    id: "scale",
    eyebrow: "Tier 03",
    name: "Scale",
    price: "$349",
    cadence: "CAD / month",
    blurb: "Always-on intelligence with weekly signal updates.",
    features: [
      "Unlimited accounts (fair-use cap 500/mo)",
      "50 deep dives per month",
      "Weekly signal refresh + email digest",
      "Zapier webhook out",
      "White-label exports",
      "Everything in Growth",
    ],
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("user_id", user.id)
    .single<{ subscription_tier: string | null }>();

  const currentTier = profile?.subscription_tier;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="brand-eyebrow">Plans</p>
      <h1 className="brand-display text-3xl mt-1">
        Pick the tier that matches your motion.
      </h1>
      <p className="text-sm text-ink/70 mt-2 max-w-2xl">
        You can keep using the free tier as long as you'd like. Upgrade when you want more
        accounts, deep dives, or the Signal Layer. Annual billing saves ~17%; available at checkout
        once Stripe is connected.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          return (
            <div
              key={tier.id}
              className="rounded-2xl bg-warm-white p-6 flex flex-col"
              style={{
                border: tier.highlight ? "2px solid var(--gold)" : "1px solid var(--border)",
                boxShadow: tier.highlight ? "var(--shadow-hover)" : "var(--shadow-soft)",
                padding: tier.highlight ? "calc(1.5rem - 1px)" : "1.5rem",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="brand-eyebrow">{tier.eyebrow}</p>
                {tier.highlight ? (
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: "var(--cream)", color: "var(--gold)" }}
                  >
                    Most popular
                  </span>
                ) : null}
              </div>

              <h2 className="brand-display text-3xl mt-1">{tier.name}</h2>
              <p className="text-sm text-ink/70 mt-2 min-h-[2.5rem]">{tier.blurb}</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="brand-display text-4xl" style={{ color: "var(--gold)" }}>
                  {tier.price}
                </span>
                <span className="text-sm text-muted">{tier.cadence}</span>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-ink/80 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span
                      className="inline-block mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--gold)" }}
                      aria-hidden
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all disabled:opacity-60 cursor-not-allowed"
                style={{ background: "var(--gradient-sunset)" }}
                title="Stripe checkout unlocks once the DFC Inc. account is live"
              >
                {isCurrent ? "Current plan" : "Choose plan"}
              </button>
              <p className="mt-2 text-xs text-muted text-center">
                Stripe checkout unlocks soon. We'll email you the moment it's live.
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center">
        <Link href="/dashboard" className="text-sm text-forest hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
