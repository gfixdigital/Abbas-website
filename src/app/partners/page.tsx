import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Handshake } from "lucide-react";
import { clients, profile } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { getPartners } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink, Magnetic } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Standing collaborations behind GFix Digital: education, hardware, creative and commercial partners supporting the studio and the training programmes.",
  alternates: { canonical: absoluteUrl("/partners") },
  openGraph: {
    title: "Partners",
    description: "The standing collaborations behind the studio.",
    url: absoluteUrl("/partners"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Standing collaborations")}&eyebrow=${encodeURIComponent("Partners")}`,
        width: 1200,
        height: 630,
        alt: "Partners",
      },
    ],
  },
};

const PARTNERSHIP_TYPES = [
  {
    title: "Training & education",
    detail:
      "Academies and institutions that host cohorts, supply venues, or send students into the programme.",
    example: "MEPA, BanoQabil, Iqra National University",
  },
  {
    title: "Media & design partnership",
    detail:
      "Organisations running events or initiatives where GFix Digital carries the creative and media operation end to end.",
    example: "Pakistan-U.S. Alumni Network, Hawks Youth Vision",
  },
  {
    title: "Creative collaboration",
    detail:
      "Studios and freelancers we bring in on larger briefs, and who bring us in on theirs.",
    example: "Dejavu, Ayaan Design Studio",
  },
  {
    title: "Supply & infrastructure",
    detail:
      "Hardware and equipment partners keeping the training rooms and production kit running.",
    example: "Computer Shop",
  },
];

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Partners", href: "/partners" },
        ]}
      />

      <PageHeader
        eyebrow="Partners"
        title="A studio this size does not work alone."
        description="Standing collaborations rather than client engagements. Each one covers a gap the studio would otherwise have to fill itself."
      >
        <Magnetic>
          <Button asChild variant="brand">
            <Link href="/contact?topic=partnership">Propose a partnership</Link>
          </Button>
        </Magnetic>
      </PageHeader>

      <Section index="01 / Current partners">
        <SectionHeader
          eyebrow="Who we work with"
          title={`${partners.length} standing collaboration${partners.length === 1 ? "" : "s"}.`}
          description="Published on the GFix Digital site and active now. Each is a two-way arrangement, not a supplier list."
        />

        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {partners.map((partner) => {
            const body = (
              <>
                <div className="mb-6 flex items-start justify-between gap-4">
                  {/* Logos come from the agency's own CDN at varying aspect
                      ratios, so they sit in a fixed contain box rather than
                      being cropped to a square. */}
                  <div className="relative h-14 w-28 shrink-0 overflow-hidden rounded-lg bg-bg-soft">
                    {partner.logoUrl ? (
                      <Image
                        src={partner.logoUrl}
                        alt={`${partner.name} logo`}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center font-display text-lg font-semibold text-line-strong">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <Badge variant="mono">{partner.category}</Badge>
                </div>

                <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-brand">
                  {partner.name}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {partner.description}
                </p>

                {partner.url && (
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-ink transition-colors group-hover:text-brand">
                    Visit partner
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </>
            );

            return (
              <RevealItem key={partner.name} className="h-full">
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7 transition-all duration-400 hover:border-brand/45 hover:shadow-[var(--shadow-sm)]"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="group flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7">
                    {body}
                  </div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      <Section tone="soft" index="02 / How partnerships work">
        <SectionHeader
          eyebrow="Four kinds of arrangement"
          title="What we actually exchange."
          description="Partnerships here are specific. Each type solves a named problem rather than being a logo swap."
        />

        <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
          {PARTNERSHIP_TYPES.map((type, index) => (
            <RevealItem key={type.title} className="bg-bg-elevated">
              <div className="grid gap-5 p-7 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-8">
                <span className="font-mono text-[11px] tracking-[0.16em] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                    {type.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                    {type.detail}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted sm:max-w-[14rem] sm:text-right">
                  {type.example}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <ArrowLink href="/clients">
            See the {clients.length} client organisations
          </ArrowLink>
        </Reveal>
      </Section>

      <Section index="03 / Work with us" containerClassName="py-20">
        <Reveal>
          <div className="flex flex-col items-start gap-7 rounded-[var(--radius)] border border-line bg-bg-elevated p-8 sm:p-12">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent/25 bg-accent/8 text-accent">
              <Handshake className="h-5 w-5" aria-hidden="true" />
            </span>

            <div>
              <h2 className="max-w-2xl font-display text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Want to partner with us?
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
                We are open to training collaborations, media partnerships on
                events and initiatives, and creative studios who want a
                production partner in Khyber Pakhtunkhwa. Tell us what you are
                trying to do and who it serves.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Button asChild variant="brand">
                  <Link href="/contact?topic=partnership">
                    Propose a partnership
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="outline">
                  <a href={`mailto:${profile.email}?subject=Partnership%20enquiry`}>
                    {profile.email}
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
