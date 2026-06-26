import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { looksLikeHtml, sanitizeHtml } from "../../lib/sanitizeHtml";

/**
 * Shared typography for rendered blog bodies. Used by the public article page,
 * the editor "write" preview, and the full-page preview so all three look
 * identical. Includes styling for editor-inserted CTA buttons (`.blog-cta`)
 * and figure captions (`.blog-figcaption`).
 */
export const blogProseClass = [
  "font-glonimove text-theme-text text-base md:text-lg leading-relaxed space-y-4",
  "[&_h1]:font-clofieBold [&_h1]:text-3xl [&_h1]:text-theme-heading [&_h1]:mt-8 [&_h1]:mb-3",
  "[&_h2]:font-clofieBold [&_h2]:text-2xl [&_h2]:text-theme-heading [&_h2]:mt-7 [&_h2]:mb-3",
  "[&_h3]:font-clofieBold [&_h3]:text-xl [&_h3]:text-theme-heading [&_h3]:mt-6 [&_h3]:mb-2",
  "[&_h4]:font-clofieBold [&_h4]:text-lg [&_h4]:text-theme-heading [&_h4]:mt-5 [&_h4]:mb-2",
  "[&_p]:leading-relaxed",
  "[&_a]:text-theme-accent [&_a]:underline hover:[&_a]:text-brand-green",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-theme-accent/60 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-theme-muted",
  "[&_hr]:my-8 [&_hr]:border-theme-border/30",
  "[&_code]:bg-theme-sec [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-theme-accent",
  "[&_pre]:bg-theme-sec [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto",
  "[&_img]:rounded [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto",
  "[&_figure]:my-4 [&_.blog-figcaption]:text-sm [&_.blog-figcaption]:text-theme-muted [&_.blog-figcaption]:mt-2 [&_.blog-figcaption]:text-center",
  "[&_table]:w-full [&_table]:my-4 [&_th]:text-left [&_th]:border-b [&_th]:border-theme-border/30 [&_th]:p-2 [&_td]:border-b [&_td]:border-theme-border/20 [&_td]:p-2",
  // CTA buttons — override the generic anchor styling with !important utilities.
  "[&_.blog-cta]:inline-flex [&_.blog-cta]:items-center [&_.blog-cta]:gap-2",
  "[&_.blog-cta]:bg-brand-green hover:[&_.blog-cta]:bg-brand-greenDark",
  "[&_.blog-cta]:!text-white [&_.blog-cta]:!no-underline",
  "[&_.blog-cta]:font-googleSans [&_.blog-cta]:font-semibold",
  "[&_.blog-cta]:px-6 [&_.blog-cta]:py-3 [&_.blog-cta]:my-2 [&_.blog-cta]:transition-colors",
].join(" ");

interface BlogContentProps {
  content: string;
  /** Force a render mode. Defaults to auto-detect (HTML vs legacy Markdown). */
  mode?: "auto" | "html" | "markdown";
  className?: string;
}

/**
 * Renders a blog body. New posts are sanitized HTML from the WYSIWYG editor;
 * legacy posts authored in Markdown still render through react-markdown.
 */
export const BlogContent: React.FC<BlogContentProps> = ({
  content,
  mode = "auto",
  className = "",
}) => {
  const isHtml = mode === "html" || (mode === "auto" && looksLikeHtml(content));
  const safeHtml = useMemo(
    () => (isHtml ? sanitizeHtml(content) : ""),
    [isHtml, content]
  );

  if (isHtml) {
    return (
      <div
        className={`${blogProseClass} ${className}`}
        // Content is allowlist-sanitized in sanitizeHtml() before this point.
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <div className={`${blogProseClass} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default BlogContent;
