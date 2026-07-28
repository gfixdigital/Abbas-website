"use server";

import { Resend } from "resend";
import { getProfile } from "@/lib/data";
import { createAdminSupabase } from "@/lib/supabase/server";
import {
  BUDGET_LABELS,
  TOPIC_LABELS,
  contactSchema,
  type ContactInput,
} from "@/lib/validation";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactInput, string>> };

/**
 * Handles a contact submission.
 *
 * Order matters: persist first, then notify. If the email provider is down the
 * enquiry is still recorded and visible in /admin, which is the failure mode
 * that loses the least.
 */
export async function submitContact(input: unknown): Promise<ContactResult> {
  const profile = await getProfile();
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot filled means a bot. Return success so it does not retry.
  if (data.website) return { ok: true };

  let stored = false;
  const supabase = createAdminSupabase();

  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: `${TOPIC_LABELS[data.topic]}${data.company ? ` — ${data.company}` : ""}`,
      message: buildPlainBody(data),
      read: false,
    });

    if (error) {
      console.error("Contact message insert failed:", error.message);
    } else {
      stored = true;
    }
  }

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;

  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: `Portfolio enquiries <${from}>`,
        to: [to],
        replyTo: data.email,
        subject: `${TOPIC_LABELS[data.topic]} — ${data.name}`,
        text: buildPlainBody(data),
        html: buildHtmlBody(data),
      });

      if (error) {
        console.error("Resend send failed:", error.message);
      } else {
        emailed = true;
      }
    } catch (error) {
      console.error("Resend threw:", error);
    }
  }

  if (!stored && !emailed) {
    return {
      ok: false,
      error: `Something went wrong on our side. Please email ${profile.email} directly and I will pick it up.`,
    };
  }

  return { ok: true };
}

function buildPlainBody(data: ContactInput) {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    `Topic: ${TOPIC_LABELS[data.topic]}`,
    data.budget ? `Budget: ${BUDGET_LABELS[data.budget]}` : null,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtmlBody(data: ContactInput) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ...(data.company ? ([["Company", data.company]] as [string, string][]) : []),
    ["Topic", TOPIC_LABELS[data.topic]],
    ...(data.budget
      ? ([["Budget", BUDGET_LABELS[data.budget]]] as [string, string][])
      : []),
  ];

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;color:#11131a">
      <div style="height:3px;background:linear-gradient(90deg,#0047b3,#0066FF,#f59e0b)"></div>
      <h2 style="margin:28px 0 6px;font-size:19px">New enquiry from the portfolio</h2>
      <p style="margin:0 0 24px;color:#5b6071;font-size:13px">abbas.gfixdigital.com</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:#5b6071;width:110px;vertical-align:top">${label}</td>
            <td style="padding:8px 0;font-weight:500">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #ececf1">
        <p style="margin:0 0 8px;color:#5b6071;font-size:13px">Message</p>
        <p style="margin:0;white-space:pre-wrap;line-height:1.65">${escapeHtml(data.message)}</p>
      </div>
    </div>
  `;
}
