import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../context/I18nContext";
import { type LanguageCode } from "../../i18n/dictionaries";
import { FlagIcon } from "../ui/FlagIcons";

const DESIGN_WIDTH = 1920;
const NAV_HEIGHT = 76;
const MOBILE_NAV_HEIGHT = 53;
const MOBILE_BREAKPOINT = 1024;

const navItems = [
  { labelKey: "nav.home", href: "/" },
  {
    labelKey: "nav.equipment",
    href: "/equipment",
    hasDropdown: true,
    dropdownItems: [
      { labelKey: "nav.konstructzMachine", href: "/equipment/konstructz-machine" },
      { labelKey: "nav.backhoeLoaders", href: "/equipment/backhoe-loaders" },
      { labelKey: "nav.dumpers", href: "/equipment/dumpers" },
      { labelKey: "nav.miniExcavators", href: "/equipment/mini-excavators" },
      { labelKey: "nav.towableExcavators", href: "/equipment/towable-excavators" },
      { labelKey: "nav.stoneCrushers", href: "/equipment/stone-crushers" },
      { labelKey: "nav.trenchers", href: "/equipment/trenchers" },
      { labelKey: "nav.wheelLoaders", href: "/equipment/wheel-loaders" },
      { labelKey: "nav.miniSkidSteers", href: "/equipment/mini-skid-steers" },
    ],
  },
  // {
  //   labelKey: "nav.attachments",
  //   href: "/attachments",
  //   hasDropdown: true,
  //   dropdownItems: [
  //     { labelKey: "nav.miniExcavatorAttachments", href: "/attachments/mini-excavator" },
  //     { labelKey: "nav.miniSkidSteerAttachments", href: "/attachments/mini-skid-steer" },
  //   ],
  // },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.blog", href: "/media" },
  {
    labelKey: "nav.support",
    href: "/support",
    hasDropdown: true,
    dropdownItems: [
      { labelKey: "nav.supportCenter", href: "/support" },
      { labelKey: "nav.orderPurchaseSupport", href: "/support/order-purchase-support" },
      { labelKey: "nav.shippingDelivery", href: "/support/shipping-delivery" },
      { labelKey: "nav.warrantyReturns", href: "/support/warranty-returns" },
      { labelKey: "nav.machineGuidance", href: "/support/machine-guidance" },
      { labelKey: "nav.attachmentsSupport", href: "/support/attachments-support" },
      { labelKey: "nav.contactSupport", href: "/support/contact-support" },
    ],
  },
];

const DropdownArrow = () => (
  <svg width="8" height="5" viewBox="0 0 10 7" fill="none" className="ml-1.5 mt-0.5">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

interface KonstructzLogoProps {
  height: number;
  isDark: boolean;
}

export const KonstructzLogo: React.FC<KonstructzLogoProps> = ({ height, isDark }) => {
  const scale = height / 1022;

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    position: "relative",
    height: `${height}px`,
    width: `${(995.88 - 82.1 + 172.2 + 2656) * scale}px`,
    alignItems: "flex-start",
    gap: `${172.2 * scale}px`,
    userSelect: "none",
    paddingTop: `${200 * scale}px`,
    paddingBottom: `${200 * scale}px`,
    boxSizing: "content-box",
  };

  const logoStyle: React.CSSProperties = {
    marginTop: `${-52.6 * scale}px`,
    marginLeft: `${-82.1 * scale}px`,
    height: `${1118.31 * scale}px`,
    width: `${995.88 * scale}px`,
    flexShrink: 0,
    transition: "filter 0.3s ease",
    filter: "none",
  };

  const textContainerStyle: React.CSSProperties = {
    marginTop: `${76 * scale}px`,
    display: "flex",
    flexDirection: "column",
    gap: `${87.5 * scale}px`,
    height: `${806 * scale}px`,
    width: `${2656 * scale}px`,
    flexShrink: 0,
  };

  const wordmarkStyle: React.CSSProperties = {
    height: `${435 * scale}px`,
    width: `${2639 * scale}px`,
    aspectRatio: 6.07,
    flexShrink: 0,
    transition: "filter 0.3s ease",
    filter: "none",
  };

  const taglineStyle: React.CSSProperties = {
    marginLeft: `${13.2 * scale}px`,
    height: `${205.2 * scale}px`,
    width: `${2629.06 * scale}px`,
    flexShrink: 0,
    transition: "filter 0.3s ease",
    filter: isDark ? "none" : "brightness(0) invert(1)",
  };

  return (
    <div style={wrapperStyle} className="pointer-events-none">
      <img
        style={logoStyle}
        alt="KONSTRUCTZ wolf logo"
        src="/img/vector.png"
        draggable={false}
      />
      <div style={textContainerStyle}>
        <img
          style={wordmarkStyle}
          alt="KONSTRUCTZ"
          src="/img/scoopy-dig-png-3-1-5.png"
          draggable={false}
        />
        <img
          style={taglineStyle}
          alt="Construct the Future"
          src="/img/construct-the-future.png"
          draggable={false}
        />
      </div>
    </div>
  );
};

