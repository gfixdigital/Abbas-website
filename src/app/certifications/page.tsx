import type { Metadata } from "next";
import { ExternalLink, GraduationCap } from "lucide-react";
import { getCertifications, getEducation } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Credentials and formal training: DigiSkills.pk certifications in graphic design and digital marketing, a Diploma in Information Technology, and a BS in Computer Science in progress.",
  alternates: { canonical: absoluteUrl("/certifications") },
  openGraph: {
    title: "Certifications",
    description: "Credentials and formal training.",
    url: absoluteUrl("/certifications"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Credentials and training")}&eyebrow=${encodeURIComponent("Certifications")}`,
        width: 1200,
        height: 630,
        alt: "Certifications",
      },
    ],
  },
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();
  const education = await getEducation();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Certifications", href: "/certifications" },
        ]}
      />

      <PageHeader
        eyebrow="Certifications"
        title="Credentials, earned in the order that was useful."
        description="The certifications came first, while taking client work. The degree came after the studio was already running."
      />

      <Section>
        <SectionHeader
          eyebrow="DigiSkills.pk"
          title="National digital skills programme."
          description="Pakistan's government-backed skills initiative. Both certifications were completed while running an active freelance practice."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {certifications.map((certification) => (
            <RevealItem key={certification.title} className="h-full">
              <div className="flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7 sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/8 text-brand">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Badge variant="mono">{certification.year}</Badge>
                </div>

                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {certification.title}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-brand">
                  {certification.issuer}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {certification.description}
                </p>

                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand"
                  >
                    Issuing body
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8">
          <p className="text-sm leading-relaxed text-muted">
            Certificate scans are held privately. They can be provided on request
            for hiring or partnership due diligence.
          </p>
        </Reveal>
      </Section>

      <Section tone="soft">
        <SectionHeader
          eyebrow="Formal education"
          title="Studied alongside building."
          description="Neither qualification preceded the business. Both were completed while the studio was delivering client work."
        />

        <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
          {education.map((item) => (
            <RevealItem key={item.qualification} className="bg-bg-elevated">
              <div className="grid gap-5 p-8 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-10">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2.5">
                    <Badge variant="mono">
                      {item.startYear} — {item.endYear}
                    </Badge>
                    {item.isCurrent && <Badge variant="success">In progress</Badge>}
                  </div>
                  <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                    {item.qualification}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted">{item.institution}</p>
                  {item.note && (
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <ContactCTA />
    </>
  );
}
