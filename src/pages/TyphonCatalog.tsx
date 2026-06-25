import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getTyphonProductHref,
  typhonCategories,
  typhonProducts,
} from "../data/typhonProducts";

export const TyphonCatalog: React.FC = () => {
  const location = useLocation();
  const selectedCategory = new URLSearchParams(location.search).get("category");
  const visibleProducts = useMemo(
    () =>
      selectedCategory
        ? typhonProducts.filter((product) => product.category === selectedCategory)
        : typhonProducts,
    [selectedCategory],
  );

  return (
    <main className="min-h-screen bg-[#282828] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-10 lg:pt-36">
      <div className="mx-auto max-w-[1480px]">
        <div className="max-w-4xl">
          <p className="font-googleSans text-sm font-bold uppercase text-[#d8c79a]">
            Typhon Machinery
          </p>
          <h1 className="mt-3 font-clofieBold text-5xl font-bold leading-none sm:text-6xl">
            Typhon Machinery catalog
          </h1>
          <p className="mt-5 max-w-2xl font-glonimove text-lg leading-8 text-white/72">
            Browse the full Typhon Machinery catalog — mini excavators, skid steer loaders, forklifts, road rollers, scissor lifts and wheel loaders built for jobsite work.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/typhon-machinery"
            className={`border px-4 py-2 font-googleSans text-sm font-bold ${
              !selectedCategory ? "border-[#d8c79a] bg-[#d8c79a] text-[#153d28]" : "border-white/20 text-white hover:border-[#d8c79a]"
            }`}
          >
            All {typhonProducts.length}
          </Link>
          {typhonCategories.map((category) => (
            <Link
              key={category.id}
              to={`/typhon-machinery?category=${category.id}`}
              className={`border px-4 py-2 font-googleSans text-sm font-bold ${
                selectedCategory === category.id
                  ? "border-[#d8c79a] bg-[#d8c79a] text-[#153d28]"
                  : "border-white/20 text-white hover:border-[#d8c79a]"
              }`}
            >
              {category.label} ({category.count})
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <article key={product.id} className="bg-[#d9d9d9] text-[#153d28]">
              <Link to={getTyphonProductHref(product)} className="block h-64 p-5">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
              </Link>
              <div className="border-t-4 border-[#153d28] p-4">
                <p className="font-googleSans text-xs font-bold uppercase text-black/58">{product.categoryLabel}</p>
                <h2 className="mt-1 font-clofieBold text-2xl font-bold leading-tight">
                  <Link to={getTyphonProductHref(product)}>{product.name}</Link>
                </h2>
                <p className="mt-3 font-glonimove text-sm leading-snug text-black/72 line-clamp-3">
                  {product.tagline}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-3 font-glonimove text-sm">
                  <div>
                    <dt className="text-black/52">{product.currentPrice ? "Price" : "Class"}</dt>
                    <dd className="font-bold">{product.currentPrice || product.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-black/52">Category</dt>
                    <dd className="font-bold">{product.categoryLabel}</dd>
                  </div>
                </dl>
                <Link
                  to={getTyphonProductHref(product)}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center bg-[#153d28] font-googleSans text-sm font-bold text-[#d9d9d9] hover:bg-black"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TyphonCatalog;
