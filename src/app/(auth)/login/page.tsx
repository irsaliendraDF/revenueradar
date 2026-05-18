import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)] text-sm text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
