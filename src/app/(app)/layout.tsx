import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/profile";
import { AppMenu } from "@/components/app/AppMenu";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProfile(user.id, user.user_metadata?.full_name ?? user.email);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-warm-white">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/logo.png" alt="DigitalFlow Consulting" width={32} height={32} />
            <span className="brand-display text-lg">Revenue Radar</span>
          </Link>

          <AppMenu email={user.email ?? null} />
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
