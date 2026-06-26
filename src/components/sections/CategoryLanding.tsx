import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  type ProductCategory,
  productCategories,
  getCategoryProductCount,
} from "../../data/productCategories";
import { products } from "../../data/products";
import { ProductCard } from "../ui/ProductCard";
import { Reveal } from "../Reveal";
import { Stagger } from "../Stagger";

interface CategoryLandingProps {
  category: ProductCategory;
}

/**
 * Reusable WooCommerce-style category landing.
 *
 * Layout: hero → products grid → about → common uses → why choose →
 * image/content split → FAQ → related categories → CTA.
 *
 * Every category page renders this same component — content comes from the
 * passed `category` config so layout stays consistent across all 8 categories.
 */
export const CategoryLanding: React.FC<CategoryLandingProps> = ({ category }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${category.name} | Konstructz`;
  }, [category]);

  const categoryProducts = products.filter(
    (p) => p.category === category.productCategoryKey
  );
  const productCount = categoryProducts.length;

  const related = productCategories.filter((c) => c.slug !== category.slug).slice(0, 3);

  return (
    <div className="bg-theme-bg text-theme-text transition-colors duration-200">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#0e0e0e] pt-32 lg:pt-40 pb-16 lg:pb-24">
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-[40%] w-[80%] max-w-[900px] h-[280px] bg-[#d8c79a]/10 rounded-[50%] blur-[120px] pointer-events-none"
        />
        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <Reveal variant="rise">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 font-googleSans text-[11px] uppercase tracking-[0.18em] text-white/55">
              <Link to="/" className="hover:text-[#d8c79a] transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/categories" className="hover:text-[#d8c79a] transition-colors">Equipment</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#d8c79a]">{category.name}</span>
            </nav>

            <p className="font-googleSans text-sm font-bold uppercase tracking-[0.25em] text-[#d8c79a]">
              Konstructz Depot
            </p>
            <h1 className="mt-4 font-heading uppercase tracking-wide text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
              {category.name}
            </h1>
            <div className="mt-5 h-1 w-16 bg-[#d8c79a]" />
            <p className="mt-6 max-w-2xl font-glonimove text-base sm:text-lg leading-relaxed text-white/75">
              {category.heroIntro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#products"
                className="k-btn-lift inline-flex items-center gap-2 bg-[#d8c79a] px-6 py-3 font-googleSans text-sm font-bold uppercase tracking-wider text-[#153d28] hover:bg-white transition-colors"
              >
                Browse Machines
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 5h12m0 0L9 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link
                to="/contact"
                className="k-btn-lift inline-flex items-center gap-2 border border-white/40 px-6 py-3 font-googleSans text-sm font-bold uppercase tracking-wider text-white hover:border-[#d8c79a] hover:text-[#d8c79a] transition-colors"
              >
                Get a Quote
              </Link>
              <span className="font-googleSans text-xs uppercase tracking-widest text-white/55">
                {productCount} {productCount === 1 ? "machine" : "machines"} available
              </span>
            </div>
          </Reveal>

          {/* Right — hero image */}
          <Reveal variant="zoom">
            <div className="relative aspect-[5/4] w-full">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-[#d8c79a]/15 to-transparent"
              />
              <img
                src={category.heroImage}
                alt={category.name}
                loading="eager"
                className="relative h-full w-full object-contain"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── PRODUCT GRID ───────────────── */}
      <section id="products" className="bg-theme-bg py-16 lg:py-24 transition-colors duration-200">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal variant="rise">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
                  Available Machines
                </p>
                <h2 className="mt-2 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading">
                  {category.name} Catalog
                </h2>
              </div>
              <Link
                to="/categories"
                className="font-googleSans text-sm font-bold text-theme-accent hover:text-theme-text transition-colors inline-flex items-center gap-2"
              >
                All Equipment Categories
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 5h12m0 0L9 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </Reveal>

          {categoryProducts.length > 0 ? (
            <Stagger as="div" step={90} className="grid grid-cols-[repeat(auto-fit,minmax(270px,293px))] justify-center gap-5 sm:gap-6">
              {categoryProducts.map((product) => (
                <Reveal key={product.id} variant="rise" className="w-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </Stagger>
          ) : (
            <Reveal variant="rise">
              <div className="text-center py-20 bg-theme-card border border-theme-border/20 max-w-lg mx-auto transition-colors duration-200">
                <p className="font-heading uppercase tracking-wide text-xl text-theme-heading">
                  New {category.name} Coming Soon
                </p>
                <p className="mt-3 max-w-sm mx-auto font-glonimove text-sm text-theme-muted">
                  Konstructz is finalizing the {category.name.toLowerCase()} line. Reach out for early-spec access and configuration help.
                </p>
                <Link
                  to={`/contact?interest=${category.slug}`}
                  className="mt-6 inline-flex items-center gap-2 bg-theme-accent px-5 py-2.5 font-googleSans text-sm font-bold uppercase tracking-wider text-theme-bg hover:bg-brand-green hover:text-white transition-colors"
                >
                  Request Early Spec
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ───────────────── ABOUT THIS CATEGORY ───────────────── */}
      <section className="bg-theme-sec py-16 lg:py-24 border-y border-theme-border/15 transition-colors duration-200">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <Reveal variant="rise">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
              About this category
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading leading-[1.1]">
              What is a {category.singular.toLowerCase()}?
            </h2>
            <div className="mt-4 h-1 w-12 bg-theme-accent" />
          </Reveal>
          <Reveal variant="rise">
            <p className="font-glonimove text-base md:text-lg leading-relaxed text-theme-muted">
              {category.aboutBody}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── COMMON USES ───────────────── */}
      <section className="bg-theme-bg py-16 lg:py-24 transition-colors duration-200">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal variant="rise">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
              Common uses
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading">
              Where {category.name.toLowerCase()} earn their keep
            </h2>
            <div className="mt-4 h-1 w-12 bg-theme-accent mb-12" />
          </Reveal>

          <Stagger as="div" step={100} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {category.commonUses.map((use, i) => (
              <Reveal key={i} variant="rise" className="h-full">
                <article className="k-card-hover h-full bg-theme-card border border-theme-border/20 p-6 flex flex-col gap-3">
                  <span className="font-googleSans text-[10px] font-bold uppercase tracking-[0.22em] text-theme-accent">
                    0{i + 1}
                  </span>
                  <h3 className="font-heading uppercase tracking-wide text-lg text-theme-heading leading-tight">
                    {use.title}
                  </h3>
                  <div className="h-px w-8 bg-theme-accent/60" />
                  <p className="font-glonimove text-sm leading-relaxed text-theme-muted">
                    {use.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────────────── WHY CHOOSE THIS MACHINE TYPE ───────────────── */}
      <section className="bg-[#0e0e0e] text-white py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal variant="rise">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-[#d8c79a]">
              Why choose this machine type
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-white">
              The case for a {category.singular.toLowerCase()}
            </h2>
            <div className="mt-4 h-1 w-12 bg-[#d8c79a] mb-12" />
          </Reveal>

          <Stagger as="div" step={100} className="grid sm:grid-cols-2 gap-5">
            {category.whyChoose.map((reason, i) => (
              <Reveal key={i} variant="rise" className="h-full">
                <article className="k-card-hover h-full bg-white/[0.04] border border-white/15 p-6 flex gap-5 items-start">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#d8c79a]/40 bg-[#0e0e0e] font-googleSans text-base font-bold text-[#d8c79a]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-3 min-w-0">
                    <h3 className="font-heading uppercase tracking-wide text-lg text-white leading-tight">
                      {reason.title}
                    </h3>
                    <p className="font-glonimove text-sm leading-relaxed text-white/70">
                      {reason.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────────────── IMAGE / CONTENT SPLIT ───────────────── */}
      <section className="bg-theme-bg py-16 lg:py-24 transition-colors duration-200">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal variant="left">
            <div className="relative aspect-[5/4] bg-theme-sec border border-theme-border/20 overflow-hidden">
              <img
                src={category.splitImage}
                alt={category.splitHeading}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain p-6"
              />
            </div>
          </Reveal>
          <Reveal variant="right">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
              Built for the job
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading leading-[1.1]">
              {category.splitHeading}
            </h2>
            <div className="mt-4 h-1 w-12 bg-theme-accent mb-6" />
            <p className="font-glonimove text-base md:text-lg leading-relaxed text-theme-muted">
              {category.splitBody}
            </p>
            <Link
              to={`/contact?interest=${category.slug}`}
              className="mt-8 inline-flex items-center gap-2 bg-theme-accent px-6 py-3 font-googleSans text-sm font-bold uppercase tracking-wider text-theme-bg hover:bg-brand-green hover:text-white transition-colors"
            >
              Talk to a Specialist
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path d="M1 5h12m0 0L9 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="bg-theme-sec py-16 lg:py-24 border-y border-theme-border/15 transition-colors duration-200">
        <div className="max-w-[920px] mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal variant="rise">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent text-center">
              Frequently asked
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading text-center">
              {category.name} — common questions
            </h2>
            <div className="mt-4 h-1 w-12 bg-theme-accent mx-auto mb-12" />
          </Reveal>

          <Reveal variant="rise">
            <div className="divide-y divide-theme-border/20 border border-theme-border/20 bg-theme-card/40 overflow-hidden">
              {category.faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 font-googleSans font-bold text-sm md:text-base text-theme-text hover:text-theme-accent hover:bg-theme-accent/5 transition-colors"
                      aria-expanded={open}
                    >
                      <span>{faq.q}</span>
                      <span
                        className={`text-theme-accent text-xl leading-none transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 text-theme-muted font-glonimove text-sm md:text-base leading-relaxed border-t border-theme-border/10 pt-4">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── RELATED CATEGORIES ───────────────── */}
      <section className="bg-theme-bg py-16 lg:py-24 transition-colors duration-200">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
          <Reveal variant="rise">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-theme-accent">
                  Keep exploring
                </p>
                <h2 className="mt-2 font-heading uppercase tracking-wide text-3xl md:text-4xl text-theme-heading">
                  Related equipment categories
                </h2>
              </div>
              <Link
                to="/categories"
                className="font-googleSans text-sm font-bold text-theme-accent hover:text-theme-text transition-colors inline-flex items-center gap-2"
              >
                View All Categories
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 5h12m0 0L9 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </Reveal>

          <Stagger as="div" step={100} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((other) => {
              const count = getCategoryProductCount(other);
              return (
                <Reveal key={other.slug} variant="rise" className="h-full">
                  <Link
                    to={`/product/${other.slug}`}
                    className="k-card-hover group block h-full bg-theme-card border border-theme-border/20 overflow-hidden"
                  >
                    <div className="relative aspect-[5/3] bg-theme-sec overflow-hidden k-image-zoom">
                      <img
                        src={other.heroImage}
                        alt={other.name}
                        loading="lazy"
                        className="k-image absolute inset-0 m-auto w-[88%] h-[88%] object-contain"
                      />
                      <span className="absolute top-3 left-3 bg-[#153d28] text-[#d9d9d9] border border-[#d8c79a]/40 px-2.5 py-1 font-googleSans text-[10px] font-bold uppercase tracking-wider">
                        {count} {count === 1 ? "model" : "models"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading uppercase tracking-wide text-xl text-theme-heading group-hover:text-theme-accent transition-colors">
                        {other.name}
                      </h3>
                      <p className="mt-3 font-glonimove text-sm leading-relaxed text-theme-muted">
                        {other.shortDescription}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="relative bg-[#153d28] text-white overflow-hidden py-16 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-[1080px] mx-auto px-5 sm:px-8 lg:px-10 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <Reveal variant="left">
            <p className="font-googleSans text-xs font-bold uppercase tracking-[0.22em] text-[#d8c79a]">
              Ready to spec your {category.singular.toLowerCase()}?
            </p>
            <h2 className="mt-3 font-heading uppercase tracking-wide text-3xl md:text-4xl text-white leading-[1.1]">
              Get a configured quote, fast.
            </h2>
            <p className="mt-5 font-glonimove text-base md:text-lg leading-relaxed text-white/75 max-w-xl">
              Tell the Konstructz team about your job — access, ground, attachments, transport — and they'll come back with a configured quote and an honest timeline.
            </p>
          </Reveal>
          <Reveal variant="right">
            <div className="flex flex-col gap-3">
              <Link
                to={`/contact?interest=${category.slug}`}
                className="k-btn-lift inline-flex items-center justify-center gap-2 bg-[#d8c79a] px-6 py-4 font-googleSans text-sm font-bold uppercase tracking-wider text-[#153d28] hover:bg-white transition-colors"
              >
                Request a Quote
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 5h12m0 0L9 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/support/machine-guidance"
                className="k-btn-lift inline-flex items-center justify-center gap-2 border border-white/40 px-6 py-4 font-googleSans text-sm font-bold uppercase tracking-wider text-white hover:border-[#d8c79a] hover:text-[#d8c79a] transition-colors"
              >
                Talk to Machine Guidance
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default CategoryLanding;
