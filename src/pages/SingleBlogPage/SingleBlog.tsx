import React, { useId, useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import BlogContent from "../../components/blog/BlogContent";
import {
  blogCategories,
  blogPosts as staticBlogPosts,
} from "../../data/blogPosts";
import { useI18n } from "../../context/I18nContext";
import { blogCategoryKey } from "../../i18n/keys";
import {
  getPublicPostBySlug,
  listPublicPosts,
  type PublicBlogDetail,
  type PublicBlogSummary,
} from "../../lib/blogStore";

const toSummary = (p: typeof staticBlogPosts[number]): PublicBlogSummary => ({
  id: String(p.id),
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  image: p.image,
  author: p.author,
  category: p.category,
  date: p.date,
  publishedAt: p.date,
});

const getBlogPostHref = (post: Pick<PublicBlogSummary, "slug">) => `/blog/${post.slug}`;

interface Comment {
  id: number;
  avatar: string;
  name: string;
  message: string;
  date: string;
  replies?: Comment[];
}

const SidebarBox: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <section className={`bg-theme-card border border-theme-border/10 p-5 lg:p-6 transition-colors duration-200 ${className}`}>
    <header className="flex items-center justify-between border-b-[3px] border-theme-accent pb-3 mb-4 transition-colors">
      <h2 className="font-clofieBold text-theme-text text-xl lg:text-2xl transition-colors">{title}</h2>
      <svg
        width="14"
        height="14"
        viewBox="0 0 10 7"
        fill="none"
        className="text-theme-text transition-colors"
        aria-hidden="true"
      >
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </header>
    {children}
  </section>
);

const AppointmentCTA: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="relative bg-[#153d28] py-10 lg:py-12 overflow-hidden w-full">
      <div className="relative max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-16">
        <div className="flex items-center gap-5 lg:gap-8 justify-center lg:justify-start">
          <div className="w-14 h-14 lg:w-[70px] lg:h-[70px] rounded-full bg-[#d8c79a] flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#153d28" aria-hidden="true">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15 15 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" />
            </svg>
          </div>
          <p className="font-readex font-semibold text-xl sm:text-2xl lg:text-3xl leading-snug">
            <span className="text-white">{t("blog.appointmentText")} </span>
            <a href="tel:+12132142203" className="text-[#d8c79a] underline whitespace-nowrap">
              +1 213-214-2203
            </a>
          </p>
        </div>
        <a
          href="tel:+12132142203"
          aria-label={t("blog.callUsNowAt", { values: { phone: "+1 213-214-2203" } })}
          className="self-center lg:self-auto inline-flex items-center justify-center gap-3 border-4 border-solid border-[#d8c79a] text-[#d8c79a] hover:bg-[#d8c79a]/10 transition-colors h-[56px] lg:h-[68px] px-8 lg:px-10 [font-family:'Google_Sans_Flex',Helvetica] font-bold text-base lg:text-lg uppercase tracking-wider btn rounded-[3px]"
        >
          {t("action.callUsNow")}
          <img
            className="w-[10px] h-[16px] object-contain"
            alt=""
            aria-hidden="true"
            src="/img/vector-9.svg"
          />
        </a>
      </div>
    </section>
  );
};

