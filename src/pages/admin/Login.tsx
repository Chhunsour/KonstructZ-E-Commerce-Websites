import React, { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Hidden admin login at /sour.
 * - Not linked from anywhere in the public site.
 * - SeoManager sets noindex,nofollow for this route.
 * - Real auth via Supabase; the hidden URL is just defense-in-depth.
 */
export const AdminLogin: React.FC = () => {
  const { user, loading, configured, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/sour/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Sign in";
  }, []);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 border border-theme-accent/40 rounded text-[10px] uppercase tracking-[0.3em] font-googleSans text-theme-accent">
            Restricted
          </div>
          <h1 className="mt-5 font-clofieBold text-4xl text-theme-heading">
            Sign in
          </h1>
          <p className="mt-3 font-glonimove text-theme-muted text-sm leading-relaxed">
            This area is for authorized Konstructz staff only.
          </p>
        </div>

        {!configured && (
          <div className="mb-6 p-4 border border-yellow-500/40 bg-yellow-500/5 rounded">
            <p className="font-glonimove text-sm text-yellow-200/90 leading-relaxed">
              Supabase isn't configured. Set{" "}
              <code className="font-mono text-yellow-100">VITE_SUPABASE_URL</code> and{" "}
              <code className="font-mono text-yellow-100">VITE_SUPABASE_ANON_KEY</code>{" "}
              and restart the dev server.
            </p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-theme-card border border-theme-border/20 rounded p-7 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-theme-bg border-2 border-theme-border/30 focus:border-theme-accent rounded px-4 py-3 font-googleSans text-base text-theme-text focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-theme-bg border-2 border-theme-border/30 focus:border-theme-accent rounded px-4 py-3 font-googleSans text-base text-theme-text focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="font-glonimove text-sm text-red-400 leading-relaxed">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-googleSans font-bold text-sm uppercase tracking-wider px-6 py-3.5 transition-colors"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
