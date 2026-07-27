import Link from "next/link";
import { ArrowUpRight, CircleAlert, Inbox } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { entities } from "@/lib/admin/entities";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Count rows per table in parallel. `head: true` fetches counts only.
  const counts = await Promise.all(
    entities.map(async (entity) => {
      const { count, error } = await supabase
        .from(entity.table)
        .select("*", { count: "exact", head: true });

      const { count: draftCount } = await supabase
        .from(entity.table)
        .select("*", { count: "exact", head: true })
        .eq("published", false);

      return {
        entity,
        count: count ?? 0,
        drafts: entity.inbox ? 0 : (draftCount ?? 0),
        missing: Boolean(error),
      };
    }),
  );

  const { count: unread } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  const schemaMissing = counts.some((row) => row.missing);

  return (
    <>
      <AdminHeader
        title="Overview"
        description={
          user?.email
            ? `Signed in as ${user.email}. Everything you change here goes live immediately.`
            : "Everything you change here goes live immediately."
        }
      />

      <div className="p-5 sm:p-8 lg:p-10">
        {schemaMissing && (
          <div className="mb-8 flex items-start gap-3.5 rounded-[var(--radius)] border border-accent/30 bg-accent/[0.07] p-5">
            <CircleAlert
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-ink">
                Some content tables are not set up yet.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Run the two files in <code className="font-mono text-[13px]">supabase/migrations</code>{" "}
                in the Supabase SQL editor, then run{" "}
                <code className="font-mono text-[13px]">npm run db:seed</code> to load
                your content. The public site keeps working from its built-in
                content until then.
              </p>
            </div>
          </div>
        )}

        {(unread ?? 0) > 0 && (
          <Link
            href="/admin/messages"
            className="group mb-8 flex items-center gap-4 rounded-[var(--radius)] border border-brand/30 bg-brand/[0.06] p-5 transition-colors hover:bg-brand/[0.1]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
              <Inbox className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">
                You have {unread} unread {unread === 1 ? "message" : "messages"}.
              </p>
              <p className="mt-0.5 text-sm text-muted">
                Someone got in touch through the contact form.
              </p>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}

        <h2 className="eyebrow mb-5">Your content</h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {counts.map(({ entity, count, drafts, missing }) => (
            <li key={entity.key}>
              <Link
                href={`/admin/${entity.key}`}
                className={cn(
                  "group flex h-full flex-col rounded-[var(--radius)] border border-line bg-bg-elevated p-6",
                  "transition-all duration-400 hover:border-brand/45 hover:shadow-[var(--shadow-sm)]",
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold tracking-tight text-ink transition-colors group-hover:text-brand">
                    {entity.label}
                  </h3>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-all group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm leading-relaxed text-muted">
                  {entity.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {missing ? (
                    <Badge variant="accent">Not set up</Badge>
                  ) : (
                    <>
                      <span className="font-mono text-[11px] tabular-nums text-muted">
                        {entity.singleton
                          ? count > 0
                            ? "Ready"
                            : "Empty"
                          : `${count} ${count === 1 ? "item" : "items"}`}
                      </span>
                      {drafts > 0 && (
                        <Badge variant="accent">
                          {drafts} hidden
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-[var(--radius)] border border-line bg-bg-elevated p-6">
          <h2 className="font-display text-base font-semibold tracking-tight text-ink">
            How this works
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted">
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand" />
              Pick a section on the left, then edit or add items. Changes appear
              on the live site straight away.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand" />
              The <strong className="font-medium text-ink">Visible</strong> switch
              controls whether something shows on the site. Turn it off to hide
              an item without deleting it.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand" />
              Drag the handle on the left of any row to change the order things
              appear in.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand" />
              Deleting cannot be undone. Hide it instead if you are unsure.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
