export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  image: string;
  detailImage: string;
  contentImages: string[];
  content: string;
  commentCount: number;
}

const sharedContent = `Excavator safety starts before the bucket touches the ground. The operator should understand the work area, underground utilities, nearby workers, soil condition, and the exact task before the machine starts moving.

A daily walkaround is one of the simplest ways to prevent expensive downtime. Check tracks, hydraulic hoses, bucket pins, couplers, lights, alarms, mirrors, and visible leaks before each shift. If the machine feels unstable or the attachment does not lock correctly, stop and inspect it before continuing.

Keep people out of the swing radius, never move a loaded bucket over workers, and use a spotter when visibility is limited. On slopes or soft ground, travel slowly with the attachment low and avoid sudden turns or heavy downhill swings.

Good operators protect the machine, the crew, and the jobsite. Safe habits repeated every day prevent damage, downtime, and serious injuries.`;

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "excavator-safety-practical-tips",
    title: "Excavator Safety: Practical Tips for Safer Jobsite Work",
    date: "12th June 2026",
    author: "Denvor Wayne",
    category: "Mini Excavator's Blog",
    excerpt:
      "Practical excavator safety habits for planning the jobsite, inspecting the machine, managing blind spots, and keeping workers clear of active digging zones.",
    image: "/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
    detailImage: "/single-blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
    contentImages: [
      "/single-blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png",
      "/single-blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
    ],
    content: sharedContent,
    commentCount: 2,
  },
  {
    id: 2,
    slug: "engine-performance-single-cylinder-vs-gasoline",
    title: "Powerful Engine Performance: Single Cylinder vs. 6.6 L Gasoline",
    date: "12th June 2026",
    author: "Denvor Wayne",
    category: "Skid Steer's Blog",
    excerpt:
      "A field-focused look at engine behavior, fuel use, torque delivery, and how operators should compare compact equipment powertrains.",
    image: "/img/chatgpt-image-apr-28-2026-09-26-28-am-2.png",
    detailImage: "/single-blog/img/chatgpt-image-apr-28-2026-09-26-28-am-2.png",
    contentImages: [
      "/single-blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png",
      "/single-blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
    ],
    content:
      "Engine selection affects more than horsepower. Operators should compare torque delivery, cooling capacity, fuel consumption, service access, and how the engine responds under repeated loading cycles.\n\nSingle-cylinder engines can be simple and economical for compact work, while larger gasoline engines can provide smoother output for heavier cycles. The right choice depends on the site, attachment load, expected runtime, and maintenance plan.\n\nBefore buying, match the machine to the work instead of comparing spec sheets alone. A balanced machine with predictable controls will often outperform an overpowered machine that is hard to service or control.",
    commentCount: 2,
  },
  {
    id: 3,
    slug: "stomp-v1000-easy-operation-smooth-control",
    title: "Konstructz Stomp V1000: Easy Operation, Smooth Control",
    date: "12th June 2026",
    author: "Denvor Wayne",
    category: "Skid Steer's Blog",
    excerpt:
      "Control response, visibility, travel stability, and operator comfort notes from compact loader work in tight site conditions.",
    image: "/img/chatgpt-image-jun-11-2026-09-17-59-am-1.png",
    detailImage: "/single-blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2-1.png",
    contentImages: [
      "/single-blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
      "/single-blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png",
    ],
    content:
      "Smooth control matters most when the jobsite is tight. The Stomp V1000 layout keeps the operator focused on predictable travel, clear attachment response, and steady loading rather than fighting the machine.\n\nBefore judging a compact loader, test low-speed movement, turn response, lift control, and how quickly the operator can correct position near walls, trucks, or pallets. Easy operation reduces fatigue and helps crews finish repeat cycles with fewer mistakes.",
    commentCount: 2,
  },
  {
    id: 4,
    slug: "lift-higher-without-increasing-overall-height",
    title: "Lift Higher Without Increasing Overall Height",
    date: "12th June 2026",
    author: "Denvor Wayne",
    category: "Wheel Loader's Blog",
    excerpt:
      "How compact equipment can improve lift path, dump reach, and jobsite productivity while staying practical for transport and access.",
    image: "/img/chatgpt-image-jun-11-2026-09-18-03-am-1.png",
    detailImage: "/single-blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png",
    contentImages: [
      "/single-blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
      "/single-blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
    ],
    content:
      "Lift height is useful only when the machine remains stable and practical. A compact machine should balance reach, visibility, counterweight, and access through gates or low-clearance areas.\n\nOperators should test real loading positions instead of relying only on maximum lift numbers. Dumping into a truck, carrying material across uneven ground, and placing loads near a wall all reveal whether the lift geometry is actually useful.",
    commentCount: 2,
  },
  {
    id: 5,
    slug: "mini-excavator-field-test",
    title: "Konstructz Terror XIX Prestige: Mini Excavator Field Test",
    date: "12th June 2026",
    author: "Denvor Wayne",
    category: "Mini Excavator's Blog",
    excerpt:
      "A practical field test covering digging control, travel behavior, visibility, and service checks before daily compact excavation work.",
    image: "/img/chatgpt-image-jun-11-2026-09-18-07-am-1.png",
    detailImage: "/single-blog/img/chatgpt-image-apr-28-2026-01-54-28-pm-2.png",
    contentImages: [
      "/single-blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png",
      "/single-blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
    ],
    content:
      "A useful field test should include more than digging a single hole. Check travel speed, boom swing, bucket breakout feel, hydraulic smoothness, and how easy the machine is to inspect at the end of the day.\n\nCompact excavators work close to property lines, driveways, and utility runs, so predictable controls and clear visibility are essential. A machine that feels calm in tight spaces is easier to run safely.",
    commentCount: 2,
  },
  {
    id: 6,
    slug: "engine-tuning-heavy-site-conditions",
    title: "Engine Tuning Guide for Heavy Site Conditions",
    date: "12th June 2026",
    author: "Denvor Wayne",
    category: "Road Roller's Blog",
    excerpt:
      "Maintenance and tuning notes for keeping compact equipment reliable under heat, dust, repeated starts, and heavy attachment cycles.",
    image: "/img/chatgpt-image-jun-11-2026-09-18-16-am-1.png",
    detailImage: "/single-blog/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png",
    contentImages: [
      "/single-blog/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png",
      "/single-blog/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png",
    ],
    content:
      "Heavy site conditions expose weak maintenance habits quickly. Dust, heat, repeated starts, and long attachment cycles all increase stress on filters, cooling systems, belts, hydraulic oil, and fuel quality.\n\nThe best tuning plan is consistent inspection. Keep airflow clean, watch temperature changes, replace worn parts early, and record how the engine behaves under real work rather than only at idle.",
    commentCount: 2,
  },
];

export const blogCategories = [
  "Mini Excavator's Blog",
  "Skid Steer's Blog",
  "Wheel Loader's Blog",
  "Forklift's Blog",
  "Road Roller's Blog",
  "Scissor Lift's Blog",
  "Stone Crusher's Blog",
];

export const latestBlogPosts = blogPosts.slice(0, 3);

export const getBlogPostHref = (post: Pick<BlogPost, "slug">) => `/media/${post.slug}`;

export const getBlogPostBySlug = (slug: string | undefined) =>
  blogPosts.find((post) => post.slug === slug);
