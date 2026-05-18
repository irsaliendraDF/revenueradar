import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-paper)" }} />
      <div
        className="absolute top-[-160px] right-[-180px] h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-sunrise)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-[-200px] left-[-180px] h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-greens)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-3 mb-12">
          <Image src="/logo.png" alt="DigitalFlow Consulting" width={48} height={48} priority />
          <div className="flex flex-col leading-tight">
            <span className="brand-eyebrow">DigitalFlow Consulting</span>
            <span className="font-mono text-xs text-muted">revenue radar</span>
          </div>
        </Link>

        <div className="mx-auto max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
