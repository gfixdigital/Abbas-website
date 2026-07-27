import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { caseStudies, getCaseStudy, profile } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { ProjectCard } from "@/components/work/ProjectCard";
import { BreadcrumbJsonLd, CaseStudyJsonLd } from "@/components/shared/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return { title: "Project not found" };

  const ogUrl = `/api/og?title=${encodeURIComponent(study.title)}&eyebrow=${encodeURIComponent(study.category)}&meta=${encodeURIComponent(`${study.client} · ${study.year}`)}`;

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: absoluteUrl(`/projects/${study.slug}`) },
    openGraph: {
      type: "article",
      title: study.title,
      description: study.summary,
      url: absoluteUrl(`/projects/${study.slug}`),
      images: [
        { url: ogUrl, width: 1200, height: 630, alt: study.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.summary,
      images: [ogUrl],
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const others = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 3);

  return (
    <>
      <CaseStudyJsonLd slug={study.slug} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
          { name: study.title, href: `/projects/${study.slug}` },
        ]}
      />

      {/* Header */}
      <header className="border-b border-line bg-bg-soft">
        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-32 sm:px-8 sm:pt-40 lg:px-12">
          <Reveal>
            <Link
              href="/projects"
              className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-brand"
            >
              <ArrowLeft
                className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              All projects
            </Link>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <div className="mb-6 flex flex-wrap items-center gap-2.5">
                  <Badge variant="brand">{study.category}</Badge>
                  <Badge variant="mono">{study.eyebrow}</Badge>
                  {study.track === "academy" && (
                    <Badge variant="accent">Academy</Badge>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="max-w-3xl font-display text-[clamp(2rem,5.2vw,4rem)] font-semibold leading-[1] tracking-[-0.04em] text-ink">
                  {study.title}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  {study.summary}
                </p>
              </Reveal>
            </div>

            {/* Fact panel */}
            <Reveal delay={0.15} className="lg:pt-4">
              <dl className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
                {[
                  { label: "Client", value: study.client },
                  { label: "Year", value: study.year },
                  { label: "Discipline", value: study.category },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[6.5rem_1fr] gap-4 bg-bg-elevated px-5 py-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-medium text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {study.liveUrl && (
                <Magnetic className="mt-5">
                  <Button asChild variant="brand">
                    <a href={study.liveUrl} target="_blank" rel="noreferrer noopener">
                      View live
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </Magnetic>
              )}
            </Reveal>
          </div>
        </div>
      </header>

      {/* Cover */}
      {study.coverImageUrl && (
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Reveal className="-mt-px">
            <div className="relative aspect-[16/9] overflow-hidden rounded-b-[var(--radius)] border border-t-0 border-line bg-bg-soft">
              <Image
                src={study.coverImageUrl}
                alt={`${study.title} — project cover`}
                fill
                sizes="(min-width: 1400px) 1376px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      )}

      {/* Narrative: brief, solution, result */}
      <Section index="01 / The work">
        <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-5">Capabilities applied</p>
            <ul className="flex flex-wrap gap-2">
              {study.techUsed.map((tech) => (
                <li key={tech}>
                  <Badge variant="outline">{tech}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-14">
            {[
              { label: "The brief", body: study.brief },
              { label: "What we did", body: study.solution },
              { label: "The outcome", body: study.result },
            ].map((block, index) => (
              <Reveal key={block.label} delay={Math.min(index * 0.04, 0.12)}>
                <div className="border-t border-line pt-8">
                  <div className="mb-5 flex items-baseline gap-4">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                      {block.label}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-[15px] leading-[1.75] text-muted sm:text-[17px]">
                    {block.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Next projects */}
      <Section tone="soft" index="02 / More work">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-[-0.03em] text-ink">
            Other projects
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">
              All projects
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item) => (
            <RevealItem key={item.slug} className="h-full">
              <ProjectCard study={item} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Contact strip */}
      <Section containerClassName="py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius)] border border-line bg-bg-elevated p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Need something like this?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Tell me what you are building and I will tell you what it takes.
              </p>
            </div>
            <Magnetic>
              <Button asChild variant="brand" size="lg">
                <Link href="/contact">
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
        <p className="mt-6 text-center font-mono text-[11px] text-muted">
          Or email {profile.email} directly.
        </p>
      </Section>
    </>
  );
}
