"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/content";
import { cn, initials } from "@/lib/utils";

/**
 * Testimonial carousel. Auto-advances only when motion is allowed and the
 * user has not interacted; any manual navigation stops the timer for good,
 * which is the behaviour people expect and most carousels get wrong.
 */
export function TestimonialsCarousel({
  testimonials,
  tone = "default",
}: {
  testimonials: Testimonial[];
  tone?: "default" | "dark";
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const dark = tone === "dark";

  const go = useCallback(
    (next: number) => {
      setLocked(true);
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [testimonials.length],
  );

  useEffect(() => {
    if (reduce || locked) return;
    const timer = window.setInterval(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [reduce, locked, testimonials.length]);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
    >
      <div className="relative min-h-[19rem] sm:min-h-[16rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col"
            aria-live="polite"
          >
            <Quote
              className={cn("mb-6 h-7 w-7", dark ? "text-accent" : "text-brand/35")}
              aria-hidden="true"
            />
            <blockquote
              className={cn(
                "font-display text-[clamp(1.125rem,2.2vw,1.75rem)] font-medium leading-[1.42] tracking-[-0.02em]",
                dark ? "text-white" : "text-ink",
              )}
            >
              {current.quote}
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-3.5">
              <span
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-full font-mono text-xs font-medium",
                  dark ? "bg-white/10 text-white" : "bg-brand/10 text-brand",
                )}
                aria-hidden="true"
              >
                {initials(current.authorName)}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm font-semibold",
                    dark ? "text-white" : "text-ink",
                  )}
                >
                  {current.authorName}
                </span>
                <span
                  className={cn(
                    "block truncate text-[13px]",
                    dark ? "text-white/50" : "text-muted",
                  )}
                >
                  {current.authorTitle}
                  {current.authorCompany ? `, ${current.authorCompany}` : ""}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border transition-colors",
              dark
                ? "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                : "border-line text-muted hover:border-brand hover:text-brand",
            )}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border transition-colors",
              dark
                ? "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                : "border-line text-muted hover:border-brand hover:text-brand",
            )}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Progress ticks double as direct navigation. */}
        <div className="flex flex-1 gap-1.5">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.authorName}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
              aria-current={i === index}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-colors duration-400",
                i === index
                  ? dark
                    ? "bg-accent"
                    : "bg-brand"
                  : dark
                    ? "bg-white/15 hover:bg-white/30"
                    : "bg-line hover:bg-line-strong",
              )}
            />
          ))}
        </div>

        <span
          className={cn(
            "shrink-0 font-mono text-[11px] tabular-nums",
            dark ? "text-white/40" : "text-muted",
          )}
        >
          {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
