"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Magnetic button                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Pulls gently toward the pointer within its own bounds. Strength is low on
 * purpose: enough to feel responsive, not enough to make the target hard to
 * click, which is the usual failure of this effect.
 */
export function Magnetic({
  children,
  className,
  strength = 0.22,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 24, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 24, mass: 0.5 });

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [strength, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Animated counter                                                           */
/* -------------------------------------------------------------------------- */

/** Counts up once when scrolled into view. Renders the final value instantly
 *  under reduced motion so the number is never withheld. */
export function AnimatedCounter({
  value,
  suffix = "",
  className,
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">{display}</span>
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Scroll progress                                                            */
/* -------------------------------------------------------------------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-gradient-to-r from-brand-navy via-brand to-brand-sky"
      style={{ scaleX }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Back to top                                                                */
/* -------------------------------------------------------------------------- */

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }
      className={cn(
        "fixed bottom-6 right-6 z-[60] grid h-11 w-11 place-items-center rounded-full",
        "border border-line bg-bg-elevated/90 text-ink shadow-[var(--shadow-md)] backdrop-blur",
        "transition-colors hover:border-brand hover:text-brand",
      )}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.85,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.25 }}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Infinite marquee. Duplicates its children once and translates by exactly
 * -50%, which is what makes the loop seamless. Pauses on hover and stops
 * entirely under reduced motion.
 */
export function Marquee({
  children,
  speed = 38,
  reverse = false,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  /** Seconds for one full cycle. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center gap-10 pr-10",
          !reduce && "animate-[marquee-x_linear_infinite]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={
          reduce
            ? undefined
            : {
                animationDuration: `${speed}s`,
                animationDirection: reverse ? "reverse" : "normal",
              }
        }
      >
        {children}
        <span aria-hidden="true" className="flex items-center gap-10 pr-10">
          {children}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scroll velocity                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Skews and nudges its content in proportion to scroll velocity. Very low
 * amplitude, so it registers as physical weight rather than as an effect.
 */
export function ScrollVelocity({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useMotionValue(0);
  const smooth = useSpring(velocity, { stiffness: 220, damping: 40 });
  const skewY = useTransform(smooth, [-2500, 0, 2500], [-2.2, 0, 2.2]);

  useEffect(() => {
    if (reduce) return;
    let previous = scrollY.get();
    let previousTime = performance.now();

    const unsubscribe = scrollY.on("change", (latest) => {
      const now = performance.now();
      const dt = Math.max(now - previousTime, 1);
      velocity.set(((latest - previous) / dt) * 1000);
      previous = latest;
      previousTime = now;
    });

    const idle = window.setInterval(() => velocity.set(0), 140);
    return () => {
      unsubscribe();
      window.clearInterval(idle);
    };
  }, [reduce, scrollY, velocity]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ skewY }}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Animated skill bar                                                         */
/* -------------------------------------------------------------------------- */

export function SkillBar({
  name,
  level,
  delay = 0,
}: {
  name: string;
  level: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-ink">{name}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted">
          {level}
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-line"
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-navy via-brand to-brand-sky"
          initial={reduce ? false : { width: 0 }}
          animate={
            reduce
              ? { width: `${level}%` }
              : { width: inView ? `${level}%` : 0 }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Arrow link                                                                 */
/* -------------------------------------------------------------------------- */

/** Underline-on-hover link with a nudging arrow. Used for all "read more" affordances. */
export function ArrowLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "group/al inline-flex items-center gap-1.5 text-sm font-medium text-ink",
    "transition-colors hover:text-brand",
    className,
  );

  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover/al:scale-x-100" />
      </span>
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover/al:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
