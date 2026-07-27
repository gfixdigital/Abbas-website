"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setState("error");
        setMessage(data.error ?? "That did not go through. Try again.");
        return;
      }

      setState("done");
      setMessage("You are on the list.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network problem. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm">
      <div className="flex items-center gap-2 rounded-full border border-line bg-bg p-1 transition-colors">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          disabled={state === "loading" || state === "done"}
          className="h-9 min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted/70 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "done"}
          aria-label="Subscribe"
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
            state === "done"
              ? "bg-success text-white"
              : "bg-ink text-ink-inverse hover:bg-brand",
            "disabled:opacity-70",
          )}
        >
          {state === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : state === "done" ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-2.5 min-h-[1.25rem] px-1 text-xs",
          state === "error" ? "text-danger" : "text-muted",
        )}
      >
        {message}
      </p>
    </form>
  );
}
