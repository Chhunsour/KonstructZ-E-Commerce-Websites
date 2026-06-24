import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const MiniSkidSteers: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "skid-steer-loaders"
  );

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.miniskidsteers.konstructz.depot")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">Skid Steer Loaders</h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">{t("auto.miniskidsteers.versatile.tight.turning")}</p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,293px))] justify-center gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-theme-card border border-theme-border/20 rounded max-w-lg mx-auto transition-colors duration-200">
            <span className="text-4xl">🚜</span>
            <h3 className="text-xl font-heading text-theme-heading mt-4">{t("auto.miniskidsteers.no.machinery.found")}</h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">{t("auto.miniskidsteers.currently.no.products")}</p>
          </div>
        )}

        <CategoryInfoSections
          categoryName="Skid Steer Loader"
          usedFor="A skid steer loader is a compact, highly maneuverable loader used for material handling, grading, loading trucks, snow clearing, demolition, landscaping, and running a wide library of work-tool attachments. Its zero-radius turning lets it work where wheel loaders cannot."
          bestFor="Skid steer loaders are a fit for general contractors, landscapers, snow and ice operators, agricultural users, rental fleets, and construction crews who need one machine that can swap roles across a job day."
          benefits={[
            "Tight-turning chassis for confined sites and indoor work",
            "Quick-attach plate enables rapid tool changes",
            "Strong lift and breakout for the operating footprint",
            "Cab visibility designed for precise placement and loading",
            "Track or wheel options to match ground and surface type",
            "Operator-friendly hydraulic and joystick controls",
          ]}
          applications={[
            "Material loading",
            "Grading & site prep",
            "Snow removal",
            "Pallet handling",
            "Landscaping",
            "Demolition cleanup",
            "Concrete & asphalt patching",
            "Trenching with attachments",
            "Farm & ranch work",
          ]}
          compatibility="Konstructz skid steer loaders are configured around quick-attach workflows, opening up a deep attachment library — buckets, forks, augers, trenchers, brooms, snow blades, hydraulic breakers, grapples, and more. Confirm coupler style and hydraulic flow class before pairing a tool."
          maintenance="Daily checks on hydraulic oil, track or tire condition, and the quick-attach pins keep a skid steer running reliably. Konstructz maintenance support covers schedules, fluid specs, and parts sourcing so downtime stays predictable."
          buyingTips={[
            "Choose tracked or wheeled based on the surfaces you work on most — tracks float on soft ground, wheels are faster and gentler on finished pavement.",
            "Match lift class to the heaviest pallet, bucket load, or attachment you regularly handle.",
            "Confirm hydraulic flow class so powered attachments match the selected machine setup.",
            "Plan cab options for the environment: open cabs are lighter and cheaper, enclosed cabs add comfort and safety in dust, cold, or noise.",
          ]}
          faqs={[
            {
              q: "What is a skid steer loader used for?",
              a: "Skid steers are used for moving and loading materials, grading, snow removal, demolition cleanup, landscaping, and running powered attachments like augers, trenchers, breakers and brooms.",
            },
            {
              q: "Skid steer vs compact track loader — what's the difference?",
              a: "Skid steers run on wheels and are fast and lower-cost. Compact track loaders run on rubber tracks for better traction and float on soft, wet, or sloped ground. Konstructz offers both formats so you can match the surface to the task.",
            },
            {
              q: "Can I run any attachment on a skid steer?",
              a: "Many attachments mount through quick-attach couplers, but the key checks are coupler type, hydraulic flow, and machine lift class. Tools such as cold planers, mulchers, and rock saws need a matching hydraulic setup.",
            },
            {
              q: "How heavy a load can a skid steer lift?",
              a: "Lift capability varies by model and final setup. Ask Konstructz to confirm the machine, attachment weight, and material load together before ordering.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MiniSkidSteers;
