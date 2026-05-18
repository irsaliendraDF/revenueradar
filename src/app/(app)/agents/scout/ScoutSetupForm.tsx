"use client";

import { useActionState, useState } from "react";
import { saveScoutSetup, type ScoutState } from "./actions";

const initial: ScoutState = {};

const SIGNAL_OPTIONS = [
  { id: "funding", label: "New funding round", blurb: "Single most predictive signal of buying readiness." },
  { id: "leadership_change", label: "Leadership change", blurb: "Especially CRO, VP Sales, VP Marketing." },
  { id: "hiring_velocity", label: "Hiring velocity spike", blurb: "Sales and revenue roles indicate scaling intent." },
  { id: "tech_stack_change", label: "Tech stack change", blurb: "Inferred from job postings and tools mentioned." },
  { id: "ma_activity", label: "M&A activity", blurb: "Acquired, acquiring, or restructuring." },
  { id: "expansion", label: "Expansion", blurb: "New office or new market." },
  { id: "product_launch", label: "Product launch", blurb: "New product or major release." },
  { id: "content_themes", label: "Content themes", blurb: "What the company is publicly talking about." },
] as const;

type Defaults = {
  scout_default_signals: string[] | null;
  scout_default_exclusions: string | null;
};

export function ScoutSetupForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveScoutSetup, initial);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(defaults.scout_default_signals ?? ["funding", "hiring_velocity"]),
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <p className="brand-eyebrow mb-3">Signals to watch (pick at least one)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SIGNAL_OPTIONS.map((s) => {
            const active = selected.has(s.id);
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => toggle(s.id)}
                className="text-left rounded-xl border p-4 transition-all"
                style={{
                  borderColor: active ? "var(--gold)" : "var(--border)",
                  borderWidth: active ? "2px" : "1px",
                  padding: active ? "calc(1rem - 1px)" : "1rem",
                  background: active ? "var(--cream)" : "var(--warm-white)",
                  boxShadow: active ? "var(--shadow-soft)" : "none",
                }}
              >
                <h3 className="font-medium text-ink text-sm">{s.label}</h3>
                <p className="text-xs text-ink/70 mt-1">{s.blurb}</p>
              </button>
            );
          })}
        </div>
        {Array.from(selected).map((id) => (
          <input type="hidden" name="scout_default_signals" key={id} value={id} />
        ))}
      </div>

      <label className="block">
        <span className="brand-eyebrow">Exclusion patterns (optional)</span>
        <textarea
          name="scout_default_exclusions"
          rows={4}
          defaultValue={defaults.scout_default_exclusions ?? ""}
          className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          placeholder="Government agencies, anyone with a Series C+ raise in the last 12 months, our existing customers."
        />
        <span className="mt-1 text-xs text-muted">
          Plain language. Scout uses this to filter the candidate pool before deep research.
        </span>
      </label>

      {state.error ? (
        <p className="text-sm" style={{ color: "#a47148" }}>{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || selected.size === 0}
        className="w-full inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)] disabled:opacity-60"
        style={{ background: "var(--gradient-sunset)" }}
      >
        {pending ? "Saving..." : "Save Scout setup"}
      </button>
    </form>
  );
}
