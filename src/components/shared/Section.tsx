import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Standard section shell. The `index` prop drives the Swiss numbered rail that
 * runs down the left edge of every page, which is the layout signature that
 * carries across routes.
 */
export function Section({
  children,
  className,
  containerClassName,
  index,
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  index?: string;
  id?: string;
  tone?: "default" | "soft" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        tone === "soft" && "bg-bg-soft",
        tone === "dark" && "bg-black text-white",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32",
          containerClassName,
        )}
      >
        {index && (
          <span
            aria-hidden="true"
            className={cn(
              "mb-8 block font-mono text-[11px] tracking-[0.2em]",
              tone === "dark" ? "text-white/35" : "text-muted/60",
            )}
          >
            {index}
          </span>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Section heading block. Two-column on wide screens so the eyebrow and title
 * sit against a supporting paragraph rather than stacking centred, which is
 * the default that makes portfolios look templated.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "split",
  tone = "default",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "split" | "stacked" | "centered";
  tone?: "default" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <Reveal
      className={cn(
        "mb-14 lg:mb-20",
        align === "split" && "grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16",
        align === "centered" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className={cn("eyebrow mb-4", dark && "text-white/45")}>{eyebrow}</p>
        )}
        <h2
          className={cn(
            "font-display text-[clamp(1.875rem,4vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.032em]",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>

      {(description || action) && (
        <div className={cn(align === "centered" && "mt-5")}>
          {description && (
            <p
              className={cn(
                "max-w-xl text-[15px] leading-relaxed sm:text-base",
                dark ? "text-white/60" : "text-muted",
                align === "centered" && "mx-auto",
              )}
            >
              {description}
            </p>
          )}
          {action && <div className="mt-6">{action}</div>}
        </div>
      )}
    </Reveal>
  );
}

/**
 * Page hero used by every route except the homepage, which has its own.
 * Keeping it uniform is what makes the site feel like one system.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-bg-soft">
      <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="max-w-4xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.15}>
            <div className="mt-10">{children}</div>
          </Reveal>
        )}
      </div>
    </header>
  );
}
