import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cookie-free client for public reads.
 *
 * The server client in `server.ts` reads cookies to carry the admin session,
 * which opts any route using it out of static generation. Public pages only
 * ever read rows where `published = true`, which the anon key can do without a
 * session, so they use this instead and stay statically generated. Freshness
 * comes from `revalidatePath` in the admin actions.
 */
export function createStaticSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
