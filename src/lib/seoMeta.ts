/**
 * Pure per-route SEO metadata — titles, descriptions, canonicals, and
 * JSON-LD schema for every public route.
 *
 * Single source of truth shared by:
 *   • SeoManager.tsx — applies this to document.head at runtime;
 *   • scripts/prerender-routes.mjs — bakes the same values into static
 *     per-route HTML at build time so non-JS crawlers (Bing, GPTBot,
 *     ClaudeBot, PerplexityBot…) see correct metadata without rendering.
 *
 * No DOM or React imports allowed here — this module must stay bundleable
 * for Node via esbuild.
 */
import { blogPosts, getBlogPostBySlug } from "../data/blogPosts";
import { categories } from "../data/categories";
import { getCategoryBySlug } from "../data/productCategories";
import { products } from "../data/products";
import { getTyphonProductById } from "../data/typhonProducts";
import { normalizeBrandCopy } from "./brandCopy";
import { getPlainText } from "./sanitizeHtml";

export const SITE_URL = "https://konstructz.com";
export const SITE_NAME = "Konstructz";
export const DEFAULT_IMAGE = `${SITE_URL}/img/STOMP%20V980%20v1.png`;

export type FAQ = {
  q: string;
  a: string;
};

export type MetaConfig = {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  canonicalPath?: string;
  schema?: Record<string, unknown>[];
};

export const supportRouteFaqs: Record<string, FAQ[]> = {
  "/support": [
    {
      q: "How long does delivery take?",
      a: "Most in-stock machines ship from our Commerce, CA depot within 2-4 business days, with transit times of 3-10 days depending on your destination. You'll receive tracking once your unit is dispatched.",
    },
    {
      q: "What warranty comes with my machine?",
      a: "Every Konstructz machine ships with a structural and powertrain warranty covering the frame, hydraulics, and diesel engine. Coverage length varies by model - full terms are on the Warranty & Returns page.",
    },
    {
      q: "How do I know which attachment fits?",
      a: "Attachment fit depends on your machine's mounting plate and hydraulic flow. Use our Attachments Support compatibility guide or send us your model and we'll confirm the right match.",
    },
  ],
  "/support/order-purchase-support": [
    {
      q: "Can I change my order after paying a deposit?",
      a: "Yes - modifications to model, attachments, or shipping address are possible before the dispatch stage. Contact purchase support with your order number to adjust.",
    },
    {
      q: "Do you issue formal invoices for accounting?",
      a: "Absolutely. Itemized invoices with tax and freight breakdowns are issued at order confirmation and on request for your records.",
    },
    {
      q: "Can I request a custom build configuration?",
      a: "Yes - many machines accept optional auxiliary hydraulic kits, canopy upgrades, attachment plates, and lighting packages. Tell your specialist what the job site needs and they will confirm what is buildable and how it affects lead time.",
    },
  ],
  "/support/shipping-delivery": [
    {
      q: "How long does delivery take?",
      a: "In-stock machines dispatch within 2-4 business days, then 3-10 days in transit depending on distance. Coast-to-coast freight sits at the longer end of that range.",
    },
    {
      q: "Can I pick up my machine from the warehouse?",
      a: "Yes. Warehouse pickup is available at our Commerce, CA depot by appointment once your unit clears pre-delivery inspection.",
    },
    {
      q: "What happens if my shipment arrives damaged?",
      a: "Note any damage on the delivery receipt, photograph it immediately, and contact our logistics team the same day so we can open a freight claim and arrange resolution.",
    },
  ],
  "/support/warranty-returns": [
    {
      q: "What warranty comes with my machine?",
      a: "Each machine includes structural, powertrain, and hydraulic coverage against manufacturing defects. Exact duration depends on the model and is listed on your purchase documents.",
    },
    {
      q: "How do I file a warranty claim?",
      a: "Submit your machine model, serial number, and issue details through Contact Support. The service team reviews the case, asks for photos or video if needed, and responds with the next practical step.",
    },
    {
      q: "Does the warranty cover wear items?",
      a: "Routine wear items such as filters, teeth, and fluids are maintenance responsibilities and are not covered, but we stock genuine replacements for all of them.",
    },
  ],
  "/support/machine-guidance": [
    {
      q: "How do I choose between an excavator and a skid steer?",
      a: "Choose an excavator for digging, trenching, and reach work; choose a skid steer for surface material handling, loading, and attachment versatility. Many job sites benefit from both.",
    },
    {
      q: "Which machine is best for tight or residential sites?",
      a: "Mini excavators and mini skid steers are built for confined access - they fit through gates and work close to structures without the footprint of full-size machines.",
    },
    {
      q: "Can one machine run multiple attachments?",
      a: "Yes. With the right mounting plate and hydraulic flow, a single machine can run buckets, augers, breakers, and more. See our Attachments Support guide for compatibility.",
    },
  ],
  "/support/attachments-support": [
    {
      q: "How do I maintain my attachments?",
      a: "Grease pivot points regularly, inspect wear parts before each use, and store attachments off the ground. Our maintenance tips section covers the essentials per attachment type.",
    },
    {
      q: "What hydraulic flow does my attachment need?",
      a: "Each powered attachment lists a required GPM and PSI range. Running below spec underperforms; running above risks damage. We help you match attachment demand to machine output.",
    },
    {
      q: "Can I run a high-flow attachment on a standard machine?",
      a: "Only if the selected machine is configured for that attachment's hydraulic demand. Running a mismatched powered tool can underperform, overheat oil, or shorten seal life, so Konstructz confirms the setup before quoting.",
    },
  ],
};

