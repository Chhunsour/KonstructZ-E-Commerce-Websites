import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const StoneCrushers: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "stone-crushers"
  );

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.stonecrushers.konstructz.depot")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">{t("auto.stonecrushers.stone.crushers")}</h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            On-site stone and concrete crushers built to turn demolition rubble, fieldstone and recycled aggregate into usable material right where you work — eliminating haul-off fees and aggregate delivery costs.
          </p>
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
            <h3 className="text-xl font-heading text-theme-heading mt-4">{t("auto.stonecrushers.no.machinery.found")}</h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">{t("auto.stonecrushers.currently.no.products")}</p>
          </div>
        )}

        <CategoryInfoSections
          categoryName="Stone Crusher"
          usedFor="A stone crusher reduces stone, concrete, brick and asphalt into smaller, uniform pieces that can be reused on site as fill, sub-base or finished aggregate. Crushing in place removes the cost of trucking debris out and aggregate back in."
          bestFor="Stone crushers fit demolition contractors, recycling operators, road and site preparation crews, quarry and aggregate yards, and landowners managing fieldstone, rubble or concrete waste."
          benefits={[
            "Eliminates haul-off and disposal fees for demolition debris",
            "Produces reusable on-site fill and sub-base aggregate",
            "Hardened jaw and wear plates handle abrasive material",
            "Adjustable output sizing matches the spec of the next pour or sub-base",
            "Reduces environmental footprint by recycling material at source",
          ]}
          applications={[
            "Concrete recycling",
            "Brick & masonry crushing",
            "Asphalt millings reuse",
            "Fieldstone reduction",
            "Sub-base preparation",
            "Demolition debris processing",
            "Landscape aggregate",
          ]}
          compatibility="Konstructz crushers are sized for site-grade input material. Pair with a loader or excavator to feed the hopper and a screener or conveyor downstream if you need graded output. Confirm feed opening dimensions against your largest input piece before buying."
          maintenance="Inspect jaw plates and wear liners regularly, keep belts and bearings clean, and clear the discharge of trapped rebar or oversize material before restarting. The Konstructz support team can help schedule wear-part replacement so a crusher stays productive across long demolition projects."
          buyingTips={[
            "Match the feed opening to the largest piece you will actually feed in — undersized input wastes labor pre-breaking material.",
            "Set output size for the downstream spec — sub-base, drainage rock and landscape aggregate all have different ranges.",
            "Choose the right drive and chassis for the site — tracked units self-relocate, skid-mounted units are cheaper but need a loader to reposition.",
            "Plan for dust suppression and rebar removal — wet kits and magnetic separators protect both the crew and the machine.",
          ]}
          faqs={[
            {
              q: "What can a stone crusher process?",
              a: "Most jaw and impact crushers handle concrete, brick, masonry, asphalt, fieldstone, and recycled aggregate. Reinforced concrete is fine as long as a magnetic separator pulls rebar out of the output stream.",
            },
            {
              q: "Why crush on site instead of hauling debris away?",
              a: "On-site crushing typically replaces two truck movements per load — debris out, aggregate in. It cuts disposal fees, fuel, dust on local roads, and project schedule.",
            },
            {
              q: "What output sizes can I get?",
              a: "Most Konstructz crushers use an adjustable jaw or wedge system so you can target a specific output size. Check the model spec page for the range supported.",
            },
            {
              q: "Do I need a permit to operate a stone crusher?",
              a: "Local rules vary. Many jurisdictions require dust, noise and air-quality permits for ongoing crushing operations. Check with the local authority before starting a long-running project.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default StoneCrushers;
