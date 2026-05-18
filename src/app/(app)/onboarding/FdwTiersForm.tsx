"use client";

import { useActionState, useState } from "react";
import { saveFdwTiers, type StepState } from "./actions";

const initial: StepState = {};

type Defaults = {
  fdw_target_tiers?: string[] | null;
  sales_motion?: string | null;
};

const TIERS = [
  {
    id: "fish",
    name: "Fish",
    size: "Under 50 employees",
    blurb: "Direct, founder-to-founder outreach. Short emails. Personal voice.",
  },
  {
    id: "dolphin",
    name: "Dolphin",
    size: "50 to 500 employees",
    blurb: "Consultative motion. Lead with the signal. Reference comparable customers.",
  },
  {
    id: "whale",
    name: "Whale",
    size: "500+ employees",
    blurb: "Insight-led. Open with an industry observation. Longer conversations, MEDDPICC.",
  },
] as const;

const MOTIONS = [
  { id: "founder_led", label: "Founder-led", desc: "I'm doing the selling myself." },
  { id: "small_team", label: "Small team", desc: "A few of us share the work." },
  { id: "full_team", label: "Full sales team", desc: "Dedicated AEs and SDRs." },
] as const;

export function FdwTiersForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveFdwTiers, initial);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(defaults.fdw_target_tiers ?? []),
  );
  const [motion, setMotion] = useState<string>(defaults.sales_motion ?? "");

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
        <p className="brand-eyebrow mb-3">Tiers you sell into (pick one or more)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((t) => {
            const active = selected.has(t.id);
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => toggle(t.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  active
                    ? "bg-cream shadow-[var(--shadow-soft)]"
                    : "bg-warm-white hover:bg-cream/60"
                }`}
                style={{
                  borderColor: active ? "var(--gold)" : "var(--border)",
                  borderWidth: active ? "2px" : "1px",
                  padding: active ? "calc(1rem - 1px)" : "1rem",
                }}
              >
                <p className="brand-eyebrow">{t.size}</p>
                <h3 className="brand-display text-xl mt-1">{t.name}</h3>
                <p className="text-xs text-ink/70 mt-2">{t.blurb}</p>
              </button>
            );
          })}
        </div>
        {Array.from(selected).map((id) => (
          <input type="hidden" name="fdw_target_tiers" key={id} value={id} />
        ))}
      </div>

      <div>
        <p className="brand-eyebrow mb-3">Your sales motion</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MOTIONS.map((m) => {
            const active = motion === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setMotion(m.id)}
                className="text-left rounded-xl border p-4 transition-all"
                style={{
                  borderColor: active ? "var(--forest)" : "var(--border)",
                  borderWidth: active ? "2px" : "1px",
                  padding: active ? "calc(1rem - 1px)" : "1rem",
                  background: active ? "var(--cream)" : "var(--warm-white)",
                  boxShadow: active ? "var(--shadow-soft)" : "none",
                }}
              >
                <h3 className="font-medium text-ink">{m.label}</h3>
                <p className="text-xs text-ink/70 mt-1">{m.desc}</p>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="sales_motion" value={motion} />
      </div>

      {state.error ? (
        <p className="text-sm" style={{ color: "#a47148" }}>{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || selected.size === 0}
        className="w-full inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)] disabled:opacity-60"
        style={{ background: "var(--gradient-sunset)" }}
      >
        {pending ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
