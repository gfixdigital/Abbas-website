import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { profile, socialLinks } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, Section } from "@/components/shared/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SocialIcon } from "@/components/shared/SocialIcon";
import { ContactForm } from "@/components/contact/ContactForm";
import { BookMeeting } from "@/components/contact/BookMeeting";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with Muhammad Abbas about client projects, training cohorts, speaking engagements or media partnerships. Email ${profile.email}.`,
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: "Contact",
    description: "Start a conversation about a project, cohort or partnership.",
    url: absoluteUrl("/contact"),
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Let us talk")}&eyebrow=${encodeURIComponent("Contact")}&meta=${encodeURIComponent(profile.email)}`,
        width: 1200,
        height: 630,
        alt: "Contact",
      },
    ],
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Tell me what you are building."
        description="Client work, a training cohort, a speaking slot, or a media partnership. Every message reaches me directly, and I reply to all of them."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* Direct channels */}
          <div>
            <Reveal>
              <p className="eyebrow mb-7">Direct</p>
            </Reveal>

            <Reveal delay={0.04}>
              <ul className="space-y-px overflow-hidden rounded-[var(--radius)] border border-line bg-line">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: profile.email,
                    href: `mailto:${profile.email}`,
                    note: "Best for detailed briefs",
                  },
                  {
                    icon: MessageCircle,
                    label: "WhatsApp",
                    value: profile.phone,
                    href: "https://wa.me/923365842012",
                    note: "Fastest response",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: profile.phone,
                    href: `tel:${profile.phone.replace(/\s/g, "")}`,
                    note: "Pakistan Standard Time",
                  },
                ].map((channel) => (
                  <li key={channel.label} className="bg-bg-elevated">
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        channel.href.startsWith("http")
                          ? "noreferrer noopener"
                          : undefined
                      }
                      className="group flex items-start gap-4 p-6 transition-colors hover:bg-bg-soft/70"
                    >
                      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand">
                        <channel.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                          {channel.label}
                        </span>
                        <span className="mt-1 block truncate text-sm font-medium text-ink transition-colors group-hover:text-brand">
                          {channel.value}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {channel.note}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="mt-8">
              <dl className="space-y-5 rounded-[var(--radius)] border border-line bg-bg-soft p-6">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Based in
                    </dt>
                    <dd className="mt-1 text-sm text-ink">{profile.location}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Response time
                    </dt>
                    <dd className="mt-1 text-sm text-ink">
                      Within two working days
                    </dd>
                  </div>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.12} className="mt-8">
              <p className="eyebrow mb-4">Elsewhere</p>
              <ul className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${social.platform}: ${social.handle}`}
                      className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand"
                    >
                      <SocialIcon name={social.iconName} />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Form */}
          <div>
            <Reveal>
              <p className="eyebrow mb-7">Send a message</p>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-[var(--radius)] border border-line bg-bg-elevated p-7 sm:p-9">
                <Suspense fallback={<FormSkeleton />}>
                  <ContactForm />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="soft" containerClassName="py-16 sm:py-20">
        <Reveal>
          <BookMeeting bookingUrl={settings?.bookingUrl ?? null} />
        </Reveal>
      </Section>
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-[4.75rem]" />
        <Skeleton className="h-[4.75rem]" />
      </div>
      <Skeleton className="h-[4.75rem]" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-[4.75rem]" />
        <Skeleton className="h-[4.75rem]" />
      </div>
      <Skeleton className="h-40" />
      <Skeleton className="h-13 w-44 rounded-full" />
    </div>
  );
}
