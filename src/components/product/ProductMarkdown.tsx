import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeBrandCopy } from "../../lib/brandCopy";
import { sanitizeHtml } from "../../lib/sanitizeHtml";

/**
 * Shared renderer for a product's rich "Full description".
 *
 * Content is authored as **Markdown** or **HTML**. If HTML tags are detected,
 * we sanitize and render it safely. Otherwise, we render via ReactMarkdown.
 *
 * CTA buttons in Markdown: write a normal Markdown link with the title text `cta`, e.g.
 *   [Get a quote](/contact "cta")
 * and it renders as a styled call-to-action button instead of a plain link.
 */
export const ProductMarkdown: React.FC<{ content: string; className?: string }> = ({
  content,
  className,
}) => {
  if (!content?.trim()) return null;
  const normalizedContent = normalizeBrandCopy(content);

  // Detect HTML tags (like <p>, <h1>, <strong>, etc.)
  const isHtml = /<\/?[a-z][a-z0-9]*\b[^>]*>/i.test(normalizedContent);

  if (isHtml) {
    const sanitized = sanitizeHtml(normalizedContent);
    return (
      <div
        className={`product-prose ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

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
                  className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white font-googleSans font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-none transition-colors no-underline my-2"
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
            <div className="overflow-x-auto my-6 border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-left border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 font-googleSans text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-3 font-glonimove text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              {children}
            </td>
          ),
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              loading="lazy"
              className="rounded-none my-3 max-w-full h-auto"
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

