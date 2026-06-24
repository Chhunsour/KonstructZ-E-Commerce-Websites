import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const WheelLoaders: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Upcoming product details
  const upcomingProduct = {
    name: t("auto.wheelloaders.k.load.1200"),
    tagline: t("auto.wheelloaders.next.generation.heavy"),
    description: "The upcoming Konstructz K-LOAD 1200 is being engineered for bulk material handling — built around traction, loading rhythm, service access, and operator comfort. Final specifications will be published ahead of launch.",
    specs: [
      { label: t("auto.wheelloaders.operating.capacity"), value: "Varies by model" },
      { label: t("auto.wheelloaders.engine.power"), value: "Depends on final configuration" },
      { label: t("auto.wheelloaders.bucket.capacity"), value: "Varies by bucket selection" },
      { label: t("auto.wheelloaders.operating.weight"), value: "Based on selected setup" },
      { label: t("auto.wheelloaders.max.dump.height"), value: "Depends on loader and bucket setup" },
    ],
    features: [
      t("auto.wheelloaders.heavy.duty.articulated"),
      t("auto.wheelloaders.ergonomic.cabin.with"),
      t("auto.wheelloaders.tier.4.final"),
      t("auto.wheelloaders.pre.installed.load"),
    ]
  };

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.wheelloaders.konstructz.depot")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">Wheel Loaders</h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">{t("auto.wheelloaders.heavy.duty.loaders")}</p>
        </div>

        {/* Conceptual Preview Section */}
        <div className="bg-theme-card border border-theme-border/20 rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-lg max-w-5xl mx-auto transition-colors duration-200">
          {/* Conceptual Image / Visual */}
          <div className="lg:w-1/2 bg-theme-sec flex flex-col justify-center items-center p-12 text-center text-theme-accent relative min-h-[350px] transition-colors duration-200">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(var(--theme-accent-rgb),0.2)_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <span className="text-6xl mb-4 select-none animate-pulse">🚜</span>
            <span className="bg-brand-green border border-brand-sand text-brand-sand text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-2">{t("auto.wheelloaders.in.development")}</span>
            <h2 className="text-3xl font-heading text-theme-text">{upcomingProduct.name}</h2>
            <p className="text-theme-muted font-googleSans text-xs max-w-xs mt-2 leading-relaxed">{t("auto.wheelloaders.accepting.early.info")}</p>
          </div>

          {/* Product Data */}
          <div className="p-8 lg:w-1/2 flex flex-col justify-between bg-theme-card">
            <div>
              <span className="text-xs uppercase tracking-widest text-theme-accent font-googleSans font-bold block mb-1">{t("auto.wheelloaders.coming.soon")}</span>
              <h3 className="text-2xl font-heading text-theme-text">
                {upcomingProduct.tagline}
              </h3>
              <p className="text-theme-muted font-glonimove text-sm mt-3 leading-relaxed">
                {upcomingProduct.description}
              </p>

              {/* Specs */}
              <div className="my-6 space-y-2 font-googleSans text-xs text-theme-text">
                <h4 className="font-bold text-theme-accent uppercase tracking-wider text-xs border-b border-theme-border/20 pb-1 mb-2">Configuration Notes</h4>
                {upcomingProduct.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b border-theme-border/10 pb-1">
                    <span className="text-theme-muted">{spec.label}</span>
                    <span className="font-bold text-theme-text">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Features List */}
              <div className="mb-8 font-googleSans text-xs text-theme-muted">
                <h4 className="font-bold text-theme-accent uppercase tracking-wider mb-2">{t("auto.wheelloaders.expected.features")}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {upcomingProduct.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to={`/contact?interest=wheel-loader`}
              className="w-full text-center py-3 font-googleSans font-bold text-sm tracking-wider bg-theme-accent text-theme-bg hover:bg-brand-green hover:text-white transition-colors duration-300 uppercase rounded border border-theme-accent"
            >{t("auto.wheelloaders.request.early.spec")}</Link>
          </div>
        </div>

        <CategoryInfoSections
          categoryName="Wheel Loader"
          usedFor="A wheel loader is an articulated, four-wheel-drive front loader used to scoop, lift and transport bulk material — aggregate, soil, snow, mulch, demolition waste and feed. It is the workhorse for any operation that moves large volumes of loose material between piles, trucks and work areas."
          bestFor="Wheel loaders fit aggregate yards, recycling operations, snow and ice contractors, large landscapers, agricultural users, ready-mix plants and any commercial site that loads trucks or moves bulk material every day."
          benefits={[
            "Articulated chassis turns tight while keeping the bucket level",
            "Loader geometry can be matched to truck, hopper, and stockpile height requirements",
            "Wheeled travel is fast between piles and across paved yards",
            "Cab visibility designed for repetitive loading cycles",
            "Quick-coupler enables fast tool changes between buckets, forks and snow blades",
          ]}
          applications={[
            "Truck loading",
            "Aggregate handling",
            "Snow & ice",
            "Demolition cleanup",
            "Recycling yards",
            "Mulch & landscape supply",
            "Agriculture & feed",
          ]}
          compatibility="Konstructz wheel loaders are designed for a coupler-based attachment workflow — general purpose buckets, light-material buckets, pallet forks, grapples, snow plows and snow buckets. Confirm bucket size, coupler type and hydraulic flow before pairing tools."
          maintenance="Tire condition, articulation pivot pins, hydraulic oil and air filtration are the daily and weekly checks that keep a wheel loader productive. The Konstructz support team helps owners stay ahead of service intervals so loading cycles stay predictable."
          buyingTips={[
            "Size the bucket to the truck or hopper you load most often so cycle time and machine strain stay balanced.",
            "Check dump height and reach against the side of your loading targets, not just the spec sheet.",
            "Choose tire type for the surface — block tires for hard pavement, lug tires for soft ground.",
            "Plan attachment range — forks and snow tools dramatically increase the seasons a wheel loader earns in.",
          ]}
          faqs={[
            {
              q: "What is a wheel loader used for?",
              a: "Wheel loaders are used for loading trucks and hoppers, moving bulk aggregate and recycled material, clearing snow, handling pallets with forks, and moving demolition waste across a yard or site.",
            },
            {
              q: "Wheel loader vs skid steer — which should I buy?",
              a: "Wheel loaders are bigger, lift higher, carry more, and travel faster across long yards. Skid steers are more maneuverable in tight spaces and accept a wider attachment library. Pick based on volume per cycle and yard layout.",
            },
            {
              q: "When will the Konstructz K-LOAD 1200 be available?",
              a: "The K-LOAD 1200 is in development. Final spec and pricing publish ahead of launch — use the early-spec request button above to be notified first.",
            },
            {
              q: "Can a wheel loader run a snow plow?",
              a: "Yes. With a correctly matched snow blade, snow bucket, or pusher box, a wheel loader can support commercial snow and ice operations on lots, yards, and private roads.",
            },
          ]}
        />

      </div>
    </div>
  );
};

export default WheelLoaders;
