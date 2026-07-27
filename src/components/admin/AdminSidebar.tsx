"use client";

import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  ChartNoAxesColumn,
  ExternalLink,
  FolderOpen,
  Handshake,
  Image as ImageIcon,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic,
  PenLine,
  School,
  Settings,
  Share2,
  SlidersHorizontal,
  Quote as QuoteIcon,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { signOut } from "@/app/admin/actions";
import { entities } from "@/lib/admin/entities";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  folder: FolderOpen,
  layers: Layers,
  briefcase: Briefcase,
  chart: ChartNoAxesColumn,
  quote: QuoteIcon,
  pen: PenLine,
  sliders: SlidersHorizontal,
  award: Award,
  badge: BadgeCheck,
  school: School,
  building: Building2,
  mic: Mic,
  share: Share2,
  inbox: Inbox,
  settings: Settings,
  handshake: Handshake,
  image: ImageIcon,
};

const SECTIONS: { label: string; keys: string[] }[] = [
  { label: "Your details", keys: ["profile", "social-links"] },
  { label: "Work", keys: ["case-studies", "services", "clients", "partners", "gallery", "metrics"] },
  { label: "Background", keys: ["experience", "education", "certifications", "awards", "skills"] },
  { label: "Words", keys: ["posts", "testimonials", "speaking"] },
  { label: "Admin", keys: ["messages", "settings"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <>
      <div className="mb-8 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-navy via-brand to-brand-sky font-display text-[12px] font-bold text-white">
          MA
        </span>
        <div className="leading-none">
          <p className="font-display text-sm font-semibold tracking-tight text-ink">
            Site editor
          </p>
          <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
            Muhammad Abbas
          </p>
        </div>
      </div>

      <nav aria-label="Content sections" className="flex-1 space-y-6 overflow-y-auto">
        <div className="space-y-0.5">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/admin"
                ? "bg-brand/8 text-brand"
                : "text-ink hover:bg-bg-soft",
            )}
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Overview
          </Link>
          <Link
            href="/admin/insights"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/admin/insights"
                ? "bg-brand/8 text-brand"
                : "text-ink hover:bg-bg-soft",
            )}
          >
            <ChartNoAxesColumn className="h-4 w-4" aria-hidden="true" />
            Insights
          </Link>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.keys.map((key) => {
                const entity = entities.find((item) => item.key === key);
                if (!entity) return null;
                const Icon = ICONS[entity.icon] ?? FolderOpen;
                const active = pathname === `/admin/${entity.key}`;

                return (
                  <li key={entity.key}>
                    <Link
                      href={`/admin/${entity.key}`}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-brand/8 font-medium text-brand"
                          : "text-muted hover:bg-bg-soft hover:text-ink",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {entity.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-6 space-y-1 border-t border-line pt-5">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-bg-soft hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          View live site
        </a>

        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="text-sm text-muted">Appearance</span>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => startTransition(() => void signOut())}
          disabled={pending}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-danger/[0.07] hover:text-danger disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {pending ? "Signing out" : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg px-5 py-3 lg:hidden">
        <span className="font-display text-sm font-semibold tracking-tight text-ink">
          Site editor
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open editor menu"
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close editor menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/45"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-bg p-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close editor menu"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {nav}
          </div>
        </div>
      )}

      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-bg p-5 lg:flex">
        {nav}
      </aside>
    </>
  );
}
