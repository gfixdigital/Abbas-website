"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * A labelled value with a copy button. Used across the media kit so an
 * organiser can lift exact wording without retyping and introducing errors.
 */
export function CopyBlock({
  label,
  value,
  meta,
  multiline = false,
}: {
  label: string;
  value: string;
  meta?: string;
  multiline?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied.`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the text manually instead.");
    }
  }

  return (
    <div className="rounded-[var(--radius)] border border-line bg-bg-elevated p-5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {meta && (
            <span className="font-mono text-[10px] tabular-nums text-muted">
              {meta}
            </span>
          )}
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${label}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors",
              copied
                ? "border-success/40 text-success"
                : "border-line text-muted hover:border-brand hover:text-brand",
            )}
          >
            {copied ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>

      <p
        className={cn(
          "text-ink",
          multiline ? "text-[15px] leading-[1.7]" : "text-sm font-medium",
        )}
      >
        {value}
      </p>
    </div>
  );
}
