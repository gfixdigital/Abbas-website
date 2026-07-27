"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Filter } from "lucide-react";
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
      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-muted mr-2">
          <Filter size={14} /> FILTER BY:
        </div>
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap gap-2"
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
                  "px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all",
                  active
                    ? "bg-brand text-white shadow-xs"
                    : "bg-bg-elevated text-muted border border-line hover:border-ink",
                )}
              >
                {option}
                <span
                  className={cn(
                    "ml-1.5 tabular-nums",
                    active ? "text-white/65" : "text-muted/70",
                  )}
                >
                  {counts.get(option) ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
