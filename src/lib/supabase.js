import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Project Configuration
 * Configured directly in code
 */
export const SUPABASE_URL = "https://ujgwskcxtxtfsafuieew.supabase.co";

/**
 * Supabase Publishable Key
 * Safe for client-side frontend use
 */
export const SUPABASE_PUBLISHABLE_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_rhqrHfKZnGiJW3iyx_UIMA_3Yqd-31s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
