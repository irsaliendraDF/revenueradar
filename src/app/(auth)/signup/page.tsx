"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpWithPassword } from "./actions";
import type { AuthState } from "@/app/(auth)/login/actions";

const initial: AuthState = {};

export default function SignupPage() {
  const [state, action, pending] = useActionState(signUpWithPassword, initial);

  return (
    <div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)]">
      <p className="brand-eyebrow">Create your account</p>
      <h1 className="brand-display text-3xl mt-1">Start with Revenue Radar.</h1>
      <p className="text-sm text-ink/70 mt-2">
        Two agents, account intelligence, and outreach calibrated to your motion.
        Email confirmation required before you reach the dashboard.
      </p>

      <form action={action} className="mt-6 space-y-4">
        <label className="block">
          <span className="brand-eyebrow">Full name</span>
          <input
            name="full_name"
            type="text"
            autoComplete="name"
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="Irene Saliendra"
          />
        </label>

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
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1 block w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-ink placeholder:text-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
            placeholder="At least 8 characters"
          />
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
          {pending ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-ink/70 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-forest font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
