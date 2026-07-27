import type { Metadata } from "next";
import { postTags, posts } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader, Section } from "@/components/shared/Section";
import { PostList } from "@/components/blog/PostList";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing by Muhammad Abbas on running a digital studio and training programme in Swat, Pakistan: agency operations, client work, and building capability locally.",
  alternates: {
    canonical: absoluteUrl("/blog"),
    types: { "application/rss+xml": absoluteUrl("/rss.xml") },
  },
  openGraph: {
    title: "Blog",
    description: "Notes on studio operations, training and client work.",
    url: absoluteUrl("/blog"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Writing")}&eyebrow=${encodeURIComponent("Blog")}`,
        width: 1200,
        height: 630,
        alt: "Blog",
      },
    ],
  },
};

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />

      <PageHeader
        eyebrow="Blog"
        title="Written from operating, not from reading."
        description="Every piece here comes out of a decision that had a cost attached. Filter by tag, or subscribe to the feed."
      />

      <Section>
        <PostList posts={posts} tags={postTags} />
      </Section>

      <ContactCTA />
    </>
  );
}