export const categoryMeta: Record<string, { title: string; description: string }> = {
  "mini-excavators": {
    title: "Mini Excavators | Compact Digging Machines | Konstructz",
    description:
      "Compare Konstructz mini excavators for trenching, landscaping, drainage, utility work, demolition prep, and tight-access digging.",
  },
  "mini-skid-steers": {
    title: "Mini Skid Steers & Compact Track Loaders | Konstructz",
    description:
      "Browse Konstructz skid steer loaders for grading, loading, landscaping, cleanup, and attachment-driven compact equipment work.",
  },
  trenchers: {
    title: "Trenchers for Utility, Irrigation & Drainage Work | Konstructz",
    description:
      "Explore Konstructz trenchers for clean utility channels, irrigation lines, drainage runs, fiber routing, and compact jobsite trenching.",
  },
  "wheel-loaders": {
    title: "Wheel Loaders for Material Handling | Konstructz",
    description:
      "Find Konstructz wheel loaders for aggregate yards, construction sites, farms, loading, stockpiling, and repeated material handling.",
  },
  "stone-crushers": {
    title: "Stone Crushers & Jobsite Aggregate Reduction | Konstructz",
    description:
      "Review Konstructz stone crushers for on-site rubble, concrete, masonry, asphalt, stone reduction, and reusable aggregate production.",
  },
  "backhoe-loaders": {
    title: "Backhoe Loaders for Digging & Loading | Konstructz",
    description:
      "Compare Konstructz backhoe loaders for trenching, loading, backfilling, utility repair, farm work, and dual-purpose construction jobs.",
  },
  dumpers: {
    title: "Compact Dumpers & Tracked Material Haulers | Konstructz",
    description:
      "Browse Konstructz dumpers for hauling soil, concrete, aggregate, debris, and bulk materials across narrow or difficult worksites.",
  },
  "towable-excavators": {
    title: "Towable Excavators for Portable Digging | Konstructz",
    description:
      "Explore Konstructz towable excavators for farms, remote sites, drainage, ditching, property maintenance, and portable excavation.",
  },
};

