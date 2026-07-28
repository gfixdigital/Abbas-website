import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCaseStudies } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Long-form write-ups of work delivered through GFix Digital, each covering the brief, the approach taken and the outcome.",
  alternates: { canonical: absoluteUrl("/case-studies") },
  openGraph: {
    title: "Case Studies",
    description: "Brief, approach and outcome for each project.",
    url: absoluteUrl("/case-studies"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Brief, approach, outcome")}&eyebrow=${encodeURIComponent("Case Studies")}`,
        width: 1200,
        height: 630,
        alt: "Case studies",
      },
    ],
  },
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Case Studies", href: "/case-studies" },
        ]}
      />

      <PageHeader
        eyebrow="Case Studies"
        title="What the brief was, what we did, what happened."
        description="The same projects as the grid view, presented as an index you can read rather than scan. Each entry links to the full write-up."
      />

      <Section>
        <SectionHeader
          eyebrow={`${caseStudies.length} published studies`}
          title="Read in order, or jump to a discipline."
          description="Ordered by scale of engagement rather than date, so the fullest write-ups come first."
        />

        {/* Editorial index. Deliberately a different reading experience from
            the /projects card grid rather than the same data restyled. */}
        <RevealGroup className="divide-y divide-line border-y border-line" stagger={0.05}>
          {caseStudies.map((study, index) => (
            <RevealItem key={study.slug} as="article">
              <Link
                href={`/projects/${study.slug}`}
                className="group grid gap-6 py-9 sm:grid-cols-[4rem_1fr_14rem] sm:items-start sm:gap-8 lg:gap-12"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2.5">
                    <Badge variant="brand">{study.category}</Badge>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {study.year}
                    </span>
                    {study.track === "academy" && (
                      <Badge variant="accent">Academy</Badge>
                    )}
                  </div>

                  <h2 className="font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-ink transition-colors group-hover:text-brand sm:text-2xl lg:text-[1.75rem]">
                    {study.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted">{study.client}</p>

                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {study.summary}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-brand">
                    Read the case study
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-bg-soft sm:aspect-[3/2]">
                  {study.coverImageUrl ? (
                    <Image
                      src={study.coverImageUrl}
                      alt={`${study.title} — ${study.category}`}
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <span className="font-display text-2xl font-semibold text-line-strong">
                        {study.client.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12">
          <p className="text-sm leading-relaxed text-muted">
            Prefer a visual pass?{" "}
            <Link
              href="/projects"
              className="font-medium text-ink underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors hover:text-brand"
            >
              Browse the filterable project grid
            </Link>{" "}
            or open the{" "}
            <Link
              href="/gallery"
              className="font-medium text-ink underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors hover:text-brand"
            >
              image gallery
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
