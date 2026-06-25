import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../../../data/products";
import { useI18n } from "../../../../context/I18nContext";

interface ProductDescriptionSectionProps {
  product: Product;
}

interface CategoryContent {
  intro: string;
  chooseIf: string;
  whatItIsUsedFor: string[];
  benefits: string[];
  applications: string[];
  buyerGuidance: string[];
  maintenance: string[];
  faqs: { q: string; a: string; }[];
  tableData: {
    category: string;
    applications: string;
    powerType: string;
    bestFor: string;
    attachments: string;
    worksiteUse: string;
    advantages: string;
    maintenanceNotes: string;
  };
}

// Complete category-based content catalog
const CATEGORY_CATALOG: Record<string, CategoryContent> = {
  "skid-steer-loaders": {
    intro: "A Konstructz skid steer loader is built for crews that need one compact machine to load, grade, clean up, carry material, and run attachments through the same workday. The category is strongest on sites where maneuverability, hydraulic tool support, and fast task changes matter more than oversized equipment.",
    chooseIf: "Choose this machine if your crew needs one compact loader to load, grade, carry, clear, and power attachments across changing jobsite tasks. It is especially useful when access is tight but daily production still matters.",
    whatItIsUsedFor: [
      "Earthmoving, excavation, and site preparation",
      "Material handling, loading trucks, and debris clean-up",
      "Landscaping, grading, and post-hole digging",
      "Operating specialized attachments like sweepers, augers, and trenchers"
    ],
    benefits: [
      "Tight-turning control for confined yards, alleys, and residential access",
      "Attachment-ready layout for buckets, forks, augers, sweepers, trenchers, and grapples",
      "Track or wheel configurations can be matched to surface and ground conditions",
      "Operator-focused controls keep repeated loading and grading cycles predictable"
    ],
    applications: ["Construction", "Landscaping", "Farming", "Utility work"],
    buyerGuidance: [
      "Choose based on your heaviest routine load, access width, and the surfaces you work on most.",
      "Verify hydraulic flow needs before ordering powered attachments.",
      "Consider undercarriage options (tracks vs. wheels) depending on ground conditions."
    ],
    maintenance: [
      "Perform daily pre-start inspections of fluid levels and track/tire condition.",
      "Clean the undercarriage regularly to prevent aggregate build-up.",
      "Follow the service schedule for engine oil, hydraulic, and air filter replacements."
    ],
    faqs: [
      {
        q: "Can I use common skid steer attachments?",
        a: "Many common attachments can be matched to Konstructz skid steers, but coupler type, hydraulic flow, electrical needs, and machine balance must be confirmed before purchase."
      },
      {
        q: "What type of fuel is recommended?",
        a: "Clean, ultra-low sulfur diesel fuel (ULSD) is recommended for optimal engine life and emission compliance."
      },
      {
        q: "Is training required to operate these machines?",
        a: "We recommend operators receive safety training and read the instruction manual fully before running the equipment."
      }
    ],
    tableData: {
      category: "Skid Steer / Track Loader",
      applications: "Earthmoving, material handling, grading, landscaping",
      powerType: "Diesel engine powertrain (25 - 72 HP)",
      bestFor: "High-maneuverability tasks and heavy multi-tool operations",
      attachments: "Common quick-attach workflow for augers, trenchers, forks, buckets, and grapples",
      worksiteUse: "Confined spaces, soft ground, residential and commercial yards",
      advantages: "Compact agility, attachment flexibility, and strong traction options",
      maintenanceNotes: "Hydraulic-fluid checks, undercarriage cleaning, quick-attach inspection, and routine greasing"
    }
  },
  "mini-excavators": {
    intro: "A Konstructz mini excavator gives contractors, property owners, landscapers, and utility crews controlled digging power without the footprint of a full-size excavator. It is designed for trenching, shaping, demolition prep, drainage, and attachment work in areas where access and surface protection matter.",
    chooseIf: "Choose this machine if your work is built around digging accuracy, trench control, foundation prep, landscaping, drainage, or utility access. It is the practical choice when a full-size excavator is too large for the site.",
    whatItIsUsedFor: [
      "Utility trenching for pipes, water lines, and electrical conduits",
      "Footings and foundation excavation",
      "Demolition of small structures and concrete breaking",
      "Landscaping, tree planting, and retaining wall preparation"
    ],
    benefits: [
      "Compact tracked footprint helps protect access routes and finished surfaces",
      "Controlled boom, arm, and bucket movement supports careful work near structures",
      "Attachment support can expand one machine into digging, grabbing, drilling, and breaking roles",
      "Transport-friendly size helps crews move between residential and commercial jobs"
    ],
    applications: ["Utility installations", "Landscaping", "Foundation digging", "Demolition"],
    buyerGuidance: [
      "Select the model around your common trench depth, access width, soil conditions, and lift expectations.",
      "For tight work near walls or fences, confirm tail-swing clearance before purchase.",
      "Match buckets, thumbs, augers, and breakers to the machine's hydraulic setup before ordering."
    ],
    maintenance: [
      "Grease boom, arm, and bucket pins daily to minimize wear.",
      "Check track tension and inspect rubber tracks for cuts or cracks.",
      "Inspect hydraulic hoses and fittings for leaks or wear before operation."
    ],
    faqs: [
      {
        q: "Are the rubber tracks durable?",
        a: "Track construction varies by model and configuration. The right track choice depends on the surface, soil, transport method, and expected duty cycle."
      },
      {
        q: "Can it be configured for powered attachments?",
        a: "Attachment plumbing depends on final configuration. Confirm auxiliary lines, coupler type, and flow needs with Konstructz before ordering powered tools."
      },
      {
        q: "What is the warranty coverage?",
        a: "Standard warranty details vary by final configuration. Please contact our support team for documentation."
      }
    ],
    tableData: {
      category: "Compact Mini Excavator",
      applications: "Trenching, footings, foundation prep, landscaping, demolition",
      powerType: "Diesel or gas powertrain options (18 - 25 HP)",
      bestFor: "Precise digging in restricted or residential spaces",
      attachments: "Compatible with buckets, hydraulic thumbs, augers, breakers",
      worksiteUse: "Narrow yards, utility corridors, near building walls",
      advantages: "Precise digging, compact access, broad attachment support, and controlled operation",
      maintenanceNotes: "Grease points, track condition, hydraulic hoses, filters, and coupler locks"
    }
  },
  "wheel-loaders": {
    intro: "A Konstructz wheel loader is built for repeated material movement: loading trucks, feeding hoppers, clearing yards, handling aggregate, and keeping stockpiles organized. It fits operations where travel speed, bucket control, visibility, and steady loading cycles matter.",
    chooseIf: "Choose this machine if your main bottleneck is moving bulk material quickly: aggregate, soil, mulch, feed, palletized goods, or stockpile material. Wheel loaders work best where repeated loading cycles and travel speed matter.",
    whatItIsUsedFor: [
      "Bulk material loading and stockpiling",
      "Truck loading and hopper feeding",
      "Site clean-up, grading, and leveling",
      "Agricultural feed, manure, and silage handling"
    ],
    benefits: [
      "Articulated steering keeps loading cycles controlled in yards and stockpile areas",
      "Wheel configuration is efficient on firm ground, paved lots, and repeated travel routes",
      "Bucket and fork options let one machine support loading, staging, and cleanup",
      "Operator visibility and simple controls matter during repetitive material handling"
    ],
    applications: ["Aggregate loading", "Agriculture", "Commercial construction", "Road work"],
    buyerGuidance: [
      "Select loader size around material type, truck height, route distance, and ground condition.",
      "Confirm dump clearance against the trucks, hoppers, or bins you load most often.",
      "Review tire options (e.g., agricultural, industrial) for your specific ground surface."
    ],
    maintenance: [
      "Check engine oil, coolant levels, and transmission fluid before starting.",
      "Clean air filters regularly, especially when operating in dusty aggregate environments.",
      "Inspect loader linkage pins and lubricate them according to the manual."
    ],
    faqs: [
      {
        q: "Can a wheel loader work on paved yards?",
        a: "Wheel loaders are generally better suited than tracked machines for paved yards and firm travel routes. Local road-use rules and machine configuration still need to be confirmed."
      },
      {
        q: "Which attachments are most useful for a wheel loader?",
        a: "Common wheel-loader tools include general-purpose buckets, light-material buckets, pallet forks, grapples, snow tools, and cleanup attachments."
      }
    ],
    tableData: {
      category: "Articulated Wheel Loader",
      applications: "Bulk material loading, stockpiling, agricultural transport",
      powerType: "Diesel powertrain options (25 - 74 HP)",
      bestFor: "High-speed bulk material handling and transferring",
      attachments: "Forks, buckets, sweepers, grapples, and snow tools depending on setup",
      worksiteUse: "Aggregate yards, farms, large construction sites",
      advantages: "Strong material flow, yard mobility, controlled loading, and multi-tool utility",
      maintenanceNotes: "Linkage grease points, engine oil intervals, and tire pressure monitoring"
    }
  },
  "backhoe-loaders": {
    intro: "A Konstructz backhoe loader is for sites that need digging and front loading from one machine platform. It can trench, backfill, move loose material, handle site cleanup, and support utility work without bringing separate loader and excavator units to every job.",
    chooseIf: "Choose this machine if your site needs both digging and loading but does not justify moving two separate machines. It is a strong fit for utility repair, farm work, road edges, and general site service.",
    whatItIsUsedFor: [
      "Excavating trenches and backfilling soil",
      "Loading materials into dump trucks",
      "Positioning pipe, jobsite material, and compact attachments within safe working limits",
      "Breaking concrete and asphalt for utility repair"
    ],
    benefits: [
      "Dual-purpose layout reduces machine swaps on small and mid-size jobs",
      "Front bucket and rear boom support trenching, loading, and backfill sequences",
      "Stabilizer setup helps prepare the machine for controlled digging",
      "Single-machine workflow is useful for utility repair, farms, roadsides, and service yards"
    ],
    applications: ["Road repair", "Utility trenching", "Public works", "Farming & development"],
    buyerGuidance: [
      "Evaluate reach and digging needs against your typical trench and repair work.",
      "Check loader configuration against the material you move most often.",
      "Examine worksite spaces to ensure the machine can deploy its stabilizer legs safely."
    ],
    maintenance: [
      "Perform grease maintenance on both the front loader arms and rear backhoe linkage.",
      "Inspect stabilizer leg pads and locking pins for structural integrity.",
      "Check hydraulic pump pressures and hydraulic fluid levels regularly."
    ],
    faqs: [
      {
        q: "How does the operator control both sections?",
        a: "Operator layout varies by model. The important check is whether the controls, stabilizer setup, and visibility fit the way your crew moves between loading and digging tasks."
      },
      {
        q: "What attachments can I run on a backhoe?",
        a: "You can run buckets of various sizes, hydraulic breakers, and augers on the backhoe, and forks or sweepers on the front loader."
      }
    ],
    tableData: {
      category: "Backhoe Loader (Dual-Duty)",
      applications: "Trenching, loading, backfilling, material handling",
      powerType: "Diesel powertrain options (74.5 HP)",
      bestFor: "Worksite tasks requiring both loading and digging in one unit",
      attachments: "Digger buckets, hammers, front forks, landscape buckets",
      worksiteUse: "Roads, utilities, farms, and public works projects",
      advantages: "Digging and loading in one platform, fewer machine moves, and strong jobsite flexibility",
      maintenanceNotes: "Dual-end grease points, stabilizer checks, hydraulic health checks"
    }
  },
  "dumpers": {
    intro: "A Konstructz dumper is built to keep material moving when wheelbarrows, small trucks, or loader shuttles slow the job down. It is most useful for hauling soil, aggregate, concrete, debris, and landscape material through narrow, soft, or uneven access routes.",
    chooseIf: "Choose this machine if your crew loses time moving material by wheelbarrow, compact truck, or loader shuttle. Dumpers are designed for short, repetitive hauling on rough, soft, narrow, or sloped access routes.",
    whatItIsUsedFor: [
      "Hauling concrete, aggregates, soil, and site debris",
      "Transporting materials across soft, wet, or hilly ground",
      "Backfilling utility trenches and landscaping yards",
      "Site clean-up and muck-away operations"
    ],
    benefits: [
      "Compact hauling format reduces manual material handling",
      "Tracked configurations can help on soft, uneven, or narrow access routes",
      "Self-loading and swivel-dump options vary by setup and can improve placement control",
      "Useful support machine for excavators, concrete crews, landscapers, and demolition cleanup"
    ],
    applications: ["Soft-ground hauling", "Backyard landscaping", "Urban demolition", "Trail building"],
    buyerGuidance: [
      "Match hauling class to your material type, haul distance, slope, and access width.",
      "Choose a model with a self-loading shovel if working without an auxiliary excavator.",
      "Consider a 180-degree swivel dump box for precise side-dumping in narrow trenches."
    ],
    maintenance: [
      "Clear mud and rocks from the track rollers and undercarriage daily.",
      "Check track tension and inspect rubber tracks for signs of puncture or wear.",
      "Inspect the hydraulic cylinder and hoses controlling the dump mechanism."
    ],
    faqs: [
      {
        q: "Can the dumper spin in place?",
        a: "Turning behavior depends on track setup, ground condition, load, and operator technique. Confirm maneuverability needs before choosing a model."
      },
      {
        q: "Does the dumper damage lawns?",
        a: "Tracked dumpers can reduce ground pressure compared with wheeled hauling, but turf protection depends on load, soil moisture, turns, and the selected track setup."
      }
    ],
    tableData: {
      category: "Tracked Compact Dumper",
      applications: "Material hauling, concrete transport, landscaping, excavation cleanup",
      powerType: "Reliable diesel or gas engine (13 - 25 HP)",
      bestFor: "Transporting heavy materials over mud, slopes, and soft ground",
      attachments: "Self-loading shovel, flatbed options (varies by config)",
      worksiteUse: "Backyards, wet fields, narrow trails, demolition sites",
      advantages: "Compact hauling, controlled dumping, rough-access movement, and reduced manual handling",
      maintenanceNotes: "Undercarriage cleaning, dump cylinder lubrication, track wear monitoring"
    }
  },
  "stone-crushers": {
    intro: "A Konstructz stone crusher helps crews process rubble, concrete, masonry, asphalt, and fieldstone closer to the work area. The goal is simple: reduce hauling, sort material more efficiently, and turn compatible site debris into usable fill or aggregate where the project allows it.",
    chooseIf: "Choose this machine if you regularly handle concrete, masonry, asphalt, rubble, or fieldstone and want to reduce hauling and disposal cycles. It is best for crews that can reuse crushed material on the same project or yard.",
    whatItIsUsedFor: [
      "Crushing concrete, masonry, brick, and asphalt rubble on-site",
      "Creating sub-base material and road fill from debris",
      "Recycling demolition waste into usable aggregates",
      "Fieldstone and river rock reduction for landscaping"
    ],
    benefits: [
      "Helps reduce off-site hauling when reclaimed material can be reused",
      "Output size and throughput depend on material, setup, and machine configuration",
      "Useful for demolition cleanup, landscape supply, road-base prep, and yard recycling",
      "Wear parts, belts, guards, and dust control should be planned before heavy use"
    ],
    applications: ["Demolition recycling", "Road base prep", "Rock reclaiming", "Landscape depot"],
    buyerGuidance: [
      "Select the crusher around material type, desired output, feed preparation, and site access.",
      "Plan how oversized material, metal, dust, and finished aggregate will be handled.",
      "Confirm powertrain, feed size, and output settings before purchase."
    ],
    maintenance: [
      "Inspect jaw plates daily for wear and tighten bolts if necessary.",
      "Lubricate the heavy-duty eccentric shaft bearings at the recommended intervals.",
      "Check drive belt tension and inspect filters in dusty conditions."
    ],
    faqs: [
      {
        q: "Can it crush concrete with rebar inside?",
        a: "Rebar handling depends on crusher configuration and the material stream. Ask Konstructz to confirm whether a separator or different processing method is needed."
      },
      {
        q: "How do I adjust the output size?",
        a: "Output adjustment varies by crusher model. Confirm the adjustment method and expected material size before ordering."
      }
    ],
    tableData: {
      category: "Mobile Jaw Crusher",
      applications: "Demolition recycling, concrete crushing, sub-base creation",
      powerType: "Diesel engine or Electric powertrain (24 - 115 HP)",
      bestFor: "On-site recycling of masonry, concrete, and stone waste",
      attachments: "Magnetic separators, dust suppression sprays",
      worksiteUse: "Demolition sites, recycling centers, stone quarries",
      advantages: "On-site material reduction, reuse potential, less hauling, and better debris control",
      maintenanceNotes: "Jaw plate wear check, main shaft bearing lubrication, belt tensioning"
    }
  },
  "trenchers": {
    intro: "A Konstructz trencher is built for repeatable narrow cuts where a bucket would be slower or less precise. It supports irrigation, drainage, conduit, landscape lighting, utility routing, and other trench paths that need consistent width and controlled spoil placement.",
    chooseIf: "Choose this machine if your work depends on straight, repeatable trenches for pipe, drainage, irrigation, fiber, landscape lighting, or utility conduit. It saves time when the trench path is narrow and consistent.",
    whatItIsUsedFor: [
      "Digging trenches for water lines, gas pipes, and electric lines",
      "Irrigation system installation and drainage channel prep",
      "Root barrier cutting and foundation outlining",
      "Installing underground lighting and landscaping cables"
    ],
    benefits: [
      "Narrow cutting path keeps utility work cleaner than broad excavation",
      "Track or wheel setup can be matched to turf, soil, and access conditions",
      "Chain selection should match clay, roots, loose soil, or rocky ground",
      "Spoil handling helps keep the trench line open for pipe, wire, or drainage work"
    ],
    applications: ["Utility pipe laying", "Irrigation prep", "Drainage install", "Fiber optic routing"],
    buyerGuidance: [
      "Determine required trench depth, width, soil type, route length, and access clearance.",
      "Choose track models when the work calls for more ground contact and lower turf disruption.",
      "Review the chain configurations (e.g., cup teeth vs. shark teeth) for clay vs. rock soil."
    ],
    maintenance: [
      "Check the cutting chain tension and oil the chain guide bar daily.",
      "Clean dirt and debris from the digging boom, track guides, and auger.",
      "Inspect teeth for breakage and replace worn teeth to maintain digging speed."
    ],
    faqs: [
      {
        q: "Does it dig through tree roots?",
        a: "Root and rock performance depends on chain type, ground conditions, and machine configuration. Share your soil conditions before choosing a chain."
      },
      {
        q: "What happens to the soil that is dug up?",
        a: "The integrated auger pushes the soil to the side of the trench, making it easy to backfill once utility work is done."
      }
    ],
    tableData: {
      category: "Tracked Utility Trencher",
      applications: "Utility trenching, irrigation prep, drainage installations",
      powerType: "Gasoline engine (35 HP)",
      bestFor: "Digging straight, narrow channels for pipes and cables",
      attachments: "Alternative chain types (rock, clay, turf)",
      worksiteUse: "Lawns, golf courses, utility corridors, farms",
      advantages: "Consistent trench width, controlled spoil, faster utility routing, and cleaner backfill prep",
      maintenanceNotes: "Chain tension adjustment, teeth replacement, auger cleanup"
    }
  },
  "towable-excavators": {
    intro: "A Konstructz towable excavator is a portable digging solution for farms, landowners, trail crews, and smaller contractors who need occasional excavation away from dense jobsite infrastructure. It favors transport simplicity, setup flexibility, and practical maintenance over high-volume earthmoving.",
    chooseIf: "Choose this machine if portability, simple transport, and remote-site access are more important than high-volume excavation. It suits farms, land maintenance, trail work, small drainage jobs, and property owners who need occasional digging power.",
    whatItIsUsedFor: [
      "Remote-site excavation, pond digging, and drainage prep",
      "Land clearing, stump removal, and planting large trees",
      "Small foundation trenching and post-hole digging",
      "Ditch clearing and path maintenance on hillsides"
    ],
    benefits: [
      "Portable format supports remote property, farm, drainage, and trail maintenance",
      "Outrigger setup helps prepare the machine before digging begins",
      "Simple mechanical layout keeps ownership and inspection straightforward",
      "Useful when a larger excavator cannot be staged economically"
    ],
    applications: ["Remote off-grid digging", "Trail & park maintenance", "Sensitive turf yards", "Farming"],
    buyerGuidance: [
      "Confirm towing rules, coupler setup, trailer requirements, and local transport regulations.",
      "Verify that the digging depth and reach fit your ditching or planting projects.",
      "Ensure you have flat mud plates for outriggers if working on soft or swampy ground."
    ],
    maintenance: [
      "Grease boom pivots and bucket linkage pins according to the operator manual.",
      "Inspect outrigger locking pins and structural frame welds for safety.",
      "Check engine oil levels and hydraulic cylinder seals."
    ],
    faqs: [
      {
        q: "How is the excavator moved around the worksite?",
        a: "Operators use the digging arm to pull or push the machine short distances, or they can hook it to an ATV for longer relocations."
      },
      {
        q: "Can I tow this on public roads?",
        a: "Road towing rules depend on configuration and local regulations. Confirm coupler, lighting, tire, registration, and tow-vehicle requirements before transport."
      }
    ],
    tableData: {
      category: "Towable Outrigger Excavator",
      applications: "Remote excavation, trenching, park trails, farm maintenance",
      powerType: "Compact gasoline engine (9 HP)",
      bestFor: "Sensitive turf and remote, off-grid digging projects",
      attachments: "Various bucket sizes, ripper tooth, mechanical thumb",
      worksiteUse: "Steep slopes, soft yards, narrow wooded paths",
      advantages: "Portable digging, simple setup, remote access, and practical ownership",
      maintenanceNotes: "Pivot pin greasing, coupler safety check, hydraulic cylinder seals check"
    }
  }
};

