import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DbLead,
  LeadStatus,
  listLeads,
  updateLeadStatus,
  deleteLead,
} from "../../lib/leadsStore";

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  read: "bg-sky-500/10 text-sky-300 border-sky-500/40",
  archived: "bg-neutral-500/10 text-neutral-300 border-neutral-500/40",
};

const StatusPill: React.FC<{ status: LeadStatus }> = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[10px] uppercase tracking-wider border ${STATUS_STYLE[status]}`}
  >
    {status}
  </span>
);

const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const FILTERS: Array<"all" | LeadStatus> = ["all", "new", "read", "archived"];

export const LeadsDashboard: React.FC = () => {
  const [leads, setLeads] = useState<DbLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLeads(await listLeads());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { all: leads.length, new: 0, read: 0, archived: 0 };
    for (const l of leads) c[l.status] += 1;
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter((l) => statusFilter === "all" || l.status === statusFilter)
      .filter((l) => {
        if (!q) return true;
        return [l.name, l.email, l.phone, l.company, l.product_interest, l.message]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q));
      });
  }, [leads, statusFilter, query]);

  const setStatus = async (id: string, status: LeadStatus) => {
    setBusyId(id);
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      flash(`Marked ${status}`);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setBusyId(id);
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      flash("Message deleted");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const toggleExpand = (lead: DbLead) => {
    const opening = expandedId !== lead.id;
    setExpandedId(opening ? lead.id : null);
    // Opening a brand-new message marks it read.
    if (opening && lead.status === "new") setStatus(lead.id, "read");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-clofieBold text-3xl text-theme-heading">Messages</h1>
          <p className="mt-1 font-glonimove text-sm text-theme-muted">
            Contact &amp; quote requests from the website and chat assistant.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="self-start font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-3 py-2 rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 font-googleSans text-xs font-bold uppercase tracking-wider rounded border transition-colors ${
                statusFilter === f
                  ? "bg-theme-accent/10 text-theme-accent border-theme-accent/40"
                  : "text-theme-muted border-theme-border/30 hover:text-theme-text hover:border-theme-border"
              }`}
            >
              {f} <span className="opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, phone…"
          className="w-full lg:w-72 h-10 px-3 rounded border border-theme-border/30 bg-theme-card text-theme-text font-googleSans text-sm placeholder:text-theme-muted/60 focus:outline-none focus:border-theme-accent transition-colors"
        />
      </div>

      {/* States */}
      {loading ? (
        <p className="font-glonimove text-sm text-theme-muted py-12 text-center">Loading messages…</p>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-6 text-center space-y-2">
          <p className="font-googleSans font-bold text-red-300">Couldn’t load messages</p>
          <p className="font-glonimove text-sm text-theme-muted break-words">{error}</p>
          <p className="font-glonimove text-xs text-theme-muted">
            If this is the first run, make sure the <code>leads</code> table exists
            (run <code>db/migrations/0008_leads.sql</code> in Supabase).
          </p>
        </div>
      ) : visible.length === 0 ? (
        <p className="font-glonimove text-sm text-theme-muted py-12 text-center">
          {leads.length === 0 ? "No messages yet." : "No messages match this filter."}
        </p>
      ) : (
        <div className="border border-theme-border/20 rounded-lg overflow-hidden divide-y divide-theme-border/10">
          {visible.map((lead) => {
            const expanded = expandedId === lead.id;
            return (
              <div key={lead.id} className={lead.status === "new" ? "bg-theme-accent/[0.03]" : ""}>
                {/* Row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(lead)}
                  className="w-full text-left px-4 py-4 grid grid-cols-12 gap-3 items-center hover:bg-theme-bg/40 transition-colors"
                >
                  <div className="col-span-12 sm:col-span-3 min-w-0">
                    <p className="font-googleSans font-bold text-theme-text truncate">
                      {lead.name || "—"}
                      {lead.company ? <span className="text-theme-muted font-normal"> · {lead.company}</span> : null}
                    </p>
                    <p className="font-glonimove text-xs text-theme-muted truncate">{formatDate(lead.created_at)}</p>
                  </div>
                  <div className="col-span-12 sm:col-span-3 min-w-0">
                    <p className="font-glonimove text-sm text-theme-text truncate">{lead.email || "—"}</p>
                    <p className="font-glonimove text-xs text-theme-muted truncate">{lead.phone || ""}</p>
                  </div>
                  <div className="hidden sm:block sm:col-span-3 min-w-0">
                    <p className="font-glonimove text-sm text-theme-text truncate">
                      {lead.product_interest || lead.interest_type || "General enquiry"}
                    </p>
                    <p className="font-glonimove text-xs text-theme-muted truncate">
                      {lead.source === "chat" ? "Chat assistant" : "Contact form"}
                    </p>
                  </div>
                  <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:justify-end gap-3">
                    <StatusPill status={lead.status} />
                    <span className={`text-theme-muted text-xs transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
                  </div>
                </button>

                {/* Detail */}
                {expanded && (
                  <div className="px-4 pb-5 pt-1 bg-theme-bg/30 space-y-4">
                    {lead.message && (
                      <div>
                        <p className="font-googleSans text-[11px] uppercase tracking-wider text-theme-muted mb-1">Message</p>
                        <p className="font-glonimove text-sm text-theme-text whitespace-pre-wrap">{lead.message}</p>
                      </div>
                    )}
                    {lead.transcript_summary && (
                      <div>
                        <p className="font-googleSans text-[11px] uppercase tracking-wider text-theme-muted mb-1">Chat summary</p>
                        <p className="font-glonimove text-sm text-theme-text whitespace-pre-wrap">{lead.transcript_summary}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      {lead.product_url && (
                        <div className="col-span-2 sm:col-span-4">
                          <p className="font-googleSans text-[11px] uppercase tracking-wider text-theme-muted">Product</p>
                          <a href={lead.product_url} target="_blank" rel="noreferrer" className="font-glonimove text-theme-accent hover:underline break-all">
                            {lead.product_interest || lead.product_url}
                          </a>
                        </div>
                      )}
                      {lead.location && (
                        <div>
                          <p className="font-googleSans text-[11px] uppercase tracking-wider text-theme-muted">Location</p>
                          <p className="font-glonimove text-theme-text">{lead.location}</p>
                        </div>
                      )}
                      {lead.language && (
                        <div>
                          <p className="font-googleSans text-[11px] uppercase tracking-wider text-theme-muted">Language</p>
                          <p className="font-glonimove text-theme-text">{lead.language}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your Konstructz enquiry")}`}
                          className="font-googleSans text-xs uppercase tracking-wider bg-theme-accent/10 text-theme-accent border border-theme-accent/40 px-3 py-1.5 rounded hover:bg-theme-accent/20 transition-colors"
                        >
                          Reply by email
                        </a>
                      )}
                      {lead.status !== "read" && (
                        <button type="button" disabled={busyId === lead.id} onClick={() => setStatus(lead.id, "read")} className="action-btn">
                          Mark read
                        </button>
                      )}
                      {lead.status !== "archived" && (
                        <button type="button" disabled={busyId === lead.id} onClick={() => setStatus(lead.id, "archived")} className="action-btn">
                          Archive
                        </button>
                      )}
                      {lead.status !== "new" && (
                        <button type="button" disabled={busyId === lead.id} onClick={() => setStatus(lead.id, "new")} className="action-btn">
                          Mark unread
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busyId === lead.id}
                        onClick={() => remove(lead.id)}
                        className="font-googleSans text-xs uppercase tracking-wider text-red-300 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-theme-card border border-theme-border/30 text-theme-text px-4 py-2 rounded-lg shadow-lg font-googleSans text-sm">
          {toast}
        </div>
      )}

      <style>{`
        .action-btn {
          font-family: 'Google_Sans_Flex', Helvetica, sans-serif;
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
          border: 1px solid rgba(127,127,127,0.3); padding: 0.375rem 0.75rem;
          border-radius: 0.375rem; transition: all 0.15s;
        }
        .action-btn:hover { border-color: var(--tw-prose-links, #d8c79a); }
        .action-btn:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default LeadsDashboard;
