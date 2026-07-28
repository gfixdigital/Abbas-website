import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { valuePillars } from "@/content";
import {
  getAwards,
  getCertifications,
  getEducation,
  getExperience,
  getProfile,
} from "@/lib/data";
import { absoluteUrl, formatDateRange } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink, Magnetic } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    title: "About",
    description: profile.shortBio,
    alternates: { canonical: absoluteUrl("/about") },
    openGraph: {
      title: `About ${profile.name}`,
      description: profile.shortBio,
      url: absoluteUrl("/about"),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent("Designer, trainer, agency lead.")}&eyebrow=${encodeURIComponent("About")}`,
          width: 1200,
          height: 630,
          alt: `About ${profile.name}`,
        },
      ],
    },
  };
}

export default async function AboutPage() {
  const awards = await getAwards();
  const certifications = await getCertifications();
  const education = await getEducation();
  const experience = await getExperience();
  const profile = await getProfile();
  const current = experience.filter((role) => role.isCurrent);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <PageHeader
        eyebrow="About"
        title="Designer first. Trainer by necessity. Agency lead by consequence."
        description={profile.fullTitle}
      >
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Button asChild variant="brand">
              <Link href="/contact">Start a conversation</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="outline">
              <Link href="/resume">
                Full résumé
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Magnetic>
        </div>
      </PageHeader>

      {/* Portrait + long bio */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius)] border border-line bg-bg-soft">
              <Image
                src={profile.portraitUrl}
                alt={`${profile.name}, ${profile.title} at ${profile.company}`}
                fill
                sizes="(min-width: 1024px) 460px, 100vw"
                priority
                className="object-cover"
              />
            </div>

            <dl className="mt-8 space-y-4 border-t border-line pt-8">
              {[
                { label: "Role", value: profile.title },
                { label: "Company", value: profile.company },
                { label: "Based in", value: "Mingora, Swat, Pakistan" },
                { label: "Availability", value: profile.availability },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[7rem_1fr] gap-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {row.label}
                  </dt>
                  <dd className="text-sm text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div>
            <div className="space-y-6 text-[15px] leading-[1.75] text-muted sm:text-[17px]">
              {profile.longBio.map((paragraph, index) => (
                <Reveal key={index} delay={Math.min(index * 0.03, 0.15)}>
                  <p
                    className={
                      index === 0
                        ? "text-lg font-medium leading-[1.6] text-ink sm:text-xl"
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Founding story, set apart as a pull-quote block */}
            <Reveal className="mt-14">
              <div className="rounded-[var(--radius)] border-l-2 border-accent bg-bg-soft p-7 sm:p-9">
                <p className="eyebrow mb-5">Why GFix Digital exists</p>
                <div className="space-y-4 text-[15px] leading-relaxed text-muted">
                  {profile.foundingStory.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? "text-ink" : undefined}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Current roles — the dual track made explicit */}
      <Section tone="soft">
        <SectionHeader
          eyebrow="Concurrent roles"
          title="Four commitments, one calendar."
          description="The studio, two training posts, and long-running community work. They reinforce each other, which is the only reason all four are possible."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {current.map((role) => (
            <RevealItem key={role.organisation} className="h-full">
              <div className="flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <Badge
                    variant={
                      role.track === "studio"
                        ? "brand"
                        : role.track === "academy"
                          ? "accent"
                          : "default"
                    }
                  >
                    {role.track === "studio"
                      ? "Studio"
                      : role.track === "academy"
                        ? "Academy"
                        : "Community"}
                  </Badge>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {formatDateRange(role.startDate, role.endDate)}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink">
                  {role.role}
                </h3>
                <p className="mt-1 text-sm font-medium text-brand">
                  {role.organisation}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {role.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <ArrowLink href="/experience">Full career timeline</ArrowLink>
        </Reveal>
      </Section>

      {/* Principles */}
      <Section>
        <SectionHeader
          eyebrow="How I work"
          title="Four things I actually hold to."
          description="Not values on a wall. These are the ones that change decisions when they are inconvenient."
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {valuePillars.map((pillar) => (
            <RevealItem key={pillar.title} className="bg-bg-elevated p-7">
              <span className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-brand/8 text-brand">
                <Icon name={pillar.iconName} />
              </span>
              <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Education, certifications, awards */}
      <Section tone="soft">
        <div className="grid gap-14 lg:grid-cols-3 lg:gap-12">
          <div>
            <Reveal>
              <p className="eyebrow mb-7">Education</p>
            </Reveal>
            <RevealGroup className="space-y-7">
              {education.map((item) => (
                <RevealItem key={item.qualification}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {item.startYear} — {item.endYear}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold leading-snug tracking-tight text-ink">
                    {item.qualification}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.institution}</p>
                  {item.note && (
                    <p className="mt-2.5 text-[13px] leading-relaxed text-brand">
                      {item.note}
                    </p>
                  )}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div>
            <Reveal>
              <p className="eyebrow mb-7">Certifications</p>
            </Reveal>
            <RevealGroup className="space-y-7">
              {certifications.map((item) => (
                <RevealItem key={item.title}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold leading-snug tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.issuer}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal className="mt-7">
              <ArrowLink href="/certifications">All certifications</ArrowLink>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="eyebrow mb-7">Recognition</p>
            </Reveal>
            <RevealGroup className="space-y-7">
              {awards.map((item) => (
                <RevealItem key={item.title}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold leading-snug tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.issuer}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal className="mt-7">
              <ArrowLink href="/awards">All awards</ArrowLink>
            </Reveal>
          </div>
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
