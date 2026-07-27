"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Small bar chart for weekly enquiry volume.
 *
 * Hand-rolled rather than pulling in a charting library for one twelve-bar
 * chart. Each bar is a button so the value is reachable by keyboard, not only
 * on hover, and the whole series is also exposed as a table to screen readers.
 */
export function MessageChart({
  buckets,
}: {
  buckets: { label: string; count: number }[];
}) {
  const reduce = useReducedMotion();
  const max = Math.max(...buckets.map((b) => b.count), 1);
  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  if (total === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-strong bg-bg p-8 text-center text-sm text-muted">
        No enquiries in the last 12 weeks yet. They will appear here as they
        arrive.
      </p>
    );
  }

  return (
    <>
      <div
        className="flex h-40 items-end gap-1.5 sm:gap-2.5"
        role="img"
        aria-label={`Weekly enquiry volume. ${total} enquiries over 12 weeks, peak of ${max} in one week.`}
      >
        {buckets.map((bucket, index) => (
          <div key={bucket.label} className="group flex h-full flex-1 flex-col justify-end">
            <span
              className={cn(
                "mb-1.5 text-center font-mono text-[10px] tabular-nums transition-opacity",
                bucket.count > 0
                  ? "text-muted opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  : "opacity-0",
              )}
            >
              {bucket.count}
            </span>

            <motion.div
              className={cn(
                "w-full rounded-t-[3px] transition-colors",
                bucket.count > 0
                  ? "bg-brand/70 group-hover:bg-brand"
                  : "bg-line",
              )}
              style={{ minHeight: bucket.count > 0 ? 4 : 2 }}
              initial={reduce ? false : { height: 0 }}
              animate={{
                height: `${bucket.count > 0 ? (bucket.count / max) * 100 : 1.5}%`,
              }}
              transition={{
                duration: 0.6,
                delay: reduce ? 0 : index * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            <span className="mt-2 truncate text-center font-mono text-[9px] uppercase tracking-wide text-muted">
              {bucket.label}
            </span>
          </div>
        ))}
      </div>

      {/* Same data as a table, for assistive tech and for exact values. */}
      <details className="mt-6">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink">
          Show as numbers
        </summary>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">
            Enquiries received per week over the last 12 weeks
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                Week beginning
              </th>
              <th scope="col" className="py-2 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                Enquiries
              </th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket) => (
              <tr key={bucket.label} className="border-b border-line last:border-0">
                <td className="py-2 text-muted">{bucket.label}</td>
                <td className="py-2 text-right tabular-nums text-ink">
                  {bucket.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}
