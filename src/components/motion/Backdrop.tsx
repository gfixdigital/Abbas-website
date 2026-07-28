"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Swiss grid backdrop. A real ruled grid rather than a gradient wash, which is
 * what keeps large empty areas feeling composed instead of unfinished.
 */
export function BackgroundGrid({
  className,
  size = 72,
  fade = true,
}: {
  className?: string;
  size?: number;
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        opacity: 0.55,
        maskImage: fade
          ? "radial-gradient(ellipse 80% 60% at 50% 0%, #000 55%, transparent 100%)"
          : undefined,
        WebkitMaskImage: fade
          ? "radial-gradient(ellipse 80% 60% at 50% 0%, #000 55%, transparent 100%)"
          : undefined,
      }}
    />
  );
}

/** Fine dot field. Used where a full grid would compete with content. */
export function BackgroundDots({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{
        backgroundImage: "radial-gradient(var(--line-strong) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        opacity: 0.5,
      }}
    />
  );
}

/**
 * Page-level pointer glow. One instance, mounted in the hero only.
 *
 * The brief asked for a mouse glow and simultaneously bans floating gradient
 * blobs, so this is the compromise: it only exists where the pointer is, it
 * never animates on its own, and it dies on touch devices.
 */
export function MouseGlow({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        x.set(event.clientX);
        y.set(event.clientY);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [x, y]);

  const background =
    useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgba(0,102,255,0.09), transparent 70%)`;

  if (reduce || !enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0", className)}
      style={{ background }}
    />
  );
}

/**
 * Custom cursor: a small dot plus a lagging ring that widens over anything
 * interactive. Desktop and fine-pointer only, and it never replaces the native
 * cursor, so nothing breaks if it fails to mount.
 */
export function CursorEffect() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches || window.innerWidth < 1024) return;
    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target as HTMLElement | null;
      setHovering(
        Boolean(
          target?.closest(
            'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]',
          ),
        ),
      );
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (reduce || !enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-brand"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-brand/60"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          width: hovering ? 44 : 26,
          height: hovering ? 44 : 26,
          borderWidth: hovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.4 }}
      />
    </>
  );
}
