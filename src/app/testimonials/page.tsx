import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { getTestimonials } from "@/lib/data";
import { absoluteUrl, initials } from "@/lib/utils";
import { PageHeader, Section, SectionHeader } from "@/components/shared/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TestimonialsCarousel } from "@/components/shared/TestimonialsCarousel";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { ContactCTA } from "@/components/home/HomeSections";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What clients, students, interns and university partners say about working with Muhammad Abbas and GFix Digital.",
  alternates: { canonical: absoluteUrl("/testimonials") },
  openGraph: {
    title: "Testimonials",
    description: "Words from clients, students and partners.",
    url: absoluteUrl("/testimonials"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("What people say afterwards")}&eyebrow=${encodeURIComponent("Testimonials")}`,
        width: 1200,
        height: 630,
        alt: "Testimonials",
      },
    ],
  },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Testimonials", href: "/testimonials" },
        ]}
      />

      <PageHeader
        eyebrow="Testimonials"
        title="Clients, students, interns and a university professor."
        description="Feedback from both halves of the business. Quotes are published as written, including the ones that are two words long."
      />

      {/* Featured carousel */}
      <Section tone="dark" className="grain">
        <div className="relative mx-auto max-w-3xl">
          <TestimonialsCarousel testimonials={testimonials} tone="dark" />
        </div>
      </Section>

      {/* Full wall */}
      <Section>
        <SectionHeader
          eyebrow="All feedback"
          title="The complete set."
          description="Collected from client projects, training cohorts and internship programmes."
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <RevealItem key={testimonial.authorName} className="h-full">
              <figure className="flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-7">
                <Quote className="mb-5 h-6 w-6 text-brand/30" aria-hidden="true" />

                <blockquote className="text-[15px] leading-relaxed text-ink">
                  {testimonial.quote}
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3.5 pt-7">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 font-mono text-[11px] font-medium text-brand"
                    aria-hidden="true"
                  >
                    {initials(testimonial.authorName)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {testimonial.authorName}
                    </span>
                    <span className="block truncate text-[13px] text-muted">
                      {testimonial.authorTitle}
                      {testimonial.authorCompany
                        ? `, ${testimonial.authorCompany}`
                        : ""}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Additional reviews are published on the GFix Digital website and on
            the studio&apos;s Google and Facebook profiles.
          </p>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
