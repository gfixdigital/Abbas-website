import type { Metadata } from "next";
import { skillGroups, tools } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/shared/Icon";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SkillBar } from "@/components/motion/Interactions";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Disciplines and tooling: graphic design, video editing, digital marketing, branding, ICT training and team leadership, with the software behind each.",
  alternates: { canonical: absoluteUrl("/skills") },
  openGraph: {
    title: "Skills",
    description: "Disciplines, proficiency and tooling.",
    url: absoluteUrl("/skills"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Disciplines and tooling")}&eyebrow=${encodeURIComponent("Skills")}`,
        width: 1200,
        height: 630,
        alt: "Skills",
      },
    ],
  },
};

export default function SkillsPage() {
  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Skills", href: "/skills" },
        ]}
      />

      <PageHeader
        eyebrow="Skills"
        title="Four disciplines, each earned by doing the work directly."
        description="These began as a freelance practice, not a job description. The proficiency figures are a self-assessment against commercial delivery, not a certification score."
      />

      <Section index="01 / Disciplines">
        <SectionHeader
          eyebrow="Capability breakdown"
          title="What I can take responsibility for."
          description="Grouped by discipline. Everything here has shipped in client work rather than in a course exercise."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {skillGroups.map((group) => (
            <RevealItem key={group.group} className="h-full">
              <div className="h-full rounded-[var(--radius)] border border-line bg-bg-elevated p-7 sm:p-8">
                <div className="mb-8 flex items-center gap-3.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/8 text-brand">
                    <Icon name={group.iconName} />
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {group.group}
                  </h3>
                </div>

                <div className="space-y-6">
                  {group.skills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={index * 0.06}
                    />
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="soft" index="02 / Tooling">
        <SectionHeader
          eyebrow="Software & platforms"
          title="The tools behind the output."
          description="Grouped by what they are used for. The web stack is the same one this site is built on."
        />

        <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
          {categories.map((category) => (
            <RevealItem key={category} className="bg-bg-elevated">
              <div className="grid gap-5 p-7 sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-8">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  {category}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {tools
                    .filter((tool) => tool.category === category)
                    .map((tool) => (
                      <li key={tool.name}>
                        <Badge variant="outline" className="px-3 py-1 text-xs">
                          {tool.name}
                        </Badge>
                      </li>
                    ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Certified in graphic design and digital marketing through
            DigiSkills.pk, Pakistan&apos;s national digital skills programme, and
            currently completing a BS in Computer Science at Iqra National
            University.
          </p>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
