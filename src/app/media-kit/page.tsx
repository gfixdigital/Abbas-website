import type { Metadata } from "next";
import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { getMetrics, getProfile, getSocialLinks } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { CopyBlock } from "@/components/shared/CopyBlock";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Media Kit",
  description:
    "Approved biography, headshot, title and company details for event programmes, press releases and speaker introductions.",
  alternates: { canonical: absoluteUrl("/media-kit") },
  openGraph: {
    title: "Media Kit",
    description: "Approved bio, headshot and brand facts for organisers and press.",
    url: absoluteUrl("/media-kit"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Media kit")}&eyebrow=${encodeURIComponent("For organisers and press")}`,
        width: 1200,
        height: 630,
        alt: "Media kit",
      },
    ],
  },
};

/** Three lengths, because programmes, intros and press releases need different ones. */
const BIO_25 =
  "Muhammad Abbas is the Founder and CEO of GFix Digital, a digital solutions agency and IT training hub based in Swat, Pakistan.";

const BIO_120 = [
  "Muhammad Abbas is the Founder and CEO of GFix Digital, a digital solutions agency and IT training hub operating from Mingora, Swat.",
  "He started in graphic design and video editing and now leads a departmental studio delivering branding, web development, digital marketing and media production for clients across Pakistan and on internationally supported initiatives.",
  "Alongside the client work he serves as Administrator and IT Trainer at Modern Educational Proficiency Academy and as a Digital Skills Trainer with the BanoQabil IT Program, and has trained over 500 learners. He received the Iqra National University Talent Award in 2025.",
].join(" ");

export default async function MediaKitPage() {
  const metrics = await getMetrics();
  const profile = await getProfile();
  const socialLinks = await getSocialLinks();
  const BIO_60 = profile.shortBio;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Media Kit", href: "/media-kit" },
        ]}
      />

      <PageHeader
        eyebrow="Media Kit"
        title="Everything an organiser needs, without emailing first."
        description="Approved biography at three lengths, the headshot, and the exact wording for name, title and company. Copy any block directly."
      >
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Button asChild variant="brand">
              <a href={profile.portraitUrl} download target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download headshot
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="outline">
              <a href={`mailto:${profile.email}?subject=Media%20kit%20enquiry`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                Ask for something else
              </a>
            </Button>
          </Magnetic>
        </div>
      </PageHeader>

      {/* Identity facts */}
      <Section>
        <SectionHeader
          eyebrow="Exact wording"
          title="Please use these spellings."
          description="Name, title and company as they should appear in print. The long title is for programmes; the short one for slides and intros."
        />

        <RevealGroup className="grid gap-4 lg:grid-cols-2">
          <RevealItem>
            <CopyBlock label="Full name" value={profile.name} />
          </RevealItem>
          <RevealItem>
            <CopyBlock label="Short title" value={`${profile.title}, ${profile.company}`} />
          </RevealItem>
          <RevealItem className="lg:col-span-2">
            <CopyBlock label="Full title" value={profile.fullTitle} />
          </RevealItem>
          <RevealItem>
            <CopyBlock label="Company" value={`${profile.company} — ${profile.companyTagline}`} />
          </RevealItem>
          <RevealItem>
            <CopyBlock label="Location" value={profile.location} />
          </RevealItem>
          <RevealItem>
            <CopyBlock label="Email" value={profile.email} />
          </RevealItem>
          <RevealItem>
            <CopyBlock label="Website" value="abbas.gfixdigital.com" />
          </RevealItem>
        </RevealGroup>
      </Section>

      {/* Biographies */}
      <Section tone="soft">
        <SectionHeader
          eyebrow="Three lengths"
          title="Pick the one that fits the space."
          description="All three are approved for publication as written. Please do not paraphrase, since the figures and role titles are specific."
        />

        <div className="space-y-4">
          <Reveal>
            <CopyBlock
              label="Short — one sentence"
              value={BIO_25}
              multiline
              meta={`${BIO_25.split(/\s+/).length} words`}
            />
          </Reveal>
          <Reveal delay={0.04}>
            <CopyBlock
              label="Medium — for programmes"
              value={BIO_60}
              multiline
              meta={`${BIO_60.split(/\s+/).length} words`}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <CopyBlock
              label="Long — for press releases"
              value={BIO_120}
              multiline
              meta={`${BIO_120.split(/\s+/).length} words`}
            />
          </Reveal>
        </div>
      </Section>

      {/* Headshot */}
      <Section>
        <SectionHeader
          eyebrow="Headshot"
          title="One approved image."
          description="Please use this one rather than a screenshot from social media. Crop freely, but do not apply filters or overlays."
        />

        <Reveal>
          <div className="grid gap-8 rounded-[var(--radius)] border border-line bg-bg-elevated p-7 sm:p-9 lg:grid-cols-[auto_1fr] lg:gap-12">
            <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl border border-line bg-bg-soft">
              <Image
                src={profile.portraitUrl}
                alt={`${profile.name}, ${profile.title} at ${profile.company}`}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <dl className="space-y-4">
                {[
                  { label: "Credit line", value: `${profile.name} / ${profile.company}` },
                  { label: "Usage", value: "Editorial, event and press use. No licence fee." },
                  { label: "Restrictions", value: "No filters, overlays or recolouring." },
                  { label: "Alt text", value: `${profile.name}, ${profile.title} at ${profile.company}` },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Magnetic className="mt-7">
                <Button asChild variant="outline">
                  <a href={profile.portraitUrl} download target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download full resolution
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Key figures + brand */}
      <Section tone="soft">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow mb-7">Key figures</p>
            </Reveal>
            <RevealGroup className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
              {metrics.map((metric) => (
                <RevealItem key={metric.label} className="bg-bg-elevated">
                  <div className="flex items-baseline justify-between gap-4 p-5">
                    <span className="text-sm text-ink">{metric.label}</span>
                    <span className="font-display text-xl font-semibold tracking-[-0.03em] text-ink">
                      {metric.value}
                      {metric.suffix}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal className="mt-4">
              <p className="text-xs leading-relaxed text-muted">
                Figures are approximate and rounded. Please cite them as
                &ldquo;over&rdquo; rather than exact.
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="eyebrow mb-7">Brand colours</p>
            </Reveal>
            <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { name: "Brand blue", hex: "#0066FF" },
                { name: "Deep navy", hex: "#0047b3" },
                { name: "Sky", hex: "#3385ff" },
                { name: "Accent amber", hex: "#f59e0b" },
                { name: "Ink", hex: "#11131a" },
                { name: "Surface", hex: "#f7f8fb" },
              ].map((colour) => (
                <RevealItem key={colour.hex}>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <div
                      className="h-16 w-full"
                      style={{ backgroundColor: colour.hex }}
                      aria-hidden="true"
                    />
                    <div className="bg-bg-elevated p-3">
                      <p className="text-[13px] font-medium text-ink">{colour.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] uppercase text-muted">
                        {colour.hex}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-8">
              <p className="eyebrow mb-4">Social profiles</p>
              <ul className="space-y-2">
                {socialLinks.slice(0, 4).map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-muted transition-colors hover:text-brand"
                    >
                      {social.platform}: {social.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
