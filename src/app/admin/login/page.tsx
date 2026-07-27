import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center bg-bg-soft px-5 py-20">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft
            className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to the site
        </Link>

        <div className="rounded-[var(--radius)] border border-line bg-bg-elevated p-8">
          <span className="mb-7 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-brand-navy via-brand to-brand-sky font-display text-[13px] font-bold text-white">
            MA
          </span>

          <h1 className="font-display text-xl font-semibold tracking-tight text-ink">
            Sign in to edit your site
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Use the email address and password set up for you. Everything you
            change here appears on the live site.
          </p>

          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          Forgotten your password? Reset it from the Supabase dashboard under
          Authentication, or ask whoever set this up for you.
        </p>
      </div>
    </div>
  );
}
