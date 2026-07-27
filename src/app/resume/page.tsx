import type { Metadata } from "next";
import { Mail, MapPin, Phone, Printer } from "lucide-react";
import {
  awards,
  certifications,
  education,
  experience,
  metrics,
  profile,
  skillGroups,
  socialLinks,
  tools,
} from "@/content";
import { absoluteUrl, formatDateRange } from "@/lib/utils";
import { PageHeader, Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { PrintButton } from "@/components/shared/PrintButton";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Full curriculum vitae for Muhammad Abbas: Founder and CEO of GFix Digital, IT trainer, and Computer Science student in Swat, Pakistan.",
  alternates: { canonical: absoluteUrl("/resume") },
  openGraph: {
    title: "Résumé",
    description: "Full curriculum vitae.",
    url: absoluteUrl("/resume"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Curriculum vitae")}&eyebrow=${encodeURIComponent("Résumé")}`,
        width: 1200,
        height: 630,
        alt: "Résumé",
      },
    ],
  },
};

export default function ResumePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Résumé", href: "/resume" },
        ]}
      />

      <div className="print:hidden">
        <PageHeader
          eyebrow="Résumé"
          title="Curriculum vitae."
          description="The full record. Use the print action for a clean single-document version; the page is styled for A4 output."
        >
          <PrintButton>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print or save as PDF
          </PrintButton>
        </PageHeader>
      </div>

      <Section
        containerClassName="max-w-4xl py-16 print:max-w-none print:px-0 print:py-0"
      >
        {/* Print-only header. The screen header lives in PageHeader above. */}
        <header className="mb-12 hidden border-b border-line pb-8 print:block">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{profile.fullTitle}</p>
          <p className="mt-3 text-xs text-muted">
            {profile.email} · {profile.phone} · {profile.location} ·
            abbas.gfixdigital.com
          </p>
        </header>

        {/* Contact block, screen only */}
        <Reveal className="mb-14 print:hidden">
          <div className="rounded-[var(--radius)] border border-line bg-bg-soft p-7">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
                { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
                { icon: MapPin, label: "Location", value: "Mingora, Swat, PK", href: null },
              ].map((row) => (
                <div key={row.label}>
                  <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <row.icon className="h-3 w-3" aria-hidden="true" />
                    {row.label}
                  </p>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="text-sm text-ink transition-colors hover:text-brand"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p className="text-sm text-ink">{row.value}</p>
                  )}
                </div>
              ))}
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  LinkedIn
                </p>
                <a
                  href={socialLinks[0]?.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-ink transition-colors hover:text-brand"
                >
                  {socialLinks[0]?.handle}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="space-y-14 print:space-y-8">
          <ResumeSection title="Profile">
            <p className="text-[15px] leading-relaxed text-muted print:text-[11pt]">
              {profile.shortBio}
            </p>
          </ResumeSection>

          <ResumeSection title="Key figures">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
                    {metric.value}
                    {metric.suffix}
                  </dd>
                  <dt className="mt-1 text-[13px] leading-snug text-muted">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title="Experience">
            <div className="space-y-9 print:space-y-6">
              {experience.map((role) => (
                <div key={`${role.organisation}-${role.role}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                      {role.role}
                    </h3>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                      {formatDateRange(role.startDate, role.endDate)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">
                    <span className="font-medium text-brand">{role.organisation}</span>
                    <span aria-hidden="true" className="mx-2 text-line-strong">·</span>
                    <span className="text-muted">{role.location}</span>
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-muted print:text-[10pt]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-line-strong"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Education">
            <div className="space-y-6">
              {education.map((item) => (
                <div key={item.qualification}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                      {item.qualification}
                    </h3>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                      {item.startYear} — {item.endYear}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.institution}</p>
                  {item.note && (
                    <p className="mt-1.5 text-[13px] text-brand">{item.note}</p>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Certifications">
            <ul className="space-y-3">
              {certifications.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                >
                  <span className="text-sm text-ink">
                    <span className="font-medium">{item.title}</span>
                    <span aria-hidden="true" className="mx-2 text-line-strong">·</span>
                    <span className="text-muted">{item.issuer}</span>
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                    {item.year}
                  </span>
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection title="Awards">
            <ul className="space-y-3">
              {awards.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                >
                  <span className="text-sm text-ink">
                    <span className="font-medium">{item.title}</span>
                    <span aria-hidden="true" className="mx-2 text-line-strong">·</span>
                    <span className="text-muted">{item.issuer}</span>
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                    {item.year}
                  </span>
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection title="Skills">
            <div className="grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.group}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {group.group}
                  </p>
                  <p className="text-[13.5px] leading-relaxed text-ink print:text-[10pt]">
                    {group.skills.map((skill) => skill.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Tools & platforms">
            <p className="text-[13.5px] leading-relaxed text-ink print:text-[10pt]">
              {tools.map((tool) => tool.name).join(", ")}
            </p>
          </ResumeSection>

          <ResumeSection title="Languages">
            <p className="text-[13.5px] leading-relaxed text-ink print:text-[10pt]">
              Pashto (native), Urdu (fluent), English (professional)
            </p>
          </ResumeSection>
        </div>

        <p className="mt-14 border-t border-line pt-6 font-mono text-[10.5px] text-muted print:mt-8">
          References and certificate scans available on request.
        </p>
      </Section>
    </>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-5 border-b border-line pb-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted print:mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
