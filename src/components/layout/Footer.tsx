import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { KonstructzLogo } from "./Navbar";
import { blogPosts as staticBlogPosts, getBlogPostHref } from "../../data/blogPosts";
import { listPublicPosts, type PublicBlogSummary } from "../../lib/blogStore";

type FooterVariant = "default" | "embedded";

interface FooterProps {
  variant?: FooterVariant;
  style?: React.CSSProperties;
}

type FooterLink = {
  label: string;
  href: string;
};

const socialIcons = [
  {
    label: "Facebook",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  },
  {
    label: "X",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Google",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.831 0-8.76-3.929-8.76-8.76s3.929-8.76 8.76-8.76c2.259 0 4.3.849 5.867 2.241l3.116-3.116C18.17 1.259 15.358 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.78 0 12.24-5.46 12.24-12.24 0-.825-.075-1.65-.24-2.455H12.24z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

const FooterColumn: React.FC<{ title: string; links: FooterLink[] }> = ({ title, links }) => (
  <nav aria-label={title}>
    <h2 className="font-heading text-[22px] uppercase tracking-wide text-[#d8c79a]">
      {title}
    </h2>
    <ul className="mt-8 flex flex-col gap-3.5 font-glonimove text-[15px] leading-tight text-white/66">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            to={link.href}
            className="inline-flex text-white/66 transition-colors duration-150 hover:text-[#d8c79a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export const Footer: React.FC<FooterProps> = ({ variant = "default", style }) => {
  const { t } = useI18n();
  const [recentBlogs, setRecentBlogs] = useState<PublicBlogSummary[]>(() =>
    staticBlogPosts.slice(0, 2).map((p) => ({
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
        setRecentBlogs(rows.slice(0, 2));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const serviceLinks: FooterLink[] = [
    { label: t("nav.allLabel", { values: { label: t("nav.equipment") } }), href: "/categories" },
    { label: t("nav.miniSkidSteers"), href: "/product/mini-skid-steers" },
    { label: t("nav.miniExcavators"), href: "/product/mini-excavators" },
    { label: t("nav.backhoeLoaders"), href: "/product/backhoe-loaders" },
    { label: t("nav.wheelLoaders"), href: "/product/wheel-loaders" },
    { label: t("nav.dumpers"), href: "/product/dumpers" },
    { label: t("nav.trenchers"), href: "/product/trenchers" },
    { label: t("nav.towableExcavators"), href: "/product/towable-excavators" },
    { label: t("nav.stoneCrushers"), href: "/product/stone-crushers" },
  ];

  const quickLinks: FooterLink[] = [
    { label: t("auto.footer.about.company"), href: "/about" },
    { label: t("auto.footer.our.products"), href: "/categories" },
    { label: t("nav.typhonMachinery"), href: "/equipment" },
    { label: t("auto.footer.blog.and.news"), href: "/media" },
    { label: t("nav.support"), href: "/support" },
    { label: t("auto.footer.contact.us"), href: "/contact" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("footer.privacy", { fallback: "Privacy" }), href: "/privacy" },
    { label: t("footer.policy", { fallback: "Policy" }), href: "/policy" },
    { label: t("auto.footer.contact.us"), href: "/contact" },
  ];

  const footerClass =
    variant === "embedded"
      ? "absolute left-0 w-[1920px] bg-[#111311] text-white"
      : "relative mt-auto bg-[#111311] text-white";

  return (
    <footer
      className={`${footerClass} border-t border-[#68825B]/25`}
      style={style}
      aria-label="Footer"
    >
      <div className="border-t border-[#d8c79a]/10">
        <div className="mx-auto grid max-w-[1760px] grid-cols-1 gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[1.25fr_0.95fr_0.9fr_1.1fr] lg:gap-20 lg:px-20 lg:py-16">
          <section aria-label={t("auto.footer.company.information")} className="max-w-[370px]">
            <Link
              to="/"
              aria-label="Go to homepage"
              className="inline-flex h-[58px] max-w-full items-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
            >
              <KonstructzLogo height={58} isDark={false} />
            </Link>
            <p className="mt-8 font-glonimove text-[15px] leading-7 text-white/68">
              {t("auto.footer.konstructz.delivers.tough")}
            </p>
            <div className="mt-9 flex items-center gap-2.5" aria-label={t("auto.footer.social.media.icons")}>
              {socialIcons.map((social) => (
                <span
                  key={social.label}
                  aria-label={social.label}
                  role="img"
                  className="flex h-10 w-10 items-center justify-center border border-[#68825B]/50 bg-black/20 text-white/78"
                  title={`${social.label} social link pending`}
                >
                  {social.icon}
                </span>
              ))}
            </div>
          </section>

          <FooterColumn title={t("auto.footer.our.service")} links={serviceLinks} />
          <FooterColumn title={t("auto.footer.quick.link")} links={quickLinks} />

          <section aria-labelledby="footer-recent-blog-heading">
            <h2 id="footer-recent-blog-heading" className="font-heading text-[22px] uppercase tracking-wide text-[#d8c79a]">
              {t("auto.footer.recent.blog")}
            </h2>
            {recentBlogs.length > 0 ? (
              <div className="mt-8 flex flex-col gap-5">
                {recentBlogs.map((blog) => (
                  <article key={blog.slug} className="grid grid-cols-[88px_1fr] gap-4">
                    <Link
                      to={getBlogPostHref(blog)}
                      className="block aspect-[1.35] overflow-hidden bg-black/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
                    >
                      <img
                        src={blog.image || blog.detailImage}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <p className="font-googleSans text-[11px] font-bold uppercase tracking-[0.12em] text-[#d8c79a]/75">
                        {blog.date}
                      </p>
                      <h3 className="mt-1 font-glonimove text-[14px] leading-snug text-white/78">
                        <Link
                          to={getBlogPostHref(blog)}
                          className="transition-colors hover:text-[#d8c79a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
                        >
                          {blog.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-8 max-w-[360px] font-glonimove text-[15px] leading-7 text-white/58">
                {t("blog.comingSoonText", {
                  fallback: "We're preparing helpful equipment guides, product updates, and industry articles.",
                })}
              </p>
            )}
          </section>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1760px] flex-col gap-5 px-6 pb-24 pt-6 font-saira text-[14px] text-white/45 sm:px-10 sm:pb-6 md:flex-row md:items-center md:justify-between lg:px-20">
            <p className="max-w-[280px] leading-6 sm:max-w-none">
              Copyright © 2026 KonstructZ. All Rights Reserved.
            </p>
            <nav aria-label={t("auto.footer.legal.and.contact")}>
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-white/48 transition-colors hover:text-[#d8c79a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