export const staticMeta: Record<string, MetaConfig> = {
  "/": {
    title: "Konstructz | Compact Construction Machinery & Attachments",
    description:
      "Konstructz builds compact construction machinery and attachments for contractors, landscapers, farms, rental fleets, and utility crews.",
  },
  "/equipment": {
    title: "Construction Equipment Catalog | Konstructz",
    description:
      "Browse Konstructz mini excavators, skid steers, trenchers, wheel loaders, dumpers, stone crushers, backhoe loaders, towable excavators, and attachments.",
  },
  "/equipment/konstructz-machine": {
    title: "Konstructz Machine Lineup | Compact Equipment Guide",
    description:
      "Explore the Konstructz compact machinery lineup with buyer guidance, category summaries, attachment support, and jobsite-ready equipment options.",
  },
  "/categories": {
    title: "Equipment Categories | Konstructz Compact Machinery",
    description:
      "Compare Konstructz equipment categories including mini excavators, skid steers, wheel loaders, trenchers, dumpers, crushers, backhoes, and towable excavators.",
  },
  "/product": {
    title: "Konstructz Product Store | Machines, Parts & Attachments",
    description:
      "Browse the Konstructz product store for compact machinery, attachments, parts, and purchase options connected to the equipment catalog.",
  },
  "/typhon-machinery": {
    title: "Typhon Products | Konstructz",
    description:
      "Browse Typhon product pages by category, including excavators, skid steers, forklifts, rollers, scissor lifts, and loaders.",
  },
  "/attachments": {
    title: "Construction Machine Attachments | Konstructz",
    description:
      "Find Konstructz attachments for excavators, skid steers, loaders, drilling, breaking, sorting, handling, and jobsite productivity.",
  },
  "/attachments/mini-excavator": {
    title: "Mini Excavator Attachments | Konstructz",
    description:
      "Choose mini excavator buckets, thumbs, breakers, augers, rippers, and fitment guidance for compact digging machines.",
  },
  "/attachments/mini-skid-steer": {
    title: "Mini Skid Steer Attachments | Konstructz",
    description:
      "Explore skid steer attachment guidance for buckets, forks, augers, trenchers, brooms, grapples, breakers, and quick-attach fitment.",
  },
  "/support": {
    title: "Konstructz Support Center | Warranty, Shipping, Parts & Manuals",
    description:
      "Get help with Konstructz orders, delivery, warranty, returns, manuals, parts, technical support, attachment compatibility, and after-sales service.",
  },
  "/support/order-purchase-support": {
    title: "Order & Purchase Support | Konstructz",
    description:
      "Get help with Konstructz quotes, configuration, payment paperwork, order changes, purchase documentation, and pre-dispatch questions.",
  },
  "/support/shipping-delivery": {
    title: "Shipping & Delivery Support | Konstructz",
    description:
      "Learn how Konstructz coordinates machinery freight, depot pickup, delivery preparation, arrival inspection, and freight issue reporting.",
  },
  "/support/warranty-returns": {
    title: "Warranty & Returns Support | Konstructz",
    description:
      "Understand Konstructz warranty support, claim preparation, maintenance records, parts replacement, return questions, and service next steps.",
  },
  "/support/machine-guidance": {
    title: "Machine Buying Guidance | Konstructz",
    description:
      "Compare compact machinery categories and get help choosing the right excavator, skid steer, loader, dumper, crusher, trencher, or attachment setup.",
  },
  "/support/attachments-support": {
    title: "Attachment Compatibility Support | Konstructz",
    description:
      "Confirm Konstructz attachment fitment, hydraulic flow, coupler type, mounting setup, hose routing, and maintenance requirements before you buy.",
  },
  "/support/contact-support": {
    title: "Contact Konstructz Support | Sales, Parts & Technical Help",
    description:
      "Contact Konstructz for sales support, machine recommendations, order help, delivery questions, parts guidance, and technical support.",
  },
  "/about": {
    title: "About Konstructz | Compact Construction Equipment Brand",
    description:
      "Learn about Konstructz compact machinery, jobsite-ready equipment, practical support, and the contractor-focused approach behind the brand.",
  },
  "/contact": {
    title: "Contact Konstructz | Request a Quote or Machine Guidance",
    description:
      "Contact Konstructz to request a quote, confirm machine fit, ask about attachments, discuss delivery, or get support from the equipment team.",
  },
  "/quality-equipment": {
    title: "Quality Equipment | Konstructz Compact Machinery",
    description:
      "Learn how Konstructz presents compact equipment with clear machine guidance, category context, and practical buyer support.",
  },
  "/trusted-support": {
    title: "Trusted Support | Konstructz Sales, Parts & Service Help",
    description:
      "See how Konstructz supports equipment buyers with sales guidance, attachment fitment help, delivery coordination, and after-sales support.",
  },
  "/job-site-ready": {
    title: "Job-Site Ready Equipment | Konstructz",
    description:
      "Explore the Konstructz focus on compact machinery configured for real access limits, worksite conditions, attachments, and support needs.",
  },
  "/long-term-value": {
    title: "Long-Term Equipment Value | Konstructz",
    description:
      "Learn how Konstructz helps buyers consider configuration, serviceability, attachment fitment, and practical long-term equipment use.",
  },
  "/privacy": {
    title: "Privacy Policy | Konstructz",
    description:
      "Read the Konstructz privacy policy for information about site data, customer inquiries, lead forms, and communication handling.",
  },
  "/policy": {
    title: "Website Policy | Konstructz",
    description:
      "Review Konstructz website policies for public site use, equipment information, support inquiries, and customer communication.",
  },
  "/blog": {
    title: "Construction Machinery Blog | Konstructz Guides & Safety",
    description:
      "Read Konstructz articles about compact equipment, machine safety, buying guidance, attachments, construction workflows, and jobsite planning.",
  },
  "/media": {
    title: "Construction Machinery Media & Equipment Articles | Konstructz",
    description:
      "Browse Konstructz media and equipment articles. The canonical blog archive is available at /blog for search indexing.",
    canonicalPath: "/blog",
  },
};

