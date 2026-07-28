import { CalendarCheck, Clock, MessageCircle, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Interactions";
import type { Profile } from "@/content";

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

export function BookMeeting({ bookingUrl, profile }: { bookingUrl?: string | null; profile: Profile }) {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-bg-elevated p-7 sm:p-9">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow mb-4">Book a meeting</p>
          <p className="text-sm leading-relaxed text-muted">
            Pick a slot and I will dial in. No preparation needed in advance.
          </p>
        </div>

        <Badge variant="brand">Free</Badge>
      </div>

      <RevealGroup className="space-y-3">
        {CALL_TYPES.map((call) => (
          <RevealItem key={call.title}>
            <div className="flex items-start gap-4 rounded-lg border border-line bg-bg p-4 transition-colors hover:border-brand/30 sm:items-center">
              <call.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand sm:mt-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{call.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{call.detail}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted">{call.duration}</span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {bookingUrl ? (
          <Magnetic>
            <Button asChild size="lg" variant="brand" className="w-full sm:w-auto">
              <a href={bookingUrl} target="_blank" rel="noreferrer noopener">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Book a call
              </a>
            </Button>
          </Magnetic>
        ) : (
          <p className="text-xs leading-relaxed text-muted">
            No scheduler linked yet. Use the options below or{" "}
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent("Booking a call")}&body=${encodeURIComponent("Hi Abbas,\n\nI would like to book a call about:\n\nMy availability:\n\nThanks,\n")}`}
              className="font-medium text-brand underline decoration-brand/30 underline-offset-3 transition-colors hover:decoration-brand/70"
            >
              email me directly
            </a>{" "}
            with your availability.
          </p>
        )}
        {!bookingUrl && (
          <div className="flex gap-3">
            <Button asChild variant="outline" size="lg">
              <a
                href={`https://wa.me/923365842012?text=${encodeURIComponent("Hi Abbas, I would like to book a call.")}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
