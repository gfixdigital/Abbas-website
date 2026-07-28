import type { Metadata } from "next";
import { getEducation, getExperience, getProfile } from "@/lib/data";
import { absoluteUrl, durationFrom, formatDateRange } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline for Muhammad Abbas: founder and CEO of GFix Digital, IT trainer at MEPA, digital skills trainer with BanoQabil, and community volunteer with MP Network.",
  alternates: { canonical: absoluteUrl("/experience") },
  openGraph: {
    title: "Experience",
    description: "Roles, responsibilities and career timeline.",
    url: absoluteUrl("/experience"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Career timeline")}&eyebrow=${encodeURIComponent("Experience")}`,
        width: 1200,
        height: 630,
        alt: "Career timeline",
      },
    ],
  },
};

const TRACK_LABEL = {
  studio: "Studio",
  academy: "Academy",
  community: "Community",
} as const;

export default async function ExperiencePage() {
  const education = await getEducation();
  const experience = await getExperience();
  const profile = await getProfile();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Experience", href: "/experience" },
        ]}
      />

      <PageHeader
        eyebrow="Experience"
        title="Five years, four concurrent roles, one through-line."
        description="Every role below sits on one of two tracks: building the studio, or building the people. The community work runs underneath both."
      />

      <Section>
        <SectionHeader
          eyebrow="Career"
          title="Roles and responsibilities."
          description="Ordered by start date, most recent first. Current roles run in parallel."
        />

        {/* Dual-rail timeline. The colour of the marker tells you which track a
            role belongs to without needing to read the badge. */}
        <RevealGroup className="relative" stagger={0.06}>
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-line sm:left-[9px]"
          />

          <ol className="space-y-12 sm:space-y-14">
            {experience.map((role) => (
              <RevealItem key={`${role.organisation}-${role.role}`} as="li">
                <div className="relative pl-8 sm:pl-12">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-bg",
                      role.track === "studio" && "bg-brand",
                      role.track === "academy" && "bg-accent",
                      role.track === "community" && "bg-muted",
                    )}
                  />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {formatDateRange(role.startDate, role.endDate)}
                    </span>
                    <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      {durationFrom(role.startDate, role.endDate)}
                    </span>
                    {role.isCurrent && (
                      <Badge variant="success">Current</Badge>
                    )}
                    <Badge
                      variant={
                        role.track === "studio"
                          ? "brand"
                          : role.track === "academy"
                            ? "accent"
                            : "default"
                      }
                    >
                      {TRACK_LABEL[role.track]}
                    </Badge>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-2xl">
                    {role.role}
                  </h3>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 text-sm">
                    <span className="font-medium text-brand">{role.organisation}</span>
                    <span aria-hidden="true" className="text-line-strong">
                      ·
                    </span>
                    <span className="text-muted">{role.location}</span>
                  </p>

                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {role.description}
                  </p>

                  <ul className="mt-5 max-w-2xl space-y-2.5">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-line-strong"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Academic"
          title="Studied while building."
          description="Both qualifications were completed alongside running the studio, not before it."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {education.map((item) => (
            <RevealItem key={item.qualification}>
              <div className="h-full rounded-[var(--radius)] border border-line bg-bg-elevated p-7">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                    {item.startYear} — {item.endYear}
                  </span>
                  {item.isCurrent && <Badge variant="success">In progress</Badge>}
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink">
                  {item.qualification}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{item.institution}</p>
                {item.note && (
                  <p className="mt-4 border-t border-line pt-4 text-[13px] leading-relaxed text-brand">
                    {item.note}
                  </p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {profile.name} holds certifications in graphic design and digital
            marketing from DigiSkills.pk, Pakistan&apos;s national digital skills
            programme.
          </p>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
