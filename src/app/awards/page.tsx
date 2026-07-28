import type { Metadata } from "next";
import { Award as AwardIcon } from "lucide-react";
import { getAwards, getMetrics } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Awards",
  description:
    "Recognition for Muhammad Abbas, including the Iqra National University Talent Award (2025) for a 4.0 GPA and a PTS Swat commendation certificate.",
  alternates: { canonical: absoluteUrl("/awards") },
  openGraph: {
    title: "Awards",
    description: "Honours and commendations.",
    url: absoluteUrl("/awards"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Recognition")}&eyebrow=${encodeURIComponent("Awards")}`,
        width: 1200,
        height: 630,
        alt: "Awards",
      },
    ],
  },
};

export default async function AwardsPage() {
  const awards = await getAwards();
  const metrics = await getMetrics();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Awards", href: "/awards" },
        ]}
      />

      <PageHeader
        eyebrow="Awards"
        title="Recognition, and what it was actually for."
        description="Two honours, both earned alongside running the studio rather than instead of it."
      />

      <Section>
        <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
          {awards.map((award) => (
            <RevealItem key={award.title} className="bg-bg-elevated">
              <div className="grid gap-6 p-8 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-10 sm:p-10">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/8 text-accent">
                  <AwardIcon className="h-5 w-5" aria-hidden="true" />
                </span>

                <div>
                  <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                    {award.title}
                  </h2>
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {award.issuer}
                  </p>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {award.description}
                  </p>
                </div>

                <span className="font-display text-2xl font-semibold tracking-[-0.03em] text-line-strong sm:text-3xl">
                  {award.year}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Delivery record, framed as the real evidence */}
      <Section tone="soft">
        <SectionHeader
          eyebrow="Beyond the certificates"
          title="The numbers are the better evidence."
          description="Awards are pleasant. Delivery volume and learner outcomes are what a prospective client should weigh."
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <RevealItem key={metric.label} className="bg-bg-elevated p-7 lg:p-8">
              <p className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="mt-3 text-sm font-medium text-ink">{metric.label}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {metric.note}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            GFix Digital has also served as official media and design partner on
            initiatives supported by the U.S. Mission to Pakistan and the
            Pakistan-U.S. Alumni Network.
          </p>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
