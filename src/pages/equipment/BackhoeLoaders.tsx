import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const BackhoeLoaders: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "backhoe-loaders"
  );

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.backhoeloaders.konstructz.depot")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">Backhoe Loaders</h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">
            Two machines on one chassis. A backhoe loader pairs a front loader for hauling and grading with a rear backhoe arm for digging — so one operator can load, trench, backfill and clean up without switching machines.
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
            <h3 className="text-xl font-heading text-theme-heading mt-4">{t("auto.backhoeloaders.no.machinery.found")}</h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">{t("auto.backhoeloaders.currently.no.products")}</p>
          </div>
        )}

        <CategoryInfoSections
          categoryName="Backhoe Loader"
          usedFor="A backhoe loader is a dual-purpose machine with a loader bucket on the front and a backhoe digging arm on the back. It is used for excavation, trenching, loading trucks, backfilling, grading and material handling — all from one operator's seat."
          bestFor="Backhoe loaders are a strong fit for general contractors, municipal crews, utility installers, landscapers, farms and rural property owners who need a single machine that can dig and load across the workday."
          benefits={[
            "Loader and backhoe on one chassis reduces fleet count",
            "Stabilizing legs hold position for accurate, repeatable digs",
            "Roadable wheeled chassis moves between jobsites under its own power",
            "Operator seat rotates to face the active end of the machine",
            "Lower total cost than running a separate loader and excavator for light-to-mid work",
          ]}
          applications={[
            "Utility digging",
            "Trenching",
            "Loading trucks",
            "Backfilling",
            "Site grading",
            "Snow clearing",
            "Farm & ranch work",
            "Municipal repair",
          ]}
          compatibility="Konstructz backhoe loaders accept standard digging buckets, ditching buckets, hydraulic breakers, augers and thumbs on the backhoe end; and quick-attach loader buckets, forks and blades on the front. Confirm coupler type and hydraulic flow before pairing tools."
          maintenance="Daily greasing of every pivot, regular hydraulic oil and filter service, and stabilizer pad checks keep a backhoe loader productive across long projects. Konstructz support provides maintenance schedules, parts diagrams and remote guidance to keep planned downtime predictable."
          buyingTips={[
            "Match backhoe dig depth to the deepest utility trench you actually run, not best-case spec sheets.",
            "Check loader bucket capacity against your most common load — material, not just water capacity.",
            "Decide between 2WD and 4WD based on jobsite surfaces — mud, snow and slopes need 4WD.",
            "Plan stabilizer pad type for the surface you set down on — finished asphalt needs different pads than soft soil.",
          ]}
          faqs={[
            {
              q: "What is a backhoe loader?",
              a: "A backhoe loader is a wheeled construction machine with a front loader bucket and a rear excavator-style digging arm. It combines the function of a loader and a small excavator in one chassis.",
            },
            {
              q: "Backhoe loader vs excavator — which should I buy?",
              a: "A backhoe loader is better when you need both loading and digging in one machine, especially on jobs that move between sites under their own power. A dedicated excavator is better for heavy or deep digging where loading is a separate task.",
            },
            {
              q: "Can a backhoe loader run on public roads?",
              a: "Most wheeled backhoes are roadable. Local rules cover lighting, slow-moving vehicle signage, and licensing. Check your jurisdiction's road code before driving between sites.",
            },
            {
              q: "What attachments work with a backhoe?",
              a: "On the backhoe end: digging buckets, ditching buckets, breakers, augers and thumbs. On the loader end: buckets, forks, snow blades and grapples. Always confirm hydraulic flow with the Konstructz attachments team.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BackhoeLoaders;
