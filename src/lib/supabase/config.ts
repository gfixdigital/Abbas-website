export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Whether Supabase is configured at all. Every data helper checks this and
 * falls back to the static content layer if it is false, so the site builds
 * and renders on a machine with no environment file.
 */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
