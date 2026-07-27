"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import type { CaseStudy } from "@/content";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

/**
 * Filterable project grid. Filter state lives in the URL-free component state
 * on purpose: these are lightweight client-side facets, not navigation, and
 * pushing them into the URL would make the back button behave oddly.
 */
export function WorkGrid({ studies }: { studies: CaseStudy[] }) {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(studies.map((study) => study.category)))],
    [studies],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>([["All", studies.length]]);
    for (const study of studies) {
      map.set(study.category, (map.get(study.category) ?? 0) + 1);
    }
    return map;
  }, [studies]);

  const filtered = useMemo(
    () =>
      category === "All"
        ? studies
        : studies.filter((study) => study.category === category),
    [category, studies],
  );

  return (
    <div>
      {/* Filter bar */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="hide-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1"
      >
        {categories.map((option) => {
          const active = option === category;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={active}
              className={cn(
                "group relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-brand text-white"
                  : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : "work-filter"}
                  className="absolute inset-0 -z-10 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                {option}
                <span
                  className={cn(
                    "ml-2 font-mono text-[10px] tabular-nums",
                    active ? "text-white/65" : "text-muted/70",
                  )}
                >
                  {counts.get(option) ?? 0}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((study, index) => (
            <motion.li
              key={study.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
              className="h-full"
            >
              <ProjectCard study={study} priority={index < 3} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <p role="status" aria-live="polite" className="mt-8 font-mono text-[11px] text-muted">
        Showing {filtered.length} of {studies.length} projects
        {category !== "All" ? ` in ${category}` : ""}.
      </p>
    </div>
  );
}
