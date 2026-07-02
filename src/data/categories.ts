export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: "backhoe-loaders",
    name: "Backhoe Loader",
    description: "Combining excavation power and front loader capabilities into a single agile machine.",
    image: "https://c.animaapp.com/9h31joeZ/img/kuvuo-2-5-2.png",
    slug: "backhoe-loaders",
  },
  {
    id: "dumpers",
    name: "Dumper",
    description: "Compact bulk material transport vehicles designed for high-capacity jobsite hauling.",
    image: "https://c.animaapp.com/9h31joeZ/img/thunderdump-png-4.png",
    slug: "dumpers",
  },
  {
    id: "mini-excavators",
    name: "Mini Excavator",
    description: "Compact and powerful excavators designed for tight spaces and reliable utility work.",
    image: "/img/new-project-19-2.webp",
    slug: "mini-excavators",
  },
  {
    id: "towable-excavators",
    name: "Towable Excavator",
    description: "Highly portable excavating solutions easily towed behind standard utility vehicles.",
    image: "https://c.animaapp.com/9h31joeZ/img/new-project--16--2@2x.png",
    slug: "towable-excavators",
  },
  {
    id: "stone-crushers",
    name: "Stone Crusher",
    description: "Heavy machinery designed for high-performance aggregate reduction and stone pulverizing.",
    image: "https://c.animaapp.com/9h31joeZ/img/stonekrusher-png.png",
    slug: "stone-crushers",
  },
  {
    id: "trenchers",
    name: "Trencher",
    description: "High-efficiency trenching tools for utility piping, electrical routing, and irrigation.",
    image: "/img/new-project-15-2.webp",
    slug: "trenchers",
  },
  {
    id: "wheel-loaders",
    name: "Wheel Loader",
    description: "Heavy-duty loaders engineered for moving bulk materials with speed and maximum traction.",
    image: "https://c.animaapp.com/9h31joeZ/img/new-project--23--3.png",
    slug: "wheel-loaders",
  },
  {
    id: "skid-steer-loaders",
    name: "Skid Steer",
    description: "Versatile, tight-turning compact loaders adapted to landscaping, loading, and grading.",
    image: "https://c.animaapp.com/9h31joeZ/img/stomp-v980-5@2x.png",
    slug: "skid-steer-loaders",
  },
];
