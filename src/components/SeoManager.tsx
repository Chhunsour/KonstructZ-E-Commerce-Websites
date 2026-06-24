import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { blogPosts, getBlogPostBySlug } from "../data/blogPosts";
import { categories } from "../data/categories";
import { products } from "../data/products";

const SITE_URL = "https://konstructz.com";
const SITE_NAME = "Konstructz";
const DEFAULT_IMAGE = `${SITE_URL}/img/STOMP%20V980%20v1.png`;

type FAQ = {
  q: string;
  a: string;
};

type MetaConfig = {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  schema?: Record<string, unknown>[];
};

const categoryFaqs: Record<string, FAQ[]> = {
  "mini-excavators": [
    {
      q: "What is a mini excavator used for?",
      a: "A mini excavator is used for trenching, drainage, small foundations, landscaping, demolition prep, and utility work where access is tight.",
    },
    {
      q: "Who should choose a mini excavator?",
      a: "Choose a mini excavator if you need precise digging power on residential, landscaping, farm, or compact commercial worksites.",
    },
  ],
  "skid-steer-loaders": [
    {
      q: "What is a skid steer loader used for?",
      a: "A skid steer loader is used for loading, grading, cleanup, snow work, material handling, and powered attachments such as augers or trenchers.",
    },
    {
      q: "How do I choose the right skid steer?",
      a: "Match the machine to rated operating capacity, ground conditions, hydraulic flow needs, transport weight, and attachment plans.",
    },
  ],
  "mini-skid-steers": [
    {
      q: "What is a mini skid steer used for?",
      a: "A mini skid steer is used for compact loading, grading, landscaping, cleanup, material handling, and attachment work where larger loaders cannot easily fit.",
    },
    {
      q: "How do I choose the right mini skid steer?",
      a: "Match the machine to access width, operating surface, attachment needs, hydraulic flow, lift requirements, and transport setup.",
    },
  ],
  trenchers: [
    {
      q: "What is a trencher used for?",
      a: "A trencher cuts narrow channels for irrigation, drainage, electrical conduit, fiber, water lines, and other utility runs.",
    },
  ],
  "wheel-loaders": [
    {
      q: "What is a wheel loader best for?",
      a: "A wheel loader is best for loading, stockpiling, moving aggregate, clearing yards, and repeated material handling on firm ground.",
    },
  ],
  dumpers: [
    {
      q: "What is a compact dumper used for?",
      a: "A compact dumper hauls soil, concrete, aggregate, debris, and other materials across soft, narrow, or sloped jobsites.",
    },
  ],
  "stone-crushers": [
    {
      q: "What is a stone crusher used for?",
      a: "A stone crusher reduces concrete, rubble, masonry, asphalt, and stone into usable fill or aggregate on or near the jobsite.",
    },
  ],
  "backhoe-loaders": [
    {
      q: "Why choose a backhoe loader?",
      a: "A backhoe loader combines front loading and rear digging in one machine, making it useful for utility, farm, road, and site-prep work.",
    },
  ],
  "towable-excavators": [
    {
      q: "Who should choose a towable excavator?",
      a: "A towable excavator is useful for landowners, farms, remote maintenance crews, and smaller jobs that need portable digging power.",
    },
  ],
};

const supportFaqs: FAQ[] = [
  {
    q: "What support is available after purchase?",
    a: "Konstructz helps with order questions, delivery coordination, manuals, parts guidance, attachment fitment, technical support, and warranty or return questions.",
  },
  {
    q: "How should I maintain compact machinery?",
    a: "Follow the operator manual, grease pins regularly, check fluids and filters, inspect tracks or tires, keep attachments secure, and address leaks before work continues.",
  },
  {
    q: "How do I get the right machine recommendation?",
    a: "Share your job type, access limits, soil or surface conditions, attachment needs, transport setup, and expected duty cycle with the Konstructz team.",
  },
];

