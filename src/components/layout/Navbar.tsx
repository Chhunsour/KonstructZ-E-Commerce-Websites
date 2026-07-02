import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../context/I18nContext";
import { type LanguageCode } from "../../i18n/dictionaries";
import { FlagIcon } from "../ui/FlagIcons";
import { CartButton } from "../cart/CartButton";
import { Icons } from "../support/SupportKit";

// Real SVG asset files (public/icons/equipment) — filled machinery
// silhouettes, one per category. Referenced by URL and rendered as <img>.
const ICON = "/icons/equipment";

const DESIGN_WIDTH = 1920;
const NAV_HEIGHT = 76;
const MOBILE_NAV_HEIGHT = 53;
const MOBILE_BREAKPOINT = 1024;

// Static labels keep the equipment dropdown readable and avoid leaking raw
// translation keys into the menu.
type EquipmentDropdownLink = {
  label: string;
  href: string;
  icon: string;
  context?: string;
};

// Navigation lists will be compiled dynamically inside the component to react to translation state.

const navItems = [
  { labelKey: "nav.home", href: "/" },
  {
    labelKey: "nav.equipment",
    href: "/categories",
    hasDropdown: true,
    isMega: true,
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
  { labelKey: "nav.blog", href: "/blog" },
  {
    labelKey: "nav.support",
    href: "/support",
    hasDropdown: true,
    dropdownItems: [
      { labelKey: "nav.supportCenter", href: "/support", icon: "info" },
      { labelKey: "nav.orderPurchaseSupport", href: "/support/order-purchase-support", icon: "order" },
      { labelKey: "nav.shippingDelivery", href: "/support/shipping-delivery", icon: "shipping" },
      { labelKey: "nav.warrantyReturns", href: "/support/warranty-returns", icon: "warranty" },
      { labelKey: "nav.machineGuidance", href: "/support/machine-guidance", icon: "machine" },
      { labelKey: "nav.attachmentsSupport", href: "/support/attachments-support", icon: "attachments" },
      { labelKey: "nav.contactSupport", href: "/support/contact-support", icon: "contact" },
    ],
  },
];

const darkHeaderTopRoutes = [
  "/",
  "/about",
  "/categories",
  "/quality-equipment",
  "/trusted-support",
  "/job-site-ready",
  "/long-term-value",
];

const isDarkHeaderTopRoute = (pathname: string) =>
  darkHeaderTopRoutes.includes(pathname) ||
  pathname.startsWith("/product/");

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
        className="k-wolf-breath"
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
  "font-googleSans text-[13px] font-medium leading-none tracking-[0] transition-colors";

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
  
  const allProductsLink: EquipmentDropdownLink = {
    label: t("category.all"),
    context: "Konstructz",
    href: "/categories",
    icon: `${ICON}/all-equipment.svg`,
  };

  const konstructzProductLinks: EquipmentDropdownLink[] = [
    { label: t("nav.miniSkidSteers"), href: "/product/mini-skid-steers", icon: `${ICON}/skid-steer.svg` },
    { label: t("nav.miniExcavators"), href: "/product/mini-excavators", icon: `${ICON}/mini-excavator.svg` },
    { label: t("nav.backhoeLoaders"), href: "/product/backhoe-loaders", icon: `${ICON}/backhoe-loader.svg` },
    { label: t("nav.wheelLoaders"), href: "/product/wheel-loaders", icon: `${ICON}/wheel-loader.svg` },
    { label: t("nav.dumpers"), href: "/product/dumpers", icon: `${ICON}/dumper.svg` },
    { label: t("nav.trenchers"), href: "/product/trenchers", icon: `${ICON}/trencher.svg` },
    { label: t("nav.towableExcavators"), href: "/product/towable-excavators", icon: `${ICON}/towable-excavator.svg` },
    { label: t("nav.stoneCrushers"), href: "/product/stone-crushers", icon: `${ICON}/stone-crusher.svg` },
  ];

  const typhonMachineryLinks: EquipmentDropdownLink[] = [
    { label: t("nav.typhonAllEquipment"), href: "/equipment", icon: `${ICON}/all-equipment.svg` },
    { label: t("nav.attachmentsSupport"), href: "/equipment?type=attachments", icon: `${ICON}/attachment.svg` },
    { label: t("nav.typhonForklifts"), href: "/equipment?category=forklifts", icon: `${ICON}/forklift.svg` },
    { label: t("nav.typhonMiniExcavators"), href: "/equipment?category=mini-excavators", icon: `${ICON}/mini-excavator.svg` },
    { label: t("nav.typhonRoadRollers"), href: "/equipment?category=road-rollers", icon: `${ICON}/road-roller.svg` },
    { label: t("nav.typhonScissorLifts"), href: "/equipment?category=scissor-lifts", icon: `${ICON}/scissor-lift.svg` },
    { label: t("nav.typhonSkidSteerLoaders"), href: "/equipment?category=skid-steer-loaders", icon: `${ICON}/skid-steer.svg` },
    { label: t("nav.typhonWheelLoaders"), href: "/equipment?category=wheel-loaders", icon: `${ICON}/wheel-loader.svg` },
  ];
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileTyphonOpen, setMobileTyphonOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  // First-load entrance: header starts above the screen, drops in after 2.1s.
  // `reduceMotion` skips the animation entirely for users who request it.
  // The drop-in plays ONLY on the front page ("/"), and replays on every reload
  // of it. On any other page the header is shown instantly (navEntered starts
  // true). Gated by window.location at mount so a front-page reload animates.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [reduceMotion] = useState(prefersReducedMotion);
  const [navEntered, setNavEntered] = useState(() => {
    if (typeof window === "undefined") return false;
    if (prefersReducedMotion) return true;
    return window.location.pathname !== "/"; // animate only on the front page
  });
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const currentPathWithSearch = location.pathname + location.search;
  const isEquipmentLinkActive = (href: string) =>
    href.includes("?") ? currentPathWithSearch === href : location.pathname === href;
  const isEquipmentRoute =
    location.pathname === "/categories" ||
    location.pathname.startsWith("/product/") ||
    location.pathname === "/equipment" ||
    location.pathname.startsWith("/typhon-machinery/");

  const isDarkHeroPage = isDarkHeaderTopRoute(location.pathname);

  const isLightPage =
    theme === "light" &&
    (location.pathname.startsWith("/typhon-machinery") ||
     location.pathname.startsWith("/equipment"));

  const useLightHeader =
    !isLightPage && (theme === "dark" || (theme === "light" && isDarkHeroPage && !scrolled));

  const getActionButtonClass = (extraClasses: string = "") => {
    const base =
      "flex h-9 items-center justify-center rounded-[4px] border-2 border-solid backdrop-blur-[10px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#68825B]";

    if (scrolled) {
      return `${base} border-theme-border/95 bg-theme-bg/45 text-theme-text hover:border-theme-accent hover:bg-theme-border/10 hover:text-theme-accent ${extraClasses}`;
    } else if (useLightHeader) {
      return `${base} border-[#68825B] bg-black/25 text-white hover:border-[#7f9a70] hover:bg-white/10 hover:text-theme-accent ${extraClasses}`;
    } else {
      return `${base} border-[#153d28] bg-white/70 text-[#212121] hover:border-[#153d28] hover:bg-white hover:text-[#153d28] ${extraClasses}`;
    }
  };

  const headerIconButtonClass = getActionButtonClass("w-9 shrink-0 cursor-pointer");
  const headerQuoteButtonClass = getActionButtonClass("min-w-[148px] px-4 cursor-pointer");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsOpen(false);
        setMobileExpanded(null);
        setMobileTyphonOpen(false);
        setMobileLangOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setIsOpen(false);
        setMobileExpanded(null);
        setMobileTyphonOpen(false);
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
    setMobileTyphonOpen(false);
  }, [location]);

  // Premium front-page entrance — runs once after mount, never on scroll.
  // navEntered only starts false on a fresh "/" load, so this drops the header
  // in there and is a no-op everywhere else.
  useEffect(() => {
    if (typeof window === "undefined" || navEntered || reduceMotion) return;
    const timer = window.setTimeout(() => setNavEntered(true), 2100);
    return () => window.clearTimeout(timer);
  }, [navEntered, reduceMotion]);

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
      className={`fixed top-0 left-0 w-full ${isOpen ? "z-[999999]" : "z-50"} ${
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
            <KonstructzLogo height={61.6} isDark={(theme === "light" && !useLightHeader) || isLightPage} />
          </Link>

          {/* Primary nav */}
          <div className="flex items-center ml-[340px] gap-[40px] h-full">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href)) ||
                // Equipment section also covers the /product/<slug> category pages.
                (item.href === "/categories" && isEquipmentRoute);
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
                  {item.hasDropdown && (item as any).isMega && (
                    <div
                      className={`absolute top-full left-0 bg-theme-bg/95 backdrop-blur-sm border border-theme-border shadow-2xl rounded p-4 transition-all duration-300 origin-top z-50 w-[500px] ${
                        isDropdownOpen
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-6 divide-x divide-theme-border/20">
                        {/* Column 1: Konstructz */}
                        <div className="flex flex-col gap-1">
                          <div className="px-3 pb-2 font-googleSans text-[10px] font-bold uppercase tracking-[0.16em] text-theme-accent/80">
                            Konstructz
                          </div>
                          
                          {/* All Products Link */}
                          {(() => {
                            const isSubActive = isEquipmentLinkActive(allProductsLink.href);
                            return (
                              <Link
                                to={allProductsLink.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-center gap-3 px-3 py-2 text-[13px] font-googleSans transition-colors rounded ${
                                  isSubActive
                                    ? "text-theme-accent bg-theme-border/10 font-bold"
                                    : "text-theme-muted hover:text-theme-accent hover:bg-theme-border/10"
                                }`}
                              >
                                <span
                                  style={{
                                    maskImage: `url(${allProductsLink.icon})`,
                                    WebkitMaskImage: `url(${allProductsLink.icon})`,
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskPosition: "center",
                                    WebkitMaskPosition: "center",
                                  }}
                                  className="w-[18px] h-[18px] shrink-0 bg-current transition-colors"
                                  aria-hidden="true"
                                />
                                <span className="block min-w-0 flex-1 truncate font-medium">
                                  {allProductsLink.label}
                                </span>
                              </Link>
                            );
                          })()}

                          {/* Konstructz Category Links */}
                          {konstructzProductLinks.map((link) => {
                            const isSubActive = isEquipmentLinkActive(link.href);
                            return (
                              <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-center gap-3 px-3 py-2 text-[13px] font-googleSans transition-colors rounded ${
                                  isSubActive
                                    ? "text-theme-accent bg-theme-border/10 font-bold"
                                    : "text-theme-muted hover:text-theme-accent hover:bg-theme-border/10"
                                }`}
                              >
                                <span
                                  style={{
                                    maskImage: `url(${link.icon})`,
                                    WebkitMaskImage: `url(${link.icon})`,
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskPosition: "center",
                                    WebkitMaskPosition: "center",
                                  }}
                                  className="w-[18px] h-[18px] shrink-0 bg-current transition-colors"
                                  aria-hidden="true"
                                />
                                <span className="block min-w-0 flex-1 truncate font-medium">
                                  {link.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Column 2: Typhon */}
                        <div className="flex flex-col gap-1 pl-6">
                          <div className="px-3 pb-2 font-googleSans text-[10px] font-bold uppercase tracking-[0.16em] text-theme-accent/80">
                            Typhon
                          </div>
                          {typhonMachineryLinks.map((link) => {
                            const isSubActive = isEquipmentLinkActive(link.href);
                            return (
                              <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-center gap-3 px-3 py-2 text-[13px] font-googleSans transition-colors rounded ${
                                  isSubActive
                                    ? "text-theme-accent bg-theme-border/10 font-bold"
                                    : "text-theme-muted hover:text-theme-accent hover:bg-theme-border/10"
                                }`}
                              >
                                <span
                                  style={{
                                    maskImage: `url(${link.icon})`,
                                    WebkitMaskImage: `url(${link.icon})`,
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskPosition: "center",
                                    WebkitMaskPosition: "center",
                                  }}
                                  className="w-[18px] h-[18px] shrink-0 bg-current transition-colors"
                                  aria-hidden="true"
                                />
                                <span className="block min-w-0 flex-1 truncate font-medium">
                                  {link.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Desktop Simple Dropdown — Support etc. */}
                  {item.hasDropdown && !(item as any).isMega && (item as any).dropdownItems && (
                    <div
                      className={`absolute top-full left-0 bg-theme-bg/95 backdrop-blur-sm border border-theme-border shadow-2xl rounded py-1.5 transition-all duration-300 origin-top z-50 w-[260px] ${
                        isDropdownOpen
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                      }`}
                    >
                      {(item as any).dropdownItems.map((subItem: any) => {
                        if (subItem.isSectionHeader) {
                          return (
                            <div
                              key={subItem.labelKey}
                              className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-theme-accent/80 border-t border-theme-border/20 mt-1 font-googleSans"
                            >
                              {t(subItem.labelKey)}
                            </div>
                          );
                        }
                        const isSubActive = location.pathname === subItem.href ||
                          (subItem.href.includes("?") && location.pathname + location.search === subItem.href);
                        const IconComponent = subItem.icon ? Icons[subItem.icon] : null;
                        return (
                          <Link
                            key={subItem.labelKey}
                            to={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors font-googleSans ${
                              isSubActive
                                ? "text-theme-accent bg-theme-border/10"
                                : "text-theme-muted hover:text-theme-accent hover:bg-theme-border/20"
                            }`}
                          >
                            {IconComponent && (
                              <span className="w-[18px] h-[18px] shrink-0">
                                <IconComponent />
                              </span>
                            )}
                            <span>{t(subItem.labelKey)}</span>
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
              className={headerIconButtonClass}
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
              className={`${headerIconButtonClass} group`}
            />

            <div className="relative" id="language-switcher-container">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "language" ? null : "language")}
                className={headerIconButtonClass}
                aria-haspopup="listbox"
                aria-expanded={activeDropdown === "language"}
                aria-label={t("language.selectCurrent", { values: { language } })}
                title={t("language.selectCurrent", { values: { language } })}
              >
                <FlagIcon code={language} />
              </button>

              {/* Language Dropdown */}
              <div
                className={`absolute right-0 mt-2 bg-[#212121] border border-[#68825B] shadow-2xl rounded p-1 transition-all duration-300 origin-top-right z-50 flex flex-col w-[160px] ${
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
                    className={`flex items-center gap-3 w-full px-3 py-2 text-left text-[13.5px] font-googleSans transition-colors cursor-pointer hover:bg-[#68825B]/25 text-white ${
                      language === lang.code
                        ? "bg-[#68825B]/40 text-[#DDC49A] font-bold"
                        : "text-white/80"
                    }`}
                  >
                    <span className="shrink-0 scale-110">
                      <FlagIcon code={lang.code} />
                    </span>
                    <span>{getNativeLanguageName(lang.code)}</span>
                  </button>
                ))}
              </div>
            </div>

            <CartButton
              className={headerIconButtonClass}
            />

            <Link
              to="/contact"
              className={headerQuoteButtonClass}
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
          <KonstructzLogo height={36.96} isDark={(theme === "light" && !useLightHeader) || isLightPage} />
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

          <CartButton className="flex h-8 w-8 items-center justify-center transition-colors hover:text-theme-accent" />

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
        className={`lg:hidden fixed right-0 top-0 h-[100dvh] max-w-xs w-full overflow-y-auto overscroll-contain border-l border-[#2d2d2d] bg-[#111] text-white shadow-2xl z-[999999] p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/12 pb-4">
          <span className="[font-family:'Mission_X-Regular',Helvetica] text-white text-xl tracking-wider">
            KONSTRUCTZ
          </span>
          <button onClick={() => setIsOpen(false)} className="text-white/65 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-6 [font-family:'Clofie-Regular',Helvetica] text-xl text-white">
          {navItems.map((item) => {
            const itemLabel = t(item.labelKey);
            const isExpanded = mobileExpanded === item.labelKey;
            return (
              <li key={item.labelKey} className="flex flex-col">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.labelKey)}
                      className={`flex items-center justify-between w-full hover:text-[#d8c79a] transition-colors py-1 ${
                        location.pathname.startsWith(item.href) ||
                        (item.href === "/categories" && isEquipmentRoute)
                          ? "text-[#d8c79a]"
                          : ""
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
                        isExpanded ? "max-h-[1200px] opacity-100 mt-2 pl-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      {(item as any).isMega ? (
                        <div className="flex flex-col border-l border-white/12 pl-3 py-1">
                          {(() => {
                            const isSubActive = isEquipmentLinkActive(allProductsLink.href);
                            return (
                              <Link
                                to={allProductsLink.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex min-h-[48px] items-center gap-3 px-2.5 py-2 transition-colors ${
                                  isSubActive ? "bg-[#d8c79a] text-[#153d28]" : "text-white hover:bg-white/[0.06]"
                                }`}
                              >
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${isSubActive ? "bg-[#153d28]/10" : "bg-[#0e0e0e]"}`}>
                                  <img src={allProductsLink.icon} alt="" aria-hidden="true" className="h-5 w-5" />
                                </span>
                                <span className="block min-w-0 flex-1 truncate font-googleSans text-[15px] font-bold leading-tight">
                                  {allProductsLink.label}
                                </span>
                              </Link>
                            );
                          })()}

                          <button
                            type="button"
                            onClick={() => setMobileTyphonOpen((open) => !open)}
                            className={`mt-1 flex min-h-[48px] items-center gap-3 px-2.5 py-2 text-left transition-colors ${
                              location.pathname === "/equipment"
                                ? "bg-[#d8c79a] text-[#153d28]"
                                : "text-white hover:bg-white/[0.06]"
                            }`}
                            aria-expanded={mobileTyphonOpen}
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${location.pathname === "/equipment" ? "bg-[#153d28]/10" : "bg-[#0e0e0e]"}`}>
                              <img src={`${ICON}/all-equipment.svg`} alt="" aria-hidden="true" className="h-5 w-5" />
                            </span>
                            <span className="block min-w-0 flex-1 truncate font-googleSans text-[15px] font-bold leading-tight">
                              Typhon
                            </span>
                            <svg
                              width="12"
                              height="8"
                              viewBox="0 0 10 7"
                              fill="none"
                              className={`shrink-0 transition-transform duration-200 ${mobileTyphonOpen ? "rotate-180" : ""}`}
                            >
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              mobileTyphonOpen ? "mt-1 max-h-[560px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="flex flex-col gap-1.5 pl-3">
                              {typhonMachineryLinks.map((link) => {
                                const isSubActive = isEquipmentLinkActive(link.href);
                                return (
                                  <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex min-h-[44px] items-center gap-3 px-2.5 py-2 transition-colors ${
                                      isSubActive ? "bg-[#d8c79a] text-[#153d28]" : "text-white/88 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                                  >
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${isSubActive ? "bg-[#153d28]/10" : "bg-[#0e0e0e]"}`}>
                                      <img src={link.icon} alt="" aria-hidden="true" className="h-5 w-5" />
                                    </span>
                                    <span className="block min-w-0 flex-1 truncate font-googleSans text-[14px] font-bold leading-tight">
                                      {link.label}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-3 border-t border-white/12 pt-3">
                            <p className="px-2 pb-2 font-googleSans text-[10px] font-bold uppercase tracking-[0.16em] text-[#d8c79a]/75">
                              Konstructz
                            </p>
                            <div className="flex flex-col gap-1.5">
                              {konstructzProductLinks.map((link) => {
                                const isSubActive = isEquipmentLinkActive(link.href);
                                return (
                                  <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex min-h-[48px] items-center gap-3 px-2.5 py-2 transition-colors ${
                                      isSubActive ? "bg-[#d8c79a] text-[#153d28]" : "text-white hover:bg-white/[0.06]"
                                    }`}
                                  >
                                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${isSubActive ? "bg-[#153d28]/10" : "bg-[#0e0e0e]"}`}>
                                      <img src={link.icon} alt="" aria-hidden="true" className="h-5 w-5" />
                                    </span>
                                    <span className="block min-w-0 flex-1 truncate font-googleSans text-[15px] font-bold leading-tight">
                                      {link.label}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ul className="flex flex-col gap-3 border-l border-white/12 pl-4 py-1 text-base text-white/70">
                          {/* Link to main landing page */}
                          <li>
                            <Link
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="hover:text-[#d8c79a] transition-colors flex items-center gap-3 py-1.5"
                            >
                              <span className="w-5 h-5 shrink-0 text-white/60">
                                <Icons.globe />
                              </span>
                              <span>{t("nav.allLabel", { values: { label: itemLabel } })}</span>
                            </Link>
                          </li>
                          {(item as any).dropdownItems?.map((subItem: any) => {
                            if (subItem.isSectionHeader) {
                              return (
                                <li key={subItem.labelKey} className="pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d8c79a]/80 border-t border-white/12 mt-1 font-googleSans">
                                  {t(subItem.labelKey)}
                                </li>
                              );
                            }
                            const IconComponent = subItem.icon ? Icons[subItem.icon] : null;
                            const isSubActive = location.pathname === subItem.href ||
                              (subItem.href.includes("?") && location.pathname + location.search === subItem.href);
                            return (
                              <li key={subItem.labelKey}>
                                <Link
                                  to={subItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className={`hover:text-[#d8c79a] transition-colors flex items-center gap-3 py-1.5 ${
                                    isSubActive ? "text-[#d8c79a]" : ""
                                  }`}
                                >
                                  {IconComponent && (
                                    <span className={`w-5 h-5 shrink-0 ${isSubActive ? "text-[#d8c79a]" : "text-white/60"}`}>
                                      <IconComponent />
                                    </span>
                                  )}
                                  <span>{t(subItem.labelKey)}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center hover:text-[#d8c79a] transition-colors py-1 ${
                      location.pathname === item.href ? "text-[#d8c79a]" : ""
                    }`}
                  >
                    {itemLabel}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 pt-6 border-t border-white/12 flex flex-col gap-4">
          <div className="relative" id="mobile-language-switcher-container">
            <button
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
              type="button"
              className="flex items-center justify-between w-full [font-family:'Clofie-Regular',Helvetica] text-white text-lg hover:text-[#d8c79a] transition-colors cursor-pointer text-left"
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
              <div className="flex flex-col gap-2 border-l border-white/12 pl-4 py-1">
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
                    className={`flex items-center gap-2.5 text-left text-[14.5px] py-2 font-googleSans transition-colors cursor-pointer ${
                      language === lang.code ? "text-[#d8c79a] font-semibold" : "text-white/70 hover:text-[#d8c79a]"
                    }`}
                  >
                    <FlagIcon code={lang.code} />
                    <span>{getNativeLanguageName(lang.code)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/contact"
            className="text-center py-3 px-5 [font-family:'Clofie-Regular',Helvetica] text-lg leading-none text-white border border-white/25 bg-white/[0.04] hover:border-[#d8c79a] hover:text-[#d8c79a] active:translate-y-px transition-all duration-200"
          >
            {t("action.getAQuote")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export function getNativeLanguageName(code: string): string {
  switch (code) {
    case "EN": return "English";
    case "FR": return "Français";
    case "JP": return "日本語";
    case "KR": return "한국어";
    case "ES": return "Español";
    case "CN": return "中文";
    case "IT": return "Italiano";
    case "DE": return "Deutsch";
    default: return code;
  }
}
