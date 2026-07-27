import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Interactive project card. Linear-style: a quiet resting state, a 1px border
 * that warms to brand on hover, and image scale as the only movement.
 */
export function ProjectCard({
  study,
  priority = false,
  size = "default",
}: {
  study: CaseStudy;
  priority?: boolean;
  size?: "default" | "feature";
}) {
  const feature = size === "feature";

  return (
    <article className="group h-full">
      <Link
        href={`/projects/${study.slug}`}
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-bg-elevated",
          "transition-all duration-500 hover:border-brand/45 hover:shadow-[var(--shadow-md)]",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-bg-soft",
            feature ? "aspect-[16/10]" : "aspect-[4/3]",
          )}
        >
          {study.coverImageUrl ? (
            <Image
              src={study.coverImageUrl}
              alt={`${study.title} — ${study.category}`}
              fill
              sizes={
                feature
                  ? "(min-width: 1024px) 60vw, 100vw"
                  : "(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
              }
              priority={priority}
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="font-display text-3xl font-semibold text-line-strong">
                {study.client.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge variant="mono" className="bg-bg/85 backdrop-blur-sm">
              {study.category}
            </Badge>
            {study.track === "academy" && (
              <Badge variant="accent" className="bg-bg/85 backdrop-blur-sm">
                Academy
              </Badge>
            )}
          </div>
        </div>

        <div className={cn("flex flex-1 flex-col p-6", feature && "sm:p-8")}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="eyebrow truncate">{study.eyebrow}</p>
            <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted">
              {study.year}
            </span>
          </div>

          <h3
            className={cn(
              "font-display font-semibold leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-brand",
              feature ? "text-2xl sm:text-3xl" : "text-lg",
            )}
          >
            {study.title}
          </h3>

          <p
            className={cn(
              "mt-3 leading-relaxed text-muted",
              feature ? "text-[15px]" : "line-clamp-3 text-sm",
            )}
          >
            {study.summary}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <ul className="flex flex-wrap gap-1.5">
              {study.techUsed.slice(0, feature ? 5 : 3).map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
              {study.techUsed.length > (feature ? 5 : 3) && (
                <li>
                  <Badge>+{study.techUsed.length - (feature ? 5 : 3)}</Badge>
                </li>
              )}
            </ul>

            <span
              aria-hidden="true"
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted",
                "transition-all duration-400 group-hover:border-brand group-hover:bg-brand group-hover:text-white",
              )}
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
