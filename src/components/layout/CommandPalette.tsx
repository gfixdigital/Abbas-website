"use client";

import { Command } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  Mail,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navGroups } from "@/lib/nav";
import { useProfile } from "@/lib/site-context";
import { cn } from "@/lib/utils";
import type { CaseStudy, Post } from "@/content";

/**
 * Global search and navigation. Slides down from the header on
 * Cmd/Ctrl+K or by clicking the search icon in the navbar.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const router = useRouter();
  const reduce = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const profile = useProfile();

  useEffect(() => {
    Promise.all([
      import("@/lib/data").then((m) => m.getCaseStudies()),
      import("@/lib/data").then((m) => m.getPosts()),
    ]).then(([cs, ps]) => {
      setStudies(cs);
      setArticles(ps);
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onToggle = () => setOpen((prev) => !prev);
    window.addEventListener("open-command-palette", onOpen);
    window.addEventListener("toggle-command-palette", onToggle);
    return () => {
      window.removeEventListener("open-command-palette", onOpen);
      window.removeEventListener("toggle-command-palette", onToggle);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-search-toggle]")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn(
            "fixed left-0 right-0 top-[72px] z-[150] mx-auto w-full max-w-xl px-4",
            "pt-2",
          )}
        >
          <Command
            label="Search this site"
            className={cn(
              "overflow-hidden rounded-2xl border border-line bg-bg-elevated",
              "shadow-[0_16px_70px_-10px_rgba(0,0,0,0.15)]",
            )}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <Command.Input
                placeholder="Search pages, projects, writing…"
                className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70 focus-visible:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted transition-colors hover:text-ink sm:block"
              >
                ESC
              </button>
            </div>

            <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
                Nothing found. Try a project name or a page title.
              </Command.Empty>

              <Command.Group heading="Quick actions" className={groupClass}>
                <Item onSelect={() => go("/contact")} icon={<Mail />} label="Get in touch" />
                <Item onSelect={() => go("/resume")} icon={<FileText />} label="View résumé" />
                <Item
                  onSelect={() => {
                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                    setOpen(false);
                  }}
                  icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
                  label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                />
                <Item
                  onSelect={() => {
                    window.open(`mailto:${profile.email}`, "_self");
                    setOpen(false);
                  }}
                  icon={<Mail />}
                  label={`Email ${profile.email}`}
                />
              </Command.Group>

              {navGroups.map((group) => (
                <Command.Group key={group.label} heading={group.label} className={groupClass}>
                  {group.items.map((item) => (
                    <Item
                      key={item.href}
                      onSelect={() => go(item.href)}
                      icon={<User />}
                      label={item.label}
                      hint={item.description}
                    />
                  ))}
                </Command.Group>
              ))}

              <Command.Group heading="Projects" className={groupClass}>
                {studies.map((study) => (
                  <Item
                    key={study.slug}
                    onSelect={() => go(`/projects/${study.slug}`)}
                    icon={<FolderOpen />}
                    label={study.title}
                    hint={study.category}
                    value={`${study.title} ${study.client} ${study.category} ${study.techUsed.join(" ")}`}
                  />
                ))}
              </Command.Group>

              <Command.Group heading="Writing" className={groupClass}>
                {articles.map((post) => (
                  <Item
                    key={post.slug}
                    onSelect={() => go(`/blog/${post.slug}`)}
                    icon={<FileText />}
                    label={post.title}
                    hint={post.tags.join(", ")}
                    value={`${post.title} ${post.excerpt} ${post.tags.join(" ")}`}
                  />
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const groupClass = cn(
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3",
  "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px]",
  "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em]",
  "[&_[cmdk-group-heading]]:text-muted",
);

function Item({
  onSelect,
  icon,
  label,
  hint,
  value,
}: {
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      value={value ?? label}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink",
        "transition-colors data-[selected=true]:bg-bg-soft",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted",
      )}
    >
      {icon}
      <span className="truncate font-medium">{label}</span>
      {hint && (
        <span className="ml-auto hidden truncate text-xs text-muted sm:block">
          {hint}
        </span>
      )}
      <ArrowRight
        className="ml-auto opacity-0 transition-opacity group-data-[selected=true]:opacity-100 sm:ml-2"
        aria-hidden="true"
      />
    </Command.Item>
  );
}

/** Opens the palette from anywhere without prop drilling. */
export function openCommandPalette() {
  window.dispatchEvent(new Event("open-command-palette"));
}

/** Toggles the palette from anywhere without prop drilling. */
export function toggleCommandPalette() {
  window.dispatchEvent(new Event("toggle-command-palette"));
}
