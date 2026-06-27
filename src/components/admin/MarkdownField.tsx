import React, { useState } from "react";
import ProductMarkdown from "../product/ProductMarkdown";

/**
 * Markdown textarea with a Write / Preview toggle. Used for the product
 * "Full description". Preview uses the same renderer as the public site, so
 * what the admin sees is what visitors get.
 */
export const MarkdownField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="bg-theme-card border border-theme-border/20 rounded overflow-hidden">
      <div className="flex items-center justify-between border-b border-theme-border/20 bg-theme-bg/40 px-2 py-1.5">
        <div className="flex gap-1">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1 font-googleSans text-[11px] uppercase tracking-wider rounded transition-colors ${
                tab === t
                  ? "bg-theme-accent text-theme-bg"
                  : "text-theme-muted hover:text-theme-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="font-googleSans text-[10px] uppercase tracking-wider text-theme-muted pr-1">
          Markdown · tables, links, images · CTA: [Label](url "cta")
        </span>
      </div>
      {tab === "write" ? (
        <textarea
          rows={16}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            placeholder ??
            '## Heading\n\n**Bold**, [link](https://…), lists, and tables.\n\n[Get a quote](/contact "cta")'
          }
          className="w-full bg-theme-card px-4 py-3 font-mono text-sm text-theme-text focus:outline-none resize-y leading-relaxed"
        />
      ) : (
        <div className="px-4 py-3 min-h-[200px]">
          {value.trim() ? (
            <ProductMarkdown content={value} />
          ) : (
            <p className="font-glonimove text-sm text-theme-muted italic">
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownField;
