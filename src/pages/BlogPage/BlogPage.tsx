import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  blogCategories,
  blogPosts as staticBlogPosts,
} from "../../data/blogPosts";
import { useI18n } from "../../context/I18nContext";
import { blogCategoryKey } from "../../i18n/keys";
import {
  listPublicPosts,
  type PublicBlogSummary,
} from "../../lib/blogStore";

type BlogPost = PublicBlogSummary;
const getBlogPostHref = (post: Pick<PublicBlogSummary, "slug">) => `/blog/${post.slug}`;

/* ─────────────────────────────────────────────────────────────────────
   DATA
 ────────────────────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────────────────
   COMPONENTS
 ────────────────────────────────────────────────────────────────────── */

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const postHref = getBlogPostHref(post);
  const { t } = useI18n();


  return (
    <article className="group flex flex-col">
      <Link to={postHref} className="block overflow-hidden">
        <div className="aspect-[16/9] w-full bg-theme-sec overflow-hidden border border-theme-border/10">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-3">
        <p className="font-glonimove text-theme-text/80 text-sm transition-colors duration-200">
          {post.date}
          <span className="mx-3 text-theme-border/30">|</span>
          {post.author}
        </p>
        <h3 className="font-clofieBold text-theme-text text-xl sm:text-2xl leading-tight group-hover:text-theme-accent transition-colors">
          <Link to={postHref}>{post.title}</Link>
        </h3>
        <p className="font-glonimove text-theme-muted text-sm leading-relaxed line-clamp-4 transition-colors">
          {post.excerpt}
        </p>
        <Link
          to={postHref}
          className="self-start mt-2 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark text-white font-googleSans font-semibold text-base px-5 py-3 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transition-colors"
        >
          {t("blog.readMore")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

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

const CategoryItem: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => {
  const id = `cat-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const { t } = useI18n();
  return (
    <li className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div
          className={`w-[18px] h-[18px] flex items-center justify-center border-2 border-theme-accent transition-all ${
            checked
              ? "bg-theme-accent text-theme-bg"
              : "bg-transparent text-transparent"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path
              d="M20 6L9 17l-5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className={`font-glonimove text-base transition-colors ${
          checked ? "text-theme-accent font-bold" : "text-theme-text group-hover:text-theme-accent"
        }`}>
          {t(blogCategoryKey(label), { fallback: label })}
        </span>
      </label>
    </li>
  );
};

const LatestBlogItem: React.FC<{
  post: BlogPost;
}> = ({ post }) => {
  const postHref = getBlogPostHref(post);

  return (
    <article className="flex gap-3 items-start">
      <Link to={postHref} className="shrink-0 w-[110px] h-[64px] overflow-hidden bg-theme-sec border border-theme-border/10">
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <p className="font-glonimove text-theme-muted text-xs transition-colors">{post.date}</p>
        <h3 className="mt-1 font-clofieBold text-theme-text text-sm leading-snug line-clamp-2 hover:text-theme-accent transition-colors">
          <Link to={postHref}>{post.title}</Link>
        </h3>
      </div>
    </article>
  );
};

const Pagination: React.FC<{
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}> = ({ page, totalPages, onChange }) => {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={t("blog.pagination")}
      className="mt-12 flex items-center justify-center gap-2 flex-wrap"
    >
      {Array.from({ length: totalPages }).map((_, i) => {
        const n = i + 1;
        const active = n === page;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={active ? "page" : undefined}
            aria-label={t("product.page", { values: { page: n } })}
            className={`w-12 h-12 lg:w-14 lg:h-14 font-googleSans font-bold text-lg lg:text-xl transition-colors ${
              active
                ? "bg-theme-accent text-theme-bg"
                : "bg-theme-sec text-theme-text border border-theme-border/20 hover:bg-theme-card"
            }`}
          >
            {n}
          </button>
        );
      })}
      {page < totalPages && (
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          aria-label={t("product.nextPage")}
          className="w-12 h-12 lg:w-14 lg:h-14 bg-theme-accent hover:bg-brand-green text-theme-bg hover:text-white flex items-center justify-center transition-colors text-xl"
        >
          ›
        </button>
      )}
    </nav>
  );
};

const AppointmentCTA: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="relative bg-[#153d28] py-10 lg:py-12 overflow-hidden">
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

/* ─────────────────────────────────────────────────────────────────────
   PAGE
 ────────────────────────────────────────────────────────────────────── */

export const BlogPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { t } = useI18n();

  // Hydrate with the static set for an instant first paint, then replace
  // with Supabase data once it loads. The list endpoint excludes full
  // content so payloads stay small.
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() =>
    staticBlogPosts.map((p) => ({
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      author: p.author,
      category: p.category,
      date: p.date,
      publishedAt: p.date,
    }))
  );

  useEffect(() => {
    let active = true;
    listPublicPosts().then((rows) => {
      if (active && rows.length > 0) setBlogPosts(rows);
    });
    return () => {
      active = false;
    };
  }, []);

  const latestBlogPosts = blogPosts.slice(0, 3);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const filteredPosts = selectedCategories.length > 0
    ? blogPosts.filter((post) => selectedCategories.includes(post.category))
    : blogPosts;

  const POSTS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-theme-bg text-theme-text min-h-screen transition-colors duration-200">
      {/* ─── Hero banner ─── */}
      <section
        aria-labelledby="blog-hero-heading"
        className="relative isolate overflow-hidden bg-theme-bg pt-24 lg:pt-28 transition-colors duration-200"
      >
        {/* Full-width banner image (devices on white platform + dark textured background) */}
        <div className="relative w-full aspect-[488/192] min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] xl:min-h-[480px]">
          <img
            src="/img/blog-banner-template.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-left select-none pointer-events-none opacity-40 dark:opacity-100"
          />
          {/* Gentle right-side fade so the heading reads cleanly */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-1/2 lg:w-[45%] bg-gradient-to-l from-theme-bg/85 via-theme-bg/30 to-transparent transition-colors"
          />

          {/* Heading + breadcrumb overlay (right side) */}
          <div className="absolute inset-0 max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 flex flex-col items-end justify-center text-right">
            <div className="w-full lg:w-[55%] flex flex-col items-end gap-3 lg:gap-5">
              <nav
                aria-label="Breadcrumb"
                className="inline-flex items-center gap-2 font-googleSans text-sm sm:text-base lg:text-lg text-theme-text/85 transition-colors"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 hover:text-theme-accent transition-colors"
                >
                  <svg
                    width="22"
                    height="22"
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
              </nav>
              <h1
                id="blog-hero-heading"
                className="font-[Malking-Regular] text-theme-heading leading-[0.95] tracking-[-0.02em] text-[56px] sm:text-[88px] lg:text-[110px] xl:text-[130px] drop-shadow-[0_6px_8px_rgba(0,0,0,0.15)] transition-colors"
              >
                {t("blog.title")}
              </h1>
              <p className="font-glonimove text-theme-text text-base sm:text-2xl lg:text-3xl xl:text-[34px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors">
                {t("blog.heroIntro")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-accent/30 to-transparent transition-colors"
        />
      </section>

      {/* ─── Main content ─── */}
      {blogPosts.length > 0 ? (
        <section
          aria-label={t("blog.listing")}
          className="bg-theme-bg py-12 lg:py-20 transition-colors duration-200"
        >
          <div className="max-w-[1620px] mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-10 lg:gap-12">
            {/* Posts grid */}
            <div>
              {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  {paginatedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-theme-card border border-theme-border/10 rounded">
                  <p className="font-glonimove text-theme-muted text-lg">
                    {t("blog.noPostsFound", { fallback: "No blog posts found for the selected categories." })}
                  </p>
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-28 self-start">
              <SidebarBox title={t("blog.categories")}>
                <ul className="flex flex-col gap-3">
                  {blogCategories.map((c) => (
                    <CategoryItem
                      key={c}
                      label={c}
                      checked={selectedCategories.includes(c)}
                      onChange={() => handleCategoryChange(c)}
                    />
                  ))}
                </ul>
              </SidebarBox>

              <SidebarBox title={t("blog.latest")}>
                <div className="flex flex-col gap-4">
                  {latestBlogPosts.map((p) => (
                    <LatestBlogItem key={p.id} post={p} />
                  ))}
                </div>
              </SidebarBox>

              <section
                aria-labelledby="social-medias-heading"
                className="flex flex-col items-center gap-4"
              >
                <h2
                  id="social-medias-heading"
                  className="font-clofieBold text-theme-heading text-2xl lg:text-3xl transition-colors"
                >
                  {t("blog.social")}
                </h2>
                <ul className="flex items-center gap-3">
                  {SOCIAL_LINKS.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        aria-label={s.name}
                        className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-theme-bg flex items-center justify-center transition-colors"
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
      ) : (
        <section className="bg-theme-bg py-16 lg:py-24 transition-colors duration-200">
          <div className="max-w-[800px] mx-auto px-5 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-theme-sec border border-theme-border/20 rounded-full flex items-center justify-center text-theme-accent mb-2">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <h2 className="font-heading text-theme-heading text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase">
              {t("blog.comingSoonTitle", { fallback: "Blog Coming Soon" })}
            </h2>
            <p className="font-glonimove text-theme-text/80 text-lg sm:text-xl max-w-[600px] leading-relaxed">
              {t("blog.comingSoonText", { fallback: "We’re preparing helpful equipment guides, product updates, and industry articles." })}
            </p>
          </div>
        </section>
      )}

      <AppointmentCTA />
    </main>
  );
};

export default BlogPage;
