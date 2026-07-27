import { ArrowUpRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  clients,
  featuredCaseStudies,
  metrics,
  processSteps,
  profile,
  services,
  tools,
  valuePillars,
} from "@/content";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import {
  AnimatedCounter,
  ArrowLink,
  Magnetic,
  Marquee,
} from "@/components/motion/Interactions";
import { SpotlightCard } from "@/components/motion/Spotlight";
import { ProjectCard } from "@/components/work/ProjectCard";
import { BackgroundDots } from "@/components/motion/Backdrop";

/* -------------------------------------------------------------------------- */
/* Client marquee                                                             */
/* -------------------------------------------------------------------------- */

export function ClientMarquee() {
  return (
    <div className="border-y border-line bg-bg-soft py-10">
      <p className="eyebrow mb-7 text-center">
        Trusted by businesses, universities and international initiatives
      </p>
      <Marquee speed={42}>
        {clients.map((client) => (
          <span
            key={client.name}
            className="whitespace-nowrap font-display text-lg font-medium tracking-tight text-muted transition-colors hover:text-ink sm:text-xl"
          >
            {client.name}
            <span aria-hidden="true" className="ml-10 text-line-strong">
              /
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Introduction — the dual track, stated plainly                              */
/* -------------------------------------------------------------------------- */

export function Introduction() {
  return (
    <Section index="01 / Introduction">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow mb-6">Who I am</p>
          <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-[var(--radius)] border border-line bg-bg-soft">
            <Image
              src={profile.portraitUrl}
              alt={`${profile.name}, ${profile.title} at ${profile.company}`}
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-6 max-w-sm border-l-2 border-brand pl-4">
            <p className="font-display text-base font-medium tracking-tight text-ink">
              {profile.name}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-muted">
              {profile.title}, {profile.company}
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.875rem)] font-semibold leading-[1.08] tracking-[-0.032em] text-ink">
              Most agencies compete for scarce talent. We decided to make more of
              it.
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted sm:text-base">
            {profile.longBio.slice(0, 4).map((paragraph, index) => (
              <Reveal key={index} delay={Math.min(index * 0.04, 0.16)}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Button asChild variant="outline">
                  <Link href="/about">Read the full story</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="ghost">
                  <Link href="/resume">
                    View résumé
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Company snapshot                                                           */
/* -------------------------------------------------------------------------- */

export function CompanySnapshot() {
  return (
    <Section tone="dark" index="02 / The company" className="grain">
      <BackgroundDots className="opacity-[0.07]" />

      <div className="relative">
        <SectionHeader
          tone="dark"
          eyebrow="GFix Digital"
          title="One studio, two outputs."
          description="The agency ships commercial work. The academy produces the people who ship it. Neither subsidises the other; each makes the other possible."
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <RevealItem key={metric.label} className="bg-[#0b0f19] p-7 lg:p-8">
              <span
                className={cn(
                  "mb-6 block h-px w-10",
                  metric.track === "studio" ? "bg-brand-sky" : "bg-accent",
                )}
                aria-hidden="true"
              />
              <p className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em] text-white">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="mt-3 text-sm font-medium text-white/90">{metric.label}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                {metric.note}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <p className="text-sm text-white/55">
              GFix Digital operates across technical, creative, media production,
              training and management departments.
            </p>
            <a
              href={profile.companyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-brand-sky-soft"
            >
              Visit gfixdigital.com
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Featured work                                                              */
/* -------------------------------------------------------------------------- */

export function FeaturedWork() {
  const [lead, ...rest] = featuredCaseStudies;

  return (
    <Section index="03 / Selected work">
      <SectionHeader
        eyebrow="Signature projects"
        title="Work that had to hold up."
        description="A fragrance storefront, a university exhibition, an internationally supported investment initiative, and a national training programme."
        action={<ArrowLink href="/projects">Browse all projects</ArrowLink>}
      />

      {lead && (
        <Reveal className="mb-6">
          <ProjectCard study={lead} size="feature" priority />
        </Reveal>
      )}

      <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((study) => (
          <RevealItem key={study.slug} className="h-full">
            <ProjectCard study={study} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export function ServicesPreview() {
  return (
    <Section tone="soft" index="04 / Capability">
      <SectionHeader
        eyebrow="What we deliver"
        title="Six disciplines, run by one team."
        description="Design, build, market, film, teach, and run the event. Handled in-house, which is why the parts fit together."
        action={<ArrowLink href="/services">Full service detail</ArrowLink>}
      />

      <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <RevealItem key={service.slug} className="h-full">
            <SpotlightCard className="h-full" innerClassName="flex h-full flex-col p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl border",
                    service.track === "academy"
                      ? "border-accent/25 bg-accent/8 text-accent"
                      : "border-brand/20 bg-brand/8 text-brand",
                  )}
                >
                  <Icon name={service.iconName} />
                </span>
                {service.track === "academy" && (
                  <Badge variant="accent">Academy</Badge>
                )}
              </div>

              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {service.description}
              </p>

              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {service.features.slice(0, 3).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-[13px] leading-snug text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Leadership philosophy                                                      */
/* -------------------------------------------------------------------------- */

export function LeadershipPhilosophy() {
  return (
    <Section index="05 / How we work">
      <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
        <div>
          <SectionHeader
            align="stacked"
            eyebrow="Principles"
            title="Clear expectations, honest timelines, work you can stand behind."
            description="Four things we actually hold ourselves to, rather than four words on a wall."
            className="mb-10"
          />

          <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
            {valuePillars.map((pillar) => (
              <RevealItem key={pillar.title} className="bg-bg-elevated p-6">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/8 text-brand">
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
        </div>

        <div className="lg:pt-4">
          <Reveal>
            <p className="eyebrow mb-8">The process</p>
          </Reveal>

          <RevealGroup className="relative space-y-9">
            {/* Single continuous rail. The numbered steps hang off it. */}
            <span
              aria-hidden="true"
              className="absolute left-[19px] top-3 h-[calc(100%-2rem)] w-px bg-line"
            />
            {processSteps.map((step) => (
              <RevealItem key={step.index} className="relative flex gap-5">
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-bg-elevated font-mono text-[11px] font-medium text-brand">
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

          <Reveal className="mt-12">
            <ArrowLink href="/leadership">More on how the studio runs</ArrowLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Tech stack marquee                                                         */
/* -------------------------------------------------------------------------- */

export function TechStack() {
  const half = Math.ceil(tools.length / 2);

  return (
    <Section tone="soft" index="06 / Toolkit" containerClassName="py-20 lg:py-24">
      <SectionHeader
        align="centered"
        eyebrow="Technology & tooling"
        title="The tools behind the output."
      />

      <div className="space-y-4">
        {[tools.slice(0, half), tools.slice(half)].map((row, rowIndex) => (
          <Marquee key={rowIndex} speed={rowIndex === 0 ? 46 : 54} reverse={rowIndex === 1}>
            {row.map((tool) => (
              <span
                key={tool.name}
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-bg-elevated px-5 py-2.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                <span className="whitespace-nowrap text-sm font-medium text-ink">
                  {tool.name}
                </span>
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {tool.category}
                </span>
              </span>
            ))}
          </Marquee>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <ArrowLink href="/skills">See the full skill breakdown</ArrowLink>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact CTA                                                                */
/* -------------------------------------------------------------------------- */

export function ContactCTA() {
  return (
    <Section tone="dark" index="08 / Next step" className="grain overflow-hidden">
      <BackgroundDots className="opacity-[0.06]" />

      <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow mb-6 text-white/45">Start something</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
              <Quote
                className="mb-6 h-8 w-8 text-accent"
                aria-hidden="true"
              />
              Tell me what you are building, and I will tell you what it takes.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-white/60 sm:text-base">
              Client work, a training cohort, a speaking slot, or a media
              partnership. Every message reaches me directly.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
            <Magnetic>
              <Button asChild size="lg" variant="accent">
                <Link href="/contact">
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="glass">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
