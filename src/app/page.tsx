import Link from "next/link";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/shared/JsonLd";
import { formatDate } from "@/lib/utils";
import { getCaseStudies, getMetrics, getPosts, getProfile, getSocialLinks, getTestimonials } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/motion/Interactions";
import { TestimonialsCarousel } from "@/components/shared/TestimonialsCarousel";
import { Hero } from "@/components/home/Hero";
import {
  ClientMarquee,
  CompanySnapshot,
  ContactCTA,
  Introduction,
  LeadershipPhilosophy,
  ServicesPreview,
  TechStack,
} from "@/components/home/HomeSections";

export default async function HomePage() {
  const [profile, socialLinks, projects, metrics, testimonials, posts] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getCaseStudies(),
    getMetrics(),
    getTestimonials(),
    getPosts(),
  ]);

  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <OrganizationJsonLd profile={profile} socialLinks={socialLinks} />
      <WebsiteJsonLd profile={profile} />

      <Hero projects={projects} metrics={metrics} profile={profile} />
      <ClientMarquee />
      <Introduction />
      <CompanySnapshot />
      <ServicesPreview />
      <LeadershipPhilosophy />
      <TechStack />

      {/* Testimonials */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <SectionHeader
              align="stacked"
              eyebrow="Client & student feedback"
              title="What people say afterwards."
              description="Collected from clients, students and interns across the studio and the training programme."
              className="mb-0"
            />
            <div className="mt-8">
              <ArrowLink href="/testimonials">All testimonials</ArrowLink>
            </div>
          </div>

          <Reveal>
            <TestimonialsCarousel testimonials={testimonials} />
          </Reveal>
        </div>
      </Section>

      {/* Writing */}
      <Section tone="soft">
        <SectionHeader
          eyebrow="Insights"
          title="Notes from running both halves."
          description="Occasional pieces on studio operations, training, and building a digital business where the market for one did not exist."
          action={<ArrowLink href="/insights">All writing</ArrowLink>}
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-3">
          {recentPosts.map((post) => (
            <RevealItem key={post.slug} className="bg-bg-elevated">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col p-7 transition-colors hover:bg-bg-soft/60"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {formatDate(post.publishedAt, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {post.readingMinutes} min
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
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
      </Section>

      <ContactCTA />
    </>
  );
}
