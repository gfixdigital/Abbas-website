"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getEntity, schemaFor } from "@/lib/admin/entities";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * All admin mutations funnel through here. Every one re-checks the session
 * server-side: middleware protects the routes, but a server action is its own
 * entry point and must not trust that it was reached through a page.
 */
async function requireSession() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return supabase;
}

/** Paths that show CMS content, revalidated after any write. */
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/leadership",
  "/experience",
  "/projects",
  "/case-studies",
  "/services",
  "/skills",
  "/awards",
  "/certifications",
  "/testimonials",
  "/clients",
  "/speaking",
  "/gallery",
  "/blog",
  "/insights",
  "/resume",
  "/contact",
];

function revalidateSite(entityKey: string) {
  for (const path of PUBLIC_PATHS) revalidatePath(path);
  revalidatePath(`/admin/${entityKey}`);
  revalidatePath("/admin");
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { ok: false, error: "Enter your email address and password." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately generic: never confirm whether an address has an account.
    return {
      ok: false,
      error: "That email address and password do not match an account.",
    };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createRecord(
  entityKey: string,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "Unknown content type." };

  const supabase = await requireSession();
  if (!supabase) return { ok: false, error: "Your session expired. Sign in again." };

  const parsed = schemaFor(entity).safeParse(values);
  if (!parsed.success) return validationError(parsed.error.issues);

  // New records land at the end of the list.
  const { data: last } = await supabase
    .from(entity.table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    ...normalise(parsed.data as Record<string, unknown>),
    sort_order: ((last?.sort_order as number | undefined) ?? -1) + 1,
  };

  const { error } = await supabase.from(entity.table).insert(payload);
  if (error) return { ok: false, error: friendlyError(error.message) };

  revalidateSite(entityKey);
  return { ok: true };
}

export async function updateRecord(
  entityKey: string,
  id: string,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "Unknown content type." };

  const supabase = await requireSession();
  if (!supabase) return { ok: false, error: "Your session expired. Sign in again." };

  const parsed = schemaFor(entity).safeParse(values);
  if (!parsed.success) return validationError(parsed.error.issues);

  const { error } = await supabase
    .from(entity.table)
    .update(normalise(parsed.data as Record<string, unknown>))
    .eq("id", id);

  if (error) return { ok: false, error: friendlyError(error.message) };

  revalidateSite(entityKey);
  return { ok: true };
}

export async function deleteRecord(
  entityKey: string,
  id: string,
): Promise<ActionResult> {
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "Unknown content type." };

  const supabase = await requireSession();
  if (!supabase) return { ok: false, error: "Your session expired. Sign in again." };

  const { error } = await supabase.from(entity.table).delete().eq("id", id);
  if (error) return { ok: false, error: friendlyError(error.message) };

  revalidateSite(entityKey);
  return { ok: true };
}

export async function togglePublished(
  entityKey: string,
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "Unknown content type." };

  const supabase = await requireSession();
  if (!supabase) return { ok: false, error: "Your session expired. Sign in again." };

  const { error } = await supabase
    .from(entity.table)
    .update({ published })
    .eq("id", id);

  if (error) return { ok: false, error: friendlyError(error.message) };

  revalidateSite(entityKey);
  return { ok: true };
}

export async function reorderRecords(
  entityKey: string,
  orderedIds: string[],
): Promise<ActionResult> {
  const entity = getEntity(entityKey);
  if (!entity) return { ok: false, error: "Unknown content type." };

  const supabase = await requireSession();
  if (!supabase) return { ok: false, error: "Your session expired. Sign in again." };

  // Sequential rather than parallel: a handful of rows, and this keeps the
  // final ordering deterministic if one write fails.
  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from(entity.table)
      .update({ sort_order: index })
      .eq("id", id);
    if (error) return { ok: false, error: friendlyError(error.message) };
  }

  revalidateSite(entityKey);
  return { ok: true };
}

export async function markMessageRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  const supabase = await requireSession();
  if (!supabase) return { ok: false, error: "Your session expired. Sign in again." };

  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);

  if (error) return { ok: false, error: friendlyError(error.message) };

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function validationError(
  issues: { path: (string | number)[]; message: string }[],
): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    ok: false,
    error: "Some fields need attention before this can be saved.",
    fieldErrors,
  };
}

/** Empty optional strings become null so the database stores absence, not "". */
function normalise(values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = value === "" ? null : value;
  }
  return out;
}

/** Postgres errors are not for end users. Translate the ones we expect. */
function friendlyError(message: string) {
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "Another item already uses that web address. Choose a different one.";
  }
  if (message.includes("duplicate key")) {
    return "An item with those details already exists.";
  }
  if (message.includes("violates check constraint")) {
    return "One of the selected options is not valid.";
  }
  if (message.includes("permission denied") || message.includes("row-level security")) {
    return "You do not have permission to do that. Sign in again.";
  }
  return "That could not be saved. Please try again.";
}
