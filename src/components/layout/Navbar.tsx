"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/content";
import { navGroups, primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { openCommandPalette } from "./CommandPalette";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every overlay on navigation, and lock scroll while the mobile
  // sheet is open.
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200]",
          "focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-ink-inverse",
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled
            ? "border-b border-line bg-bg/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5 sm:h-[72px] sm:px-8 lg:px-12"
        >
          {/* Wordmark. The monogram block is the only place the brand gradient
              appears in the chrome, which keeps it from feeling decorative. */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Muhammad Abbas, home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-navy via-brand to-brand-sky font-display text-[13px] font-bold text-white">
              MA
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                Muhammad Abbas
              </span>
              <span className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                {profile.title} · {profile.company}
              </span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-ink"
                    : "text-muted hover:text-ink",
                )}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId={reduce ? undefined : "nav-pill"}
                    className="absolute inset-0 -z-10 rounded-full bg-bg-soft"
                    transition={{ type: "spring", stiffness: 340, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setMegaOpen((prev) => !prev)}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              className={cn(
                "ml-1 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                megaOpen ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              More
              <svg
                viewBox="0 0 12 12"
                className={cn(
                  "h-2.5 w-2.5 transition-transform duration-300",
                  megaOpen && "rotate-180",
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M2 4.5 6 8.5 10 4.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Search this site"
              className={cn(
                "hidden h-9 items-center gap-2 rounded-full border border-line px-3",
                "text-muted transition-colors hover:border-brand hover:text-brand sm:flex",
              )}
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <kbd className="font-mono text-[10px] tracking-wider">⌘K</kbd>
            </button>

            <ThemeToggle />

            <Button asChild size="sm" variant="brand" className="hidden sm:inline-flex">
              <Link href="/contact">
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMegaOpen(false)}
                className="fixed inset-0 top-[72px] -z-10 hidden cursor-default lg:block"
              />
              <motion.div
                id="mega-menu"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                className="hidden border-t border-line bg-bg/95 backdrop-blur-xl lg:block"
              >
                <div className="mx-auto grid max-w-[1400px] gap-8 px-12 py-10 md:grid-cols-4">
                  {navGroups.map((group) => (
                    <div key={group.label}>
                      <p className="eyebrow mb-4">{group.label}</p>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="group block rounded-lg px-3 py-2 transition-colors hover:bg-bg-soft"
                            >
                              <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                                {item.label}
                                <ArrowUpRight
                                  className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                  aria-hidden="true"
                                />
                              </span>
                              {item.description && (
                                <span className="mt-0.5 block text-xs leading-snug text-muted">
                                  {item.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[90] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-line bg-bg"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                {navGroups.map((group) => (
                  <div key={group.label} className="mb-7">
                    <p className="eyebrow mb-3">{group.label}</p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
                              isActive(item.href)
                                ? "bg-bg-soft text-brand"
                                : "text-ink hover:bg-bg-soft",
                            )}
                          >
                            {item.label}
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="shrink-0 space-y-3 border-t border-line p-5">
                <Button asChild variant="brand" className="w-full">
                  <Link href="/contact">Start a project</Link>
                </Button>
                <a
                  href={`mailto:${profile.email}`}
                  className="block text-center text-sm text-muted transition-colors hover:text-brand"
                >
                  {profile.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
