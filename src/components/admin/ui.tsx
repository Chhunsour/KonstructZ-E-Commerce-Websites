/**
 * Shared admin UI primitives — small building blocks used across admin pages
 * (e.g. the Chatbot settings page) so they match the dashboard look without
 * duplicating Tailwind soup.
 */
import React from "react";

export const inputCls =
  "w-full bg-theme-card border border-theme-border/20 focus:border-theme-accent rounded px-4 py-2.5 font-glonimove text-sm text-theme-text focus:outline-none transition-colors";

export const btnPrimary =
  "inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnGhost =
  "inline-flex items-center justify-center font-googleSans text-xs uppercase tracking-wider text-theme-text hover:text-theme-accent border border-theme-border/30 hover:border-theme-accent px-4 py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnDanger =
  "inline-flex items-center justify-center font-googleSans text-xs uppercase tracking-wider text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500 px-4 py-2.5 rounded transition-colors disabled:opacity-50";

export const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, children }) => (
  <div>
    <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1.5 font-glonimove text-[11px] text-theme-muted">{hint}</p>}
  </div>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <div className={`bg-theme-card border border-theme-border/20 rounded ${className}`}>
    {children}
  </div>
);

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATE_STYLE: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  partial: "bg-amber-500/10 text-amber-300 border-amber-500/40",
  pending: "bg-yellow-500/10 text-yellow-200 border-yellow-500/40",
  failed: "bg-red-500/10 text-red-300 border-red-500/40",
  active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  inactive: "bg-theme-bg text-theme-muted border-theme-border/40",
  waiting: "bg-blue-500/10 text-blue-300 border-blue-500/40",
};

export const Pill: React.FC<{ value: string }> = ({ value }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full font-googleSans text-[10px] uppercase tracking-wider border ${
      STATE_STYLE[value] ?? "bg-theme-bg text-theme-muted border-theme-border/40"
    }`}
  >
    {value}
  </span>
);

/** Bottom-center toast, matching the existing dashboards. */
export const Toast: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-theme-card border border-theme-border/40 rounded px-5 py-3 shadow-xl font-glonimove text-sm text-theme-text max-w-[90vw] text-center">
      {message}
    </div>
  ) : null;

/** Simple centered modal shell. */
export const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ title, onClose, children, wide }) => (
  <div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8"
    onClick={onClose}
  >
    <div
      className={`bg-theme-card border border-theme-border/30 rounded shadow-2xl w-full ${
        wide ? "max-w-3xl" : "max-w-lg"
      } my-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-theme-border/20 px-5 py-4">
        <h2 className="font-clofieBold text-lg text-theme-heading">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 grid place-items-center rounded border border-theme-border/30 hover:border-theme-accent text-theme-text hover:text-theme-accent transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);
