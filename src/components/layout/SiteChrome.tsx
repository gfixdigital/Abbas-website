"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { BackToTop, ScrollProgress } from "@/components/motion/Interactions";
import { CursorEffect } from "@/components/motion/Backdrop";
import { LoadingScreen, PageTransition } from "@/components/motion/Transitions";

/**
 * Decides whether a route gets the public chrome.
 *
 * The admin section shares the root layout (so it keeps the theme provider and
 * toaster) but must not inherit the marketing navigation, footer, custom
 * cursor or intro curtain. Branching on the pathname here is what keeps the two
 * areas visually separate without needing two root layouts.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <CursorEffect />
      <CommandPalette />

      <Navbar />

      <main id="main" className="relative">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />

      <BackToTop />
    </>
  );
}
