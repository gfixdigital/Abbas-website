"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EASE_OUT_EXPO, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedCounter, Magnetic } from "@/components/motion/Interactions";
import type { CaseStudy, Metric, Profile } from "@/content";

export function Hero({
  projects,
  metrics,
  profile,
}: {
  projects: CaseStudy[];
  metrics: Metric[];
  profile: Profile;
}) {
  const reduce = useReducedMotion();
  const thumbnails = projects.filter((study) => study.coverImageUrl).slice(0, 6);

  const item = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 26 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.62, ease: EASE_OUT_EXPO },
        },
      };

  return (
    <section className="relative overflow-hidden bg-bg pt-32 sm:pt-40 lg:pt-44">
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={reduce ? undefined : stagger(0.075)}
        >
          {/* Status line */}
          <motion.div variants={item} className="mb-9 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-soft px-3.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                Available for work
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Mingora, Swat, Pakistan
            </span>
          </motion.div>

          {/* Headline. Deliberately two lines of very different weight so it
              reads as a statement rather than a slogan. */}
          <h1 className="max-w-[19ch] font-display text-[clamp(2.75rem,8.4vw,7rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-ink">
            <motion.span variants={item} className="block">
              I build brands,
            </motion.span>
            <motion.span variants={item} className="block text-brand">
              and I train the people
            </motion.span>
            <motion.span variants={item} className="block">
              who build them.
            </motion.span>
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
            <motion.div variants={item} className="max-w-xl">
              <p className="text-base leading-relaxed text-muted sm:text-[17px]">
                I am <span className="font-medium text-ink">{profile.name}</span>,
                founder and CEO of{" "}
                <a
                  href={profile.companyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-ink underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors hover:text-brand"
                >
                  GFix Digital
                </a>
                . A digital studio and training hub in Swat, Pakistan, running
                two things at once: commercial work for clients, and the
                programme that produces the people who deliver it.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button asChild size="lg" variant="brand">
                    <Link href="/projects">
                      See the work
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/contact">Start a conversation</Link>
                  </Button>
                </Magnetic>
              </div>
            </motion.div>

            {/* The dual-track ledger. Two rails, split by a rule, one for the
                studio and one for the academy. This motif recurs site-wide. */}
            <motion.dl
              variants={item}
              className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-7 sm:gap-x-14"
            >
              {(["studio", "academy"] as const).map((track) => (
                <div key={track} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-4 top-1 h-full w-px sm:-left-7",
                      track === "studio" ? "bg-brand/35" : "bg-accent/45",
                    )}
                  />
                  <p
                    className={cn(
                      "mb-5 font-mono text-[10px] uppercase tracking-[0.16em]",
                      track === "studio" ? "text-brand" : "text-accent",
                    )}
                  >
                    {track === "studio" ? "Studio" : "Academy"}
                  </p>
                  <div className="space-y-5">
                    {metrics
                      .filter((metric) => metric.track === track)
                      .map((metric) => (
                        <div key={metric.label}>
                          <dd className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
                            <AnimatedCounter
                              value={metric.value}
                              suffix={metric.suffix}
                            />
                          </dd>
                          <dt className="mt-1.5 text-[13px] leading-snug text-muted">
                            {metric.label}
                          </dt>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Work strip. Horizontally scrollable on every size, snapping on
              touch. Shows craft before the visitor has clicked anything. */}
          <motion.div variants={item} className="mt-16 sm:mt-20">
            <div className="mb-4 flex items-baseline justify-between gap-4 border-t border-line pt-5">
              <p className="eyebrow">Recent work</p>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand"
              >
                All projects
                <ArrowUpRight
                  className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <ul className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
              {thumbnails.map((study, index) => (
                <li
                  key={study.slug}
                  className="w-[68vw] shrink-0 snap-start sm:w-[38vw] lg:w-[23vw]"
                >
                  <Link href={`/projects/${study.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-bg-soft">
                      <Image
                        src={study.coverImageUrl as string}
                        alt={`${study.title} — ${study.category}`}
                        fill
                        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 38vw, 68vw"
                        priority={index < 2}
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium text-ink transition-colors group-hover:text-brand">
                        {study.title}
                      </p>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {study.year}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {study.category}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
