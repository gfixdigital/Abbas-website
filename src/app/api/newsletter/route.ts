import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." },
      { status: 422 },
    );
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    // No database configured. Accept the address rather than showing the
    // visitor an error they cannot act on, and say so in the logs.
    console.warn("Newsletter signup received but Supabase is not configured.");
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email }, { onConflict: "email" });

  if (error) {
    console.error("Newsletter signup failed:", error.message);
    return NextResponse.json(
      { error: "Could not save that right now. Try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
