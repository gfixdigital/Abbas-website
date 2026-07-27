import { notFound } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { entities, getEntity } from "@/lib/admin/entities";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EntityManager } from "@/components/admin/EntityManager";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { MessagesInbox } from "@/components/admin/MessagesInbox";

export function generateStaticParams() {
  return entities.map((entity) => ({ entity: entity.key }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: key } = await params;
  const entity = getEntity(key);
  return { title: entity?.label ?? "Admin" };
}

export default async function EntityPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: key } = await params;
  const entity = getEntity(key);

  if (!entity) notFound();

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from(entity.table)
    .select("*")
    .order(entity.inbox ? "created_at" : "sort_order", {
      ascending: !entity.inbox,
    });

  if (error) {
    return (
      <>
        <AdminHeader title={entity.label} description={entity.description} />
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="flex items-start gap-3.5 rounded-[var(--radius)] border border-accent/30 bg-accent/[0.07] p-5">
            <CircleAlert
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-ink">
                This section is not set up in the database yet.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Run the files in <code className="font-mono text-[13px]">supabase/migrations</code>{" "}
                in the Supabase SQL editor, then run{" "}
                <code className="font-mono text-[13px]">npm run db:seed</code>. The
                public site keeps working from its built-in content in the
                meantime.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const rows = (data ?? []) as Record<string, unknown>[];

  if (entity.inbox) {
    return (
      <>
        <AdminHeader title={entity.label} description={entity.description} />
        <div className="p-5 sm:p-8 lg:p-10">
          <MessagesInbox rows={rows} />
        </div>
      </>
    );
  }

  if (entity.singleton) {
    return (
      <>
        <AdminHeader title={entity.label} description={entity.description} />
        <div className="p-5 sm:p-8 lg:p-10">
          <SingletonEditor entity={entity} row={rows[0] ?? null} />
        </div>
      </>
    );
  }

  return <EntityManager entity={entity} rows={rows} />;
}
