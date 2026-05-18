"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AppMenu({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-cream transition-colors hover:bg-warm-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-warm-white shadow-[var(--shadow-soft)] overflow-hidden z-50"
        >
          {email ? (
            <div className="px-4 py-3 border-b border-border">
              <p className="brand-eyebrow">Signed in as</p>
              <p className="text-sm text-ink mt-1 truncate">{email}</p>
            </div>
          ) : null}

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm text-ink hover:bg-cream transition-colors"
            role="menuitem"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm text-ink hover:bg-cream transition-colors"
            role="menuitem"
          >
            Settings
          </Link>

          <form action="/api/auth/signout" method="post" className="border-t border-border">
            <button
              type="submit"
              className="block w-full text-left px-4 py-3 text-sm text-ink hover:bg-cream transition-colors"
              role="menuitem"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
