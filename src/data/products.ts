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
    weight: "Configurable",
    tagline: "Uncompromised Torque and Performance",
    description: "Built for heavier operations, the STOMP V980 expands on the V950 platform with an upgraded diesel powertrain and reinforced lift arms. Ideal for operations requiring continuous heavy loading and grading.",
    image: "/img/STOMP V980 v1.png",
    gallery: [
      "/img/STOMP V980 v1.png",
      "/img/stomp-v980-poster-1.png",
      "/img/stomp-v980-poster-2.png",
      "/img/stomp-v980-poster-3.png"
    ],
    specs: [
      { label: "Operating Capacity", value: "Varies by model" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Operating Weight", value: "Based on selected setup" },
      { label: "Dump Height", value: "Varies by attachment and setup" },
      { label: "Hydraulic Flow", value: "Match to attachment requirements" }
    ],
    features: [
      "Turbocharged diesel engine for superior fuel efficiency and power",
      "Reinforced heavy loader arms with high-strength geometry",
      "Pre-wired auxiliary electrical outlets for specialized attachments",
      "Enhanced sound dampening for comfortable daily operation"
    ],
    featured: true
  },
  {
    id: "kuvuo-2-5",
    name: "KUVUO 2.5",
    category: "mini-excavators",
    categoryLabel: "Mini Excavator",
    weight: "Configurable",
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
      { label: "Operating Weight", value: "Based on selected setup" },
      { label: "Digging Depth", value: "Varies by model" },
      { label: "Engine", value: "Depends on final configuration" },
      { label: "Bucket Breakout Force", value: "Varies by hydraulic setup" }
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
    weight: "Configurable",
    tagline: "Heavy Duty Wheel Loader",
    description: "The SKOOP II is engineered for high-capacity bulk material handling, offering unmatched traction, loading speed, and fuel efficiency.",
    image: "/img/skoop ii v2.png",
    gallery: [
      "/img/skoop ii v2.png",
      "/img/skoop-ii-poster-1.png",
      "/img/skoop-ii-poster-2.png",
      "/img/skoop-ii-poster-3.png"
    ],
    specs: [
      { label: "Operating Capacity", value: "Varies by model" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Bucket Capacity", value: "Varies by bucket selection" },
      { label: "Operating Weight", value: "Based on selected setup" }
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
    weight: "Configurable",
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
      { label: "Backhoe Dig Depth", value: "Varies by model" },
      { label: "Loader Bucket Capacity", value: "Varies by bucket selection" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Operating Weight", value: "Based on selected setup" }
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
    weight: "Configurable",
    tagline: "Unstoppable Bulk Materials Hauler",
    description: "When the grade is steep and the payload is heavy, THUNDERDUMP delivers. This compact tracked dumper transports concrete, aggregates, and soil across the roughest terrains.",
    image: "/img/thunder dump lift.png",
    gallery: [
      "/img/thunder dump lift.png",
      "/img/thunderdump-1-poster-1.png",
      "/img/thunderdump-1-poster-2.png",
      "/img/thunderdump-1-poster-3.png"
    ],
    specs: [
      { label: "Payload Capacity", value: "Varies by model" },
      { label: "Bucket Capacity", value: "Varies by selected skip" },
      { label: "Engine", value: "Depends on final configuration" },
      { label: "Dumping Mechanism", value: "Hydraulic Tip" }
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
    weight: "Configurable",
    tagline: "Aggregate Reduction in Place",
    description: "The STONE CRUSHER reduces rubble, concrete chunks, and fieldstones into useful fill. Saves thousands in aggregate delivery and waste transportation fees by crushing on-site.",
    image: "/img/stone krusher k1.png",
    gallery: [
      "/img/stone krusher k1.png",
      "/img/stone-crusher-1-poster-1.png",
      "/img/stone-crusher-1-poster-2.png",
      "/img/stone-crusher-1-poster-3.png"
    ],
    specs: [
      { label: "Crushing Capacity", value: "Varies by material and model" },
      { label: "Feed Opening", value: "Depends on final configuration" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Weight", value: "Based on selected setup" }
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
    weight: "Configurable",
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
      { label: "Trench Depth", value: "Varies by chain and model" },
      { label: "Trench Width", value: "Varies by chain setup" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Weight", value: "Based on selected setup" }
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
    weight: "Configurable",
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
      { label: "Digging Depth", value: "Varies by model" },
      { label: "Operating Weight", value: "Based on selected setup" },
      { label: "Engine", value: "Depends on final configuration" },
      { label: "Bucket Breakout Force", value: "Varies by hydraulic setup" }
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
    weight: "Configurable",
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
      { label: "Operating Weight", value: "Based on selected setup" },
      { label: "Digging Depth", value: "Varies by model" },
      { label: "Engine", value: "Depends on final configuration" },
      { label: "Boom Swing", value: "Varies by selected setup" }
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
    name: "STONE CRUSHER",
    category: "stone-crushers",
    categoryLabel: "Stone Crusher",
    weight: "Configurable",
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
      { label: "Crushing Capacity", value: "Varies by material and model" },
      { label: "Feed Opening", value: "Depends on final configuration" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Weight", value: "Based on selected setup" }
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
    name: "THUNDERDUMP",
    category: "dumpers",
    categoryLabel: "Dumper",
    weight: "Configurable",
    tagline: "High-Capacity Tracked Dumper",
    description: "The THUNDERDUMP Pro is a professional-grade tracked dumper built to transport concrete, aggregates, and soil across the toughest terrains with a larger payload limit.",
    image: "/img/thunder dump 180.png",
    gallery: [
      "/img/thunder dump 180.png",
      "/img/thunderdump-2-poster-1.png",
      "/img/thunderdump-2-poster-2.png",
      "/img/thunderdump-2-poster-3.png"
    ],
    specs: [
      { label: "Payload Capacity", value: "Varies by model" },
      { label: "Bucket Capacity", value: "Varies by selected skip" },
      { label: "Engine", value: "Depends on final configuration" },
      { label: "Dumping Mechanism", value: "Hydraulic Tip & Swivel" }
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
    weight: "Configurable",
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
      { label: "Operating Capacity", value: "Varies by model" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Operating Weight", value: "Based on selected setup" },
      { label: "Dump Height", value: "Varies by attachment and setup" }
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
    name: "STONE CRUSHER",
    category: "stone-crushers",
    categoryLabel: "Stone Crusher",
    weight: "Configurable",
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
      { label: "Crushing Capacity", value: "Varies by material and model" },
      { label: "Feed Opening", value: "Depends on final configuration" },
      { label: "Engine Power", value: "Depends on final configuration" },
      { label: "Weight", value: "Based on selected setup" }
    ],
    features: [
      "Hydraulic jaw adjustment",
      "Reinforced feeding hopper",
      "Caterpillar tracks for self-propelled movement"
    ],
    featured: false
  }
];