export const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({ product }) => {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactItems = [
    {
      titleKey: "contact.email",
      content: [
        { text: "support@konstructz.com", href: "mailto:support@konstructz.com" },
        { text: "sales@konstructz.com", href: "mailto:sales@konstructz.com" },
      ],
    },
    {
      titleKey: "contact.phoneNumber",
      content: [
        { text: "+1 213-214-2203", href: "tel:+12132142203" },
      ],
    },
    {
      titleKey: "contact.location",
      content: [
        {
          text: t("auto.productdescription.2522.s.malt"),
          href: "https://www.google.com/maps/search/?api=1&query=2522+S+Malt+Ave,+Commerce,+CA+90040",
        },
      ],
      multiline: true,
    },
  ];

  // Retrieve category-specific content, fall back to skid steer if category not found
  const categoryInfo = CATEGORY_CATALOG[product.category] || CATEGORY_CATALOG["skid-steer-loaders"];

  return (
    <section
      aria-labelledby="product-description-heading"
      className="relative ml-[90px] mt-[100px] w-[1740px] text-theme-text transition-colors duration-200"
    >
      <div className="flex gap-[58px] w-[1740px] text-theme-text items-start">
        {/* Left Column: Specifications Guide & Buyer-focused sections */}
        <div className="w-[1289px] flex flex-col gap-12">
          {/* Header row */}
          <div className="border-b border-theme-border/20 pb-3">
            <h2 id="product-description-heading" className="font-clofieBold text-[45px] font-bold text-theme-heading whitespace-nowrap">
              {t("product.description")}
            </h2>
          </div>

          {/* Intro paragraph */}
          <p className="font-glonimove text-[22px] font-normal leading-relaxed text-theme-text text-justify">
            {categoryInfo.intro}
          </p>

          {/* Clean modern table: General Machine Overview / Specification Guide */}
          <div className="flex flex-col gap-4">
            <h3 className="font-glonimoveBold text-[28px] text-[#d8c79a]">
              General Machine Overview
            </h3>
            <div className="overflow-x-auto w-full border border-theme-border/20 rounded">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#153D28] border-b border-theme-border/20">
                    <th className="p-4 text-left font-glonimoveBold text-lg text-[#d8c79a] w-1/3">Planning Field</th>
                    <th className="p-4 text-left font-glonimoveBold text-lg text-white">General Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/10 font-glonimove text-base">
                  <tr className="bg-theme-sec/10 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Machine Category</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.category}</td>
                  </tr>
                  <tr className="bg-theme-sec/5 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Common Applications</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.applications}</td>
                  </tr>
                  <tr className="bg-theme-sec/10 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Power Type / Engine Type</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.powerType}</td>
                  </tr>
                  <tr className="bg-theme-sec/5 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Best For</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.bestFor}</td>
                  </tr>
                  <tr className="bg-theme-sec/10 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Attachment Support</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.attachments}</td>
                  </tr>
                  <tr className="bg-theme-sec/5 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Worksite Use</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.worksiteUse}</td>
                  </tr>
                  <tr className="bg-theme-sec/10 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Key Advantages</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.advantages}</td>
                  </tr>
                  <tr className="bg-theme-sec/5 hover:bg-theme-sec/20 transition-colors">
                    <td className="p-4 font-bold text-theme-heading">Maintenance Notes</td>
                    <td className="p-4 text-theme-text">{categoryInfo.tableData.maintenanceNotes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-glonimove text-sm text-theme-muted italic">
              Note: Exact specifications, dimensions, warranty terms, and attachment compatibility vary by final configuration. Confirm the selected setup before purchase.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 p-6 bg-theme-sec/5 border border-theme-border/10 rounded">
              <h3 className="font-glonimoveBold text-[24px] text-[#d8c79a]">
                Who Should Choose This Machine?
              </h3>
              <p className="font-glonimove text-lg leading-relaxed text-theme-muted">
                {categoryInfo.chooseIf}
              </p>
            </div>

            <div className="flex flex-col gap-4 p-6 bg-theme-sec/5 border border-theme-border/10 rounded">
              <h3 className="font-glonimoveBold text-[24px] text-[#d8c79a]">
                Before You Request A Quote
              </h3>
              <p className="font-glonimove text-lg leading-relaxed text-theme-muted">
                Share your job type, working surface, access limits, attachment plans, transport setup, and expected duty cycle. Those details help the Konstructz team recommend the right model and configuration without relying on guesswork.
              </p>
            </div>
          </div>

          {/* Two-column layout for Primary Use Cases and Benefits */}
          <div className="grid grid-cols-2 gap-8">
            {/* Primary Use-Cases */}
            <div className="bg-theme-sec/10 border border-theme-border/10 p-6 rounded flex flex-col gap-4">
              <h3 className="font-glonimoveBold text-[24px] text-theme-heading border-b border-theme-border/15 pb-2">
                Primary Use-Cases
              </h3>
              <ul className="list-none flex flex-col gap-3 font-glonimove text-lg">
                {categoryInfo.whatItIsUsedFor.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-theme-accent text-xl leading-none">■</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category Benefits */}
            <div className="bg-theme-sec/10 border border-theme-border/10 p-6 rounded flex flex-col gap-4">
              <h3 className="font-glonimoveBold text-[24px] text-theme-heading border-b border-theme-border/15 pb-2">
                Category Benefits
              </h3>
              <ul className="list-none flex flex-col gap-3 font-glonimove text-lg">
                {categoryInfo.benefits.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-theme-accent text-xl leading-none">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deployment and Buyer Guidance */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-glonimoveBold text-[24px] text-[#d8c79a]">
                Worksite Deployment Guide
              </h3>
              <p className="font-glonimove text-lg leading-relaxed text-theme-muted">
                This category is commonly deployed for {categoryInfo.applications.join(", ").toLowerCase()}. Before final selection, confirm access width, surface condition, operator experience, transport method, and the attachments or tools expected to run on the machine.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-glonimoveBold text-[24px] text-[#d8c79a]">
                Buyer Guidance & Selection
              </h3>
              <ul className="list-none flex flex-col gap-2 font-glonimove text-lg text-theme-muted">
                {categoryInfo.buyerGuidance.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="text-theme-accent font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Maintenance & Support Guide */}
          <div className="flex flex-col gap-4 p-6 bg-theme-sec/5 border border-theme-border/10 rounded">
            <h3 className="font-glonimoveBold text-[24px] text-[#d8c79a]">
              Support & Maintenance Schedule
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-glonimove text-lg text-theme-muted">
              {categoryInfo.maintenance.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-theme-accent font-bold">»</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <Link to="/attachments" className="border border-theme-border/15 bg-theme-sec/5 p-5 rounded hover:border-theme-accent transition-colors k-hover-lift">
              <h3 className="font-glonimoveBold text-[20px] text-theme-heading">Attachments That Expand Your Machine</h3>
              <p className="mt-2 font-glonimove text-base text-theme-muted leading-relaxed">Review buckets, breakers, augers, forks, and fitment checks for the work you plan to run.</p>
            </Link>
            <Link to="/support/machine-guidance" className="border border-theme-border/15 bg-theme-sec/5 p-5 rounded hover:border-theme-accent transition-colors k-hover-lift">
              <h3 className="font-glonimoveBold text-[20px] text-theme-heading">Machine Selection Help</h3>
              <p className="mt-2 font-glonimove text-base text-theme-muted leading-relaxed">Compare categories and get a practical recommendation before you commit to a model.</p>
            </Link>
            <Link to="/support/contact-support" className="border border-theme-border/15 bg-theme-sec/5 p-5 rounded hover:border-theme-accent transition-colors k-hover-lift">
              <h3 className="font-glonimoveBold text-[20px] text-theme-heading">Support After Purchase</h3>
              <p className="mt-2 font-glonimove text-base text-theme-muted leading-relaxed">Get help with manuals, parts, delivery questions, warranty cases, and technical support.</p>
            </Link>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="flex flex-col gap-4">
            <h3 className="font-glonimoveBold text-[28px] text-[#d8c79a]">
              Frequently Asked Questions
            </h3>
            <div className="flex flex-col gap-3">
              {categoryInfo.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-theme-border/20 rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center p-4 bg-theme-sec/10 text-left font-glonimoveBold text-xl text-theme-heading hover:bg-theme-sec/20 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-theme-accent text-2xl font-mono">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-theme-sec/5 font-glonimove text-lg leading-relaxed text-theme-text border-t border-theme-border/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Need Help address panel */}
        <div className="w-[393px]">
          <address aria-labelledby="need-help-heading" className="not-italic flex flex-col gap-8">
            <div className="border-b border-theme-border/20 pb-3">
              <h2 id="need-help-heading" className="font-clofieBold text-[45px] font-bold text-theme-heading whitespace-nowrap">
                {t("product.needHelp")}
              </h2>
            </div>
            
            {contactItems.map((item) => (
              <div key={item.titleKey} className="flex flex-col gap-2">
                <h3 className="font-glonimoveBold text-[23px] font-bold text-theme-heading">
                  {t(item.titleKey)}
                </h3>
                <div className="font-glonimove text-[23px] font-normal leading-normal text-theme-muted flex flex-col gap-1 transition-colors">
                  {item.content.map((line, index) => (
                    <div key={`${item.titleKey}-${index}`}>
                      {line.href ? (
                        <a
                          href={line.href}
                          target={line.href.startsWith("http") ? "_blank" : undefined}
                          rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="hover:underline hover:text-theme-accent transition-colors duration-200"
                        >
                          {line.text}
                        </a>
                      ) : (
                        line.text
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </address>
        </div>
      </div>
    </section>
  );
};

export default ProductDescriptionSection;
