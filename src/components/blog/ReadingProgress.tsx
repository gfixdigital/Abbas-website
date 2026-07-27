"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Article reading progress. Sits directly under the global scroll progress bar
 * and uses the amber accent so the two are distinguishable at a glance.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-[2px] z-[69] h-[2px] w-full origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
