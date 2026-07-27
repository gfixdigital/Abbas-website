import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { processSteps, profile, services } from "@/content";
import { absoluteUrl, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand and graphic design, web development, digital marketing, video and media production, ICT and digital skills training, and event branding, delivered by GFix Digital.",
  alternates: { canonical: absoluteUrl("/services") },
  openGraph: {
    title: "Services",
    description: "Six disciplines, run in-house by one team.",
    url: absoluteUrl("/services"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Six disciplines, one team")}&eyebrow=${encodeURIComponent("Services")}`,
        width: 1200,
        height: 630,
        alt: "Services",
      },
    ],
  },
};

export default function ServicesPage() {
  const studio = services.filter((service) => service.track === "studio");
  const academy = services.filter((service) => service.track === "academy");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <PageHeader
        eyebrow="Services"
        title="Everything handled in house, which is why the parts fit together."
        description="Six disciplines across the studio and the academy. You can commission one of them or the whole chain."
      >
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Button asChild variant="brand">
              <Link href="/contact">Request a quote</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="outline">
              <Link href="/projects">
                See the work
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Magnetic>
        </div>
      </PageHeader>

      {/* Studio services */}
      <Section>
        <SectionHeader
          eyebrow="Commercial work"
          title="For businesses and institutions."
          description="Design, build, market and film. Commissioned individually or as a full programme of work."
        />

        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          {studio.map((service, index) => (
            <RevealItem key={service.slug} className="h-full">
              <ServiceCard service={service} index={index + 1} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Academy services */}
      <Section tone="soft">
        <SectionHeader
          eyebrow="Training & capability"
          title="For learners, teams and institutions."
          description="Project-based programmes that end with portfolio work rather than a certificate. Delivered to cohorts, schools and corporate teams."
        />

        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          {academy.map((service, index) => (
            <RevealItem key={service.slug} className="h-full">
              <ServiceCard service={service} index={studio.length + index + 1} accent />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeader
          eyebrow="How an engagement runs"
          title="Four stages, no surprises."
          description="The same process governs a logo and a full e-commerce build. Only the duration changes."
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <RevealItem key={step.index} className="bg-bg-elevated p-7 lg:p-8">
              <span className="mb-6 block font-display text-3xl font-semibold tracking-[-0.04em] text-line-strong">
                {step.index}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Every build ships with documentation and, where relevant, an admin
            interface your own team can operate. Handover is part of the scope,
            not a follow-up invoice. Contact {profile.email} to discuss a brief.
          </p>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}

function ServiceCard({
  service,
  index,
  accent = false,
}: {
  service: (typeof services)[number];
  index: number;
  accent?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7 transition-colors hover:border-brand/40 sm:p-9">
      <div className="mb-7 flex items-start justify-between gap-4">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl border",
            accent
              ? "border-accent/25 bg-accent/8 text-accent"
              : "border-brand/20 bg-brand/8 text-brand",
          )}
        >
          <Icon name={service.iconName} className="h-5 w-5" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
        {service.title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        {service.description}
      </p>

      <ul className="mt-7 space-y-3 border-t border-line pt-6">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-muted">
            <Check
              className={cn(
                "mt-[3px] h-3.5 w-3.5 shrink-0",
                accent ? "text-accent" : "text-brand",
              )}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Badge variant={accent ? "accent" : "brand"}>
          {accent ? "Academy" : "Studio"}
        </Badge>
      </div>
    </div>
  );
}