export const SingleBlog = (): JSX.Element => {
  const { t } = useI18n();
  const { blogSlug } = useParams<{ blogSlug: string }>();
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Load the current blog post — try Supabase first (only published), fall
  // back to the static set so the page never goes blank during dev. The
  // static post is rendered as plain text; Supabase posts render as Markdown.
  type RenderablePost = PublicBlogDetail & {
    detailImage?: string;
    contentImages?: string[];
    isMarkdown: boolean;
  };

  const staticByCurrentSlug = useMemo(() => {
    const s = staticBlogPosts.find((p) => p.slug === blogSlug) ?? staticBlogPosts[0];
    return s
      ? ({
          ...toSummary(s),
          content: s.content,
          seoTitle: null,
          seoDescription: s.excerpt,
          keywords: null,
          tags: [],
          detailImage: s.detailImage,
          contentImages: s.contentImages,
          isMarkdown: false,
        } as RenderablePost)
      : null;
  }, [blogSlug]);

  const [post, setPost] = useState<RenderablePost | null>(staticByCurrentSlug);
  const [latestBlogPosts, setLatestBlogPosts] = useState<PublicBlogSummary[]>(
    () => staticBlogPosts.slice(0, 3).map(toSummary)
  );

  useEffect(() => {
    let active = true;
    setPost(staticByCurrentSlug);
    (async () => {
      const dbPost = await getPublicPostBySlug(blogSlug);
      if (active && dbPost) {
        setPost({ ...dbPost, isMarkdown: true });
      }
    })();
    return () => {
      active = false;
    };
  }, [blogSlug, staticByCurrentSlug]);

  useEffect(() => {
    let active = true;
    listPublicPosts().then((rows) => {
      if (active && rows.length > 0) setLatestBlogPosts(rows.slice(0, 4));
    });
    return () => {
      active = false;
    };
  }, []);

  // Reader-submitted comments. Starts empty (no template/demo comment); reset
  // when navigating to a different article.
  const [postComments, setPostComments] = useState<Comment[]>([]);

  useEffect(() => {
    setPostComments([]);
  }, [post?.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogSlug]);

  // Apply per-post SEO to the document head, restoring the previous values
  // when the visitor navigates away.
  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = post.seoTitle?.trim() || `${post.title} — Konstructz`;

    const setMeta = (name: string, content: string | null) => {
      if (!content) return () => {};
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (created) tag?.remove();
        else if (prev !== null) tag?.setAttribute("content", prev);
      };
    };

    const restoreDesc = setMeta(
      "description",
      post.seoDescription?.trim() || post.excerpt || null
    );
    const restoreKeywords = setMeta("keywords", post.keywords?.trim() || null);

    return () => {
      document.title = prevTitle;
      restoreDesc();
      restoreKeywords();
    };
  }, [post?.slug, post?.seoTitle, post?.seoDescription, post?.keywords, post?.title, post?.excerpt]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      avatar: "/single-blog/img/image-74.png", // default avatar
      name: formData.name,
      message: formData.message,
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      replies: [],
    };

    setPostComments((current) => [...current, newComment]);
    setFormData({ name: "", email: "", message: "" });
  };

  if (!post) {
    return (
      <main className="bg-theme-bg text-theme-text min-h-screen pt-28 pb-16 transition-colors duration-200 flex items-center justify-center">
        <div className="max-w-[600px] mx-auto px-5 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-theme-sec border border-theme-border/20 rounded-full flex items-center justify-center text-theme-accent mb-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="font-heading text-theme-heading text-3xl sm:text-4xl tracking-wide uppercase">
            {t("blog.notFoundTitle", { fallback: "Article Not Found" })}
          </h1>
          <p className="font-glonimove text-theme-text/80 text-base md:text-lg leading-relaxed">
            {t("blog.notFoundText", { fallback: "The article you are looking for does not exist or has been removed." })}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-googleSans font-semibold text-base px-6 py-3.5 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transition-colors"
          >
            ← {t("blog.backToBlog", { fallback: "Back to Blog" })}
          </Link>
        </div>
      </main>
    );
  }

  const visibleLatestBlogs = latestBlogPosts
    .filter((latestPost) => latestPost.slug !== post.slug)
    .slice(0, 3);

  const SOCIAL_LINKS = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <path d="M22 5.8c-.7.3-1.5.6-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4-1.7-5.5-.2-1 1-1.5 2.4-1.2 3.8C9 8.5 5.7 6.9 3.4 4.2c-1.1 1.9-.5 4.3 1.3 5.5-.6 0-1.3-.2-1.8-.5 0 2 1.4 3.7 3.3 4.1-.5.1-1.1.2-1.7.1.5 1.7 2 2.8 3.8 2.8a8 8 0 0 1-5.7 1.6c1.8 1.2 4 1.8 6.2 1.8 7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2-2.1Z" />
      ),
    },
    {
      name: "Google",
      href: "#",
      icon: (
        <path d="M12 11v3.4h5.4a4.8 4.8 0 0 1-2 3.2L19 20a8 8 0 0 0 2.5-6c0-.6-.1-1.2-.2-1.8H12Zm0 8a8 8 0 0 1-7.8-5.4l-3.5 2.7A12 12 0 0 0 12 23c3.2 0 5.9-1 7.8-2.9L16.4 18A7.2 7.2 0 0 1 12 19ZM4.2 13.6A7.9 7.9 0 0 1 4.2 10.4l-3.5-2.7a12 12 0 0 0 0 8.6l3.5-2.7ZM12 5c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 12 1a12 12 0 0 0-11.3 6.7l3.5 2.7A8 8 0 0 1 12 5Z" />
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.3 18.3H5.7v-8h2.6v8ZM7 9.1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11.3 9.2h-2.6v-3.9c0-1 0-2.2-1.4-2.2-1.4 0-1.6 1-1.6 2.1v4h-2.6v-8h2.5v1.1h.1c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.1 1.7 3.1 4v4.3Z" />
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.9.3 2.3.4.6.2 1 .5 1.4 1 .5.4.7.8 1 1.4.1.4.3 1.1.4 2.3 0 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.9-.4 2.3a3.6 3.6 0 0 1-1 1.4c-.4.5-.8.7-1.4 1-.4.1-1.1.3-2.3.4-1.2 0-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.9-.3-2.3-.4-.6-.2-1-.5-1.4-1a3.6 3.6 0 0 1-1-1.4c-.1-.4-.3-1.1-.4-2.3 0-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c0-1.2.3-1.9.4-2.3.2-.6.5-1 1-1.4.4-.5.8-.7 1.4-1 .4-.1 1.1-.3 2.3-.4 1.2-.1 1.6-.1 4.8-.1ZM12 0C8.7 0 8.3 0 7.1.1c-1.3 0-2.2.3-2.9.6a6 6 0 0 0-2.2 1.4A6 6 0 0 0 .6 4.2C.3 4.9.1 5.8 0 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c0 1.3.3 2.2.6 2.9a6 6 0 0 0 1.4 2.2 6 6 0 0 0 2.2 1.4c.7.3 1.6.5 2.9.6 1.2 0 1.6.1 4.9.1s3.7 0 4.9-.1c1.3 0 2.2-.3 2.9-.6a6 6 0 0 0 2.2-1.4 6 6 0 0 0 1.4-2.2c.3-.7.5-1.6.6-2.9 0-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c0-1.3-.3-2.2-.6-2.9a6 6 0 0 0-1.4-2.2A6 6 0 0 0 19.8.7C19.1.4 18.2.2 16.9.1 15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
      ),
    },
  ];

  return (
    <main className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      {/* ─── Hero banner ─── */}
      <section
        aria-label={t("blog.detailsTitle")}
        className="relative isolate overflow-hidden bg-theme-bg pt-24 lg:pt-28 transition-colors duration-200"
      >
        <div className="relative w-full aspect-[488/192] min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] xl:min-h-[480px] bg-theme-sec">
          <img
            src="/single-blog/img/new-project-24-1.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none opacity-40 dark:opacity-100"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/40 to-transparent"
          />
          <div className="absolute inset-0 max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-start justify-end pb-8 sm:pb-12 lg:pb-16">
            <div className="w-full lg:w-[70%] flex flex-col items-start gap-3 lg:gap-5 text-left">
              <nav
                aria-label="Breadcrumb"
                className="inline-flex items-center gap-2 font-googleSans text-sm sm:text-base lg:text-lg text-theme-text/85 transition-colors"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 hover:text-theme-accent transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 12l9-9 9 9" />
                    <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
                  </svg>
                  <span>{t("nav.home")}</span>
                </Link>
                <span className="text-theme-border/30">/</span>
                <Link
                  to="/blog"
                  className="hover:text-theme-accent transition-colors"
                >
                  {t("blog.title")}
                </Link>
              </nav>
              <p className="font-clofieBold text-theme-accent text-lg sm:text-xl lg:text-2xl transition-colors">
                {t("blog.detailsTitle")}
              </p>
              <h1 className="font-heading text-theme-text leading-tight tracking-tight text-[28px] sm:text-[40px] lg:text-[52px] xl:text-[64px] transition-colors">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main content ─── */}
      <section className="bg-theme-bg py-12 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-10 lg:gap-12">
          {/* Left Column (Article content) */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <article className="flex flex-col gap-6">
              <div className="overflow-hidden bg-theme-sec border border-theme-border/10">
                <img
                  src={post.detailImage || post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover max-h-[600px] mx-auto"
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-glonimove text-sm text-theme-text/80 border-y border-theme-border/10 py-4 transition-colors">
                <span className="bg-brand-green px-3 py-1 text-white font-semibold text-xs rounded-sm tracking-wide uppercase">
                  {t(blogCategoryKey(post.category), { fallback: post.category })}
                </span>
                <span className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-theme-accent">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-accent">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-accent">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {t("blog.comments", { values: { count: postComments.length } })}
                </span>
              </div>

              {post.isMarkdown ? (
                <BlogContent content={post.content} />
              ) : (
                <div className="font-glonimove text-theme-text text-base md:text-lg leading-relaxed whitespace-pre-line space-y-4">
                  {post.content}
                </div>
              )}

              {post.contentImages && post.contentImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-4">
                  {post.contentImages.map((img, idx) => (
                    <div key={idx} className="overflow-hidden bg-theme-sec border border-theme-border/10 aspect-[16/9]">
                      <img
                        src={img}
                        alt={t("blog.fieldImage", { values: { title: post.title } })}
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* Comments list section */}
            <section className="bg-theme-card border border-theme-border/10 p-6 md:p-8 mt-4 rounded-sm">
              <h2 className="font-clofieBold text-theme-text text-2xl mb-6">
                {t("blog.comments", { values: { count: postComments.length } })}
              </h2>
              {postComments.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {postComments.map((comment) => (
                    <article key={comment.id} className="flex gap-4 items-start border-b border-theme-border/10 pb-6 last:border-b-0 last:pb-0">
                      <img
                        src={comment.avatar || "/single-blog/img/image-74.png"}
                        alt={comment.name}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-theme-border/10 shrink-0 bg-theme-sec"
                      />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-clofieBold text-theme-text text-lg md:text-xl truncate">
                            {comment.name}
                          </h3>
                          <span className="font-glonimove text-theme-muted text-xs md:text-sm whitespace-nowrap">
                            {comment.date}
                          </span>
                        </div>
                        <p className="font-glonimove text-theme-text/80 text-sm md:text-base mt-2 whitespace-pre-line leading-relaxed">
                          {comment.message}
                        </p>

                        {/* Render replies if any */}
                        {comment.replies && comment.replies.map((reply) => (
                          <div key={reply.id} className="mt-4 flex gap-3 items-start bg-theme-sec p-4 border-l-2 border-theme-accent">
                            <img
                              src={reply.avatar}
                              alt={reply.name}
                              className="w-9 h-9 rounded-full object-cover border border-theme-border/10 shrink-0 bg-theme-bg"
                            />
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-4">
                                <h4 className="font-clofieBold text-theme-text text-sm md:text-base truncate">
                                  {reply.name}
                                </h4>
                                <span className="font-glonimove text-theme-muted text-[10px] md:text-xs whitespace-nowrap">
                                  {reply.date}
                                </span>
                              </div>
                              <p className="font-glonimove text-theme-text/85 text-xs md:text-sm mt-1 whitespace-pre-line leading-relaxed">
                                {reply.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="font-glonimove text-theme-muted text-sm md:text-base">
                  No comments yet. Be the first to leave a comment!
                </p>
              )}
            </section>

            {/* Leave a comment section */}
            <section className="bg-theme-card border border-theme-border/10 p-6 md:p-8 rounded-sm">
              <h2 className="font-clofieBold text-theme-text text-2xl mb-6">
                {t("blog.leaveComment")}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={nameId} className="font-googleSans font-bold text-theme-muted text-sm">
                      {t("blog.yourName")}
                    </label>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className="w-full bg-theme-sec border border-theme-border/20 px-4 py-3 font-glonimove text-theme-text outline-none focus:border-theme-accent transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor={emailId} className="font-googleSans font-bold text-theme-muted text-sm">
                      {t("blog.yourEmail")}
                    </label>
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className="w-full bg-theme-sec border border-theme-border/20 px-4 py-3 font-glonimove text-theme-text outline-none focus:border-theme-accent transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={messageId} className="font-googleSans font-bold text-theme-muted text-sm">
                    {t("blog.yourMessage")}
                  </label>
                  <textarea
                    id={messageId}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-theme-sec border border-theme-border/20 px-4 py-3 font-glonimove text-theme-text outline-none focus:border-theme-accent resize-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="self-start inline-flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-googleSans font-semibold text-base px-6 py-3.5 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transition-colors"
                >
                  {t("blog.submitComment")}
                  <span>→</span>
                </button>
              </form>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-28 self-start">
            <SidebarBox title={t("blog.categories")}>
              <ul className="flex flex-col gap-3 font-glonimove text-theme-text text-base">
                {blogCategories.map((c) => (
                  <li key={c} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-theme-accent rotate-45 shrink-0" />
                    <Link to="/blog" className="hover:text-theme-accent transition-colors">
                      {t(blogCategoryKey(c), { fallback: c })}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarBox>

            <SidebarBox title={t("blog.latest")}>
              <div className="flex flex-col gap-4">
                {visibleLatestBlogs.map((latestBlog) => (
                  <article key={latestBlog.slug} className="flex gap-3 items-start">
                    <Link to={getBlogPostHref(latestBlog)} className="shrink-0 w-[110px] h-[64px] overflow-hidden bg-theme-sec border border-theme-border/10">
                      <img
                        src={latestBlog.image}
                        alt={latestBlog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="font-glonimove text-theme-muted text-xs">{latestBlog.date}</p>
                      <h3 className="mt-1 font-clofieBold text-theme-text text-sm leading-snug line-clamp-2 hover:text-theme-accent transition-colors">
                        <Link to={getBlogPostHref(latestBlog)}>{latestBlog.title}</Link>
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </SidebarBox>

            <section className="flex flex-col items-center gap-4 bg-theme-card border border-theme-border/10 p-5 lg:p-6">
              <h2 className="font-clofieBold text-theme-text text-xl lg:text-2xl transition-colors">
                {t("blog.social")}
              </h2>
              <ul className="flex items-center gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      aria-label={s.name}
                      className="w-10 h-10 rounded-full border-2 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-theme-bg flex items-center justify-center transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        {s.icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>

      <AppointmentCTA />
    </main>
  );
};

export default SingleBlog;
