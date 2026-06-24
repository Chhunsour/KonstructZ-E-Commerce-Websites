import { useI18n } from "../../../../context/I18nContext";
import { Link } from "react-router-dom";

export const HeroIntroSection = (): JSX.Element => {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="hero-intro-heading"
      className="absolute top-0 left-0 h-[1080px] w-[1920px]"
    >
      <div className="relative h-[1080px] overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-[1080px] w-[1920px] bg-[#d9d9d9]"
        />
        <img
          className="absolute left-0 top-0 h-[1080px] w-[1920px] object-cover aspect-[1.5]"
          alt={t("auto.herointro.manager.meeting.with")}
          src="/img/manager-meeting-with-engineer-outdoor-site-stack-hand-teamwork-1.png"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-transparent z-[1]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[-698px] top-[944px] h-[1058px] w-[1608px] rotate-[22.63deg] bg-theme-bg blur-[289.75px] transition-colors duration-200 z-[2]"
        />
        <nav
          aria-label="Breadcrumb"
          className="absolute left-[125px] top-[260px] z-10"
        >
          <ol className="m-0 list-none p-0">
            <li className="relative flex h-[38px] items-center">
              <Link
                to="/"
                className="group inline-flex items-center text-white"
              >
                <img
                  className="h-[38px] w-[38px] shrink-0"
                  alt={t("auto.herointro.home")}
                  src="/img/home.svg"
                />
                <span className="absolute left-[45px] top-[8px] [font-family:'Google_Sans_Flex',Helvetica] text-[22px] font-normal leading-[normal] tracking-[0] text-white">{t("auto.herointro.home")}</span>
              </Link>
            </li>
          </ol>
        </nav>
        <div className="absolute left-[125px] top-[336px] w-[778px] z-10">
          <h1
            id="hero-intro-heading"
            className="[font-family:'Clofie-Bold',Helvetica] text-[48px] font-bold leading-[54px] tracking-[0] text-white"
          >{t("auto.herointro.affordable.machinery.reliable")}</h1>
        </div>
        <p className="absolute left-[125px] top-[549px] w-[1079px] [font-family:'Glonimove-Regular',Helvetica] text-[24px] font-normal leading-relaxed tracking-[0] text-white z-10">
          Konstructz exists to put dependable construction machinery within
          reach of the people who actually swing the hammer — small contractors,
          landscapers, farmers, and family-run job shops. Every machine and
          attachment in our catalogue is chosen for daily-driver reliability,
          honest pricing, and serviceability you can plan around. Based in
          Commerce, California, with a small, accountable team and online
          support around the clock.
        </p>
      </div>
    </section>
  );
};
