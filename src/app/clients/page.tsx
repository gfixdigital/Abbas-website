import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, clients, metrics } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AnimatedCounter, ArrowLink } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Businesses, universities, government departments and international initiatives that have worked with Muhammad Abbas and GFix Digital.",
  alternates: { canonical: absoluteUrl("/clients") },
  openGraph: {
    title: "Clients",
    description: "Who GFix Digital has worked with.",
    url: absoluteUrl("/clients"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Who we work with")}&eyebrow=${encodeURIComponent("Clients")}&meta=${encodeURIComponent("50+ client partnerships")}`,
        width: 1200,
        height: 630,
        alt: "Clients",
      },
    ],
  },
};

export default function ClientsPage() {
  const partnershipMetric = metrics.find(
    (metric) => metric.label === "Client partnerships",
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Clients", href: "/clients" },
        ]}
      />

      <PageHeader
        eyebrow="Clients"
        title="From a local salon to a U.S. Mission supported initiative."
        description="The range is deliberate. A studio that only serves one tier of client never learns what the next tier expects."
      />

      <Section index="01 / Partnerships">
        <SectionHeader
          eyebrow="Selected clients"
          title="Named with permission, drawn from published work."
          description="Every organisation below appears in a project published on the GFix Digital site."
          action={
            partnershipMetric ? (
              <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-ink">
                <AnimatedCounter
                  value={partnershipMetric.value}
                  suffix={partnershipMetric.suffix}
                />
                <span className="ml-3 align-middle font-sans text-sm font-normal text-muted">
                  partnerships to date
                </span>
              </p>
            ) : undefined
          }
        />

        <RevealGroup
          className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.045}
        >
          {clients.map((client) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-base font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                    {client.name}
                  </h2>
                  {client.url && (
                    <ArrowUpRight
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-2 text-[13px] text-muted">{client.context}</p>
              </>
            );

            return (
              <RevealItem key={client.name} className="bg-bg-elevated">
                {client.url ? (
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group block h-full p-7 transition-colors hover:bg-bg-soft/60"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group h-full p-7">{inner}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      <Section tone="soft" index="02 / Sectors">
        <SectionHeader
          eyebrow="Where the work sits"
          title="Six sectors, one delivery standard."
        />

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              sector: "E-commerce & retail",
              detail:
                "Custom storefronts with bespoke admin panels, built for owners to operate themselves.",
              example: "AD Collection Scents",
            },
            {
              sector: "Higher education",
              detail:
                "Event branding, exhibition media and academic programme promotion.",
              example: "Iqra National University",
            },
            {
              sector: "International initiatives",
              detail:
                "Media and design partnership to international brand standards.",
              example: "Pakistan-U.S. Alumni Network",
            },
            {
              sector: "Youth & civic organisations",
              detail:
                "Summit operations, leadership programmes and digital skills workshops.",
              example: "United Youth Parliament",
            },
            {
              sector: "National training programmes",
              detail:
                "Trainer selection, curriculum shaping and cohort coordination.",
              example: "BanoQabil",
            },
            {
              sector: "Local business & services",
              detail:
                "Brand identity, collateral systems and retained social management.",
              example: "Ayaan Design Studio",
            },
          ].map((item) => (
            <RevealItem key={item.sector} className="h-full">
              <div className="flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7">
                <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                  {item.sector}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {item.detail}
                </p>
                <p className="mt-auto pt-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-brand">
                  {item.example}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <ArrowLink href="/projects">
            See the {caseStudies.length} published case studies
          </ArrowLink>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
