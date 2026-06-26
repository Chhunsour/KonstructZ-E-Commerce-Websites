import React, { useEffect } from "react";
import BlogContent from "../blog/BlogContent";
import { contentTextLength } from "../../lib/sanitizeHtml";

export interface PostPreviewData {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  image: string | null;
  content: string;
  tags: string[];
}

/**
 * Full-screen preview that mirrors the public article layout. Shared by the
 * post editor (live, unsaved content) and the dashboard "Preview" action so a
 * post looks identical wherever it's reviewed — including drafts and scheduled
 * posts that aren't publicly reachable yet.
 */
export const PostPreviewOverlay: React.FC<
  PostPreviewData & { onClose: () => void; loading?: boolean }
> = ({ title, excerpt, author, category, image, content, tags, onClose, loading }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between gap-4 px-5 py-3 bg-theme-card border-b border-theme-border/20">
        <span className="font-googleSans text-xs uppercase tracking-wider text-theme-muted">
          Preview — exactly how it appears on the site
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-googleSans text-xs uppercase tracking-wider text-theme-text border border-theme-border/30 hover:border-theme-accent px-4 py-2 rounded transition-colors"
        >
          Close (Esc)
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-theme-bg">
        {loading ? (
          <div className="py-24 text-center font-glonimove text-theme-muted">
            Loading preview…
          </div>
        ) : (
          <article className="max-w-[820px] mx-auto px-5 sm:px-8 py-10">
            {category && (
              <span className="inline-block bg-brand-green px-3 py-1 text-white font-semibold text-xs rounded-sm tracking-wide uppercase mb-4">
                {category}
              </span>
            )}
            <h1 className="font-heading text-theme-heading leading-tight text-[32px] sm:text-[44px] mb-4">
              {title || "Untitled post"}
            </h1>
            {excerpt && (
              <p className="font-glonimove text-theme-muted text-lg mb-6">{excerpt}</p>
            )}
            <p className="font-glonimove text-sm text-theme-muted mb-6">By {author}</p>
            {image && (
              <img
                src={image}
                alt={title}
                className="w-full rounded mb-8 border border-theme-border/10"
              />
            )}
            {contentTextLength(content) > 0 ? (
              <BlogContent content={content} />
            ) : (
              <p className="font-glonimove text-theme-muted italic">
                Nothing to preview yet — start writing.
              </p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-theme-border/10">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-googleSans text-xs uppercase tracking-wider text-theme-muted border border-theme-border/30 rounded px-2.5 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  );
};

export default PostPreviewOverlay;
