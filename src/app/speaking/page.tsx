import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Mic } from "lucide-react";
import { profile, speaking } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Speaking & Media",
  description:
    "Sessions, summits, training programmes and media partnerships involving Muhammad Abbas, including the Youth Peace Leadership Summit and the Swat Investment Readiness Initiative.",
  alternates: { canonical: absoluteUrl("/speaking") },
  openGraph: {
    title: "Speaking & Media",
    description: "Sessions, summits and media partnerships.",
    url: absoluteUrl("/speaking"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Speaking & media")}&eyebrow=${encodeURIComponent("Engagements")}`,
        width: 1200,
        height: 630,
        alt: "Speaking and media",
      },
    ],
  },
};

const TOPICS = [
  {
    title: "Building a digital business where the market does not exist yet",
    detail:
      "Founding and scaling a studio in a region with no established digital sector, and why training became structural rather than charitable.",
  },
  {
    title: "Digital skills as employment, not certificates",
    detail:
      "Designing training that ends in portfolio work and paid engagements, drawn from over 500 learners across GFix, MEPA and BanoQabil.",
  },
  {
    title: "Freelancing and the international client",
    detail:
      "What overseas clients check, how to price, and the asset and documentation standards that separate hobby work from commercial work.",
  },
  {
    title: "Management and leadership for young teams",
    detail:
      "Delegation, accountability and review culture in a team where most members are early in their careers.",
  },
];

export default function SpeakingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Speaking & Media", href: "/speaking" },
        ]}
      />

      <PageHeader
        eyebrow="Speaking & Media"
        title="Sessions, summits, and the partnerships behind them."
        description="Training delivery, panel and seminar work, and media partnerships on national and internationally supported initiatives."
      >
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Button asChild variant="brand">
              <Link href="/contact?topic=speaking">Request a speaker</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="outline">
              <a href={`mailto:${profile.email}?subject=Speaking%20enquiry`}>
                Email directly
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </Magnetic>
        </div>
      </PageHeader>

      <Section index="01 / Engagements">
        <SectionHeader
          eyebrow="Recent and ongoing"
          title="Where the work has been delivered."
          description="A mix of standalone sessions, running programmes, and partnerships where GFix Digital handled media and design as well as speaking."
        />

        <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
          {speaking.map((item) => (
            <RevealItem key={item.title} className="bg-bg-elevated">
              <div className="grid gap-6 p-7 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-8 sm:p-9">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand">
                  <Mic className="h-4.5 w-4.5" aria-hidden="true" />
                </span>

                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2.5">
                    <Badge variant="mono">{item.type}</Badge>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {item.year}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-xl">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-sm">
                    <span className="text-muted">{item.event}</span>
                    <span aria-hidden="true" className="mx-2 text-line-strong">
                      ·
                    </span>
                    <span className="font-medium text-brand">{item.organiser}</span>
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand"
                  >
                    Details
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="soft" index="02 / Topics">
        <SectionHeader
          eyebrow="What I speak about"
          title="Four topics I can take questions on."
          description="Each is drawn from operating experience rather than reading. Sessions can be adapted for students, early-career professionals or business audiences."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {TOPICS.map((topic, index) => (
            <RevealItem key={topic.title} className="h-full">
              <div className="h-full rounded-[var(--radius)] border border-line bg-bg-elevated p-7">
                <span className="mb-5 block font-mono text-[11px] tracking-[0.16em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-ink">
                  {topic.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {topic.detail}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Media kit */}
      <Section index="03 / Media kit">
        <Reveal>
          <div className="rounded-[var(--radius)] border border-line bg-bg-elevated p-8 sm:p-10">
            <p className="eyebrow mb-6">For organisers and press</p>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
                  Media kit
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
                  Approved biography, headshot, full title and company
                  description for event programmes, press releases and speaker
                  introductions. Request the pack and it will be sent as a single
                  archive.
                </p>
                <Magnetic className="mt-7">
                  <Button asChild variant="brand">
                    <a
                      href={`mailto:${profile.email}?subject=Media%20kit%20request`}
                    >
                      Request the media kit
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </Magnetic>
              </div>

              <dl className="space-y-4 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                {[
                  { label: "Full name", value: profile.name },
                  { label: "Title", value: profile.fullTitle },
                  { label: "Organisation", value: profile.company },
                  { label: "Location", value: profile.location },
                  { label: "Contact", value: profile.email },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-snug text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
