import {
  Award,
  CalendarCheck,
  Circle,
  Clapperboard,
  Code2,
  Gem,
  GraduationCap,
  Handshake,
  Palette,
  Sprout,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Whitelisted lucide icons addressable by name. Content and CMS rows store a
 * string; this keeps the bundle from pulling in the whole icon set and stops a
 * bad value in the database from crashing a page.
 */
const MAP = {
  Palette,
  Code2,
  TrendingUp,
  Clapperboard,
  GraduationCap,
  CalendarCheck,
  Users,
  Handshake,
  Gem,
  Sprout,
  Zap,
  Award,
} as const;

export const ICON_NAMES = Object.keys(MAP);

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = MAP[name as keyof typeof MAP] ?? Circle;
  return <Cmp className={cn("h-5 w-5", className)} aria-hidden="true" />;
}
