import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressBar } from "./ProgressBar";
import { CompanyBasicsForm } from "./CompanyBasicsForm";
import { IcpForm } from "./IcpForm";
import { FdwTiersForm } from "./FdwTiersForm";
import { ByokStep } from "./ByokStep";

type Profile = {
  company_name: string | null;
  company_website: string | null;
  product_one_liner: string | null;
  typical_deal_size_min: number | null;
  typical_deal_size_max: number | null;
  current_icp: string | null;
  dream_customers: { name?: string }[] | null;
  bad_fit_customers: { name?: string }[] | null;
  fdw_target_tiers: string[] | null;
  sales_motion: string | null;
  onboarding_completed_at: string | null;
};

function determineStep(p: Profile): 1 | 2 | 3 | 4 {
  if (!p.company_name || !p.product_one_liner) return 1;
  if (!p.current_icp) return 2;
  if (!p.fdw_target_tiers || p.fdw_target_tiers.length === 0) return 3;
  return 4;
}

const HEADINGS: Record<1 | 2 | 3 | 4, { eyebrow: string; title: string; sub: string }> = {
  1: {
    eyebrow: "About your company",
    title: "Tell us who you are.",
    sub: "Two minutes. Sets the context Scout uses to research accounts that look like your best fits.",
  },
  2: {
    eyebrow: "Ideal customer profile",
    title: "Who do you sell to today?",
    sub: "The clearer this is, the sharper Scout's results. You can refine anytime in Settings.",
  },
  3: {
    eyebrow: "Tier and motion",
    title: "How you sell.",
    sub: "Outreach tone, email length, and play structure adapt to the tiers you target.",
  },
  4: {
    eyebrow: "Integrations",
    title: "Optional: bring your own keys.",
    sub: "Skip this for now if you don't have any. Everything below unlocks at Growth and above.",
  },
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "company_name, company_website, product_one_liner, typical_deal_size_min, typical_deal_size_max, current_icp, dream_customers, bad_fit_customers, fdw_target_tiers, sales_motion, onboarding_completed_at",
    )
    .eq("user_id", user.id)
    .single<Profile>();

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="brand-callout text-sm" style={{ borderLeftColor: "#a47148" }}>
          We couldn&apos;t find your profile. Sign out and back in, then try again.
        </div>
      </div>
    );
  }

  if (profile.onboarding_completed_at) {
    redirect("/dashboard");
  }

  const step = determineStep(profile);
  const heading = HEADINGS[step];

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <ProgressBar current={step} />

      <p className="brand-eyebrow">{heading.eyebrow}</p>
      <h1 className="brand-display text-3xl mt-1">{heading.title}</h1>
      <p className="text-sm text-ink/70 mt-2 mb-8">{heading.sub}</p>

      <div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)]">
        {step === 1 ? (
          <CompanyBasicsForm
            defaults={{
              company_name: profile.company_name,
              company_website: profile.company_website,
              product_one_liner: profile.product_one_liner,
              typical_deal_size_min: profile.typical_deal_size_min,
              typical_deal_size_max: profile.typical_deal_size_max,
            }}
          />
        ) : null}

        {step === 2 ? (
          <IcpForm
            defaults={{
              current_icp: profile.current_icp,
              dream_customers: profile.dream_customers,
              bad_fit_customers: profile.bad_fit_customers,
            }}
          />
        ) : null}

        {step === 3 ? (
          <FdwTiersForm
            defaults={{
              fdw_target_tiers: profile.fdw_target_tiers,
              sales_motion: profile.sales_motion,
            }}
          />
        ) : null}

        {step === 4 ? <ByokStep /> : null}
      </div>
    </div>
  );
}
