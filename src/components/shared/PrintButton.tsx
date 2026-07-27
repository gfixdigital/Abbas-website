"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Interactions";

/** Thin client boundary so the résumé page itself stays a server component. */
export function PrintButton({ children }: { children: ReactNode }) {
  return (
    <Magnetic>
      <Button variant="brand" onClick={() => window.print()}>
        {children}
      </Button>
    </Magnetic>
  );
}
