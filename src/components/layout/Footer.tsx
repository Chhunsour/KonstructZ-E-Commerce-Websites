import React, { FormEvent, useId, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { KonstructzLogo } from "./Navbar";

export const Footer: React.FC = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const emailId = useId();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const serviceLinks = [
    { label: t("nav.equipment"), href: "/equipment" },
    { label: t("nav.attachments"), href: "/attachments" },
    { label: t("auto.footer.mini.excavators"), href: "/equipment/mini-excavators" },
    { label: t("auto.footer.skid.steers"), href: "/equipment/mini-skid-steers" },
    { label: t("auto.footer.wheel.loaders"), href: "/equipment/wheel-loaders" },
    { label: t("auto.footer.dumpers"), href: "/equipment/dumpers" },
    { label: t("auto.footer.stone.crusher"), href: "/equipment/stone-crushers" },
    { label: t("auto.footer.ground.rippers"), href: "/equipment" },
  ];

  const quickLinks = [
    { label: t("auto.footer.about.company"), href: "/about" },
    { label: t("auto.footer.our.products"), href: "/equipment" },
    { label: t("auto.footer.blog.and.news"), href: "/media" },
    { label: t("auto.footer.contact.us"), href: "/contact" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Twitter",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Google",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.831 0-8.76-3.929-8.76-8.76s3.929-8.76 8.76-8.76c2.259 0 4.3.849 5.867 2.241l3.116-3.116C18.17 1.259 15.358 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.78 0 12.24-5.46 12.24-12.24 0-.825-.075-1.65-.24-2.455H12.24z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Instagram",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: "#",
    },
  ];

  const recentBlogs = [
    {
      date: t("auto.footer.12th.june.2026"),
      title: t("auto.footer.on.the.other"),
      imageSrc: "/img/footer/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
      href: "/media",
    },
    {
      date: t("auto.footer.9th.june.2026"),
      title: t("auto.footer.on.the.other"),
      imageSrc: "/img/footer/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      href: "/media",
    },
    {
      date: t("auto.footer.9th.june.2026"),
      title: t("auto.footer.on.the.other"),
      imageSrc: "/img/footer/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      href: "/media",
    },
  ];

  return (
    <footer className="bg-[#1B1B1A] text-white relative mt-auto border-t border-white/5 pt-12 pb-8">
      {/* Newsletter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-20">
        <div className="bg-[#274426] border-2 border-brand-sand/30 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl rounded-lg">
          <div className="flex items-center gap-5">
            <div className="bg-brand-sand p-3.5 shrink-0 rounded flex items-center justify-center relative w-14 h-14">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#274426">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-readex text-brand-sand uppercase leading-tight">
                {t("auto.footer.subscribe.to.our")}
                <br />
                {t("auto.footer.newsletter.solutions")}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              required
              placeholder={t("auto.footer.ex.johndoe.gmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-neutral-800 font-glonimove px-4 py-3 w-full sm:w-80 focus:outline-none border-0 rounded"
            />
            <button
              type="submit"
              className="bg-brand-sand text-brand-dark hover:bg-white hover:text-brand-green font-googleSans font-bold text-sm tracking-wider px-6 py-3 shrink-0 transition-colors uppercase rounded border border-brand-sand"
            >
              {submitted ? t("action.subscribed") : t("action.subscribe")}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="h-[50px] flex items-center mb-6">
              <KonstructzLogo height={50} isDark={false} />
            </div>
            <p className="text-neutral-300 font-glonimove text-sm leading-relaxed mb-6">
              {t("auto.footer.konstructz.delivers.tough")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-brand-sand hover:text-brand-dark text-white transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Machinery Services */}
          <div>
            <h3 className="text-lg font-heading text-brand-sand border-b border-white/10 pb-2 mb-4 tracking-wider uppercase">
              {t("auto.footer.our.service")}
            </h3>
            <ul className="space-y-2.5 text-sm font-glonimove text-neutral-300">
              {serviceLinks.map((service, index) => (
                <li key={`${service.label}-${index}`}>
                  <Link to={service.href} className="hover:text-brand-sand transition-colors block">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading text-brand-sand border-b border-white/10 pb-2 mb-4 tracking-wider uppercase">
              {t("auto.footer.quick.link")}
            </h3>
            <ul className="space-y-2.5 text-sm font-glonimove text-neutral-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-brand-sand transition-colors block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Blogs */}
          <div>
            <h3 className="text-lg font-heading text-brand-sand border-b border-white/10 pb-2 mb-4 tracking-wider uppercase">
              {t("auto.footer.recent.blog")}
            </h3>
            <div className="space-y-4">
              {recentBlogs.map((blog, index) => (
                <article key={`${blog.title}-${index}`} className="flex gap-3 items-start">
                  <Link to={blog.href} className="shrink-0 w-20 h-11 overflow-hidden rounded bg-white/10">
                    <img
                      src={blog.imageSrc}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-brand-sand font-glonimove">{blog.date}</p>
                    <h4 className="mt-0.5 text-xs font-semibold text-neutral-200 hover:text-brand-sand transition-colors line-clamp-2 leading-snug">
                      <Link to={blog.href}>{blog.title}</Link>
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-saira text-neutral-400">
          <p>Copyright © 2026 KonstructZ. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-brand-sand transition-colors">
              Privacy
            </Link>
            <Link to="/about" className="hover:text-brand-sand transition-colors">
              Policy
            </Link>
            <Link to="/contact" className="hover:text-brand-sand transition-colors">
              {t("auto.footer.contact.us")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
