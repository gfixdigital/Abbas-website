import Link from "next/link";
import { ArrowUpRight, CircleAlert, EyeOff, Inbox, Mail, TriangleAlert } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { entities } from "@/lib/admin/entities";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MessageChart } from "@/components/admin/MessageChart";

export const dynamic = "force-dynamic";

export const metadata = { title: "Insights" };

/**
 * Content and engagement overview.
 *
 * This reports on the CMS itself: how much content exists, what is hidden, and
 * how enquiries are trending. It is deliberately not web traffic analytics,
 * which would need a provider like Vercel Analytics; presenting invented
 * pageview numbers would be worse than presenting none.
 */
export default async function AdminInsightsPage() {
  const supabase = await createServerSupabase();

  const contentEntities = entities.filter((e) => !e.inbox && !e.singleton);

  const counts = await Promise.all(
    contentEntities.map(async (entity) => {
      const { count: total, error } = await supabase
        .from(entity.table)
        .select("*", { count: "exact", head: true });
      const { count: hidden } = await supabase
        .from(entity.table)
        .select("*", { count: "exact", head: true })
        .eq("published", false);

      return {
        entity,
        total: total ?? 0,
        hidden: hidden ?? 0,
        missing: Boolean(error),
      };
    }),
  );

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("created_at,read,subject,name")
    .order("created_at", { ascending: false })
    .limit(200);

  const { count: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true });

  const rows = messages ?? [];
  const unread = rows.filter((m) => m.read !== true).length;

  // Bucket the last 12 weeks of enquiries.
  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const buckets = Array.from({ length: 12 }, (_, i) => {
    const end = now - i * WEEK;
    const start = end - WEEK;
    return {
      label: formatDate(new Date(start).toISOString(), { day: "numeric", month: "short" }),
      count: rows.filter((m) => {
        const t = new Date(String(m.created_at)).getTime();
        return t >= start && t < end;
      }).length,
    };
  }).reverse();

  const totalContent = counts.reduce((sum, c) => sum + c.total, 0);
  const totalHidden = counts.reduce((sum, c) => sum + c.hidden, 0);
  const empty = counts.filter((c) => !c.missing && c.total === 0);
  const anyMissing = counts.some((c) => c.missing);

  return (
    <>
      <AdminHeader
        title="Insights"
        description="How much content you have, what is hidden from the site, and how enquiries are trending."
      />

      <div className="p-5 sm:p-8 lg:p-10">
        {anyMissing && (
          <div className="mb-8 flex items-start gap-3.5 rounded-[var(--radius)] border border-accent/30 bg-accent/[0.07] p-5">
            <CircleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted">
              Some tables are not set up yet, so these figures are incomplete.
              Run <code className="font-mono text-[13px]">npm run db:migrate</code>{" "}
              then <code className="font-mono text-[13px]">npm run db:seed</code>.
            </p>
          </div>
        )}

        {/* Headline figures */}
        <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Content items", value: totalContent, note: "Across every section", tone: "default" as const },
            { label: "Hidden from site", value: totalHidden, note: "Saved but not public", tone: totalHidden > 0 ? "accent" as const : "default" as const },
            { label: "Enquiries received", value: rows.length, note: "Last 200 shown", tone: "default" as const },
            { label: "Newsletter signups", value: subscribers ?? 0, note: "Confirmed and pending", tone: "default" as const },
          ].map((stat) => (
            <li
              key={stat.label}
              className="rounded-[var(--radius)] border border-line bg-bg-elevated p-6"
            >
              <p
                className={cn(
                  "font-display text-3xl font-semibold leading-none tracking-[-0.04em]",
                  stat.tone === "accent" ? "text-accent" : "text-ink",
                )}
              >
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium text-ink">{stat.label}</p>
              <p className="mt-1 text-xs text-muted">{stat.note}</p>
            </li>
          ))}
        </ul>

        {/* Enquiry trend */}
        <section className="mb-10 rounded-[var(--radius)] border border-line bg-bg-elevated p-6 sm:p-8">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                Enquiries over the last 12 weeks
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Each bar is one week. Hover to see the count.
              </p>
            </div>
            {unread > 0 && (
              <Link href="/admin/messages">
                <Badge variant="brand" className="cursor-pointer">
                  <Inbox className="h-3 w-3" aria-hidden="true" />
                  {unread} unread
                </Badge>
              </Link>
            )}
          </div>

          <MessageChart buckets={buckets} />
        </section>

        {/* Attention needed */}
        {(empty.length > 0 || totalHidden > 0) && (
          <section className="mb-10 rounded-[var(--radius)] border border-line bg-bg-elevated p-6 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink">
              <TriangleAlert className="h-4 w-4 text-accent" aria-hidden="true" />
              Worth a look
            </h2>

            <ul className="space-y-3">
              {empty.map(({ entity }) => (
                <li key={entity.key}>
                  <Link
                    href={`/admin/${entity.key}`}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-bg p-4 transition-colors hover:border-brand/40"
                  >
                    <EyeOff className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <span className="flex-1 text-sm text-ink">
                      <strong className="font-medium">{entity.label}</strong> has no
                      items yet.
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}

              {counts
                .filter((c) => c.hidden > 0)
                .map(({ entity, hidden, total }) => (
                  <li key={`${entity.key}-hidden`}>
                    <Link
                      href={`/admin/${entity.key}`}
                      className="group flex items-center gap-3 rounded-xl border border-line bg-bg p-4 transition-colors hover:border-brand/40"
                    >
                      <EyeOff className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <span className="flex-1 text-sm text-ink">
                        <strong className="font-medium">{entity.label}</strong>:{" "}
                        {hidden} of {total} {hidden === 1 ? "item is" : "items are"}{" "}
                        hidden from the site.
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Per-section breakdown */}
        <section>
          <h2 className="eyebrow mb-5">Content by section</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map(({ entity, total, hidden, missing }) => (
              <li key={entity.key}>
                <Link
                  href={`/admin/${entity.key}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-bg-elevated p-4 transition-colors hover:border-brand/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink transition-colors group-hover:text-brand">
                      {entity.label}
                    </span>
                    {hidden > 0 && (
                      <span className="mt-0.5 block text-xs text-accent">
                        {hidden} hidden
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-mono text-sm tabular-nums text-muted">
                    {missing ? "—" : total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 flex items-start gap-2.5 text-xs leading-relaxed text-muted">
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          These are content figures, not website traffic. For visitor numbers,
          enable Vercel Analytics on the project and it will appear in the Vercel
          dashboard.
        </p>
      </div>
    </>
  );
}
