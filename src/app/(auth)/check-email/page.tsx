import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function CheckEmailPage({ searchParams }: PageProps) {
  const { email } = await searchParams;

  return (
    <div className="bg-warm-white rounded-2xl border border-border p-8 shadow-[var(--shadow-soft)] text-center">
      <p className="brand-eyebrow">Almost there</p>
      <h1 className="brand-display text-3xl mt-1">Check your email.</h1>
      <p className="text-sm text-ink/70 mt-3">
        We sent a confirmation link to{" "}
        <span className="font-medium text-ink">{email ?? "your inbox"}</span>.
        Click it to verify your address and finish signing in.
      </p>

      <div className="brand-callout text-left text-sm mt-6">
        Not seeing it? Wait a minute, then check spam. Some inboxes label the first email from a
        new sender as promotions.
      </div>

      <Link
        href="/login"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-cream px-6 font-medium text-ink transition-colors hover:bg-warm-white"
      >
        Back to sign in
      </Link>
    </div>
  );
}