const headerActionTextClass =
  "[font-family:'Clofie-Regular',Helvetica] text-[14px] font-normal leading-none tracking-[0] transition-colors";

const SearchIcon: React.FC<{ label: string; className: string }> = ({ label, className }) => (
  <Link
    to="/equipment"
    aria-label={label}
    className={className}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      className="transition-colors"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21L16.65 16.65" strokeLinecap="round" />
    </svg>
  </Link>
);

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, languages, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  // First-load entrance: header starts above the screen, drops in after 2.1s.
  // `reduceMotion` skips the animation entirely for users who request it.
  const [navEntered, setNavEntered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const isDarkHeroPage =
    location.pathname === "/" ||
    location.pathname === "/about" ||
    (location.pathname.startsWith("/equipment/") &&
      location.pathname !== "/equipment" &&
      location.pathname !== "/equipment/konstructz-machine");

  const useLightHeader =
    theme === "dark" || (theme === "light" && isDarkHeroPage && !scrolled);

  const getActionButtonClass = (extraClasses: string = "") => {
    const base =
      "flex h-[32px] items-center justify-center border shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition-all duration-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#68825B]";

    if (scrolled) {
      return `${base} border-theme-border/95 bg-theme-bg/20 text-theme-text hover:border-theme-border hover:bg-theme-border/10 hover:text-theme-accent ${extraClasses}`;
    } else if (useLightHeader) {
      return `${base} border-[#68825B]/70 bg-black/20 text-white hover:border-[#68825B] hover:bg-white/10 hover:text-theme-accent ${extraClasses}`;
    } else {
      return `${base} border-[#153d28]/35 bg-black/5 text-[#212121] hover:border-[#153d28] hover:bg-black/10 hover:text-[#153d28] ${extraClasses}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsOpen(false);
        setMobileExpanded(null);
        setMobileLangOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setIsOpen(false);
        setMobileExpanded(null);
        setMobileLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth / DESIGN_WIDTH);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
  }, [location]);

  // Premium first-load entrance — runs once on mount only, never on scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
      setNavEntered(true);
      return;
    }
    const timer = window.setTimeout(() => setNavEntered(true), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  // One transition declaration covers BOTH the entrance properties (opacity /
  // transform / filter) and the scroll-state properties (background, border,
  // shadow, color). Each gets its own duration so the cinematic drop-in is
  // smooth while the on-scroll bg switch stays snappy at 300ms.
  const entranceTransition = reduceMotion
    ? "none"
    : [
        "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        "transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
        "filter 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        "background-color 300ms ease",
        "backdrop-filter 300ms ease",
        "border-color 300ms ease",
        "box-shadow 300ms ease",
        "color 300ms ease",
      ].join(", ");

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 ${
        scrolled
          ? "bg-theme-bg/95 backdrop-blur-sm shadow-lg border-b border-theme-border text-theme-text"
          : "bg-transparent"
      }`}
      style={{
        height: isMobile ? MOBILE_NAV_HEIGHT : NAV_HEIGHT * scale,
        opacity: reduceMotion ? 1 : navEntered ? 1 : 0,
        transform: reduceMotion ? "none" : navEntered ? "translate3d(0,0,0)" : "translate3d(0,-100%,0)",
        filter: reduceMotion ? "none" : navEntered ? "none" : "blur(8px)",
        transition: entranceTransition,
        willChange: navEntered ? "auto" : "opacity, transform, filter",
      }}
    >
      {/* Desktop bar — scaled 1920 design space */}
      <div
        className="hidden lg:block origin-top-left"
        style={{ width: DESIGN_WIDTH, transform: `scale(${scale})` }}
      >
        <div
          className={`flex items-center w-[1920px] pl-[125px] pr-[212px] transition-colors duration-300 ${
            scrolled
              ? "text-theme-text"
              : useLightHeader
                ? "text-white"
                : "text-[#212121]"
          }`}
          style={{ height: NAV_HEIGHT }}
        >
          {/* Logo (left edge at x=125) */}
          <Link to="/" className="shrink-0" aria-label={t("auto.navbar.go.to.homepage")}>
            <KonstructzLogo height={61.6} isDark={theme === "light" && !useLightHeader} />
          </Link>

          {/* Primary nav */}
          <div className="flex items-center ml-[340px] gap-[40px] h-full">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));
              const itemLabel = t(item.labelKey);
              const isDropdownOpen = activeDropdown === item.labelKey;

              return (
                <div
                  key={item.labelKey}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.labelKey)}
                  onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    onClick={(e) => {
                      if (item.hasDropdown) {
                        if (activeDropdown !== item.labelKey) {
                          e.preventDefault();
                          setActiveDropdown(item.labelKey);
                        } else {
                          setActiveDropdown(null);
                        }
                      }
                    }}
                    className={`flex items-center [font-family:'Clofie-Regular',Helvetica] text-[15px] font-normal leading-normal tracking-[0] transition-colors duration-200 hover:text-theme-accent ${
                      isActive
                        ? "text-theme-accent"
                        : scrolled
                          ? "text-theme-text"
                          : useLightHeader
                            ? "text-white/95 hover:text-white"
                            : "text-[#212121] hover:text-[#153d28]"
                    }`}
                  >
                    {itemLabel}
                    {item.hasDropdown && <DropdownArrow />}
                  </Link>

                  {/* Desktop Dropdown */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div
                      className={`absolute top-full left-0 bg-theme-bg/95 backdrop-blur-sm border border-theme-border shadow-2xl rounded py-1.5 transition-all duration-300 origin-top z-50 w-[233px] ${
                        isDropdownOpen
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                      }`}
                    >
                      {item.dropdownItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.labelKey}
                            to={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-2 text-[13px] transition-colors font-googleSans ${
                              isSubActive
                                ? "text-theme-accent bg-theme-border/10"
                                : "text-theme-muted hover:text-theme-accent hover:bg-theme-border/20"
                            }`}
                          >
                            {t(subItem.labelKey)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right cluster (right edge at x=1708) */}
          <div className="flex items-center ml-auto gap-[8px] shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={getActionButtonClass("w-[32px] cursor-pointer rounded-[3px]")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <SearchIcon
              label={t("action.searchEquipment")}
              className={getActionButtonClass("w-[32px] shrink-0 cursor-pointer rounded-[3px] group")}
            />

            <div className="relative" id="language-switcher-container">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "language" ? null : "language")}
                className={getActionButtonClass("w-[32px] cursor-pointer rounded-[3px]")}
                aria-haspopup="listbox"
                aria-expanded={activeDropdown === "language"}
                aria-label={t("language.selectCurrent", { values: { language } })}
                title={t("language.selectCurrent", { values: { language } })}
              >
                <FlagIcon code={language} />
              </button>

              {/* Language Dropdown */}
              <div
                className={`absolute right-0 mt-2 bg-[#212121] border border-[#68825B] shadow-2xl rounded p-2 transition-all duration-300 origin-top-right z-50 grid grid-cols-4 gap-1.5 w-[138px] ${
                  activeDropdown === "language"
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                }`}
                role="listbox"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setActiveDropdown(null);
                      console.log(`Language changed to ${lang.name} (${lang.code})`);
                    }}
                    type="button"
                    title={lang.name}
                    aria-label={t("language.switchTo", { values: { language: lang.name } })}
                    className={`flex items-center justify-center h-6 w-6 rounded transition-colors cursor-pointer hover:bg-[#68825B]/25 ${
                      language === lang.code
                        ? "bg-[#68825B]/40 border border-[#DDC49A]"
                        : "border-transparent"
                    }`}
                  >
                    <FlagIcon code={lang.code} />
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className={`flex h-[32px] min-w-[98px] items-center justify-center border rounded-[3px] px-[15px] cursor-pointer bg-transparent transition-all duration-200 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#68825B] ${
                scrolled
                  ? "border-theme-border text-theme-text hover:bg-theme-border/10"
                  : useLightHeader
                    ? "border-[#68825B] text-white hover:bg-white/10"
                    : "border-[#153d28] text-[#212121] hover:bg-black/5"
              }`}
            >
              <span className={`${headerActionTextClass} whitespace-nowrap`}>
                {t("action.getAQuote")}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile bar — real pixels */}
      <div
        className={`lg:hidden flex items-center justify-between h-full px-4 transition-colors duration-300 ${
          scrolled
            ? "text-theme-text"
            : useLightHeader
              ? "text-white"
              : "text-[#212121]"
        }`}
      >
        <Link to="/" className="shrink-0" aria-label={t("auto.navbar.go.to.homepage")}>
          <KonstructzLogo height={36.96} isDark={theme === "light" && !useLightHeader} />
        </Link>
        <div
          className={`fixed right-3 top-[10px] z-[60] flex shrink-0 items-center gap-1.5 transition-opacity ${
            isOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center cursor-pointer transition-colors hover:text-theme-accent"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex h-8 w-8 items-center justify-center transition-colors hover:text-theme-accent"
            aria-label={t("auto.navbar.toggle.menu")}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 max-w-xs w-full bg-theme-bg border-l border-theme-border shadow-2xl z-50 p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-theme-border pb-4">
          <span className="[font-family:'Mission_X-Regular',Helvetica] text-theme-text text-xl tracking-wider">
            KONSTRUCTZ
          </span>
          <button onClick={() => setIsOpen(false)} className="text-theme-muted hover:text-theme-text">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-6 [font-family:'Clofie-Regular',Helvetica] text-xl text-theme-text">
          {navItems.map((item) => {
            const itemLabel = t(item.labelKey);
            const isExpanded = mobileExpanded === item.labelKey;
            return (
              <li key={item.labelKey} className="flex flex-col">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.labelKey)}
                      className={`flex items-center justify-between w-full hover:text-theme-accent transition-colors py-1 ${
                        location.pathname.startsWith(item.href) ? "text-theme-accent" : ""
                      }`}
                    >
                      <span>{itemLabel}</span>
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 10 7"
                        fill="none"
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    {/* Mobile Dropdown Inline Accordion */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-[400px] opacity-100 mt-2 pl-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="flex flex-col gap-3 border-l border-theme-border pl-4 py-1 text-base text-theme-muted">
                        {/* Link to main landing page */}
                        <li>
                          <Link
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className="hover:text-theme-accent transition-colors block py-1"
                          >
                            {t("nav.allLabel", { values: { label: itemLabel } })}
                          </Link>
                        </li>
                        {item.dropdownItems?.map((subItem) => (
                          <li key={subItem.labelKey}>
                            <Link
                              to={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className={`hover:text-theme-accent transition-colors block py-1 ${
                                location.pathname === subItem.href ? "text-theme-accent" : ""
                              }`}
                            >
                              {t(subItem.labelKey)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center hover:text-theme-accent transition-colors py-1 ${
                      location.pathname === item.href ? "text-theme-accent" : ""
                    }`}
                  >
                    {itemLabel}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 pt-6 border-t border-theme-border flex flex-col gap-4">
          <div className="relative" id="mobile-language-switcher-container">
            <button
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
              type="button"
              className="flex items-center justify-between w-full [font-family:'Clofie-Regular',Helvetica] text-theme-text text-lg hover:text-theme-accent transition-colors cursor-pointer text-left"
              aria-label={t("language.selectCurrent", { values: { language } })}
            >
              <span className="flex items-center gap-2">
                <span>{t("language.label")}:</span>
                <FlagIcon code={language} />
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 10 7"
                fill="none"
                className={`transition-transform duration-200 ${mobileLangOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileLangOpen ? "max-h-[300px] opacity-100 mt-2 pl-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-2 border-l border-theme-border pl-4 py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setMobileLangOpen(false);
                      setIsOpen(false);
                    }}
                    type="button"
                    aria-label={t("language.switchTo", { values: { language: lang.name } })}
                    className={`flex items-center gap-2 text-left text-sm py-1.5 font-googleSans transition-colors cursor-pointer ${
                      language === lang.code ? "text-theme-accent font-semibold" : "text-theme-muted hover:text-theme-accent"
                    }`}
                  >
                    <FlagIcon code={lang.code} />
                    <span>{lang.name} ({lang.code})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/contact"
            className="text-center py-3 px-5 [font-family:'Clofie-Regular',Helvetica] text-lg leading-none text-theme-text border border-theme-border/95 bg-theme-bg/20 hover:border-theme-border hover:bg-theme-border/10 hover:text-theme-accent active:translate-y-px transition-all duration-200"
          >
            {t("action.getAQuote")}
          </Link>
        </div>
      </div>
    </nav>
  );
};
