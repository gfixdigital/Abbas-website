import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPost, posts, profile } from "@/content";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import { ShareRow } from "@/components/blog/ShareRow";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/shared/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Post not found" };

  const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&eyebrow=${encodeURIComponent("Insights")}&meta=${encodeURIComponent(`${post.readingMinutes} min read`)}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt,
      authors: [profile.name],
      tags: post.tags,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogUrl],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const index = posts.findIndex((item) => item.slug === post.slug);
  const next = posts[index + 1] ?? posts[0];

  return (
    <>
      <ReadingProgress />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        publishedAt={post.publishedAt}
        tags={post.tags}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article>
        <header className="border-b border-line bg-bg-soft">
          <div className="mx-auto max-w-3xl px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
            <Reveal>
              <Link
                href="/blog"
                className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-brand"
              >
                <ArrowLeft
                  className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                All writing
              </Link>
            </Reveal>

            <Reveal delay={0.04}>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <time
                  dateTime={post.publishedAt}
                  className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted"
                >
                  {formatDate(post.publishedAt, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  {post.readingMinutes} min read
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-[clamp(1.875rem,4.6vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">
                {post.title}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                {post.excerpt}
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline">{tag}</Badge>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </header>

        {/* Body. Max-width is set in ch rather than rem so the measure stays
            correct regardless of the reader's font size. */}
        <Section containerClassName="max-w-3xl py-16 sm:py-20">
          <div className="space-y-6">
            {post.body.map((paragraph, i) => (
              <Reveal key={i} delay={Math.min(i * 0.02, 0.1)}>
                <p
                  className={
                    i === 0
                      ? "text-[19px] leading-[1.7] text-ink"
                      : "text-[17px] leading-[1.78] text-muted"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 border-t border-line pt-8">
            <ShareRow title={post.title} slug={post.slug} />
          </Reveal>

          {/* Author card */}
          <Reveal className="mt-12">
            <div className="rounded-[var(--radius)] border border-line bg-bg-soft p-7">
              <p className="eyebrow mb-4">Written by</p>
              <p className="font-display text-lg font-semibold tracking-tight text-ink">
                {profile.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                {profile.title}, {profile.company}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {profile.shortBio}
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-brand"
              >
                More about Abbas
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </Section>

        {/* Next post */}
        {next && next.slug !== post.slug && (
          <Section tone="soft" containerClassName="max-w-3xl py-16">
            <Reveal>
              <p className="eyebrow mb-6">Read next</p>
              <Link href={`/blog/${next.slug}`} className="group block">
                <h2 className="font-display text-2xl font-semibold leading-snug tracking-[-0.03em] text-ink transition-colors group-hover:text-brand">
                  {next.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {next.excerpt}
                </p>
              </Link>
              <Magnetic className="mt-7">
                <Button asChild variant="outline">
                  <Link href="/blog">All writing</Link>
                </Button>
              </Magnetic>
            </Reveal>
          </Section>
        )}
      </article>
    </>
  );
}
