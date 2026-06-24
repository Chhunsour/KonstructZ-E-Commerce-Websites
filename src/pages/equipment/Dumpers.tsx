import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const Dumpers: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "dumpers"
  );

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">
            {t("equipment.eyebrow")}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">
            Compact Dumpers
          </h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            Tracked and wheeled compact dumpers built to move concrete, soil and aggregate across the toughest sites — including the muddy, steep and tight-access ground that bigger trucks can't reach.
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
            <h3 className="text-xl font-heading text-theme-heading mt-4">
              {t("equipment.noMachineryFound")}
            </h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">
              {t("equipment.noMachineryText")}
            </p>
          </div>
        )}

        <CategoryInfoSections
          categoryName="Compact Dumper"
          usedFor="A compact dumper is a small, high-payload hauler used on construction, landscaping and farm sites to move bulk material — concrete, aggregate, soil, mulch, demolition waste — between the staging point and the work area. Tracked dumpers extend that capability onto soft, sloped or muddy ground."
          bestFor="Compact dumpers fit residential builders, hardscape and landscape crews, concrete contractors, demolition teams, farms, and anyone moving material across ground a wheeled dump truck can't safely cross."
          benefits={[
            "Tracked undercarriage handles mud, slope and soft ground",
            "Tight-access footprint fits through gates and between buildings",
            "Hydraulic tip empties the load fast and cleanly",
            "Self-loading and swivel options reduce manual handling",
            "Lower ground pressure protects finished surfaces and turf",
          ]}
          applications={[
            "Concrete pours",
            "Hardscape & paver work",
            "Backfill",
            "Soil & mulch moving",
            "Demolition cleanup",
            "Drainage projects",
            "Farm & ranch hauling",
          ]}
          compatibility="Konstructz dumpers ship in tracked and wheeled formats with hydraulic tip and (on select models) hydraulic swivel and self-loading shovel options — so you can match the chassis and box to how the material gets in, out, and across the site."
          maintenance="Track tension, hydraulic cylinder condition, and bed pivot pins are the daily checks that keep a dumper running. Konstructz support can guide owners through scheduled service intervals and source replacement wear parts when needed."
          buyingTips={[
            "Match payload to your most-repeated load — concrete is much heavier than mulch for the same box volume.",
            "Choose tracked or wheeled based on ground condition — tracks for mud and slopes, wheels for hard surfaces.",
            "Pick the dump style — straight tip, three-way tip, or swivel — based on how often you need to discharge to one side.",
            "Decide whether you need a self-loading shovel — it removes one machine from the loading cycle on solo jobs.",
          ]}
          faqs={[
            {
              q: "What is a compact dumper used for?",
              a: "Compact dumpers move bulk material around a jobsite — concrete to a pour, aggregate to a base prep, soil out of an excavation, demolition waste to a skip. They cover the ground a full-size dump truck cannot.",
            },
            {
              q: "Tracked vs wheeled dumper — which is better?",
              a: "Tracked dumpers handle mud, snow, slopes and soft ground. Wheeled dumpers are faster and lower-cost on hard surfaces. Choose the one that matches the worst ground you regularly work on.",
            },
            {
              q: "Can I use a dumper on a slope?",
              a: "Tracked compact dumpers are designed for sloped ground within the rated incline angle on each product page. Always load within capacity and follow the operator's manual for slope direction.",
            },
            {
              q: "How do dumpers compare to wheelbarrows for concrete?",
              a: "A single dumper load typically replaces dozens of wheelbarrow trips, with less labor and faster discharge. For any pour bigger than a small footing, a dumper pays back quickly in time savings.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Dumpers;
