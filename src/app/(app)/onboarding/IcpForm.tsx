"use client";

import { useActionState } from "react";
import { saveIcp, type StepState } from "./actions";

const initial: StepState = {};

type Customer = { name?: string };
type Defaults = {
  current_icp?: string | null;
  dream_customers?: Customer[] | null;
  bad_fit_customers?: Customer[] | null;
};

function customersToText(list: Customer[] | null | undefined): string {
  if (!list || list.length === 0) return "";
  return list.map((c) => c.name ?? "").filter(Boolean).join("\n");
}

export function IcpForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveIcp, initial);

  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="brand-eyebrow">Your current ideal customer</span>
        <textarea
          name="current_icp"
          required
          rows={4}
          defaultValue={defaults.current_icp ?? ""}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="Founder-led B2B SaaS, 10 to 50 employees, $1M to $10M ARR, post-product fit but pre-sales-team, Canada or US."
        />
        <span className="mt-1 text-xs text-muted">
          Plain language. Industry, size, stage, geography, any other filters.
        </span>
      </label>

      <label className="block">
        <span className="brand-eyebrow">Dream customers (one per line)</span>
        <textarea
          name="dream_customers"
          rows={3}
          defaultValue={customersToText(defaults.dream_customers)}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="Acme Co.&#10;Globex Corp.&#10;Initech"
        />
        <span className="mt-1 text-xs text-muted">
          Names of companies you wish were customers. We use these to find similar accounts.
        </span>
      </label>

      <label className="block">
        <span className="brand-eyebrow">Bad-fit customers (one per line)</span>
        <textarea
          name="bad_fit_customers"
          rows={3}
          defaultValue={customersToText(defaults.bad_fit_customers)}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="Enterprise government&#10;Series C+ funded with full sales orgs"
        />
        <span className="mt-1 text-xs text-muted">
          Patterns you want filtered out. We exclude accounts that look like these.
        </span>
      </label>

      {state.error ? (
        <p className="text-sm" style={{ color: "#a47148" }}>{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)] disabled:opacity-60"
        style={{ background: "var(--gradient-sunset)" }}
      >
        {pending ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