const categoryMeta: Record<string, { title: string; description: string }> = {
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

const staticMeta: Record<string, MetaConfig> = {
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
  "/blog": {
    title: "Construction Machinery Blog | Konstructz Guides & Safety",
    description:
      "Read Konstructz articles about compact equipment, machine safety, buying guidance, attachments, construction workflows, and jobsite planning.",
  },
  "/media": {
    title: "Construction Machinery Blog | Konstructz Guides & Safety",
    description:
      "Read Konstructz articles about compact equipment, machine safety, buying guidance, attachments, construction workflows, and jobsite planning.",
  },
};

const upsertMeta = (selector: string, create: () => HTMLMetaElement, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureCanonical = (href: string) => {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const faqSchema = (faqs: FAQ[]) => ({
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

const baseSchema = () => [
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

const breadcrumbSchema = (pathname: string) => {
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

const getRouteConfig = (pathname: string): MetaConfig => {
  const productMatch = pathname.match(/^\/equipment\/([^/]+)$/);
  if (productMatch) {
    const product = products.find((item) => item.id === productMatch[1]);
    if (product) {
      return {
        title: `${product.name} ${product.categoryLabel} | Konstructz Equipment`,
        description: `${product.name} is a Konstructz ${product.categoryLabel.toLowerCase()} for ${product.description.toLowerCase()} Review applications, buyer guidance, support, and attachment fitment.`,
        image: product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`,
        schema: [
          {
            "@type": "Product",
            name: product.name,
            brand: { "@type": "Brand", name: SITE_NAME },
            category: product.categoryLabel,
            description: product.description,
            image: product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`,
          },
        ],
      };
    }
  }

  const blogMatch = pathname.match(/^\/(?:blog|media)\/([^/]+)$/);
  if (blogMatch) {
    const post = getBlogPostBySlug(blogMatch[1]);
    if (post) {
      return {
        title: `${post.title} | Konstructz Blog`,
        description: post.excerpt,
        image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
        type: "article",
        schema: [
          {
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
            author: { "@type": "Person", name: post.author },
            publisher: { "@id": `${SITE_URL}/#organization` },
            datePublished: post.date,
            mainEntityOfPage: `${SITE_URL}${pathname}`,
          },
        ],
      };
    }
  }

  const categorySlug = pathname.replace("/equipment/", "");
  if (categoryMeta[categorySlug]) {
    const category = categories.find((item) => item.slug === categorySlug || item.id === categorySlug);
    return {
      ...categoryMeta[categorySlug],
      image: category?.image
        ? category.image.startsWith("http")
          ? category.image
          : `${SITE_URL}${category.image}`
        : DEFAULT_IMAGE,
      schema: categoryFaqs[categorySlug] ? [faqSchema(categoryFaqs[categorySlug])] : undefined,
    };
  }

  const config = staticMeta[pathname] ?? staticMeta["/"];
  const schema = pathname.startsWith("/support") ? [faqSchema(supportFaqs), ...(config.schema ?? [])] : config.schema;
  return { ...config, schema };
};

export const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname === "" ? "/" : location.pathname;
    const config = getRouteConfig(pathname);
    const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    const image = config.image ?? DEFAULT_IMAGE;

    document.title = config.title;
    upsertMeta('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    }, config.description);
    upsertMeta('meta[property="og:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    }, config.title);
    upsertMeta('meta[property="og:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    }, config.description);
    upsertMeta('meta[property="og:type"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:type");
      return tag;
    }, config.type ?? "website");
    upsertMeta('meta[property="og:url"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:url");
      return tag;
    }, canonical);
    upsertMeta('meta[property="og:image"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:image");
      return tag;
    }, image);
    upsertMeta('meta[name="twitter:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:title");
      return tag;
    }, config.title);
    upsertMeta('meta[name="twitter:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:description");
      return tag;
    }, config.description);
    upsertMeta('meta[name="twitter:image"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:image");
      return tag;
    }, image);
    ensureCanonical(canonical);

    document.head.querySelectorAll('script[data-konstructz-schema="true"]').forEach((node) => node.remove());
    const graph = [...baseSchema(), breadcrumbSchema(pathname), ...(config.schema ?? [])];
    const schemaTag = document.createElement("script");
    schemaTag.type = "application/ld+json";
    schemaTag.dataset.konstructzSchema = "true";
    schemaTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
    document.head.appendChild(schemaTag);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
