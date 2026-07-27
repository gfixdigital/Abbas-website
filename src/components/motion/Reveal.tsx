"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, reducedVariants, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Kept under 0.2 by callers per the motion brief. */
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "li" | "article" | "span" | "header" | "footer";
};

/** Once-only scroll reveal. Becomes a no-op under prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduce ? reducedVariants : variants}
      transition={reduce ? undefined : { delay }}
    >
      {children}
    </MotionTag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section" | "ol";
};

/** Parent for staggered children. Pair with <RevealItem />. */
export function RevealGroup({
  children,
  className,
  stagger: staggerAmount = 0.07,
  delay = 0,
  as = "div",
}: RevealGroupProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduce ? reducedVariants : stagger(staggerAmount, delay)}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag className={className} variants={reduce ? reducedVariants : variants}>
      {children}
    </MotionTag>
  );
}

/**
 * Masked line reveal for headings. Splits on words so lines wrap naturally,
 * then slides each word up behind an overflow-hidden clip.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger(0.035, delay)}
        aria-hidden="true"
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.06em]"
          >
            <motion.span
              className={cn("inline-block", wordClassName)}
              variants={{
                hidden: { y: "108%" },
                visible: {
                  y: "0%",
                  transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
