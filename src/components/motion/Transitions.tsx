"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Loading screen                                                             */
/* -------------------------------------------------------------------------- */

/**
 * First-visit-only curtain. Stored in sessionStorage so internal navigation
 * never shows it again, which is the difference between an intro and an
 * obstacle. Skipped entirely under reduced motion.
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (sessionStorage.getItem("ab:intro") === "done") return;

    setVisible(true);
    document.documentElement.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("ab:intro", "done");
      setVisible(false);
      document.documentElement.style.overflow = "";
    }, 1250);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-[#0b0f19]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.span
              className="font-display text-2xl font-semibold tracking-tight text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Muhammad Abbas
            </motion.span>
            <div className="h-px w-40 overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Page transition                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Short cross-fade keyed on pathname. Deliberately fade-only with no vertical
 * travel, because sliding page content fights the browser's scroll restoration.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

export type LightboxImage = { src: string; alt: string; caption?: string };

/**
 * Image lightbox with keyboard navigation and a focus-trapping backdrop.
 * Escape closes, arrows move, and the trigger regains focus on close.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose, next, prev]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-6 sm:top-6"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-6"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}

          <motion.figure
            className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white/5">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="flex items-center gap-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
              <span>
                {(index ?? 0) + 1} / {images.length}
              </span>
              {current.caption && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="normal-case tracking-normal">
                    {current.caption}
                  </span>
                </>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Glass card                                                                 */
/* -------------------------------------------------------------------------- */

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-white/12 bg-white/[0.06] p-6",
        "shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
    >
      {children}
    </div>
  );
}
