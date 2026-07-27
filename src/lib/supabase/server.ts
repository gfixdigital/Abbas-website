import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Request-scoped server client. Reads and writes the auth cookie so
 * middleware-protected admin routes see the session.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component render, where cookies are
          // read-only. Middleware handles session refresh instead.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses RLS, so it is only ever used in trusted
 * server contexts (contact form insert, newsletter insert) and never exposed
 * to the browser.
 */
export function createAdminSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;

  return createServerClient(SUPABASE_URL, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
