import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-warm-white">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/logo.png" alt="DigitalFlow Consulting" width={32} height={32} />
            <span className="brand-display text-lg">Revenue Radar</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-ink/70">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-full border border-border bg-cream px-4 text-sm font-medium text-ink transition-colors hover:bg-warm-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-warm-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-wider text-muted">
            Revenue Radar by DigitalFlow Consulting
          </span>
          <span className="text-muted">digitalflowconsulting.ca</span>
        </div>
      </footer>
    </div>
  );
}
