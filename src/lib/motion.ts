import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language.
 *
 * The house easing is the same cubic-bezier the GFix site uses for its
 * transitions, so motion feels related across the two properties. Durations
 * are deliberately short: the brief bans entrance delays over 200ms and
 * anything that reads as an animation showreel.
 *
 * Every consumer of these variants gates them behind useReducedMotion.
 */

export const EASE = [0.22, 0.61, 0.36, 1] as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const transition: Transition = {
  duration: 0.55,
  ease: EASE,
};

export const springy: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/** Once-only viewport config. Reveals never replay on scroll-up. */
export const viewportOnce = { once: true, amount: 0.25 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition },
};

export const clipUp: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

/** Parent orchestrator. Stagger stays under the 200ms ceiling per child. */
export function stagger(children = 0.07, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: children, delayChildren: delay },
    },
  };
}

/** Collapses any variant set to a plain opacity swap for reduced motion. */
export const reducedVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
