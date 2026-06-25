import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { BlogCategory, supabase } from "../../lib/supabase";

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const AdminCategories: React.FC = () => {
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from("blog_categories")
      .select("id,name,slug,created_at")
      .order("name");
    if (err) setError(err.message);
    setCats((data as BlogCategory[] | null) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onName = (v: string) => {
    setName(v);
    if (!slugDirty) setSlug(slugify(v));
  };

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const n = name.trim();
    const s = slug.trim() || slugify(n);
    if (!n || !s) {
      setError("Name and slug are required.");
      return;
    }
    setError(null);
    const { error: err } = await supabase
      .from("blog_categories")
      .insert({ name: n, slug: s });
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    setSlug("");
    setSlugDirty(false);
    load();
  };

  const onDelete = async (cat: BlogCategory) => {
    if (!supabase) return;
    if (!confirm(`Delete category "${cat.name}"? Posts will lose their category.`)) return;
    const { error: err } = await supabase.from("blog_categories").delete().eq("id", cat.id);
    if (err) {
      alert(err.message);
      return;
    }
    setCats((prev) => prev.filter((c) => c.id !== cat.id));
  };

  return (
    <div>
      <h1 className="font-clofieBold text-3xl md:text-4xl text-theme-heading mb-6">
        Categories
      </h1>

      <form
        onSubmit={onAdd}
        className="bg-theme-card border border-theme-border/20 rounded p-5 mb-8 grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end"
      >
        <div>
          <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onName(e.target.value)}
            className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-glonimove text-sm text-theme-text focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block font-googleSans text-xs uppercase tracking-wider text-theme-muted mb-2">
            Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugDirty(true);
              setSlug(slugify(e.target.value));
            }}
            className="w-full bg-theme-bg border border-theme-border/20 focus:border-theme-accent rounded px-3 py-2 font-mono text-sm text-theme-text focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="font-googleSans text-xs font-bold uppercase tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white px-5 py-2.5 rounded transition-colors"
        >
          Add
        </button>
      </form>

      {error && (
        <div className="mb-6 p-3 border border-red-500/40 bg-red-500/5 rounded font-glonimove text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="bg-theme-card border border-theme-border/20 rounded overflow-hidden">
        {loading ? (
          <div className="p-10 text-center font-glonimove text-theme-muted">Loading…</div>
        ) : cats.length === 0 ? (
          <div className="p-10 text-center font-glonimove text-theme-muted">
            No categories yet.
          </div>
        ) : (
          <ul className="divide-y divide-theme-border/20">
            {cats.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-clofieBold text-base text-theme-heading">{cat.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-theme-muted truncate">
                    {cat.slug}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(cat)}
                  className="font-googleSans text-xs uppercase tracking-wider text-red-300 hover:text-red-200 border border-red-500/30 px-3 py-1.5 rounded transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
