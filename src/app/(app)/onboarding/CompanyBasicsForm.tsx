"use client";

import { useActionState } from "react";
import { saveCompanyBasics, type StepState } from "./actions";

const initial: StepState = {};

type Defaults = {
  company_name?: string | null;
  company_website?: string | null;
  product_one_liner?: string | null;
  typical_deal_size_min?: number | null;
  typical_deal_size_max?: number | null;
};

export function CompanyBasicsForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveCompanyBasics, initial);

  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="brand-eyebrow">Company name</span>
        <input
          name="company_name"
          required
          defaultValue={defaults.company_name ?? ""}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="DigitalFlow Consulting"
        />
      </label>

      <label className="block">
        <span className="brand-eyebrow">Website</span>
        <input
          name="company_website"
          type="url"
          defaultValue={defaults.company_website ?? ""}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="https://yourcompany.com"
        />
      </label>

      <label className="block">
        <span className="brand-eyebrow">What you do, in one line</span>
        <input
          name="product_one_liner"
          required
          defaultValue={defaults.product_one_liner ?? ""}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="We build B2B revenue engines for Atlantic Canada founders."
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="brand-eyebrow">Typical deal size (min, CAD)</span>
          <input
            name="typical_deal_size_min"
            type="number"
            min="0"
            step="100"
            defaultValue={defaults.typical_deal_size_min ?? ""}
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="5000"
          />
        </label>

        <label className="block">
          <span className="brand-eyebrow">Typical deal size (max, CAD)</span>
          <input
            name="typical_deal_size_max"
            type="number"
            min="0"
            step="100"
            defaultValue={defaults.typical_deal_size_max ?? ""}
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="50000"
          />
        </label>
      </div>

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
