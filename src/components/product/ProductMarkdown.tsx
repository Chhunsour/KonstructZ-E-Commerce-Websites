import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeBrandCopy } from "../../lib/brandCopy";

/**
 * Shared renderer for a product's rich "Full description".
 *
 * Content is authored as **Markdown** (GFM — so tables, lists, links, images,
 * bold all work out of the box). Raw HTML is intentionally NOT enabled, so the
 * content is XSS-safe by construction.
 *
 * CTA buttons: write a normal Markdown link with the title text `cta`, e.g.
 *   [Get a quote](/contact "cta")
 * and it renders as a styled call-to-action button instead of a plain link.
 */
export const ProductMarkdown: React.FC<{ content: string; className?: string }> = ({
  content,
  className,
}) => {
  if (!content?.trim()) return null;
  const normalizedContent = normalizeBrandCopy(content);
  return (
    <div className={`product-prose ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, title, children }) => {
            const url = href ?? "#";
            const isCta = (title ?? "").trim().toLowerCase() === "cta";
            const external = /^https?:\/\//.test(url);
            const rel = external ? "noopener noreferrer" : undefined;
            const target = external ? "_blank" : undefined;
            if (isCta) {
              return (
                <a
                  href={url}
                  target={target}
                  rel={rel}
                  className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded transition-colors no-underline my-2"
                >
                  {children}
                </a>
              );
            }
            return (
              <a href={url} target={target} rel={rel} className="text-theme-accent underline">
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-theme-border/30 px-3 py-2 bg-theme-bg/50 font-googleSans text-xs uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-theme-border/30 px-3 py-2 font-glonimove text-sm">
              {children}
            </td>
          ),
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              loading="lazy"
              className="rounded my-3 max-w-full h-auto"
            />
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};

export default ProductMarkdown;
