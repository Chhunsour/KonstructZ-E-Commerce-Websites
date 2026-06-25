import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTyphonProductHref,
  TyphonProduct,
  typhonProducts,
} from "../../data/typhonProducts";

interface TyphonProductSingleProps {
  product: TyphonProduct;
}

export const TyphonProductSingle: React.FC<TyphonProductSingleProps> = ({ product }) => {
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product.id]);

  const relatedProducts = useMemo(() => {
    const sameCategory = typhonProducts.filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category &&
        item.productType === product.productType,
    );
    const fallback = typhonProducts.filter(
      (item) => item.id !== product.id && item.productType === product.productType && item.category !== product.category,
    );
    const finalFallback = typhonProducts.filter(
      (item) => item.id !== product.id && item.productType !== product.productType,
    );
    return [...sameCategory, ...fallback, ...finalFallback].slice(0, 4);
  }, [product]);

  return (
    <main className="bg-[#282828] text-white">
      <section className="mx-auto flex w-full max-w-[1480px] flex-col gap-10 px-4 pb-14 pt-28 sm:px-6 lg:px-10 lg:pb-20 lg:pt-36">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#d8c79a]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <span className="text-white/55">/</span>
          <Link to="/typhon-machinery" className="hover:text-white">
            Typhon Machinery
          </Link>
          <span className="text-white/55">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.72fr)] lg:items-start">
          <section aria-label="Product image gallery" className="min-w-0">
            <div className="bg-neutral-100">
              <img
                src={gallery[activeImage] ?? product.image}
                alt={product.name}
                className="h-[360px] w-full object-contain p-6 sm:h-[520px] lg:h-[640px]"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View ${product.name} image ${index + 1}`}
                  className={`h-24 bg-neutral-100 p-2 transition sm:h-32 ${
                    activeImage === index ? "ring-4 ring-[#d8c79a]" : "ring-1 ring-white/10 hover:ring-[#d8c79a]/70"
                  }`}
                >
                  <img src={image} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0 lg:pt-8" aria-labelledby="typhon-product-title">
            <p className="font-googleSans text-sm font-bold uppercase text-[#d8c79a]">
              {product.categoryLabel}
            </p>
            <h1
              id="typhon-product-title"
              className="mt-3 font-clofieBold text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl"
            >
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl font-glonimove text-xl leading-8 text-white/82">
              {product.tagline}
            </p>

            <div className="mt-8 grid gap-3" aria-label="Product specifications">
              {product.specs.slice(1, 5).map((spec) => (
                <div key={spec.label} className="grid grid-cols-[160px_minmax(0,1fr)] items-center gap-4 border-b border-white/14 py-3">
                  <span className="font-glonimove text-sm text-white/62">{spec.label}</span>
                  <strong className="font-googleSans text-base text-white">{spec.value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/contact?product=${product.id}&brand=typhon`}
                className="inline-flex min-h-[50px] items-center justify-center bg-neutral-100 px-6 font-googleSans text-base font-bold text-[#153d28] transition hover:bg-[#d8c79a]"
              >
                Request Quote
              </Link>
              <Link
                to={`/contact?product=${product.id}&topic=fit-check&brand=typhon`}
                className="inline-flex min-h-[50px] items-center justify-center border border-[#d8c79a] px-6 font-googleSans text-base font-bold text-[#d8c79a] transition hover:bg-[#d8c79a] hover:text-[#153d28]"
              >
                Ask Fitment
              </Link>
              <button
                type="button"
                className="inline-flex min-h-[50px] items-center justify-center border border-white/20 px-5 font-googleSans text-base text-white transition hover:border-white"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                Share
              </button>
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#202020]">
        <div className="mx-auto grid max-w-[1480px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-10">
          {[
            ["Series", product.series],
            ["Category", product.categoryLabel],
            ["Weight Class", product.weight],
          ].map(([label, value]) => (
            <div key={label} className="border-l-4 border-[#d8c79a] pl-5">
              <p className="font-glonimove text-sm text-white/58">{label}</p>
              <p className="mt-2 font-googleSans text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-20">
        <article>
          <h2 className="font-clofieBold text-4xl font-bold text-white">Product Description</h2>
          <div className="mt-6 h-1.5 w-full bg-[#d9d9d9]" />
          <p className="mt-8 max-w-4xl font-glonimove text-lg leading-8 text-white/78">
            {product.description}
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Key Features</h3>
              <ul className="mt-4 space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3 font-glonimove text-white/76">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-[#d8c79a]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Common Applications</h3>
              <ul className="mt-4 space-y-3">
                {product.applications.map((application) => (
                  <li key={application} className="flex gap-3 font-glonimove text-white/76">
                    <span className="mt-2 h-2 w-2 shrink-0 bg-[#d8c79a]" />
                    <span>{application}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <aside className="border-t border-white/18 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="font-clofieBold text-4xl font-bold text-white">Need Help?</h2>
          <div className="mt-6 h-1.5 w-full bg-[#d9d9d9]" />
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Product Help</h3>
              <Link to={`/contact?product=${product.id}&brand=typhon`} className="mt-3 block font-glonimove text-xl text-[#e8e8e8] hover:text-[#d8c79a]">
                Request configuration support
              </Link>
            </div>
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Compare Category</h3>
              <Link to={`/typhon-machinery?category=${product.category}`} className="mt-3 block font-glonimove text-xl text-[#e8e8e8] hover:text-[#d8c79a]">
                View {product.categoryLabel} models
              </Link>
            </div>
            <div>
              <h3 className="font-googleSans text-2xl font-bold text-white">Product Source</h3>
              {product.sourceUrl ? (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block font-glonimove text-xl text-[#e8e8e8] hover:text-[#d8c79a]"
                >
                  View original Typhon record
                </a>
              ) : (
                <p className="mt-3 font-glonimove text-lg leading-7 text-[#e8e8e8]">
                  Imported from the Typhon Machinery CSV.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="flex flex-col justify-between gap-4 border-t border-white/14 pt-10 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-clofieBold text-4xl font-bold text-white">Related Products</h2>
            <p className="mt-2 font-glonimove text-white/64">Typhon products from the same category and product type appear first.</p>
          </div>
          <Link to="/typhon-machinery" className="font-googleSans text-sm font-bold uppercase text-[#d8c79a] hover:text-white">
            View Typhon Catalog
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <Link
              key={item.id}
              to={getTyphonProductHref(item)}
              className="group bg-[#d9d9d9] text-[#153d28] transition hover:bg-white"
            >
              <div className="h-56 p-4">
                <img src={item.image} alt={item.name} className="h-full w-full object-contain transition group-hover:scale-[1.02]" />
              </div>
              <div className="border-t-4 border-[#153d28] p-4">
                <p className="font-googleSans text-xs font-bold uppercase text-black/58">{item.categoryLabel}</p>
                <h3 className="mt-1 font-clofieBold text-2xl font-bold leading-tight">{item.name}</h3>
                <p className="mt-3 font-glonimove text-sm text-black/70">{item.weight}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TyphonProductSingle;
