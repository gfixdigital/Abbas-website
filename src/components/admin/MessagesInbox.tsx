"use client";

import { Mail, MailOpen, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { markMessageRead } from "@/app/admin/actions";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Row = Record<string, unknown>;

export function MessagesInbox({ rows: initialRows }: { rows: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => setRows(initialRows), [initialRows]);

  async function setRead(id: string, read: boolean) {
    const snapshot = rows;
    setRows((current) =>
      current.map((row) => (String(row.id) === id ? { ...row, read } : row)),
    );

    const result = await markMessageRead(id, read);
    if (!result.ok) {
      setRows(snapshot);
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  function toggleOpen(row: Row) {
    const id = String(row.id);
    const next = openId === id ? null : id;
    setOpenId(next);
    // Opening a message marks it read, which is what an inbox should do.
    if (next && row.read !== true) void setRead(id, true);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-dashed border-line-strong bg-bg-elevated p-12 text-center">
        <Mail className="mx-auto mb-4 h-6 w-6 text-line-strong" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          No messages yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Enquiries sent through the contact form will appear here, and you will
          also get an email for each one.
        </p>
      </div>
    );
  }

  const unread = rows.filter((row) => row.read !== true).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <p className="font-mono text-[11px] text-muted">
          {rows.length} {rows.length === 1 ? "message" : "messages"}
        </p>
        {unread > 0 && <Badge variant="brand">{unread} unread</Badge>}
      </div>

      <ul className="space-y-2.5">
        {rows.map((row) => {
          const id = String(row.id);
          const isOpen = openId === id;
          const isUnread = row.read !== true;

          return (
            <li
              key={id}
              className={cn(
                "overflow-hidden rounded-[var(--radius)] border bg-bg-elevated transition-colors",
                isUnread ? "border-brand/35" : "border-line",
              )}
            >
              <button
                type="button"
                onClick={() => toggleOpen(row)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-bg-soft/60"
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    isUnread ? "bg-brand text-white" : "bg-bg-soft text-muted",
                  )}
                  aria-hidden="true"
                >
                  {isUnread ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={cn(
                        "truncate text-sm",
                        isUnread ? "font-semibold text-ink" : "font-medium text-ink",
                      )}
                    >
                      {String(row.name ?? "Unknown sender")}
                    </span>
                    <span className="truncate text-[13px] text-muted">
                      {String(row.email ?? "")}
                    </span>
                  </span>

                  <span className="mt-1 block truncate text-[13px] text-muted">
                    {String(row.subject ?? "No subject")}
                  </span>

                  {!isOpen && (
                    <span className="mt-1.5 block truncate text-[13px] text-muted/80">
                      {String(row.message ?? "").slice(0, 140)}
                    </span>
                  )}
                </span>

                <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  {row.created_at
                    ? formatDate(String(row.created_at), {
                        day: "numeric",
                        month: "short",
                      })
                    : ""}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-line p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                    {String(row.message ?? "")}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
                    <Button asChild variant="brand" size="sm">
                      <a
                        href={`mailto:${String(row.email ?? "")}?subject=${encodeURIComponent(`Re: ${String(row.subject ?? "your enquiry")}`)}`}
                      >
                        <Reply className="h-3.5 w-3.5" aria-hidden="true" />
                        Reply by email
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void setRead(id, isUnread)}
                    >
                      Mark as {isUnread ? "read" : "unread"}
                    </Button>
                    <span className="font-mono text-[10.5px] text-muted">
                      Received{" "}
                      {row.created_at
                        ? formatDate(String(row.created_at), {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "unknown"}
                    </span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
