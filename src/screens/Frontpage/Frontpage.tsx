import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { AnimaScaler } from "../../components/layout/AnimaScaler";
import { MobileFrontpage } from "./MobileFrontpage";
import { BrandShowcaseSection } from "./sections/BrandShowcaseSection";
import { FeatureHighlightsSection } from "./sections/FeatureHighlightsSection";
import { OurWarehouseSection } from "./sections/OurWarehouseSection";
import { ProductCarouselSection } from "./sections/ProductCarouselSection";
import { ScheduleAppointmentSection } from "./sections/ScheduleAppointmentSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";

import { BlogSection } from "./sections/BlogSection/BlogSection";

import { MachineLogoSlider } from "../../components/sections/MachineLogoSlider";
import { Reveal } from "../../components/Reveal";
import "../../styles/home-reveal.css";

export const Frontpage = (): JSX.Element => {
  const { t } = useI18n();
  const [activeModel, setActiveModel] = useState<"v950" | "v980">("v950");
  const v950Ref = useRef<HTMLVideoElement>(null);
  const v980Ref = useRef<HTMLVideoElement>(null);
  const activeEquipmentSlug = activeModel === "v950" ? "stomp-v950" : "stomp-v980";
  const activeEquipmentName = activeModel === "v950" ? "STOMP V950" : "STOMP V980";

  useEffect(() => {
    if (activeModel === "v950") {
      if (v950Ref.current) {
        v950Ref.current.currentTime = 0;
        v950Ref.current.play().catch((err) => console.log("v950 play error", err));
      }
      if (v980Ref.current) {
        v980Ref.current.pause();
      }
    } else {
      if (v980Ref.current) {
        v980Ref.current.currentTime = 0;
        v980Ref.current.play().catch((err) => console.log("v980 play error", err));
      }
      if (v950Ref.current) {
        v950Ref.current.pause();
      }
    }
  }, [activeModel]);

  return (
    <AnimaScaler bgColor="var(--theme-sec)" mobile={<MobileFrontpage />}>
    <div
      className="home-reveal-scope bg-theme-sec text-theme-text overflow-hidden w-[1920px] relative transition-colors duration-200"
      style={{ minHeight: "9547px" }}
    >
      <div
        className="absolute top-0 left-0 w-[1920px] h-[120px] bg-theme-sec transition-colors duration-200"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 w-[1920px] h-[1080px] bg-theme-sec transition-colors duration-200"
        aria-hidden="true"
      />
      <video
        ref={v950Ref}
        className="absolute top-0 left-0 w-[1919px] h-[1080px] aspect-[1.78] object-cover transition-opacity duration-1000 ease-in-out"
        src="/video/banner-konstructz.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label={t("auto.frontpage.konstructz.hero.background")}
        style={{ opacity: activeModel === "v950" ? 1 : 0, zIndex: activeModel === "v950" ? 1 : 0 }}
        onEnded={() => setActiveModel("v980")}
      />
      <video
        ref={v980Ref}
        className="absolute top-0 left-0 w-[1919px] h-[1080px] aspect-[1.78] object-cover transition-opacity duration-1000 ease-in-out"
        src="/video/skid-steer-v980-banner.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="STOMP V980 Hero Video"
        style={{ opacity: activeModel === "v980" ? 1 : 0, zIndex: activeModel === "v980" ? 1 : 0 }}
        onEnded={() => setActiveModel("v950")}
      />

      {/* Left-side cinematic vignette — no visible edges, just a soft darkening
          so the headline reads cleanly. Two stacked radial gradients fade
          smoothly into the video; no clip-paths, no hard polygon edges. */}
      <Reveal
        variant="fade"
        delay={1600}
        ariaHidden
        className="absolute top-0 left-0 w-[1200px] h-[1080px] pointer-events-none z-10"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 18% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0) 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0) 55%)",
          }}
        />
      </Reveal>

      {/* Hero text overlay — waits for the video to land, then drops in */}
      <Reveal
        variant="fall"
        delay={2100}
        className="absolute top-[364px] left-[125px] flex items-center justify-center px-5 h-[53px] border-[3px] border-solid border-[#d8c79a] bg-black/10 backdrop-blur-[1px] z-20"
        style={{ boxShadow: "0 0 24px rgba(216,199,154,0.25)" }}
      >
        <span
          className="[font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[30px] tracking-[0] leading-none whitespace-nowrap"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}
        >
          {t("auto.frontpage.mini.skid.steer")}
        </span>
      </Reveal>
      <Reveal
        as="h1"
        variant="cinematic"
        delay={2400}
        className="absolute top-[448px] left-[125px] w-[817px] [text-shadow:-6px_5px_10.4px_#00000040] [font-family:'Mission_X-Regular',Helvetica] font-normal text-transparent text-[87px] tracking-[0] leading-[normal] z-20"
      >
        <span className="text-white">KONSTRUCTZ </span>
        <span className="text-[#d8c79a]">
          {activeModel === "v950" ? t("auto.frontpage.stomp.v950") : "STOMP V980"}
        </span>
      </Reveal>

      <Reveal
        variant="fade"
        delay={2550}
        className="absolute top-[683px] left-[125px] z-20"
      >
        <Link
          to={`/equipment/${activeEquipmentSlug}`}
          aria-label={`View ${activeEquipmentName} equipment`}
          className="inline-flex h-[58px] min-w-[202px] items-center justify-center border-[3px] border-solid border-[#d8c79a] bg-[#d8c79a] px-7 font-googleSans text-[18px] font-bold text-[#153d28] shadow-[0_18px_44px_rgba(0,0,0,0.34)] transition-colors duration-200 hover:bg-transparent hover:text-[#d8c79a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8c79a]"
        >
          View Equipment
        </Link>
      </Reveal>

      {/* Model Switcher Buttons */}
      <Reveal
        variant="fade"
        delay={2600}
        className="absolute top-[927px] flex items-center gap-1.5 p-1 bg-black/45 backdrop-blur-md border border-white/10 z-20"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <button
          type="button"
          onClick={() => setActiveModel("v950")}
          className={`px-5 py-2 font-googleSans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            activeModel === "v950"
              ? "bg-[#d8c79a] text-[#153d28]"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          STOMP V950
        </button>
        <button
          type="button"
          onClick={() => setActiveModel("v980")}
          className={`px-5 py-2 font-googleSans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
            activeModel === "v980"
              ? "bg-[#d8c79a] text-[#153d28]"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          STOMP V980
        </button>
      </Reveal>

      {/* Partner brands bar — fade only, never transform (marquee keeps running) */}
      <Reveal
        as="section"
        variant="fade"
        ariaLabel={t("auto.frontpage.partner.brands")}
        className="absolute top-[1080px] left-0 w-[1920px] h-[127px] overflow-hidden bg-[#070806]"
      >
        <MachineLogoSlider className="py-0 h-full border-y-0" />
      </Reveal>

      {/* Everything below the engine band is shifted up now that engine band is removed */}
      <div className="absolute left-0 top-0 w-[1920px]">

      {/* Promotional imagery */}
      <Reveal
        as="section"
        variant="zoom"
        ariaLabel={t("auto.frontpage.promotional.imagery")}
        className="absolute top-[1206px] left-0 w-[1920px] h-[900px] bg-[#d9d9d9]"
      >
        <img
          className="absolute top-0 left-[720px] w-[1200px] h-[900px] object-cover"
          alt="Rectangle"
          src="/img/rectangle-9581.png"
        />
        <div
          className="absolute top-[450px] left-0 w-[720px] h-[450px] bg-[#114f2f]"
          aria-hidden="true"
        />
        <img
          className="absolute top-[450px] left-0 w-[720px] h-[450px] aspect-[1.6]"
          alt={t("auto.frontpage.equipment.showcase")}
          src="/img/remove-the-white-background-and-202605291020-1.png"
        />
        <div
          className="absolute top-0 left-0 w-[720px] h-[450px] bg-[#e22c2c]"
          aria-hidden="true"
        />
        <img
          className="absolute top-0 left-0 w-[720px] h-[450px] aspect-[1.61]"
          alt={t("auto.frontpage.equipment.showcase")}
          src="/img/change-the-aspect-ratio-to-202605291023-1.png"
        />
      </Reveal>

      {/*
        These section components root themselves with position: absolute relative
        to the AnimaScaler canvas (top: 2106px, 3846px, etc.). Wrapping them with
        <Reveal> would create a transform-based containing block, collapsing them
        to 0 height. Their own internal Reveal usage (see WhyChooseUsSection) is
        where the scroll-in animations live.
      */}
      <section aria-label={t("auto.frontpage.product.carousel")}>
        <ProductCarouselSection />
      </section>
      <section aria-label={t("auto.frontpage.brand.showcase")}>
        <BrandShowcaseSection />
      </section>
      <section aria-label={t("auto.frontpage.feature.highlights")}>
        <FeatureHighlightsSection />
      </section>
      <section aria-label={t("auto.frontpage.schedule.appointment")}>
        <ScheduleAppointmentSection />
      </section>
      <section aria-label={t("auto.frontpage.our.warehouse")}>
        <OurWarehouseSection />
      </section>
      <section aria-label="Latest Blog Posts">
        <BlogSection />
      </section>
      {/* Inner card stagger lives inside WhyChooseUsSection. */}
      <section aria-label={t("auto.frontpage.why.choose.us")}>
        <WhyChooseUsSection />
      </section>
      </div>
    </div>
    </AnimaScaler>
  );
};
