import { CalendarCheck, Clock, Video } from "lucide-react";
import { profile } from "@/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";

/**
 * Booking block.
 *
 * `bookingUrl` comes from site settings so Abbas can point it at Cal.com,
 * Calendly or Google Calendar appointments without a code change. Until one is
 * set, this falls back to WhatsApp and email, which is how he already books
 * calls, rather than showing a dead scheduler.
 */
const CALL_TYPES = [
  {
    title: "Project scoping",
    duration: "30 min",
    detail:
      "You describe what you need, I tell you what it takes and roughly what it costs. No deck.",
    icon: Video,
  },
  {
    title: "Training enquiry",
    duration: "20 min",
    detail:
      "For institutions or teams considering a cohort. Covers curriculum, group size and scheduling.",
    icon: CalendarCheck,
  },
  {
    title: "Partnership or media",
    duration: "30 min",
    detail:
      "Events, initiatives and standing collaborations. Bring the dates and the audience.",
    icon: Clock,
  },
];

export function BookMeeting({ bookingUrl }: { bookingUrl?: string | null }) {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-bg-elevated p-7 sm:p-9">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow mb-4">Book a meeting</p>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
            Rather just talk?
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            Pick the call that matches what you need. All times are Pakistan
            Standard Time, and I work Monday to Saturday.
          </p>
        </div>
        <Badge variant="success">Usually free within 48 hours</Badge>
      </div>

      <RevealGroup className="grid gap-4 sm:grid-cols-3">
        {CALL_TYPES.map((call) => (
          <RevealItem key={call.title} className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-line bg-bg p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/8 text-brand">
                  <call.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {call.duration}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-ink">{call.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {call.detail}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-8 border-t border-line pt-7">
        <div className="flex flex-wrap items-center gap-3">
          {bookingUrl ? (
            <Magnetic>
              <Button asChild variant="brand" size="lg">
                <a href={bookingUrl} target="_blank" rel="noreferrer noopener">
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  See available times
                </a>
              </Button>
            </Magnetic>
          ) : (
            <Magnetic>
              <Button asChild variant="brand" size="lg">
                <a
                  href="https://wa.me/9233658420212?text=Hi%20Abbas%2C%20I%27d%20like%20to%20book%20a%20call."
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  Request a time on WhatsApp
                </a>
              </Button>
            </Magnetic>
          )}

          <Magnetic>
            <Button asChild variant="outline" size="lg">
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Booking a call")}&body=${encodeURIComponent("Hi Abbas,\n\nI would like to book a call about:\n\nMy availability:\n\nThanks,\n")}`}
              >
                Propose times by email
              </a>
            </Button>
          </Magnetic>
        </div>

        {!bookingUrl && (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            A live scheduling link can be added under Site settings in the
            editor. Until then these two reach him directly.
          </p>
        )}
      </Reveal>
    </div>
  );
}
