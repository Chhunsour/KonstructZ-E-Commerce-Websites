import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../../context/I18nContext";
import { blogPosts as staticBlogPosts } from "../../../../data/blogPosts";
import { listPublicPosts, type PublicBlogSummary } from "../../../../lib/blogStore";
import { Reveal } from "../../../../components/Reveal";
import { Stagger } from "../../../../components/Stagger";

export const BlogSection = (): JSX.Element => {
  const { t } = useI18n();
  const [posts, setPosts] = useState<PublicBlogSummary[]>(() =>
    staticBlogPosts.slice(0, 3).map((p) => ({
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
      if (active && rows.length > 0) {
        setPosts(rows.slice(0, 3));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="absolute top-[8519px] left-0 w-[1920px] h-[947px] bg-[#1a1a1a] text-white flex flex-col justify-between py-14 px-[90px] select-none"
      aria-labelledby="home-blog-section-heading"
    >
      {/* Decorative ambient spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,199,154,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col h-full justify-between">
        {/* Section Heading */}
        <header className="text-center flex flex-col items-center">
          <Reveal as="span" variant="fade" className="text-theme-accent text-sm uppercase tracking-[0.25em] font-googleSans font-bold block mb-2">
            {t("nav.media") || "LATEST NEWS"}
          </Reveal>
          <Reveal
            as="h2"
            variant="rise"
            delay={160}
            className="font-[Malking-Regular] text-white text-5xl lg:text-6xl tracking-wide uppercase leading-tight"
          >
            <span id="home-blog-section-heading">
              {t("auto.bloglisting.latest.blogs") || "FROM OUR BLOG"}
            </span>
          </Reveal>
          <Reveal variant="reveal-x" delay={320} className="w-16 h-1 bg-[#153d28] mt-3" ariaHidden>
            {null}
          </Reveal>
        </header>

        {/* Blog Post Grid — staggered card reveal */}
        {posts.length > 0 ? (
          <Stagger
            step={140}
            base={120}
            className="grid grid-cols-3 gap-10 mt-8 mb-10 w-full"
          >
            {posts.map((post) => (
              <Reveal key={post.id} variant="stack" className="contents-fix">
                <Link
                  to={`/blog/${post.slug}`}
                  className="k-card-hover group flex flex-col justify-between h-[540px] bg-transparent"
                >
                  {/* Image Frame */}
                  <div className="k-image-zoom relative w-full aspect-video overflow-hidden bg-[#1e1e1e]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-[#153d28] text-white text-[10px] font-googleSans font-bold uppercase tracking-widest px-2.5 py-1 shadow-md">
                      {post.category.split("'s")[0] || "ARTICLE"}
                    </div>
                  </div>

                  {/* Text Meta Info & Excerpt */}
                  <div className="flex-1 pt-6 px-0 pb-2 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="font-glonimove text-xs text-theme-accent/80 uppercase tracking-widest font-semibold">
                        {post.date} &nbsp;·&nbsp; BY {post.author.toUpperCase()}
                      </span>
                      <h3 className="font-clofieBold text-xl text-white group-hover:text-theme-accent transition-colors duration-300 line-clamp-2 mt-1 leading-snug">
                        {post.title}
                      </h3>
                      <p className="font-glonimove text-sm text-neutral-400 line-clamp-3 mt-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 w-full">
                      <span className="font-googleSans text-xs font-bold uppercase tracking-widest text-theme-accent group-hover:text-white transition-colors duration-300">
                        READ ARTICLE
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#153d28]/30 border border-theme-accent/15 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-brand-dark group-hover:scale-110 transition-all duration-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </Stagger>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center py-16 bg-[#212121]/30 border border-white/5 rounded-lg mb-10 mt-8 w-full text-center px-6">
            <div className="w-12 h-12 rounded-full border border-theme-accent/20 flex items-center justify-center text-theme-accent/80 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              </svg>
            </div>
            <p className="font-glonimove text-neutral-300 text-base max-w-[480px] leading-relaxed">
              {t("blog.comingSoonText", { fallback: "We’re preparing helpful equipment guides, product updates, and industry articles." })}
            </p>
          </div>
        )}

        {/* View All Posts Button */}
        <Reveal variant="rise" delay={120} className="flex justify-center">
          <Link
            to="/blog"
            className="k-btn-lift inline-flex items-center justify-center gap-3 bg-[#153d28] border-3 border-[#153d28] text-white hover:bg-theme-accent hover:text-[#153d28] hover:border-theme-accent h-14 px-10 font-googleSans font-bold text-lg tracking-[0.02em] shadow-md"
          >
            <span>{t("action.exploreMore") || "EXPLORE MORE ARTICLES"}</span>
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
