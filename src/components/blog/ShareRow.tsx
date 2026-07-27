"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { absoluteUrl } from "@/lib/utils";
import { SocialIcon } from "@/components/shared/SocialIcon";

/**
 * Share row. Uses the Web Share API when available (mobile), otherwise falls
 * back to explicit LinkedIn and X links plus copy-to-clipboard.
 */
export function ShareRow({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/blog/${slug}`);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the address bar instead.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
        Share
      </p>

      <div className="flex gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Share on LinkedIn"
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <SocialIcon name="Linkedin" className="h-3.5 w-3.5" />
        </a>

        <a
          href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Share on X"
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
            <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.96 6.82H1.66l7.49-8.56L1 2.25h6.83l4.71 6.23 5.7-6.23Zm-1.16 17.52h1.83L6.99 4.13H5.02l12.06 15.64Z" />
          </svg>
        </a>

        <button
          type="button"
          onClick={copy}
          aria-label="Copy link to this post"
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          ) : (
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
