import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { profile, socialLinks } from "@/content";
import { footerLegal, navGroups } from "@/lib/nav";
import { SocialIcon } from "@/components/shared/SocialIcon";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-soft">
      {/* Oversized wordmark bleeding off the bottom edge. Swiss poster move:
          the name becomes architecture rather than a label. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
      >
        <span className="block translate-y-[28%] whitespace-nowrap text-center font-display text-[18vw] font-bold leading-none tracking-[-0.05em] text-ink/[0.035]">
          MUHAMMAD ABBAS
        </span>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Top band: pitch + newsletter */}
        <div className="grid gap-12 border-b border-line py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-20">
          <div>
            <p className="eyebrow mb-5">Let us talk</p>
            <h2 className="max-w-xl font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">
              Tell me what you are building next.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              A new site, a brand identity, a video suite, or a training cohort.
              Say what you need and I will point you at the right next step.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 text-ink transition-colors hover:text-brand"
              >
                <Mail className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-brand" aria-hidden="true" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="group inline-flex items-center gap-2 text-ink transition-colors hover:text-brand"
              >
                <Phone className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-brand" aria-hidden="true" />
                {profile.phone}
              </a>
              <span className="inline-flex items-center gap-2 text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Mingora, Swat, Pakistan
              </span>
            </div>
          </div>

          <div className="lg:pl-8">
            <p className="eyebrow mb-5">Occasional notes</p>
            <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-muted">
              Short pieces on running a studio and a training programme in a
              market that has neither. No cadence, no filler.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          {navGroups.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <p className="eyebrow mb-4">{group.label}</p>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="eyebrow mb-4">Elsewhere</p>
            <ul className="space-y-2.5">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <SocialIcon
                      name={social.iconName}
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    {social.platform}
                    <ArrowUpRight
                      className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted">
            © {year} Muhammad Abbas. Built in Swat.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLegal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={profile.companyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-brand"
            >
              {profile.company}
              <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
