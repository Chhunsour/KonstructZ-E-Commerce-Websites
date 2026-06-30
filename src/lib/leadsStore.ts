/**
 * Leads / contact-message store.
 *
 * One entry point — `submitLead` — is called whenever a visitor sends a
 * message (the contact/quote form and the chat assistant both use it). It does
 * two independent things, best-effort:
 *   1. Stores the message in Supabase (`public.leads`) so it shows in the admin
 *      Messages dashboard.
 *   2. POSTs it to the PHP email endpoint (see receiver/send.php) which mails it
 *      to the Hostinger inbox.
 * Neither failure blocks the other, so a message is never silently lost as long
 * as one channel works.
 *
 * The admin dashboard uses `listLeads` / `updateLeadStatus` / `deleteLead`,
 * which require an authenticated admin session (enforced by RLS).
 */
import { supabase } from "./supabase";
import { hubSupabase } from "./hubSupabase";

/** Identifies this site's messages in the shared hub `website_messages` table. */
const HUB_WEBSITE = "konstructz";

export type LeadStatus = "new" | "read" | "archived";

export interface LeadInput {
  source?: string; // 'contact-form' | 'chat'
  source_page?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  language?: string;
  interest_type?: string;
  product_interest?: string;
  product_url?: string;
  message?: string;
  transcript_summary?: string;
}

export interface DbLead extends LeadInput {
  id: string;
  created_at: string;
  updated_at?: string;
  status: LeadStatus;
  handled_by?: string | null;
}

export interface SubmitResult {
  ok: boolean;
  stored: boolean;
  emailed: boolean;
  hubStored: boolean;
}

const EMAIL_ENDPOINT = import.meta.env.VITE_LEADS_EMAIL_ENDPOINT as string | undefined;

/** Strip empty strings so we don't store blank columns. */
const clean = (input: LeadInput): LeadInput => {
  const out: LeadInput = {};
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed) (out as Record<string, unknown>)[k] = trimmed;
    } else if (v != null) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
};

/**
 * Store a message in Supabase and email it. Resolves (never throws) with which
 * channels succeeded; `ok` is true if the message landed somewhere.
 */
export async function submitLead(input: LeadInput): Promise<SubmitResult> {
  const payload = { source: "contact-form", ...clean(input) };

  let stored = false;
  let emailed = false;
  let hubStored = false;

  // 1. Store in this site's own Supabase
  if (supabase) {
    try {
      const { error } = await supabase.from("leads").insert(payload);
      stored = !error;
      if (error) console.error("[leads] Supabase insert failed:", error.message);
    } catch (e) {
      console.error("[leads] Supabase insert threw:", e);
    }
  }

  // 2. Forward to the central hub (Wordpress prompt System) so it appears in
  //    the hub admin's Messages page. Best-effort, independent of the above.
  if (hubSupabase) {
    try {
      const { error } = await hubSupabase
        .from("website_messages")
        .insert({ website: HUB_WEBSITE, ...payload });
      hubStored = !error;
      if (error) console.error("[leads] Hub insert failed:", error.message);
    } catch (e) {
      console.error("[leads] Hub insert threw:", e);
    }
  }

  // 3. Email via the PHP endpoint (best-effort, doesn't block storage)
  if (EMAIL_ENDPOINT) {
    try {
      const res = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      emailed = res.ok;
      if (!res.ok) console.error("[leads] Email endpoint responded", res.status);
    } catch (e) {
      console.error("[leads] Email endpoint failed:", e);
    }
  }

  return { ok: stored || emailed || hubStored, stored, emailed, hubStored };
}

/* ── Admin dashboard operations (require an admin session via RLS) ── */

export async function listLeads(): Promise<DbLead[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbLead[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
