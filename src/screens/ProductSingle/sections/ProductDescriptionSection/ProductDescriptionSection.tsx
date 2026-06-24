import React, { useState } from "react";
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
    intro: "The Konstructz Skid Steer Loader series represents the pinnacle of compact versatility on modern jobsites. Engineered for maximum performance in confined spaces, these loaders combine a compact footprint with high-torque hydraulic systems and rugged construction. Whether you are moving earth, grading, or operating high-demand hydraulic attachments, our skid steers deliver consistent reliability and power.",
    chooseIf: "Choose this machine if your crew needs one compact loader to load, grade, carry, clear, and power attachments across changing jobsite tasks. It is especially useful when access is tight but daily production still matters.",
    whatItIsUsedFor: [
      "Earthmoving, excavation, and site preparation",
      "Material handling, loading trucks, and debris clean-up",
      "Landscaping, grading, and post-hole digging",
      "Operating specialized attachments like sweepers, augers, and trenchers"
    ],
    benefits: [
      "Exceptional maneuverability with zero-turn capability",
      "High auxiliary hydraulic flow to run demanding attachments",
      "Heavy-duty steel track/wheel options for superior traction on mud, sand, or asphalt",
      "Ergonomic operator station with intuitive joystick controls and desert-adapted cooling"
    ],
    applications: ["Construction", "Landscaping", "Farming", "Utility work"],
    buyerGuidance: [
      "Choose based on rated operating capacity (ROC) requirements and standard worksite widths.",
      "Verify if your application requires high-flow hydraulics for heavy attachments.",
      "Consider undercarriage options (tracks vs. wheels) depending on ground conditions."
    ],
    maintenance: [
      "Perform daily pre-start inspections of fluid levels and track/tire condition.",
      "Clean the undercarriage regularly to prevent aggregate build-up.",
      "Follow the service schedule for engine oil, hydraulic, and air filter replacements."
    ],
    faqs: [
      {
        q: "Can I use standard universal skid steer attachments?",
        a: "Yes, our skid steers are equipped with standard universal quick-attach couplings compatible with most major attachment brands."
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
      powerType: "Diesel engine powertrain (Varies by model)",
      bestFor: "High-maneuverability tasks and heavy multi-tool operations",
      attachments: "Universal quick-attach system (augers, trenchers, forks, buckets)",
      worksiteUse: "Confined spaces, soft ground, residential and commercial yards",
      advantages: "Excellent zero-turn agility, high hydraulic flow, robust track traction",
      maintenanceNotes: "Regular hydraulic fluid checks, track tensioning, and daily greasing"
    }
  },
  "mini-excavators": {
    intro: "The Konstructz Mini Excavator lineup is engineered to deliver powerful digging performance in compact spaces where larger machinery cannot operate. Featuring advanced hydraulics, smooth controls, and zero-tail-swing options, these excavators are ideal for precise utility trenching, pool excavation, foundation work, and general landscaping. Their retractable undercarriage makes passing through narrow gates simple.",
    chooseIf: "Choose this machine if your work is built around digging accuracy, trench control, foundation prep, landscaping, drainage, or utility access. It is the practical choice when a full-size excavator is too large for the site.",
    whatItIsUsedFor: [
      "Utility trenching for pipes, water lines, and electrical conduits",
      "Footings and foundation excavation",
      "Demolition of small structures and concrete breaking",
      "Landscaping, tree planting, and retaining wall preparation"
    ],
    benefits: [
      "Zero-tail-swing design prevents damage to surrounding walls or fences",
      "Smooth, pilot-operated hydraulic controls for micro-adjustments",
      "Retractable track systems allow access through narrow passageways",
      "Auxiliary hydraulics pre-plumbed to the boom for thumbs, augers, or breakers"
    ],
    applications: ["Utility installations", "Landscaping", "Foundation digging", "Demolition"],
    buyerGuidance: [
      "Select the machine based on your maximum required digging depth and breakout force.",
      "For tight spaces near walls or structures, zero-tail-swing models are highly recommended.",
      "Ensure you select appropriate bucket sizes and thumb attachments for your primary projects."
    ],
    maintenance: [
      "Grease boom, arm, and bucket pins daily to minimize wear.",
      "Check track tension and inspect rubber tracks for cuts or cracks.",
      "Inspect hydraulic hoses and fittings for leaks or wear before operation."
    ],
    faqs: [
      {
        q: "Are the rubber tracks durable?",
        a: "Yes, our mini excavators use high-durability, steel-reinforced rubber tracks designed to minimize ground damage while ensuring long wear life."
      },
      {
        q: "Does the machine come pre-plumbed for attachments?",
        a: "Yes, auxiliary hydraulic piping is standard on the boom, allowing easy plug-and-play hookup for hydraulic attachments."
      },
      {
        q: "What is the warranty coverage?",
        a: "Standard warranty details vary by final configuration. Please contact our support team for documentation."
      }
    ],
    tableData: {
      category: "Compact Mini Excavator",
      applications: "Trenching, footings, foundation prep, landscaping, demolition",
      powerType: "High-efficiency diesel engine (Varies by model)",
      bestFor: "Precise digging in restricted or residential spaces",
      attachments: "Compatible with buckets, hydraulic thumbs, augers, breakers",
      worksiteUse: "Narrow yards, utility corridors, near building walls",
      advantages: "Zero-tail-swing body, retractable tracks, excellent bucket breakout force",
      maintenanceNotes: "Daily joint greasing, track tension checks, and hydraulic hose safety inspection"
    }
  },
  "wheel-loaders": {
    intro: "The Konstructz Wheel Loader series is built for rapid material handling and bulk loading operations. Combining high-capacity buckets, articulating steering, and heavy-duty 4WD, these loaders move soil, gravel, sand, and agricultural products quickly and efficiently. The spacious, ergonomic cabin provides excellent 360-degree visibility, ensuring operators can work safely and comfortably for long shifts.",
    chooseIf: "Choose this machine if your main bottleneck is moving bulk material quickly: aggregate, soil, mulch, feed, palletized goods, or stockpile material. Wheel loaders work best where repeated loading cycles and travel speed matter.",
    whatItIsUsedFor: [
      "Bulk material loading and stockpiling",
      "Truck loading and hopper feeding",
      "Site clean-up, grading, and leveling",
      "Agricultural feed, manure, and silage handling"
    ],
    benefits: [
      "Articulated steering offers tight turning radiuses and minimal turf damage",
      "Four-wheel-drive transmission provides maximum traction in slick conditions",
      "High travel speeds for fast cycle times across large worksites",
      "Comfortable cabin with intuitive controls and panoramic visibility"
    ],
    applications: ["Aggregate loading", "Agriculture", "Commercial construction", "Road work"],
    buyerGuidance: [
      "Select your loader size based on bucket capacity (cubic yards) and material density.",
      "Consider the dump clearance height to ensure compatibility with your haul trucks.",
      "Review tire options (e.g., agricultural, industrial) for your specific ground surface."
    ],
    maintenance: [
      "Check engine oil, coolant levels, and transmission fluid before starting.",
      "Clean air filters regularly, especially when operating in dusty aggregate environments.",
      "Inspect loader linkage pins and lubricate them according to the manual."
    ],
    faqs: [
      {
        q: "Can this machine travel on paved roads?",
        a: "Yes, our wheel loaders can travel on asphalt roads without damaging the road surface, unlike tracked loaders."
      },
      {
        q: "Is the cab climate-controlled?",
        a: "Yes, premium cabin configurations include heating and air conditioning systems."
      }
    ],
    tableData: {
      category: "Articulated Wheel Loader",
      applications: "Bulk material loading, stockpiling, agricultural transport",
      powerType: "Turbocharged diesel powertrain",
      bestFor: "High-speed bulk material handling and transferring",
      attachments: "Forks, high-capacity buckets, sweepers, grapple buckets",
      worksiteUse: "Aggregate yards, farms, large construction sites",
      advantages: "4WD traction, articulated frame, fast cycle speeds, roomy cab",
      maintenanceNotes: "Linkage grease points, engine oil intervals, and tire pressure monitoring"
    }
  },
  "backhoe-loaders": {
    intro: "The Konstructz Backhoe Loader series is the ultimate multi-tasker, combining the digging power of an excavator and the loading capability of a wheel loader on a single rugged chassis. Perfect for worksites that require trenching, backfilling, lifting, and loading, these dual-duty machines save space and reduce transport costs by replacing two single-purpose units. Features include stabilizer legs and a 180-degree swivel operator station.",
    chooseIf: "Choose this machine if your site needs both digging and loading but does not justify moving two separate machines. It is a strong fit for utility repair, farm work, road edges, and general site service.",
    whatItIsUsedFor: [
      "Excavating trenches and backfilling soil",
      "Loading materials into dump trucks",
      "Lifting pipes, concrete barriers, and heavy building blocks",
      "Breaking concrete and asphalt for utility repair"
    ],
    benefits: [
      "Dual-purpose utility eliminates the need to transport multiple machines",
      "Rugged 4WD chassis handles uneven and muddy ground easily",
      "Wide stabilizer pads provide a solid, safe base during digging operations",
      "Swivel seat allows operators to transition from front loader to rear digger in seconds"
    ],
    applications: ["Road repair", "Utility trenching", "Public works", "Farming & development"],
    buyerGuidance: [
      "Evaluate the backhoe digging depth against your utility excavation requirements.",
      "Check loader lifting capacities and bucket sizes for bulk transport tasks.",
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
        a: "The operator station features a 180-degree swivel seat. Once turned, the operator has full control of the backhoe section via pilot joysticks."
      },
      {
        q: "What attachments can I run on a backhoe?",
        a: "You can run buckets of various sizes, hydraulic breakers, and augers on the backhoe, and forks or sweepers on the front loader."
      }
    ],
    tableData: {
      category: "Backhoe Loader (Dual-Duty)",
      applications: "Trenching, loading, backfilling, material handling",
      powerType: "High-torque diesel engine (Varies by model)",
      bestFor: "Worksite tasks requiring both loading and digging in one unit",
      attachments: "Digger buckets, hammers, front forks, landscape buckets",
      worksiteUse: "Roads, utilities, farms, and public works projects",
      advantages: "Dual functionality, stabilizer legs, robust 4WD chassis",
      maintenanceNotes: "Dual-end grease points, stabilizer checks, hydraulic health checks"
    }
  },
  "dumpers": {
    intro: "The Konstructz Tracked Dumper lineup is engineered to haul heavy payloads across terrain that would stop a wheeled truck. Featuring thick rubber tracks, low ground pressure, and robust dump boxes, these haulers navigate mud, sand, snow, and steep slopes without sinking or tearing up the ground. Available self-loading shovels allow for efficient single-operator cycles, boosting productivity on any worksite.",
    chooseIf: "Choose this machine if your crew loses time moving material by wheelbarrow, compact truck, or loader shuttle. Dumpers are designed for short, repetitive hauling on rough, soft, narrow, or sloped access routes.",
    whatItIsUsedFor: [
      "Hauling concrete, aggregates, soil, and site debris",
      "Transporting materials across soft, wet, or hilly ground",
      "Backfilling utility trenches and landscaping yards",
      "Site clean-up and muck-away operations"
    ],
    benefits: [
      "High payload capacities relative to compact machine dimensions",
      "Extremely low ground pressure tracks prevent surface damage and sinking",
      "Self-loading bucket options enable one operator to load and haul autonomously",
      "Tip and swivel dump boxes simplify material placement in tight spaces"
    ],
    applications: ["Soft-ground hauling", "Backyard landscaping", "Urban demolition", "Trail building"],
    buyerGuidance: [
      "Match the machine payload rating with your daily volume haul requirements.",
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
        a: "Yes, the tracked design allows the dumper to spin 360 degrees in place, making it perfect for dead-end paths."
      },
      {
        q: "Does the dumper damage lawns?",
        a: "Because the payload weight is distributed over wide tracks, it has extremely low ground pressure, minimizing turf damage."
      }
    ],
    tableData: {
      category: "Tracked Compact Dumper",
      applications: "Material hauling, concrete transport, landscaping, excavation cleanup",
      powerType: "Reliable diesel or gas engine (Varies by model)",
      bestFor: "Transporting heavy materials over mud, slopes, and soft ground",
      attachments: "Self-loading shovel, flatbed options (varies by config)",
      worksiteUse: "Backyards, wet fields, narrow trails, demolition sites",
      advantages: "Low ground pressure, 360-degree pivot, self-loading capability",
      maintenanceNotes: "Undercarriage cleaning, dump cylinder lubrication, track wear monitoring"
    }
  },
  "stone-crushers": {
    intro: "The Konstructz Mobile Stone Crusher series is designed to convert demolition waste, bricks, concrete, and stones into high-quality reusable fill directly on the jobsite. By recycling aggregate in place, these heavy-duty crushers save contractors thousands of dollars in transport fees, disposal costs, and new material delivery charges. Built with high-manganese steel jaw plates, they tackle tough aggregate with ease.",
    chooseIf: "Choose this machine if you regularly handle concrete, masonry, asphalt, rubble, or fieldstone and want to reduce hauling and disposal cycles. It is best for crews that can reuse crushed material on the same project or yard.",
    whatItIsUsedFor: [
      "Crushing concrete, masonry, brick, and asphalt rubble on-site",
      "Creating sub-base material and road fill from debris",
      "Recycling demolition waste into usable aggregates",
      "Fieldstone and river rock reduction for landscaping"
    ],
    benefits: [
      "Recycles waste material on-site, eliminating dump fees and trucking costs",
      "Adjustable jaw openings to control the output sizing of the crushed material",
      "Compact, towable or self-propelled track designs for easy transport",
      "Robust construction with manganese jaw plates for long-lasting operation"
    ],
    applications: ["Demolition recycling", "Road base prep", "Rock reclaiming", "Landscape depot"],
    buyerGuidance: [
      "Select your crusher based on the expected tons-per-hour processing volume.",
      "Verify the feed opening size to ensure it matches the size of your demolition debris.",
      "Choose between diesel power for remote fields or electric models for indoor/low-noise work."
    ],
    maintenance: [
      "Inspect jaw plates daily for wear and tighten bolts if necessary.",
      "Lubricate the heavy-duty eccentric shaft bearings at the recommended intervals.",
      "Check drive belt tension and inspect filters in dusty conditions."
    ],
    faqs: [
      {
        q: "Can it crush concrete with rebar inside?",
        a: "Yes, but we recommend selecting models with magnetic separators to extract rebar from the output."
      },
      {
        q: "How do I adjust the output size?",
        a: "Our crushers feature a simple mechanical wedge adjustment system to quickly set the target jaw gap."
      }
    ],
    tableData: {
      category: "Mobile Jaw Crusher",
      applications: "Demolition recycling, concrete crushing, sub-base creation",
      powerType: "Diesel engine or Electric powertrain (Varies by model)",
      bestFor: "On-site recycling of masonry, concrete, and stone waste",
      attachments: "Magnetic separators, dust suppression sprays",
      worksiteUse: "Demolition sites, recycling centers, stone quarries",
      advantages: "Saves waste disposal fees, adjustable output size, heavy manganese jaw plates",
      maintenanceNotes: "Jaw plate wear check, main shaft bearing lubrication, belt tensioning"
    }
  },
  "trenchers": {
    intro: "The Konstructz Trencher series is built to slice clean, precise utility channels through the toughest soil, clay, and roots. Engineered with dual tracks and high-torque engines, these trenchers provide steady forward traction and deep cutting force. The carbide-tipped chains and auger spoil management systems ensure that digging trenches for irrigation, water, or power cables is fast, clean, and efficient.",
    chooseIf: "Choose this machine if your work depends on straight, repeatable trenches for pipe, drainage, irrigation, fiber, landscape lighting, or utility conduit. It saves time when the trench path is narrow and consistent.",
    whatItIsUsedFor: [
      "Digging trenches for water lines, gas pipes, and electric lines",
      "Irrigation system installation and drainage channel prep",
      "Root barrier cutting and foundation outlining",
      "Installing underground lighting and landscaping cables"
    ],
    benefits: [
      "Dual tracks provide superior stability and traction without spinning tires",
      "Carbide-tipped teeth carve through shale, rocky soil, and thick root systems",
      "Side augers push dug soil away from the trench edge, preventing backfill",
      "Adjustable boom depth with safety lock lets you control trench parameters precisely"
    ],
    applications: ["Utility pipe laying", "Irrigation prep", "Drainage install", "Fiber optic routing"],
    buyerGuidance: [
      "Determine the maximum depth and width requirements of the utility lines you install.",
      "Choose track models for superior control and less ground disruption on turf.",
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
        a: "Yes, the carbide-tipped teeth are designed to slice through roots, clay, and compact gravel."
      },
      {
        q: "What happens to the soil that is dug up?",
        a: "The integrated auger pushes the soil to the side of the trench, making it easy to backfill once utility work is done."
      }
    ],
    tableData: {
      category: "Tracked Utility Trencher",
      applications: "Utility trenching, irrigation prep, drainage installations",
      powerType: "Gasoline or Diesel engine options (Varies by model)",
      bestFor: "Digging straight, narrow channels for pipes and cables",
      attachments: "Alternative chain types (rock, clay, turf)",
      worksiteUse: "Lawns, golf courses, utility corridors, farms",
      advantages: "Clean trenches, carbide chain durability, auger soil clearing",
      maintenanceNotes: "Chain tension adjustment, teeth replacement, auger cleanup"
    }
  },
  "towable-excavators": {
    intro: "The Konstructz Towable Excavator is a unique, lightweight digging solution built for remote or sensitive worksites. Featuring heavy-duty outriggers for secure leveling on slopes, these compact diggers can be easily towed behind standard utility vehicles or ATVs. Perfect for landowners, agricultural workers, and contractors working on soft turf or steep embankments.",
    chooseIf: "Choose this machine if portability, simple transport, and remote-site access are more important than high-volume excavation. It suits farms, land maintenance, trail work, small drainage jobs, and property owners who need occasional digging power.",
    whatItIsUsedFor: [
      "Remote-site excavation, pond digging, and drainage prep",
      "Land clearing, stump removal, and planting large trees",
      "Small foundation trenching and post-hole digging",
      "Ditch clearing and path maintenance on hillsides"
    ],
    benefits: [
      "Extremely lightweight and towable by standard trucks, SUVs, or ATVs",
      "Stabilizing outriggers slide and lock to provide stability on steep slopes",
      "Simple, robust design minimizes maintenance costs and breakdown risks",
      "Low ground disruption — ideal for lawns, golf courses, and nature preserves"
    ],
    applications: ["Remote off-grid digging", "Trail & park maintenance", "Sensitive turf yards", "Farming"],
    buyerGuidance: [
      "Confirm your towing vehicle's capacity matches the excavator towing weight.",
      "Verify that the digging depth and reach fit your ditching or planting projects.",
      "Ensure you have flat mud plates for outriggers if working on soft or swampy ground."
    ],
    maintenance: [
      "Grease boom pivots and bucket linkage pins after every 8 hours of work.",
      "Inspect outrigger locking pins and structural frame welds for safety.",
      "Check engine oil levels and hydraulic cylinder seals."
    ],
    faqs: [
      {
        q: "How is the excavator moved around the worksite?",
        a: "Operators use the digging arm to pull or push the machine short distances, or they can hook it to an ATV for longer relocations."
      },
      {
        q: "Can I tow this on the highway?",
        a: "Yes, our towable excavators feature a standard trailer hitch coupler and highway-rated tires."
      }
    ],
    tableData: {
      category: "Towable Outrigger Excavator",
      applications: "Remote excavation, trenching, park trails, farm maintenance",
      powerType: "Compact gasoline engine (Varies by model)",
      bestFor: "Sensitive turf and remote, off-grid digging projects",
      attachments: "Various bucket sizes, ripper tooth, mechanical thumb",
      worksiteUse: "Steep slopes, soft yards, narrow wooded paths",
      advantages: "Light towing weight, outrigger stability, simple mechanical design",
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
                Designed for optimal worksite integration, this equipment category is commonly deployed in settings requiring active {categoryInfo.applications.join(", ").toLowerCase()}. Their durable configuration supports robust duty cycles while keeping undercarriage footprint minimal, protecting finished surfaces and sensitive turf.
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
            <a href="/#/attachments" className="border border-theme-border/15 bg-theme-sec/5 p-5 rounded hover:border-theme-accent transition-colors">
              <h3 className="font-glonimoveBold text-[20px] text-theme-heading">Attachments That Expand Your Machine</h3>
              <p className="mt-2 font-glonimove text-base text-theme-muted leading-relaxed">Review buckets, breakers, augers, forks, and fitment checks for the work you plan to run.</p>
            </a>
            <a href="/#/support/machine-guidance" className="border border-theme-border/15 bg-theme-sec/5 p-5 rounded hover:border-theme-accent transition-colors">
              <h3 className="font-glonimoveBold text-[20px] text-theme-heading">Machine Selection Help</h3>
              <p className="mt-2 font-glonimove text-base text-theme-muted leading-relaxed">Compare categories and get a practical recommendation before you commit to a model.</p>
            </a>
            <a href="/#/support/contact-support" className="border border-theme-border/15 bg-theme-sec/5 p-5 rounded hover:border-theme-accent transition-colors">
              <h3 className="font-glonimoveBold text-[20px] text-theme-heading">Support After Purchase</h3>
              <p className="mt-2 font-glonimove text-base text-theme-muted leading-relaxed">Get help with manuals, parts, delivery questions, warranty cases, and technical support.</p>
            </a>
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
