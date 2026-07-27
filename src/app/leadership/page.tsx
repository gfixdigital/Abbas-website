import type { Metadata } from "next";
import { metrics, processSteps, profile, valuePillars } from "@/content";
import { absoluteUrl, cn } from "@/lib/utils";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/motion/Interactions";
import { Icon } from "@/components/shared/Icon";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "How Muhammad Abbas runs GFix Digital: a departmental studio structure, a training arm that feeds its own hiring pipeline, and a delivery process shared across both.",
  alternates: { canonical: absoluteUrl("/leadership") },
  openGraph: {
    title: "Leadership",
    description: "Operating philosophy and studio structure.",
    url: absoluteUrl("/leadership"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Build the pipeline, not the job advert")}&eyebrow=${encodeURIComponent("Leadership")}`,
        width: 1200,
        height: 630,
        alt: "Leadership philosophy",
      },
    ],
  },
};

const DEPARTMENTS = [
  {
    name: "Technical",
    detail: "Web development, e-commerce builds, custom admin panels.",
  },
  {
    name: "Creative",
    detail: "Brand identity, graphic design, print and social systems.",
  },
  {
    name: "Media Production",
    detail: "Photography, videography, editing and event documentation.",
  },
  {
    name: "Training",
    detail: "ICT, design and marketing cohorts, plus institutional sessions.",
  },
  {
    name: "Mentorship & Career Development",
    detail: "Portfolio review, freelancing routes, employability coaching.",
  },
  {
    name: "Management",
    detail: "Client relationships, scheduling, quality review and handover.",
  },
];

const CONVICTIONS = [
  {
    claim: "Train the pipeline instead of competing for it.",
    reasoning:
      "In a market where the talent does not exist yet, you can fight over the few available people or you can make more of them. The second option takes longer and compounds. Over 500 learners have come through the programme, and the studio hires from it.",
  },
  {
    claim: "The admin panel is part of the deliverable.",
    reasoning:
      "A client who cannot change their own prices treats their site as a brochure someone else made. Every build ships with an interface the owner can actually operate, which is why the work stays current after handover.",
  },
  {
    claim: "Departments, not heroes.",
    reasoning:
      "For the first two years every project waited on one person. Splitting the studio into departments with real ownership is what let the work scale and let me finish a degree at the same time.",
  },
  {
    claim: "Run local work to international standard.",
    reasoning:
      "Serving as media partner on a U.S. Mission supported initiative set a bar on asset specification, consistency and documentation. We kept that bar for every project, because the discipline is what lets you accept the next larger one.",
  },
  {
    claim: "Say no while you are still small.",
    reasoning:
      "We turned down work we could technically have delivered. Taking it would have meant delivering it badly. Slower growth cost less than a damaged reputation would have.",
  },
];

export default function LeadershipPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Leadership", href: "/leadership" },
        ]}
      />

      <PageHeader
        eyebrow="Leadership"
        title="Most agencies compete for scarce talent. We decided to make more of it."
        description="How the studio is structured, what it holds to, and the reasoning behind the decisions that shaped both."
      />

      {/* Convictions — the substance of the page */}
      <Section index="01 / Operating convictions">
        <SectionHeader
          eyebrow="What I believe about this work"
          title="Five positions, each with a cost attached."
          description="Stated as claims rather than values, because a claim can be argued with and a value cannot."
        />

        <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
          {CONVICTIONS.map((conviction, index) => (
            <RevealItem key={conviction.claim} className="bg-bg-elevated">
              <div className="grid gap-5 p-7 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-9">
                <span className="font-mono text-[11px] tracking-[0.16em] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-xl">
                    {conviction.claim}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {conviction.reasoning}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Structure */}
      <Section tone="soft" index="02 / Structure">
        <SectionHeader
          eyebrow="How the studio is organised"
          title="Six departments with real ownership."
          description="Each department carries its own briefs and its own review standard, so delivery does not queue behind any single person."
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((department, index) => (
            <RevealItem key={department.name} className="bg-bg-elevated p-7">
              <span className="mb-5 block font-mono text-[11px] tracking-[0.16em] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-ink">
                {department.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {department.detail}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* The dual ledger, at scale */}
      <Section tone="dark" index="03 / Outcomes" className="grain">
        <SectionHeader
          tone="dark"
          eyebrow="Where it has got to"
          title="Two tracks, measured separately."
          description="The studio number and the academy number are kept apart on purpose. Blending them would hide which half is working."
        />

        <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:gap-16">
          {(["studio", "academy"] as const).map((track) => (
            <RevealItem key={track}>
              <div className="relative pl-6">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1 h-full w-px",
                    track === "studio" ? "bg-brand-sky" : "bg-accent",
                  )}
                />
                <p
                  className={cn(
                    "mb-8 font-mono text-[10.5px] uppercase tracking-[0.16em]",
                    track === "studio" ? "text-brand-sky" : "text-accent",
                  )}
                >
                  {track === "studio" ? "The studio" : "The academy"}
                </p>

                <div className="space-y-9">
                  {metrics
                    .filter((metric) => metric.track === track)
                    .map((metric) => (
                      <div key={metric.label}>
                        <p className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-white">
                          <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                        </p>
                        <p className="mt-3 text-base font-medium text-white/90">
                          {metric.label}
                        </p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
                          {metric.note}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Process + principles */}
      <Section index="04 / Delivery">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeader
              align="stacked"
              eyebrow="Process"
              title="Fix, build, grow, scale."
              description="The same four stages govern client work and student deliverables. Briefs, deadlines and quality reviews are not classroom theory here."
              className="mb-10"
            />

            <RevealGroup className="relative space-y-9">
              <span
                aria-hidden="true"
                className="absolute left-[19px] top-3 h-[calc(100%-2rem)] w-px bg-line"
              />
              {processSteps.map((step) => (
                <RevealItem key={step.index} className="relative flex gap-5">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-bg font-mono text-[11px] font-medium text-brand">
                    {step.index}
                  </span>
                  <div className="pt-2">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div>
            <SectionHeader
              align="stacked"
              eyebrow="Principles"
              title="Clear expectations, honest timelines."
              className="mb-10"
            />

            <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
              {valuePillars.map((pillar) => (
                <RevealItem key={pillar.title} className="bg-bg-elevated p-6">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Icon name={pillar.iconName} className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-8">
              <p className="text-sm leading-relaxed text-muted">
                {profile.company} operates from {profile.location}, serving clients
                across Pakistan and on internationally supported initiatives.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
