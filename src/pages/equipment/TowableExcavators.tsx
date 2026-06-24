import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const TowableExcavators: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "towable-excavators"
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
            Towable Excavators
          </h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            Tow-behind digging machines built for remote, off-grid and rural jobsites. Pulls behind a pickup or utility vehicle, sets up on outriggers, and digs where access keeps a full-size excavator off the property.
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
          categoryName="Towable Excavator"
          usedFor="A towable excavator is a small excavator on a road-legal trailer chassis that gets pulled behind a pickup or utility vehicle. Once on site, outriggers deploy and the boom and bucket dig like a standard mini excavator. It is built for remote, rural and access-limited work."
          bestFor="Towable excavators fit landowners, farms, ranches, utility crews, telecom and irrigation installers, and contractors who travel between many small jobs and want to avoid trucking a tracked machine on a separate trailer each time."
          benefits={[
            "Tows behind a standard pickup or utility vehicle",
            "Outriggers stabilize the dig on slopes and uneven ground",
            "Lower transport cost than a tracked mini and dedicated trailer",
            "Compact deployed footprint for access-limited sites",
            "Easy to store between jobs on a standard trailer slot",
          ]}
          applications={[
            "Rural utility installs",
            "Fence post & pole holes",
            "Drainage on acreage",
            "Stump removal",
            "Septic & well work",
            "Garden & pond digging",
            "Off-grid property work",
          ]}
          compatibility="Konstructz towable excavators accept standard digging and trenching buckets and a thumb attachment for material handling. Confirm coupler pin size and hydraulic flow against the attachments you plan to run."
          maintenance="Trailer brakes, lights, wheel bearings and boom hydraulics are the four areas to check before every haul. The Konstructz support team can help owners set a preventative service schedule and source replacement wear parts."
          buyingTips={[
            "Match towing weight, hitch class and brake spec to the vehicle that will pull it most often.",
            "Check digging depth against the actual depth of your most common work — septic, footings and trenches each have different bury depths.",
            "Plan outrigger pad type for the surfaces you set down on — soft soil and finished pavement need different pads.",
            "Verify the engine type matches local fuel access — gas engines simplify rural refuelling.",
          ]}
          faqs={[
            {
              q: "What is a towable excavator?",
              a: "A towable excavator is a small excavator mounted on a road-legal trailer chassis. You tow it behind a pickup, lower the outriggers on site, and operate it like a mini excavator without needing a separate trailer or commercial transport.",
            },
            {
              q: "Do I need a CDL to tow one?",
              a: "Towing requirements depend on combined vehicle weight and local law. Most light towable excavators fall under standard non-commercial towing class, but always verify the hitch class, brake controller requirement and weight limits in your region.",
            },
            {
              q: "Towable vs tracked mini excavator — which should I buy?",
              a: "A towable saves the cost of a dedicated trailer and is easier to move between many small remote jobs. A tracked mini gives more digging force and faster on-site mobility for a single longer project. Many owners run both.",
            },
            {
              q: "How deep can a towable excavator dig?",
              a: "Dig depth varies by model — check the spec on each product page. For most residential, agricultural and small utility work, towable excavators reach the depth needed for footings, septic, and standard utility runs.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TowableExcavators;
