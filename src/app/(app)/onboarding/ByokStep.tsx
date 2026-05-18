import { completeOnboarding } from "./actions";

export function ByokStep() {
  return (
    <div className="space-y-5">
      <div className="brand-callout">
        <p className="brand-eyebrow">Bring your own keys (Tier 2+)</p>
        <p className="text-sm text-ink/80 mt-2">
          Apollo, Hunter, Clay, and Sales Navigator integrations unlock at the Growth tier and
          above. You can connect them later from Settings, no rush.
        </p>
      </div>

      <ul className="space-y-2 text-sm text-ink/80">
        <li className="flex gap-3">
          <span className="brand-eyebrow w-16 pt-0.5">Apollo</span>
          <span>Contact data unlock. Pulls verified emails and phone numbers from your seat.</span>
        </li>
        <li className="flex gap-3">
          <span className="brand-eyebrow w-16 pt-0.5">Hunter</span>
          <span>Email verification. Confirms email patterns before you reach out.</span>
        </li>
        <li className="flex gap-3">
          <span className="brand-eyebrow w-16 pt-0.5">Clay</span>
          <span>Workflow enrichment. Pipes our research into your existing Clay tables.</span>
        </li>
        <li className="flex gap-3">
          <span className="brand-eyebrow w-16 pt-0.5">Sales Nav</span>
          <span>LinkedIn signals via PhantomBuster, BYOK only. No direct scraping.</span>
        </li>
      </ul>

      <form action={completeOnboarding}>
        <button
          type="submit"
          className="w-full inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)]"
          style={{ background: "var(--gradient-sunset)" }}
        >
          Finish onboarding
        </button>
      </form>
    </div>
  );
}
