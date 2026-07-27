"use client";

import { Command } from "cmdk";
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
import { useCallback, useEffect, useState } from "react";
import { caseStudies, posts, profile } from "@/content";
import { navGroups } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Global search and navigation. Opens on Cmd/Ctrl+K or by clicking the
 * header trigger. Indexes routes, case studies and posts.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-command-palette", onOpen);
    return () => window.removeEventListener("open-command-palette", onOpen);
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search this site"
      className="fixed inset-0 z-[160]"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm"
      />

      <div
        className={cn(
          "absolute left-1/2 top-[12vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2",
          "overflow-hidden rounded-2xl border border-line bg-bg-elevated shadow-[var(--shadow-md)]",
        )}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <Command.Input
            placeholder="Search pages, projects, writing…"
            className="h-14 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
            ESC
          </kbd>
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
            {caseStudies.map((study) => (
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
            {posts.map((post) => (
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
      </div>
    </Command.Dialog>
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
