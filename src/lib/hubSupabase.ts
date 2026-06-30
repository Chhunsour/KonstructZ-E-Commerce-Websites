/**
 * Secondary Supabase client pointed at the central hub (the "Wordpress prompt
 * System" / KiuQ admin) — a DIFFERENT Supabase project from this site's own.
 *
 * It exists only to forward contact/quote messages into the hub's
 * `website_messages` table so they show up in the hub's admin "Messages" page.
 * No auth/session here — it's insert-only via the hub's public anon key, gated
 * by row-level security on the hub side.
 *
 * Configure with VITE_HUB_SUPABASE_URL + VITE_HUB_SUPABASE_ANON_KEY. If either
 * is missing, `hubSupabase` is null and forwarding is simply skipped.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_HUB_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_HUB_SUPABASE_ANON_KEY as string | undefined;

export const hubConfigured = Boolean(url && anon);

export const hubSupabase: SupabaseClient | null = hubConfigured
  ? createClient(url!, anon!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        // Keep this client's storage separate from the main site client.
        storageKey: "kz-hub-noauth",
      },
    })
  : null;
