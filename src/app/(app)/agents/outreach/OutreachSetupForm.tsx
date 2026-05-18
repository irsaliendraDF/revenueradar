"use client";

import { useActionState } from "react";
import { saveOutreachSetup, type OutreachState } from "./actions";

const initial: OutreachState = {};

type ProofPoint = { client?: string; outcome?: string };
type Defaults = {
  outreach_value_prop: string | null;
  outreach_proof_points: ProofPoint[] | null;
};

export function OutreachSetupForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveOutreachSetup, initial);
  const proofs = defaults.outreach_proof_points ?? [];

  return (
    <form action={action} className="space-y-6">
      <label className="block">
        <span className="brand-eyebrow">Your value proposition</span>
        <textarea
          name="outreach_value_prop"
          required
          rows={4}
          defaultValue={defaults.outreach_value_prop ?? ""}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="We help B2B founders ship a working CRM and a documented Sales Engine Playbook in 60 days, so their first sales hire can ramp without a 3-month rebuild."
        />
        <span className="mt-1 text-xs text-muted">
          Outreach uses this as the spine of every first-touch email. Make it outcome-led, no jargon.
        </span>
      </label>

      <div>
        <p className="brand-eyebrow mb-3">Proof points (add 1 to 3)</p>
        <p className="text-xs text-muted mb-3">
          Specific outcomes for named or anonymized clients. Used to ground every email.
        </p>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => {
            const proof = proofs[i] ?? {};
            return (
              <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                <input
                  name={`proof_client_${i}`}
                  type="text"
                  defaultValue={proof.client ?? ""}
                  className="rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  placeholder={`Client ${i + 1}`}
                />
                <input
                  name={`proof_outcome_${i}`}
                  type="text"
                  defaultValue={proof.outcome ?? ""}
                  className="rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  placeholder="Outcome (e.g., reduced sales cycle from 78 to 41 days)"
                />
              </div>
            );
          })}
        </div>
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
        {pending ? "Saving..." : "Save Outreach setup"}
      </button>
    </form>
  );
}