export const toAbsoluteImage = (image?: string) =>
  image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : undefined;

export const cleanDescription = (value: string, maxLength = 158) => {
  const plain = getPlainText(value).replace(/\s+/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).replace(/\s+\S*$/, "")}.`;
};

const productProperties = (specs: { label: string; value: string }[]) =>
  specs
    .filter((spec) => spec.label.trim() && spec.value.trim())
    .map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    }));

export const faqSchema = (faqs: FAQ[]) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
});

export const baseSchema = () => [
  {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      "Konstructz supplies compact construction machinery and attachments for contractors, landscapers, farmers, rental fleets, and utility crews.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-213-214-2203",
      contactType: "sales and customer support",
      areaServed: "US",
      availableLanguage: ["English", "Spanish"],
    },
  },
  {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  },
];

export const breadcrumbSchema = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      ...parts.map((part, index) => {
        const itemPath = `/${parts.slice(0, index + 1).join("/")}`;
        return {
          "@type": "ListItem",
          position: index + 2,
          name: part
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          item: `${SITE_URL}${itemPath}`,
        };
      }),
    ],
  };
};

export const getRouteConfig = (pathname: string): MetaConfig => {
  const productMatch = pathname.match(/^\/equipment\/([^/]+)$/);
  if (productMatch) {
    const product = products.find((item) => item.id === productMatch[1]);
    if (product) {
      const productUrl = `${SITE_URL}/equipment/${product.id}`;
      const images = (product.gallery?.length ? product.gallery : [product.image])
        .map(toAbsoluteImage)
        .filter(Boolean);
      return {
        title: `${product.name} ${product.categoryLabel} | Konstructz Equipment`,
        description: cleanDescription(
          `${product.name} is a Konstructz ${product.categoryLabel.toLowerCase()} for ${product.description} Review specs, applications, support, and attachment guidance.`
        ),
        image: toAbsoluteImage(product.image),
        schema: [
          {
            "@type": "Product",
            "@id": `${productUrl}#product`,
            name: product.name,
            brand: { "@type": "Brand", name: SITE_NAME },
            category: product.categoryLabel,
            description: getPlainText(product.description),
            url: productUrl,
            image: images,
            additionalProperty: productProperties(product.specs),
          },
        ],
      };
    }
  }

  const typhonProductMatch = pathname.match(/^\/typhon-machinery\/([^/]+)$/);
  if (typhonProductMatch) {
    const product = getTyphonProductById(typhonProductMatch[1]);
    if (product) {
      const productUrl = `${SITE_URL}/typhon-machinery/${product.id}`;
      const images = (product.gallery?.length ? product.gallery : [product.image])
        .map(toAbsoluteImage)
        .filter(Boolean);
      const productSchema: Record<string, unknown> = {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        brand: { "@type": "Brand", name: "Typhon" },
        category: product.categoryLabel,
        description: getPlainText(normalizeBrandCopy(product.description)),
        url: productUrl,
        image: images,
        additionalProperty: productProperties(product.specs),
      };
      if (product.sku) productSchema.sku = product.sku;
      if (product.gtin) productSchema.gtin = product.gtin;

      return {
        title: `${product.name} ${product.categoryLabel} | Typhon`,
        description: cleanDescription(
          `${product.name} is a Typhon ${product.categoryLabel.toLowerCase()} for ${product.applications.join(", ").toLowerCase()}. SKU ${product.sku || "available on request"}.`
        ),
        image: toAbsoluteImage(product.image),
        schema: [productSchema],
      };
    }
  }

  const blogMatch = pathname.match(/^\/(?:blog|media)\/([^/]+)$/);
  if (blogMatch) {
    const post = getBlogPostBySlug(blogMatch[1]);
    if (post) {
      const canonicalPath = `/blog/${post.slug}`;
      return {
        title: `${post.title} | Konstructz Blog`,
        description: post.excerpt,
        image: toAbsoluteImage(post.image),
        type: "article",
        canonicalPath,
        schema: [
          {
            "@type": "BlogPosting",
            "@id": `${SITE_URL}${canonicalPath}#article`,
            headline: post.title,
            description: post.excerpt,
            image: toAbsoluteImage(post.image),
            author: { "@type": "Person", name: post.author },
            publisher: { "@id": `${SITE_URL}/#organization` },
            datePublished: post.date,
            mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
          },
        ],
      };
    }
  }

  const categoryMatch = pathname.match(/^\/(?:product|equipment)\/([^/]+)$/);
  const categorySlug = categoryMatch?.[1] ?? "";
  const categoryConfig = getCategoryBySlug(categorySlug);
  if (categoryConfig) {
    const legacyCategory = categories.find((item) => item.slug === categorySlug || item.id === categorySlug);
    const preferredPath = `/product/${categorySlug}`;
    return {
      ...(categoryMeta[categorySlug] ?? {
        title: `${categoryConfig.name} | Konstructz Equipment`,
        description: categoryConfig.shortDescription,
      }),
      canonicalPath: preferredPath,
      image: toAbsoluteImage(categoryConfig.heroImage || legacyCategory?.image) ?? DEFAULT_IMAGE,
      schema: categoryConfig.faqs.length ? [faqSchema(categoryConfig.faqs)] : undefined,
    };
  }

  const config = staticMeta[pathname] ?? staticMeta["/"];
  const routeFaqs = supportRouteFaqs[pathname];
  const schema = routeFaqs ? [faqSchema(routeFaqs), ...(config.schema ?? [])] : config.schema;
  return { ...config, schema };
};

/** Blog posts bundled at build time — used by the prerenderer for fallbacks. */
export { blogPosts };
