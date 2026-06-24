import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { products } from "../../data/products";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryInfoSections } from "../../components/sections/CategoryInfoSections";

export const MiniExcavators: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === "mini-excavators"
  );

  return (
    <div className="bg-theme-bg min-h-screen pt-32 pb-24 text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-theme-accent text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.miniexcavators.konstructz.depot")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide text-theme-heading">Mini Excavators</h1>
          <div className="w-16 h-1 bg-theme-accent mx-auto my-2" />
          <p className="text-theme-muted font-glonimove text-base leading-relaxed">{t("auto.miniexcavators.compact.and.powerful")}</p>
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
            <h3 className="text-xl font-heading text-theme-heading mt-4">{t("auto.miniexcavators.no.machinery.found")}</h3>
            <p className="text-theme-muted font-glonimove text-sm mt-1">{t("auto.miniexcavators.currently.no.products")}</p>
          </div>
        )}

        <CategoryInfoSections
          categoryName="Mini Excavator"
          usedFor="A mini excavator is a compact tracked digging machine used for trenching, foundation prep, utility installation, drainage, demolition, and landscaping in tight spaces where a full-size excavator cannot work. With the right attachment it can dig, grade, break, drill, lift and handle materials on the same job."
          bestFor="Mini excavators are ideal for contractors, landscapers, plumbers, electricians, rental fleets, farms and property owners who need precise digging power on residential lots, urban worksites, and confined commercial sites where access, footprint and surface protection matter."
          benefits={[
            "Compact footprint that fits through standard gates and access ramps",
            "Tracked undercarriage delivers stable digging on slopes and soft ground",
            "Hydraulic auxiliary lines support a wide range of work tools",
            "Operator-friendly controls reduce fatigue across long shifts",
            "Lower fuel consumption than full-size excavators for the same task",
            "Easy to trailer between jobs without a CDL in most regions",
          ]}
          applications={[
            "Utility trenching",
            "Footings & foundations",
            "Landscaping",
            "Drainage & french drains",
            "Stump & root removal",
            "Light demolition",
            "Pool & pond digging",
            "Pipe & cable laying",
            "Farm & property maintenance",
          ]}
          compatibility="Konstructz mini excavators support common quick-coupler attachments — digging buckets, grading buckets, hydraulic breakers, augers, thumbs, rippers, and tilt couplers — so a single machine can move from trenching to grading to demolition without leaving the site."
          maintenance="Daily greasing of pivot points, regular track tension checks, clean hydraulic oil, and timely filter changes keep a mini excavator productive for years. The Konstructz support team provides operator manuals, parts lookups, and maintenance guidance so owners can run a planned service schedule instead of reactive repairs."
          buyingTips={[
            "Match the operating weight class to the largest trench depth and lift you actually do — sizing up wastes fuel and ground access; sizing down wears the machine out.",
            "Check the swing geometry — zero-tail or near-zero models protect walls and finished surfaces when working close to structures.",
            "Confirm the auxiliary hydraulic flow rating matches the attachments you plan to run, especially augers and breakers.",
            "Look at transport weight against your trailer and tow vehicle so the machine moves between jobs without compliance issues.",
            "Plan parts availability and local service support before buying — uptime depends on it more than headline specs.",
          ]}
          faqs={[
            {
              q: "What is a mini excavator?",
              a: "A mini excavator is a small tracked excavator typically under a few metric tons, designed for digging, trenching and material handling in confined spaces. It uses a boom, arm and bucket powered by a hydraulic system, and accepts a wide range of attachments.",
            },
            {
              q: "What jobs is a mini excavator best for?",
              a: "Mini excavators are best for utility trenching, foundation work, landscaping, drainage, light demolition, fence-post and pole holes, and any project where access is tight or surface protection matters.",
            },
            {
              q: "Can a mini excavator replace a full-size excavator?",
              a: "For small to mid-size residential and commercial work, yes. For deep digs, heavy lifting, or large-volume earthmoving, a standard excavator is still the right tool. Many contractors run both for the right job at the right cost.",
            },
            {
              q: "Do I need a special license to operate one?",
              a: "Licensing rules vary by country and state. In most regions a CDL is not required to tow or operate a small mini excavator on private property, but commercial jobsites usually require operator training and competency sign-off. Check local regulations.",
            },
            {
              q: "What attachments work with a Konstructz mini excavator?",
              a: "Standard digging buckets, grading and ditching buckets, hydraulic breakers, augers, thumbs, rippers and quick couplers. Reach out to the Konstructz attachments team to confirm fitment and hydraulic flow for your model.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MiniExcavators;
