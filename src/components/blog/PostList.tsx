"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/content";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/** Tag-filterable post index, shared by /blog and /insights. */
export function PostList({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const reduce = useReducedMotion();
  const [tag, setTag] = useState("All");

  const filtered = useMemo(
    () => (tag === "All" ? posts : posts.filter((post) => post.tags.includes(tag))),
    [posts, tag],
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter writing by tag"
        className="hide-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1"
      >
        {["All", ...tags].map((option) => {
          const active = option === tag;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setTag(option)}
              aria-pressed={active}
              className={cn(
                "relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-brand text-white"
                  : "border-line text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : "post-filter"}
                  className="absolute inset-0 -z-10 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{option}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce} className="divide-y divide-line border-y border-line">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((post, index) => (
            <motion.li
              key={post.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-4 py-8 sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {formatDate(post.publishedAt, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {post.readingMinutes} min read
                    </span>
                  </div>

                  <h2 className="max-w-2xl font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-ink transition-colors group-hover:text-brand sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-brand">
                      Read
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <ul className="flex flex-wrap gap-1.5">
                      {post.tags.map((item) => (
                        <li key={item}>
                          <Badge>{item}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <p role="status" aria-live="polite" className="mt-8 font-mono text-[11px] text-muted">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        {tag !== "All" ? ` tagged ${tag}` : ""}.
      </p>
    </div>
  );
}
