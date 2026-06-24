import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const Trenchers: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "trenchers"
  );

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.trenchers.konstructz.depot")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">
            Trenchers
          </h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            Purpose-built trenching machines for utility, irrigation, drainage, and cable installation work. Engineered to cut clean, consistent channels through compacted soil, clay and roots so backfill goes faster and pipe sits straight.
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
            <h3 className="text-xl font-heading text-theme-heading mt-4">{t("auto.trenchers.no.machinery.found")}</h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">{t("auto.trenchers.currently.no.products")}</p>
          </div>
        )}

        <CategoryInfoSections
          categoryName="Trencher"
          usedFor="A trencher is a dedicated digging machine that cuts narrow, uniform channels for buried utilities — water, sewer, gas, fiber, electrical, irrigation, and drainage. A trencher delivers a cleaner, faster channel than an excavator bucket for any linear underground install."
          bestFor="Trenchers suit utility contractors, landscapers running irrigation and lighting, fence and cable installers, drainage specialists, and property owners running their own farm or large-acreage projects."
          benefits={[
            "Cuts straight, uniform channels for clean backfill",
            "Carbide teeth handle compacted soil, shale and roots",
            "Faster than bucket-digging for any long linear run",
            "Lower spoil volume reduces cleanup and disposal time",
            "Compact form factor for tight residential and commercial sites",
          ]}
          applications={[
            "Water & sewer lines",
            "Fiber & cable",
            "Irrigation",
            "Drainage tile",
            "Landscape lighting",
            "Invisible fence",
            "Root pruning",
          ]}
          compatibility="Konstructz trenchers are matched with digging chains and tooth options sized to common channel widths. Reach out to confirm chain length, tooth pattern, and chain speed for the depth and soil class on your project."
          maintenance="Trencher uptime depends on chain tension, tooth condition, and clean drive components. Replace worn carbide teeth before they start tearing the channel, keep the chain lubricated, and clear the auger system at the end of each shift to keep the next dig fast."
          buyingTips={[
            "Match the trench depth and width to your most common install — pipe diameter and bury depth set the spec, not personal preference.",
            "Match the cutting tooth pattern to your soil — shale, clay, roots and rocky soil each have a recommended pattern.",
            "Choose a self-propelled or attachment-style trencher based on linear footage per job — long runs justify a dedicated machine.",
            "Plan how spoil is removed — augers, conveyors and side-discharge all behave differently next to finished landscaping.",
          ]}
          faqs={[
            {
              q: "What is a trencher used for?",
              a: "Trenchers cut narrow channels in the ground for underground utilities — water and sewer pipes, electrical and fiber cable, gas lines, drainage tile, irrigation lines, landscape lighting and invisible fence.",
            },
            {
              q: "Trencher vs excavator — which is better for utility lines?",
              a: "A trencher is faster and cleaner for any long, narrow, uniform channel. An excavator is better when you need wider trenches, deeper digs, or have obstacles that require a bucket. Many contractors run both.",
            },
            {
              q: "How deep can a Konstructz trencher dig?",
              a: "Trench depth depends on the model and chain. Each product page lists the rated trench depth and width — check that against your bury-depth requirement and soil class.",
            },
            {
              q: "What soils does a trencher handle?",
              a: "With the correct tooth pattern, a trencher cuts through topsoil, clay, packed dirt, shale and roots. Solid rock and large boulders are not a trencher application — those need a rock saw or breaker.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Trenchers;
