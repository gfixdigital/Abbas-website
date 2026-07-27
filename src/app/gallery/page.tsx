import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getGalleryItems } from "@/lib/data";
import { PageHeader, Section } from "@/components/shared/Section";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Visual archive of work delivered through GFix Digital: brand identities, event branding, e-commerce design, media production and training programmes.",
  alternates: { canonical: absoluteUrl("/gallery") },
  openGraph: {
    title: "Gallery",
    description: "Visual archive of delivered work.",
    url: absoluteUrl("/gallery"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Visual archive")}&eyebrow=${encodeURIComponent("Gallery")}`,
        width: 1200,
        height: 630,
        alt: "Gallery",
      },
    ],
  },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  const images = items.map((item) => ({
    src: item.imageUrl,
    alt: `${item.title} — ${item.caption}`,
    caption: item.title,
    category: item.category,
  }));

  const categories = Array.from(new Set(images.map((image) => image.category)));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery" },
        ]}
      />

      <PageHeader
        eyebrow="Gallery"
        title="The work, without the write-up."
        description="A visual pass through delivered projects. Select any image to view it at full size, or read the full case study from the projects page."
      />

      <Section index="01 / Archive">
        <GalleryGrid images={images} categories={categories} />
      </Section>

      <ContactCTA />
    </>
  );
}
