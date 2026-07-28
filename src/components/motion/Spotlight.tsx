"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pointer-following radial highlight, scoped to its container.
 *
 * Gated three ways: reduced-motion, coarse pointers (no hover on touch), and
 * only paints while the pointer is actually inside the element. Keeping it
 * scoped rather than page-wide is what stops it reading as decoration.
 */
export function Spotlight({
  children,
  className,
  size = 520,
  colour = "37, 99, 235",
  opacity = 0.1,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
  /** Comma-separated RGB triplet. */
  colour?: string;
  opacity?: number;
}) {
  const reduce = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    },
    [x, y],
  );

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, rgba(${colour}, ${opacity}), transparent 72%)`;

  const enabled = canHover && !reduce;

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseMove={enabled ? onMove : undefined}
      onMouseEnter={enabled ? () => setActive(true) : undefined}
      onMouseLeave={enabled ? () => setActive(false) : undefined}
    >
      {enabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          style={{ background, opacity: active ? 1 : 0 }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Border highlight that tracks the pointer across a card's edge. Used on the
 * Linear-style cards. The glow lives on a pseudo-layer behind the card body so
 * only the 1px rim lights up.
 */
export function SpotlightCard({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const [active, setActive] = useState(false);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    },
    [x, y],
  );

  const border =
    useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(0,102,255,0.55), transparent 78%)`;

  return (
    <div
      ref={ref}
      onMouseMove={reduce ? undefined : onMove}
      onMouseEnter={reduce ? undefined : () => setActive(true)}
      onMouseLeave={reduce ? undefined : () => setActive(false)}
      className={cn(
        "group relative rounded-[var(--radius)] border border-line bg-bg-elevated",
        className,
      )}
    >
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-400"
          style={{ background: border, opacity: active ? 1 : 0 }}
        />
      )}
      <div
        className={cn(
          "relative h-full rounded-[inherit] bg-bg-elevated",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
