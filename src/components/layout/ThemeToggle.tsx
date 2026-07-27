"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch colour theme"
      }
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-full border border-line",
        "text-muted transition-colors hover:border-brand hover:text-brand",
        className,
      )}
    >
      {/* Both icons render; opacity swaps. Avoids a hydration mismatch and
          avoids the icon popping in after mount. */}
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          mounted && isDark ? "scale-50 opacity-0" : "scale-100 opacity-100",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          mounted && isDark ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
