import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-paper)" }} />
        <div className="absolute top-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
             style={{ background: "var(--gradient-sunrise)" }} aria-hidden />
        <div className="absolute bottom-[-160px] left-[-120px] h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
             style={{ background: "var(--gradient-greens)" }} aria-hidden />

        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="flex items-center gap-3 mb-10">
            <Image src="/logo.png" alt="DigitalFlow Consulting" width={56} height={56} priority />
            <div className="flex flex-col leading-tight">
              <span className="brand-eyebrow">DigitalFlow Consulting</span>
              <span className="font-mono text-xs text-muted">revenue radar</span>
            </div>
          </div>

          <p className="brand-eyebrow mb-4">B2B Account Intelligence</p>
          <h1 className="brand-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
            Decide <span style={{ color: "var(--gold)" }}>who to target</span> and how to reach them.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/80">
            Revenue Radar runs two agents over your market. Scout researches accounts with cited sources.
            Outreach drafts the first touch for every persona, calibrated to your Fish, Dolphin, or Whale motion.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[0_4px_20px_rgba(94,115,78,0.10)] transition-all hover:translate-y-[-1px] hover:shadow-[0_8px_32px_rgba(94,115,78,0.15)]"
              style={{ background: "var(--gradient-sunset)" }}
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-warm-white px-6 font-medium text-ink transition-colors hover:bg-cream"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              { eyebrow: "Tier 01", title: "Starter", body: "20 accounts and 3 deep dives per month. CAD $39." },
              { eyebrow: "Tier 02", title: "Growth", body: "50 accounts, 5 deep dives, quarterly signal refresh. CAD $129." },
              { eyebrow: "Tier 03", title: "Scale", body: "Unlimited accounts (fair-use cap), weekly signal refresh. CAD $349." },
            ].map((t) => (
              <div key={t.title} className="brand-callout">
                <p className="brand-eyebrow">{t.eyebrow}</p>
                <h3 className="brand-display text-xl mt-1">{t.title}</h3>
                <p className="text-sm text-ink/75 mt-2">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto" style={{ background: "var(--forest-deep)" }}>
        <div className="mx-auto max-w-5xl px-6 py-10 text-warm-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="brand-display text-lg">Revenue Radar</p>
            <p className="text-sm text-warm-white/70">by DigitalFlow Consulting</p>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-warm-white/60">
            digitalflowconsulting.ca
          </p>
        </div>
      </footer>
    </main>
  );
}
