"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lightbox, type LightboxImage } from "@/components/motion/Transitions";

/**
 * Masonry-ish visual archive. Uses CSS columns rather than a JS masonry
 * library: it reflows for free, needs no measurement pass, and degrades to a
 * single column on small screens without any breakpoint logic.
 */
export function GalleryGrid({
  images,
  categories,
}: {
  images: (LightboxImage & { category: string })[];
  categories: string[];
}) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? images
        : images.filter((image) => image.category === filter),
    [filter, images],
  );

  return (
    <>
      <div
        role="group"
        aria-label="Filter gallery by category"
        className="hide-scrollbar mb-10 flex gap-2 overflow-x-auto pb-1"
      >
        {["All", ...categories].map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
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
                  layoutId={reduce ? undefined : "gallery-filter"}
                  className="absolute inset-0 -z-10 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{option}</span>
            </button>
          );
        })}
      </div>

      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        {filtered.map((image, index) => (
          <li key={image.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block w-full overflow-hidden rounded-xl border border-line bg-bg-soft"
              aria-label={`Open ${image.alt} at full size`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              />
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {image.caption}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-white/65">
                    {image.category}
                  </span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p role="status" aria-live="polite" className="mt-8 font-mono text-[11px] text-muted">
        {filtered.length} {filtered.length === 1 ? "image" : "images"}
        {filter !== "All" ? ` in ${filter}` : ""}.
      </p>

      <Lightbox
        images={filtered}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
