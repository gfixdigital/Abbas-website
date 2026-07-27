"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitContact } from "@/app/contact/actions";
import {
  BUDGET_LABELS,
  TOPIC_LABELS,
  contactSchema,
  type ContactInput,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const [sent, setSent] = useState(false);

  // ?topic=speaking pre-selects the right enquiry type when arriving from the
  // speaking page CTA.
  const topicParam = searchParams.get("topic");
  const defaultTopic: ContactInput["topic"] =
    topicParam && topicParam in TOPIC_LABELS
      ? (topicParam as ContactInput["topic"])
      : "project";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      topic: defaultTopic,
      budget: "undecided",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    const result = await submitContact(values);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactInput, { type: "server", message });
        }
      }
      toast.error(result.error);
      return;
    }

    setSent(true);
    reset();
    toast.success("Message sent. I will reply within two working days.");
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[var(--radius)] border border-success/25 bg-success/[0.06] p-9 text-center"
          >
            <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-success text-white">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
              Message sent.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
              It has reached my inbox directly. I reply to everything within two
              working days, usually sooner.
            </p>
            <Button
              variant="outline"
              className="mt-7"
              onClick={() => setSent(false)}
            >
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Honeypot. Hidden from sighted users and from assistive tech. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                id="name"
                label="Your name"
                error={errors.name?.message}
                required
              >
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Muhammad Abbas"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
              </Field>

              <Field
                id="email"
                label="Email"
                error={errors.email?.message}
                required
              >
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="abbas@gfixdigital.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>
            </div>

            <Field
              id="company"
              label="Company or organisation"
              hint="Optional"
              error={errors.company?.message}
            >
              <Input
                id="company"
                autoComplete="organization"
                placeholder="Acme Ltd"
                aria-invalid={Boolean(errors.company)}
                {...register("company")}
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                id="topic"
                label="What is this about"
                error={errors.topic?.message}
                required
              >
                {/* Native select: keyboard and screen-reader behaviour is
                    better than any custom listbox inside a form like this. */}
                <select
                  id="topic"
                  aria-invalid={Boolean(errors.topic)}
                  className={selectClass}
                  style={{ colorScheme: "dark" }}
                  {...register("topic")}
                >
                  {Object.entries(TOPIC_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="budget"
                label="Indicative budget"
                hint="Optional"
                error={errors.budget?.message}
              >
                <select id="budget" className={selectClass} style={{ colorScheme: "dark" }} {...register("budget")}>
                  {Object.entries(BUDGET_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              id="message"
              label="Tell me what you are building"
              error={errors.message?.message}
              required
            >
              <Textarea
                id="message"
                rows={6}
                placeholder="What you need, roughly when you need it, and anything already decided."
                aria-invalid={Boolean(errors.message)}
                {...register("message")}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
              <p className="text-xs leading-relaxed text-muted">
                Your details are used only to reply. Nothing is shared or added to
                a mailing list.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const selectClass = cn(
  "flex h-11 w-full appearance-none rounded-xl border border-line bg-bg px-4 py-2 text-sm text-ink",
  "transition-colors focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/18",
  "aria-invalid:border-danger",
  // Custom chevron, since appearance-none removes the native one.
  "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 12%22 fill=%22none%22 stroke=%22%235b6071%22 stroke-width=%221.6%22><path d=%22M2 4.5 6 8.5 10 4.5%22 stroke-linecap=%22round%22/></svg>')] bg-[length:12px] bg-[position:right_1rem_center] bg-no-repeat pr-10",
);

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
