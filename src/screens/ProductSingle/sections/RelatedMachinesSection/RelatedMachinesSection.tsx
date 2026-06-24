import React from "react";
import { Link } from "react-router-dom";
import { products, Product } from "../../../../data/products";
import { useI18n } from "../../../../context/I18nContext";
import { categoryKey, specLabelKey } from "../../../../i18n/keys";

interface RelatedMachinesSectionProps {
  product: Product;
}

export const RelatedMachinesSection: React.FC<RelatedMachinesSectionProps> = ({ product }) => {
  const { t } = useI18n();
  // Find up to 5 other products, prioritizing those in the same category
  let related = products.filter(p => p.id !== product.id && p.category === product.category);
  if (related.length < 5) {
    const additional = products.filter(p => p.id !== product.id && p.category !== product.category);
    related = [...related, ...additional].slice(0, 5);
  } else {
    related = related.slice(0, 5);
  }

  const lefts = ["left-16", "left-[399px]", "left-[726px]", "left-[1053px]", "left-[1380px]"];

  return (
    <section
      aria-labelledby="related-machines-heading"
      className="relative ml-[123px] mt-[80px] w-[1673px] h-[600px] text-theme-text transition-colors duration-200"
    >
      <h2
        id="related-machines-heading"
        className="absolute top-0 left-0 [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-heading text-[45px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors"
      >
        {t("product.relatedMachines")}
      </h2>
      <div
        className="absolute top-[117px] left-0 w-[1673px] h-[482px]"
        role="list"
        aria-label={t("product.relatedMachines")}
      >
        {related.map((p, idx) => {
          const leftClass = lefts[idx] || "left-0";
          const weight = p.specs.find(s => s.label.toLowerCase().includes("weight") || s.label.toLowerCase().includes("capacity"))?.value || "2T";
          
          // Get first 2 specs for display
          const displaySpecs = p.specs.slice(0, 2);
          
          return (
            <article
              key={p.id}
              role="listitem"
              className={`absolute top-0 ${leftClass} w-[293px] h-[482px] bg-theme-card border border-theme-border/25 rounded shadow-sm transition-colors duration-200`}
              aria-label={`${p.name} ${p.category}`}
            >
              <div className="absolute top-[9px] left-2.5 w-[41px] h-[49px]">
                <img
                  className="absolute top-0 left-0 w-[41px] h-[49px] aspect-[0.83]"
                  alt=""
                  aria-hidden="true"
                  src="/img/kilogram-kg-and-pound-lbs-weight-symbol-icon-dumbbell-vector-ill-12.png"
                />
                <div className="absolute top-[26px] left-[12px] [font-family:'Clofie-Bold',Helvetica] font-bold text-white text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                  {weight.replace(/\s+/g, '').slice(0, 4)}
                </div>
              </div>
              <Link to={`/equipment/${p.id}`} className="absolute top-[37px] left-[10px] w-[271px] h-[271px] flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  className="max-w-[271px] max-h-[271px] object-contain transition-transform duration-300 hover:scale-105"
                  alt={p.name}
                  src={p.image}
                />
              </Link>
              <h3 className="top-[323px] left-2.5 w-[200px] [font-family:'Cal_Sans',Helvetica] text-theme-text text-2xl absolute font-normal tracking-[0] leading-[normal] truncate hover:text-theme-accent transition-colors">
                <Link to={`/equipment/${p.id}`}>
                  {p.name}
                </Link>
              </h3>
              <div className="absolute top-[330px] left-[215px] [font-family:'Cal_Sans',Helvetica] font-normal text-theme-muted text-[14px] tracking-[0] leading-[normal] truncate w-[70px] text-right">
                {t(categoryKey(p.category), { fallback: p.category.split("-")[0] })}
              </div>
              <div className="absolute top-[355px] left-2.5 w-[272px] h-0.5 bg-theme-border/20" />
              <div className="absolute top-[418px] left-2 w-[272px] h-0.5 bg-theme-border/20" />
              
              {displaySpecs.map((spec, sIdx) => (
                <div key={sIdx}>
                  <div
                    className={`absolute left-2.5 [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-muted text-lg tracking-[0] leading-[normal] whitespace-nowrap truncate w-28 ${
                      sIdx === 0 ? "top-[365px]" : "top-[390px]"
                    }`}
                  >
                    {t(specLabelKey(spec.label), { fallback: spec.label })}
                  </div>
                  <div
                    className={`absolute left-[160px] [font-family:'Cal_Sans',Helvetica] font-normal text-theme-text text-lg tracking-[0] leading-[normal] text-right truncate w-[120px] ${
                      sIdx === 0 ? "top-[365px]" : "top-[388px]"
                    }`}
                  >
                    {spec.value}
                  </div>
                </div>
              ))}
              
              {displaySpecs.length === 0 && (
                <>
                  <div className="absolute left-2.5 top-[365px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-muted text-lg tracking-[0] leading-[normal]">SPEC</div>
                  <div className="absolute left-[225px] top-[365px] [font-family:'Cal_Sans',Helvetica] font-normal text-theme-text text-lg tracking-[0] leading-[normal]">N/A</div>
                  <div className="absolute left-2.5 top-[390px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-muted text-lg tracking-[0] leading-[normal]">SPEC</div>
                  <div className="absolute left-[225px] top-[388px] [font-family:'Cal_Sans',Helvetica] font-normal text-theme-text text-lg tracking-[0] leading-[normal]">N/A</div>
                </>
              )}

              <Link
                to={`/contact?product=${p.id}`}
                className="absolute top-[432px] left-2 w-[111px] h-[33px] flex items-center justify-center border-2 border-solid border-theme-border text-theme-text font-bold transition-all hover:bg-theme-accent hover:text-theme-bg hover:border-theme-accent btn cursor-pointer"
              >
                <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[15px] leading-none">
                  {t("action.quote")}
                </span>
              </Link>
              <Link
                to={`/equipment/${p.id}`}
                className="absolute top-[432px] left-[130px] w-[150px] h-[33px] flex items-center justify-center bg-theme-accent text-theme-bg font-bold transition-all hover:bg-brand-green hover:text-white btn border border-theme-accent cursor-pointer"
              >
                <span className="[font-family:'Google_Sans_Flex',Helvetica] text-[15px] leading-none">
                  {t("action.details")}
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};
