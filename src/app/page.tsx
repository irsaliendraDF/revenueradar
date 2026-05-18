import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <header className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="DigitalFlow Consulting" width={36} height={36} priority />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="brand-eyebrow">DigitalFlow Consulting</span>
              <span className="font-mono text-xs text-muted">revenue radar</span>
            </div>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-full border border-border bg-warm-white px-5 text-sm font-medium text-ink transition-colors hover:bg-cream"
          >
            Sign In
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden flex-1">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-paper)" }} />
        <div
          className="absolute top-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--gradient-sunrise)" }}
          aria-hidden
        />
        <div
          className="absolute bottom-[-160px] left-[-120px] h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-greens)" }}
          aria-hidden
        />

        <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="brand-eyebrow mb-4">B2B Account Intelligence</p>
          <h1 className="brand-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
            Decide <span style={{ color: "var(--gold)" }}>who to target</span> and{" "}
            <span
              style={{
                background:
                  "linear-gradient(180deg, transparent 62%, rgba(255, 167, 79, 0.35) 62%)",
                paddingBottom: "0.05em",
              }}
            >
              how to reach
            </span>{" "}
            them.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/80">
            Revenue Radar runs two agents over your market. Scout researches accounts with cited
            sources. Outreach drafts the first touch for every persona, calibrated to your Fish,
            Dolphin, or Whale motion.
          </p>

          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full px-8 font-medium text-warm-white shadow-[0_4px_20px_rgba(94,115,78,0.10)] transition-all hover:translate-y-[-1px] hover:shadow-[0_8px_32px_rgba(94,115,78,0.15)]"
              style={{ background: "var(--gradient-sunset)" }}
            >
              Get Started Free
            </Link>
            <p className="mt-3 text-sm text-ink/70">
              Free to start. Choose a plan when you're ready to scale.
            </p>
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
