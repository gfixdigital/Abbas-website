import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { getProfile } from "@/lib/data";
import { navGroups } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { BackgroundGrid } from "@/components/motion/Backdrop";

export default async function NotFound() {
  const profile = await getProfile();
  return (
    <div className="relative overflow-hidden">
      <BackgroundGrid />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-24 pt-40 sm:px-8 sm:pt-48 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-7">Error 404</p>
        </Reveal>

        <Reveal delay={0.04}>
          {/* The oversized numeral is the page, rather than a small centred
              apology block. */}
          <p
            aria-hidden="true"
            className="font-display text-[clamp(6rem,22vw,16rem)] font-bold leading-[0.8] tracking-[-0.06em] text-ink/[0.07]"
          >
            404
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="-mt-4 max-w-2xl font-display text-[clamp(1.875rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:-mt-8">
            That page does not exist.
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
            The link may be out of date, or the address may have a typo in it.
            Everything on the site is reachable from the list below, or press{" "}
            <kbd className="rounded border border-line bg-bg-soft px-1.5 py-0.5 font-mono text-[11px]">
              ⌘K
            </kbd>{" "}
            to search.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="brand" size="lg">
                <Link href="/">Back to the homepage</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">
                  See the work
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>

        {/* Full sitemap, because a 404 with no way forward is the actual failure */}
        <Reveal delay={0.2}>
          <nav
            aria-label="Site index"
            className="mt-20 grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="eyebrow mb-4">{group.label}</p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
                      >
                        {item.label}
                        <ArrowUpRight
                          className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-14 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
            <Search className="h-3 w-3" aria-hidden="true" />
            Still stuck? Email{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-ink underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors hover:text-brand"
            >
              {profile.email}
            </a>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
