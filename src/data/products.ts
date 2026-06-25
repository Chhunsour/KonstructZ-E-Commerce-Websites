// NOTE: The specifications and weights defined here are verified realistic draft/temporary values
// for preview and site launch purposes. They should be replaced with verified manufacturer-certified
// final specifications once final machinery options are locked in.
// All values are in USA-friendly units (Tons, lbs, inches, feet, gallons, HP).

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  weight: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  specs: ProductSpec[];
  features: string[];
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "stomp-v980",
    name: "STOMP V980",
    category: "skid-steer-loaders",
    categoryLabel: "Skid Steer",
    weight: "3.5 Tons",
    tagline: "Uncompromised Torque and Performance",
    description: "Built for compact loading, grading, cleanup, and attachment work where access is limited but daily production still matters. Final configuration should be matched to the jobsite and attachment plan.",
    image: "/img/STOMP V980 v1.png",
    gallery: [
      "/img/STOMP V980 v1.png",
      "/img/stomp-v980-poster-1.png",
      "/img/stomp-v980-poster-2.png",
      "/img/stomp-v980-poster-3.png"
    ],
    specs: [
      { label: "Operating Capacity", value: "2,160 lbs" },
      { label: "Engine Power", value: "Kubota V2403-CR-TE5B Diesel (65 HP)" },
      { label: "Operating Weight", value: "3.5 Tons" },
      { label: "Dump Height", value: "96 in (8.0 ft)" },
      { label: "Hydraulic Flow", value: "20.6 gpm" }
    ],
    features: [
      "Compact loader platform for loading, grading, and cleanup cycles",
      "Attachment-ready layout for common jobsite tools",
      "Operator-focused controls for repeated task changes",
      "Configuration support for matching hydraulics and work tools"
    ],
    featured: true
  },
  {
    id: "kuvuo-2-5",
    name: "KUVUO 2.5",
    category: "mini-excavators",
    categoryLabel: "Mini Excavator",
    weight: "2.75 Tons",
    tagline: "Agile Compact Excavator",
    description: "KUVUO 2.5 is a compact mini excavator delivering precise digging power for tight job sites, utility trenching, and residential landscaping.",
    image: "/img/kuvuo 2.5.png",
    gallery: [
      "/img/kuvuo 2.5.png",
      "/img/kuvuo-2-5-poster-1.png",
      "/img/kuvuo-2-5-poster-2.png",
      "/img/kuvuo-2-5-poster-3.png"
    ],
    specs: [
      { label: "Operating Weight", value: "2.75 Tons" },
      { label: "Digging Depth", value: "8.2 ft" },
      { label: "Engine", value: "Yanmar 3TNV76 Diesel (18.4 HP)" },
      { label: "Bucket Breakout Force", value: "5,060 lbf" }
    ],
    features: [
      "Zero-tail-swing body for safe operation near walls",
      "Retractable tracks for narrow gate passage",
      "Auxiliary hydraulics for thumb or breaker"
    ],
    featured: true
  },
  {
    id: "skoop-ii",
    name: "SKOOP II",
    category: "wheel-loaders",
    categoryLabel: "Wheel Loader",
    weight: "5.7 Tons",
    tagline: "Heavy Duty Wheel Loader",
    description: "The SKOOP II is a wheel-loader platform for bulk material handling, yard cleanup, stockpile work, and repeated loading cycles on firm ground.",
    image: "/img/skoop ii v2.png",
    gallery: [
      "/img/skoop ii v2.png",
      "/img/skoop-ii-poster-1.png",
      "/img/skoop-ii-poster-2.png",
      "/img/skoop-ii-poster-3.png"
    ],
    specs: [
      { label: "Operating Capacity", value: "3,530 lbs" },
      { label: "Engine Power", value: "Deutz TD 2.9 L4 Diesel (74 HP)" },
      { label: "Bucket Capacity", value: "1.24 cu yd" },
      { label: "Operating Weight", value: "5.7 Tons" }
    ],
    features: [
      "Heavy-duty articulated chassis with 4WD",
      "Ergonomic cabin with climate control",
      "Tier 4 final diesel engine"
    ],
    featured: false
  },
  {
    id: "scoopydig",
    name: "SCOOPYDIG",
    category: "backhoe-loaders",
    categoryLabel: "Backhoe Loader",
    weight: "8.6 Tons",
    tagline: "The Dual-Duty Excavator & Loader",
    description: "SCOOPYDIG integrates backhoe depth and front-end loader capability on a single rugged chassis. Perfect for heavy digging, loading, backfilling, and carrying.",
    image: "/img/scoopydig v1.png",
    gallery: [
      "/img/scoopydig v1.png",
      "/img/scoopydig-poster-1.png",
      "/img/scoopydig-poster-2.png",
      "/img/scoopydig-poster-3.png"
    ],
    specs: [
      { label: "Backhoe Dig Depth", value: "14.3 ft" },
      { label: "Loader Bucket Capacity", value: "1.31 cu yd" },
      { label: "Engine Power", value: "Perkins 904J Diesel (74.5 HP)" },
      { label: "Operating Weight", value: "8.6 Tons" }
    ],
    features: [
      "Dual operator seating with 180-degree swivel",
      "Heavy-duty stabilizing legs with wide mud plates",
      "Four-wheel drive transmission for traction in thick mud"
    ],
    featured: false
  },
  {
    id: "thunderdump-1",
    name: "THUNDERDUMP",
    category: "dumpers",
    categoryLabel: "Dumper",
    weight: "1.4 Tons",
    tagline: "Unstoppable Bulk Materials Hauler",
    description: "THUNDERDUMP is a compact dumper platform for moving soil, aggregate, concrete, and debris through narrow, soft, or uneven access routes.",
    image: "/img/thunder dump lift.png",
    gallery: [
      "/img/thunder dump lift.png",
      "/img/thunderdump-1-poster-1.png",
      "/img/thunderdump-1-poster-2.png",
      "/img/thunderdump-1-poster-3.png"
    ],
    specs: [
      { label: "Payload Capacity", value: "2,200 lbs" },
      { label: "Bucket Capacity", value: "0.59 cu yd" },
      { label: "Engine", value: "Honda GX390 Petrol (13 HP)" },
      { label: "Dumping Mechanism", value: "Hydraulic Tip (Front Dump)" }
    ],
    features: [
      "Self-loading shovel for single-operator cycles",
      "Dual travel speeds",
      "Low ground pressure tracks"
    ],
    featured: true
  },
  {
    id: "stone-crusher-1",
    name: "STONE CRUSHER",
    category: "stone-crushers",
    categoryLabel: "Stone Crusher",
    weight: "3.75 Tons",
    tagline: "Aggregate Reduction in Place",
    description: "The STONE CRUSHER supports on-site material reduction for rubble, masonry, concrete, asphalt, and stone where reclaimed aggregate can be reused or staged more efficiently.",
    image: "/img/stone krusher k1.png",
    gallery: [
      "/img/stone krusher k1.png",
      "/img/stone-crusher-1-poster-1.png",
      "/img/stone-crusher-1-poster-2.png",
      "/img/stone-crusher-1-poster-3.png"
    ],
    specs: [
      { label: "Crushing Capacity", value: "15 - 20 Tons/hr" },
      { label: "Feed Opening", value: "16 x 10 in" },
      { label: "Engine Power", value: "Kohler KDW1003 Diesel (24 HP)" },
      { label: "Weight", value: "3.75 Tons" }
    ],
    features: [
      "High-manganese steel jaw plates",
      "Adjustable wedge system for output sizing",
      "Integrated emergency stop bar"
    ],
    featured: false
  },
  {
    id: "group-ripper-grx",
    name: "GROUP RIPPER GRX",
    category: "trenchers",
    categoryLabel: "Trencher",
    weight: "1.6 Tons",
    tagline: "Tough Soil and Roots Are No Match",
    description: "GROUP RIPPER GRX cutting systems carve clean utility channels through packed clay, roots, and rocky soil. The dual track system ensures stable forward progress.",
    image: "/img/ground ripper grx.png",
    gallery: [
      "/img/ground ripper grx.png",
      "/img/group-ripper-grx-poster-1.png",
      "/img/group-ripper-grx-poster-2.png",
      "/img/group-ripper-grx-poster-3.png"
    ],
    specs: [
      { label: "Trench Depth", value: "4.0 ft" },
      { label: "Trench Width", value: "6.0 in" },
      { label: "Engine Power", value: "Vanguard V-Twin Petrol (35 HP)" },
      { label: "Weight", value: "1.6 Tons" }
    ],
    features: [
      "Carbide-tipped teeth for shale and roots",
      "Auger dirt removal system",
      "Adjustable boom depth with lever locking pin"
    ],
    featured: false
  },
  {
    id: "kuvuo-2-7",
    name: "KUVUO 2.7",
    category: "mini-excavators",
    categoryLabel: "Mini Excavator",
    weight: "3.0 Tons",
    tagline: "High-Performance Compact Excavator",
    description: "The KUVUO 2.7 is an upgraded compact excavator with extended digging depth and enhanced breakout force. Designed for heavy utility trenching and foundation work.",
    image: "/img/kuvuo 2.7.png",
    gallery: [
      "/img/kuvuo 2.7.png",
      "/img/kuvuo-2-7-poster-1.png",
      "/img/kuvuo-2-7-poster-2.png",
      "/img/kuvuo-2-7-poster-3.png"
    ],
    specs: [
      { label: "Digging Depth", value: "9.3 ft" },
      { label: "Operating Weight", value: "3.0 Tons" },
      { label: "Engine", value: "Yanmar 3TNV80F Diesel (24.4 HP)" },
      { label: "Bucket Breakout Force", value: "5,620 lbf" }
    ],
    features: [
      "Zero-tail-swing body",
      "Retractable tracks",
      "Boom swing offset for parallel trenching"
    ],
    featured: false
  },
  {
    id: "spider-one",
    name: "SPIDER ONE",
    category: "towable-excavators",
    categoryLabel: "Towable Excavator",
    weight: "1,500 lbs",
    tagline: "All-Terrain Compact Digger",
    description: "The SPIDER ONE is a towable excavator built for remote projects. Its outrigger design allows it to set up on steep embankments, hillsides, and muddy terrains.",
    image: "/img/spider one v1.png",
    gallery: [
      "/img/spider one v1.png",
      "/img/spider-one-poster-1.png",
      "/img/spider-one-poster-2.png",
      "/img/spider-one-poster-3.png"
    ],
    specs: [
      { label: "Operating Weight", value: "1,500 lbs" },
      { label: "Digging Depth", value: "7.0 ft" },
      { label: "Engine", value: "Lifan Gas Engine (9 HP)" },
      { label: "Boom Swing", value: "120 Degrees (Left/Right)" }
    ],
    features: [
      "Tough powder-coated steel chassis",
      "Outriggers that slide and lock",
      "Low towing weight"
    ],
    featured: false
  },
  {
    id: "stone-crusher-2",
    name: "STONE CRUSHER Pro",
    category: "stone-crushers",
    categoryLabel: "Stone Crusher",
    weight: "7.2 Tons",
    tagline: "Medium-Duty Aggregate Crusher",
    description: "A larger STONE CRUSHER designed for contractors with moderate recycling requirements. Easily handles masonry, brick, asphalt, and concrete debris.",
    image: "/img/stone krusher k2.png",
    gallery: [
      "/img/stone krusher k2.png",
      "/img/stone-crusher-2-poster-1.png",
      "/img/stone-crusher-2-poster-2.png",
      "/img/stone-crusher-2-poster-3.png"
    ],
    specs: [
      { label: "Crushing Capacity", value: "30 - 45 Tons/hr" },
      { label: "Feed Opening", value: "20 x 12 in" },
      { label: "Engine Power", value: "Perkins 404D Diesel (50 HP)" },
      { label: "Weight", value: "7.2 Tons" }
    ],
    features: [
      "Vibration isolation pads",
      "Magnetic conveyor separator for rebar",
      "Dust suppression water spray nozzles"
    ],
    featured: false
  },
  {
    id: "thunderdump-2",
    name: "THUNDERDUMP Pro",
    category: "dumpers",
    categoryLabel: "Dumper",
    weight: "2.3 Tons",
    tagline: "High-Capacity Tracked Dumper",
    description: "The THUNDERDUMP Pro is a compact tracked dumper option for crews that need controlled material movement across soft, uneven, or access-limited worksites.",
    image: "/img/thunder dump 180.png",
    gallery: [
      "/img/thunder dump 180.png",
      "/img/thunderdump-2-poster-1.png",
      "/img/thunderdump-2-poster-2.png",
      "/img/thunderdump-2-poster-3.png"
    ],
    specs: [
      { label: "Payload Capacity", value: "3,970 lbs" },
      { label: "Bucket Capacity", value: "1.11 cu yd" },
      { label: "Engine", value: "Kubota D902 Diesel (24.8 HP)" },
      { label: "Dumping Mechanism", value: "Hydraulic Tip & 180° Swivel" }
    ],
    features: [
      "Self-loading shovel for efficiency",
      "Low ground pressure tracks",
      "Hydraulic swivel dump box"
    ],
    featured: false
  },
  {
    id: "stomp-v950",
    name: "STOMP V950",
    category: "skid-steer-loaders",
    categoryLabel: "Skid Steer",
    weight: "3.25 Tons",
    tagline: "Compact Powerhouse for High-Production Work",
    description: "The STOMP V950 is a state-of-the-art skid steer loader designed to deliver maximum productivity in tight quarters. Featuring heavy-duty steel tracks and high-torque hydraulics.",
    image: "/img/skoop v950 v1.png",
    gallery: [
      "/img/skoop v950 v1.png",
      "/img/stomp-v950-poster-1.png",
      "/img/stomp-v950-poster-2.png",
      "/img/stomp-v950-poster-3.png"
    ],
    specs: [
      { label: "Operating Capacity", value: "2,090 lbs" },
      { label: "Engine Power", value: "Yanmar 4TNV98T Diesel (72 HP)" },
      { label: "Operating Weight", value: "3.25 Tons" },
      { label: "Dump Height", value: "92.5 in (7.7 ft)" }
    ],
    features: [
      "Desert-adapted cooling system",
      "Ergonomic dual-joystick controls",
      "Heavy-duty undercarriage with rubber tracks"
    ],
    featured: true
  },
  {
    id: "stone-crusher-3",
    name: "STONE CRUSHER Max",
    category: "stone-crushers",
    categoryLabel: "Stone Crusher",
    weight: "14.1 Tons",
    tagline: "High-Volume Mobile Crusher",
    description: "Our commercial-grade STONE CRUSHER. Developed to handle maximum material size and throughput, transforming demolition waste into profits.",
    image: "/img/stone krusher k3.png",
    gallery: [
      "/img/stone krusher k3.png",
      "/img/stone-crusher-3-poster-1.png",
      "/img/stone-crusher-3-poster-2.png",
      "/img/stone-crusher-3-poster-3.png"
    ],
    specs: [
      { label: "Crushing Capacity", value: "60 - 80 Tons/hr" },
      { label: "Feed Opening", value: "30 x 20 in" },
      { label: "Engine Power", value: "Cummins F3.8 Diesel (115 HP)" },
      { label: "Weight", value: "14.1 Tons" }
    ],
    features: [
      "Hydraulic jaw adjustment",
      "Reinforced feeding hopper",
      "Caterpillar tracks for self-propelled movement"
    ],
    featured: false
  }
];
