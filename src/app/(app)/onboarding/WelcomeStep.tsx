import { markWelcomeSeen } from "./actions";

const FEATURES = [
  {
    eyebrow: "Agent 01",
    name: "Scout Agent",
    body: "Researches 20 to 200 accounts per month (tier-dependent) and returns firmographics, recent signals, and a Fish/Dolphin/Whale fit score with reasoning. Every claim carries a source URL and a timestamp, so you can verify anything in one click.",
    benefit: "You stop scrolling LinkedIn and Crunchbase for hours. Pre-qualified accounts land in your dashboard already cited.",
  },
  {
    eyebrow: "Agent 02",
    name: "Outreach Agent",
    body: "Drafts per-persona email sequences, LinkedIn connection messages, and call talk tracks for up to 5 deep-dive accounts. Calibrated to your sales motion: founder-direct for Fish, consultative for Dolphin, insight-led for Whale.",
    benefit: "Your first-touch copy is grounded in your real proof points, not generic templates. You always send manually.",
  },
  {
    eyebrow: "Workbench",
    name: "Your campaign dashboard",
    body: "Watch Scout run in real time, filter the results by tier and score, bulk-select the 5 accounts you want deep dives on, then trigger Outreach. Download a multi-tab xlsx workbook, a per-account docx outreach kit, and a pdf campaign brief.",
    benefit: "Every campaign ends as something you can hand to a teammate, a contractor, or a hire on day one.",
  },
];

const PROMISES = [
  "Source attribution on every data point (no black boxes)",
  "Nothing sent automatically (manual send, always)",
  "Email/password and magic link sign-in (no Google fragmentation)",
  "Built-in HubSpot push (lands later in Phase 1)",
];

export function WelcomeStep({ greeting }: { greeting: string }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="brand-eyebrow">Welcome</p>
        <h1 className="brand-display text-4xl mt-1">
          Hi <span style={{ color: "var(--gold)" }}>{greeting}</span>.
        </h1>
        <p className="text-base text-ink/80 mt-3 max-w-xl">
          Spend the next 5 minutes telling Revenue Radar about your business. Then your dashboard
          runs two agents that decide who to target and how to reach them.
        </p>
      </div>

      <div>
        <p className="brand-eyebrow mb-3">What you&apos;re about to set up</p>
        <div className="space-y-4">
          {FEATURES.map((f) => (
            <div
              key={f.name}
              className="bg-warm-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="brand-eyebrow">{f.eyebrow}</p>
                  <h2 className="brand-display text-xl mt-1">{f.name}</h2>
                </div>
              </div>
              <p className="text-sm text-ink/75 mt-3">{f.body}</p>
              <div
                className="mt-4 brand-callout"
                style={{ background: "var(--cream)" }}
              >
                <p className="brand-eyebrow text-forest">Why it matters</p>
                <p className="text-sm text-ink mt-1">{f.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warm-white rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
        <p className="brand-eyebrow">Our promises</p>
        <ul className="mt-3 space-y-2 text-sm text-ink/80">
          {PROMISES.map((p) => (
            <li key={p} className="flex gap-3">
              <span
                className="inline-block mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--gold)" }}
                aria-hidden
              />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <form action={markWelcomeSeen}>
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full px-8 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)]"
          style={{ background: "var(--gradient-sunset)" }}
        >
          Get started
        </button>
        <p className="text-xs text-muted mt-3">
          4 quick steps. Saves as you go, so you can pause anytime.
        </p>
      </form>
    </div>
  );
}
