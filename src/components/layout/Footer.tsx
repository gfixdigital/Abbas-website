import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { profile, socialLinks } from "@/content";
import { footerLegal, navGroups } from "@/lib/nav";
import { SocialIcon } from "@/components/shared/SocialIcon";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Top band: pitch + newsletter */}
        <div className="grid gap-12 border-b border-white/10 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-20">
          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-white/40">
              LET US TALK
            </p>
            <h2 className="max-w-xl font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
              Tell me what you are building next.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60">
              A new site, a brand identity, a video suite, or a training cohort.
              Say what you need and I will point you at the right next step.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-accent-soft hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-accent" aria-hidden="true" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-accent" aria-hidden="true" />
                {profile.phone}
              </a>
              <span className="inline-flex items-center gap-2 text-white/40">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Mingora, Swat, Pakistan
              </span>
            </div>
          </div>

          <div className="lg:pl-8">
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-white/40">
              OCCASIONAL NOTES
            </p>
            <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-white/60">
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
              <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-white/40">
                {group.label.toUpperCase()}
              </p>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-white/40">
              ELSEWHERE
            </p>
            <ul className="space-y-2.5">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
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
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-white/35">
            © {year} Muhammad Abbas. Built in Swat.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLegal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[11px] text-white/35 transition-colors hover:text-white/70"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={profile.companyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-1 font-mono text-[11px] text-white/35 transition-colors hover:text-accent"
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
