"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithPassword, sendMagicLink, type AuthState } from "./actions";

const initial: AuthState = {};

export function LoginForm() {
  const search = useSearchParams();
  const next = search.get("next") ?? "/dashboard";
  const queryError = search.get("error");

  const [passwordState, passwordAction, passwordPending] = useActionState(
    signInWithPassword,
    initial,
  );
  const [magicState, magicAction, magicPending] = useActionState(
    sendMagicLink,
    initial,
  );

  return (
    <div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)]">
      <p className="brand-eyebrow">Sign in</p>
      <h1 className="brand-display text-3xl mt-1">Welcome back.</h1>
      <p className="text-sm text-ink/70 mt-2">Use your password, or get a one-time sign-in link by email.</p>

      {queryError ? (
        <div className="mt-6 brand-callout text-sm" style={{ borderLeftColor: "#a47148" }}>
          We couldn&apos;t sign you in. Try again, or request a new magic link.
        </div>
      ) : null}

      <form action={passwordAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />

        <label className="block">
          <span className="brand-eyebrow">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="you@company.com"
          />
        </label>

        <label className="block">
          <span className="brand-eyebrow">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="At least 8 characters"
          />
        </label>

        {passwordState.error ? (
          <p className="text-sm" style={{ color: "#a47148" }}>{passwordState.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={passwordPending}
          className="w-full inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-warm-white shadow-[var(--shadow-soft)] transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-hover)] disabled:opacity-60"
          style={{ background: "var(--gradient-sunset)" }}
        >
          {passwordPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="brand-eyebrow text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form action={magicAction} className="space-y-3">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="brand-eyebrow">Email for magic link</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="you@company.com"
          />
        </label>

        {magicState.info ? (
          <p className="text-sm text-forest">{magicState.info}</p>
        ) : null}
        {magicState.error ? (
          <p className="text-sm" style={{ color: "#a47148" }}>{magicState.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={magicPending}
          className="w-full inline-flex h-12 items-center justify-center rounded-full border border-border bg-cream px-6 font-medium text-ink transition-colors hover:bg-warm-white disabled:opacity-60"
        >
          {magicPending ? "Sending..." : "Send Magic Link"}
        </button>
      </form>

      <p className="mt-8 text-sm text-ink/70 text-center">
        New here?{" "}
        <Link href="/signup" className="text-forest font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
