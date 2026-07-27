import type { Metadata } from "next";
import { caseStudies } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader, Section } from "@/components/shared/Section";
import { WorkGrid } from "@/components/work/WorkGrid";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work from GFix Digital: fragrance e-commerce, university exhibitions, internationally supported investment initiatives, youth summits, brand identities and national training programmes.",
  alternates: { canonical: absoluteUrl("/projects") },
  openGraph: {
    title: "Projects",
    description: "Selected work across web, branding, media and training.",
    url: absoluteUrl("/projects"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Selected work")}&eyebrow=${encodeURIComponent("Projects")}&meta=${encodeURIComponent("200+ projects delivered")}`,
        width: 1200,
        height: 630,
        alt: "Projects",
      },
    ],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
        ]}
      />

      <PageHeader
        eyebrow="Projects"
        title="The work, and what it had to survive."
        description="Nine projects that show the range: a custom storefront, an internationally branded initiative, event operations at scale, and training programmes that had to produce employable graduates."
      />

      <Section index="01 / All projects">
        <WorkGrid studies={caseStudies} />
      </Section>

      <ContactCTA />
    </>
  );
}
