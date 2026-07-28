import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import { getPosts, getPostTags } from "@/lib/data";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Editorial from Muhammad Abbas on building a digital studio and training programme in a market that had neither: hiring, standards, client operations and growth decisions.",
  alternates: {
    canonical: absoluteUrl("/insights"),
    types: { "application/rss+xml": absoluteUrl("/rss.xml") },
  },
  openGraph: {
    title: "Insights",
    description: "Editorial on studio operations and workforce development.",
    url: absoluteUrl("/insights"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Insights")}&eyebrow=${encodeURIComponent("Editorial")}`,
        width: 1200,
        height: 630,
        alt: "Insights",
      },
    ],
  },
};

export default async function InsightsPage() {
  const posts = await getPosts();
  const postTags = await getPostTags();
  const [lead, ...rest] = posts;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
        ]}
      />

      <PageHeader
        eyebrow="Insights"
        title="Four things I got wrong before I got them right."
        description="Editorial on the decisions behind the studio: how we hire, what standard we hold, and what we chose not to take."
      >
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Button asChild variant="outline">
              <Link href="/blog">
                Browse by tag
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="ghost">
              <a href="/rss.xml">
                <Rss className="h-4 w-4" aria-hidden="true" />
                RSS feed
              </a>
            </Button>
          </Magnetic>
        </div>
      </PageHeader>

      {/* Lead piece, given real weight rather than sitting in a uniform grid */}
      {lead && (
        <Section>
          <Reveal>
            <Link
              href={`/blog/${lead.slug}`}
              className="group block rounded-[var(--radius)] border border-line bg-bg-elevated p-8 transition-all duration-500 hover:border-brand/45 hover:shadow-[var(--shadow-md)] sm:p-12"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge variant="brand">Latest</Badge>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  {formatDate(lead.publishedAt, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  {lead.readingMinutes} min read
                </span>
              </div>

              <h2 className="max-w-3xl font-display text-[clamp(1.625rem,3.6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.032em] text-ink transition-colors group-hover:text-brand">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {lead.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-brand">
                  Read the piece
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
                <ul className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </Reveal>
        </Section>
      )}

      {/* Archive */}
      <Section tone="soft">
        <SectionHeader
          eyebrow={`${posts.length} pieces published`}
          title="Everything else."
          description="Sorted newest first. Tags cover leadership, client work, standards and personal notes."
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-3">
          {rest.map((post) => (
            <RevealItem key={post.slug} className="bg-bg-elevated">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col p-7 transition-colors hover:bg-bg-soft/60"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {formatDate(post.publishedAt)}
                  </span>
                  <span aria-hidden="true" className="h-px w-3 bg-line-strong" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {post.readingMinutes} min
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <ul className="flex flex-wrap items-center gap-2">
            <li className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
              Tags
            </li>
            {postTags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">{tag}</Badge>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Newsletter */}
      <Section containerClassName="py-20">
        <Reveal>
          <div className="grid gap-10 rounded-[var(--radius)] border border-line bg-bg-elevated p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow mb-5">Occasional notes</p>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                No cadence, no filler.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                New pieces land in your inbox when there is something worth
                sending. Unsubscribe in one click, and the address is never used
                for anything else.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
