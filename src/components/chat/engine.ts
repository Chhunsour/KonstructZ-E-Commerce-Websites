// Konstructz assistant — conversation engine (no-LLM, grounded).
//
// This is a rules engine, but built to behave like a consultant rather than an
// FAQ: scored intent detection (not first-keyword-wins), category-aware
// comparison that never mixes up machine types, reasoned recommendations,
// conversation memory with an "active machine", clarifying questions, and
// varied wording. It never invents specs — unavailable values are stated as
// such and routed to support.

import {
  kb,
  PRODUCT_REFS,
  PRODUCT_DETAIL,
  specValue,
  CONTACT,
  type ProductRef,
  type ProductDetail,
} from "./knowledge";

export interface Answer {
  markdown: string;
  products?: ProductRef[];
  links?: { label: string; href: string }[];
  followups?: string[];
  handoff?: boolean;
}

export interface ChatMemory {
  slots: {
    job?: string;
    terrain?: string;
    budget?: string;
    experience?: string;
    capacity?: string;
    attachments?: string;
    projectSize?: string;
  };
  activeMachine?: ProductRef; // the machine the user is currently focused on
  activeCategory?: string;
  lastProducts: ProductRef[];
  lastIntent?: string;
  awaiting?: "recommend" | null;
  turn: number;
  greeted?: boolean; // has the user been greeted at least once this session?
  usedGreetings?: string[]; // greeting lines already used — never repeat in a session
}

export const emptyMemory = (): ChatMemory => ({
  slots: {},
  lastProducts: [],
  awaiting: null,
  turn: 0,
  greeted: false,
  usedGreetings: [],
});

export const STARTERS = [
  "Which machine is right for my job?",
  "Compare a mini excavator and a skid steer",
  "What attachments fit a mini excavator?",
  "What does the warranty cover?",
  "How does shipping and delivery work?",
];

export const WELCOME =
  "Hi — I'm the **Konstructz assistant**. Think of me as a machinery consultant: I can help you pick the right machine for your project, compare options properly, talk through attachments and fitment, and cover warranty, shipping, financing, and maintenance.\n\nTell me a bit about what you're working on and I'll take it from there — or pick a question below.";

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/* ───────────────────────── Greeting system ─────────────────────────── */
// A real conversational greeter: a large library of varied, natural openers
// (1–2 short sentences, no feature dump), randomly chosen while never reusing
// a line in the same session. Capabilities are introduced only once the user
// actually asks about machines/support — never on a bare "hi".

// First-time greetings — used the first time the user says hello.
const GREETING_OPENERS = [
  "Hello! 👋 How can I help you today?",
  "Hi there! What are you working on today?",
  "Hey! What can I do for you?",
  "Welcome! What can I help you with today?",
  "Hi! What brings you in today?",
  "Hey there! What's on your plate today?",
  "Hello! What would you like to figure out?",
  "Hi! Where would you like to start?",
  "Hey! What can I get sorted for you?",
  "Welcome aboard — what do you need a hand with?",
  "Hi 👋 What's the plan today?",
  "Hello! Ask away — where shall we begin?",
  "Hey! Happy to help. What's first?",
  "Hi! What can I help you tackle today?",
  "Good to meet you. What are you after?",
  "Hello there! What would you like to know?",
  "Hey! What's the project today?",
  "Hi! How can I point you in the right direction?",
  "Welcome! What would you like to dig into?",
  "Hello! What can I help you sort out?",
  "Hey there 👋 What do you need today?",
  "Hi! Glad you stopped by — what's up?",
  "Hello! What would you like a hand with?",
  "Hey! Where do you want to start?",
  "Hi there! How can I help right now?",
  "Welcome! Tell me what you're after.",
  "Hello! What's the question?",
  "Hey! What can I help you with first?",
  "Hi! What would be most useful right now?",
  "Good to see you. What can I help with?",
  "Hello! What are you trying to get done?",
  "Hey there! How can I be useful today?",
  "Hi! Fire away — what do you need?",
  "Welcome! What can I help you look into?",
  "Hello 👋 What would you like to explore?",
  "Hey! What's the goal today?",
  "Hi there! What can I help you work through?",
  "Hello! How can I make your day easier?",
  "Hey! What brings you here today?",
  "Hi! What can I help you figure out?",
  "Welcome! Where would you like to begin?",
  "Hello! What's on your mind?",
  "Hey there! What can I help you with?",
  "Hi! Ready when you are — what's first?",
  "Good day! How can I help?",
  "Hello! What would you like to get into today?",
  "Hey! Tell me what you need and I'll jump in.",
  "Hi there! What can I sort out for you today?",
  "Welcome! What's the first thing on your list?",
  "Hello! What can I help you with right now?",
];

// Subsequent greetings — used when the user has already been greeted. These
// don't re-introduce; they pick the conversation back up naturally.
const RETURN_GREETINGS = [
  "Welcome back! What would you like to work on next?",
  "Hey again! What's next?",
  "What can I help you with today?",
  "Back again 👋 What do you need?",
  "Good to see you again. Where to next?",
  "Still here and ready — what's next?",
  "What would you like to look at next?",
  "Sure — what can I help with?",
  "Of course. What do you need?",
  "Ready when you are. What's the question?",
  "What else can I help you with?",
  "Happy to keep going — what's next?",
  "Right with you. What would you like to know?",
  "Anytime. What can I sort out for you?",
  "What's on your mind?",
  "Go ahead — what do you need?",
  "Sure thing. Where would you like to start?",
  "Welcome back — what can I help you with this time?",
  "Hey! Picking up where we left off — what's next?",
  "All yours. What would you like to do?",
  "What can I help you tackle next?",
  "Here for it — what do you need?",
  "Of course! What would you like to look into?",
  "Let's keep going. What's the next thing?",
  "What would you like to cover next?",
  "Happy to help again. What's up?",
  "Sure — where would you like to go from here?",
  "Ready for the next one. What is it?",
  "What can I do for you this time?",
  "Good to have you back. What's the plan?",
  "Absolutely. What do you need a hand with?",
  "What would help you most right now?",
  "Carry on whenever — what's next?",
  "Right then, what can I help with?",
  "What's next on your list?",
];

// Time-of-day greetings (first-time, when the user states the time of day).
const MORNING_GREETINGS = [
  "Good morning! How can I assist you today?",
  "Morning! What can I help you with?",
  "Good morning 👋 What's first on the list today?",
  "Morning! What are you working on today?",
  "Good morning! Where would you like to start?",
  "Good morning! What can I get sorted for you?",
  "Morning! What brings you in today?",
  "Good morning — how can I help you get going?",
];
const AFTERNOON_GREETINGS = [
  "Good afternoon! How can I help?",
  "Afternoon! What can I do for you?",
  "Good afternoon 👋 What are you working on?",
  "Good afternoon! Where shall we start?",
  "Afternoon! What do you need a hand with?",
  "Good afternoon! What can I help you tackle?",
  "Hope your afternoon's going well — what can I help with?",
  "Afternoon! What's the plan?",
];
const EVENING_GREETINGS = [
  "Good evening! How can I help you tonight?",
  "Evening! What can I do for you?",
  "Good evening 👋 What are you working on?",
  "Good evening! Where would you like to start?",
  "Evening! What do you need a hand with?",
  "Good evening! What can I help you with?",
  "Hope your evening's going well — what can I help with?",
  "Evening! What's on your mind?",
];
// "What's up?"-style — a literal "how can I help" reads oddly here, so reply in kind.
const WHATSUP_REPLIES = [
  "Not much — I'm ready to help. What would you like to know?",
  "All good here! What can I help you with?",
  "Just here and ready to lend a hand. What's up with you?",
  "Not much — what can I do for you?",
  "Here and ready. What are you working on?",
  "Ticking along nicely. What do you need?",
  "Ready to help, as always. What's on your mind?",
  "Same as ever — ready to help. What's the question?",
];

/** Pick a line not used yet this session; reset gracefully if a pool runs dry. */
const pickUnused = (pool: string[], used: string[]): string => {
  const fresh = pool.filter((g) => !used.includes(g));
  if (fresh.length) return pick(fresh);
  // Pool exhausted — allow reuse but never repeat the immediately previous line.
  const last = used[used.length - 1];
  const candidates = pool.filter((g) => g !== last);
  return pick(candidates.length ? candidates : pool);
};

function composeGreeting(
  m: string,
  memory: ChatMemory
): { answer: Answer; patch: Partial<ChatMemory> } {
  const used = memory.usedGreetings ?? [];
  const firstTime = !memory.greeted;

  let pool: string[];
  if (/\b(what'?s up|whats up|wassup|sup)\b/.test(m)) {
    pool = WHATSUP_REPLIES;
  } else if (firstTime && /(good morning|^morning\b)/.test(m)) {
    pool = MORNING_GREETINGS;
  } else if (firstTime && /(good afternoon|^afternoon\b)/.test(m)) {
    pool = AFTERNOON_GREETINGS;
  } else if (firstTime && /(good evening|^evening\b)/.test(m)) {
    pool = EVENING_GREETINGS;
  } else {
    pool = firstTime ? GREETING_OPENERS : RETURN_GREETINGS;
  }

  const text = pickUnused(pool, used);
  return {
    // A bare greeting stays a bare greeting — no products, links, capability
    // list, or follow-up chips. Those appear once the user asks about a topic.
    answer: { markdown: text },
    patch: { greeted: true, usedGreetings: [...used, text].slice(-200), lastIntent: "greeting" },
  };
}

/* ───────────────────────── Category knowledge ──────────────────────── */
// Qualitative, accurate domain knowledge per machine class. Used to reason in
// comparisons and recommendations. (Hard specs come from real product data.)

interface CategoryProfile {
  purpose: string;
  bestFor: string[];
  pros: string[];
  cons: string[];
  maneuverability: string;
  terrain: string;
  attachments: string;
  maintenance: string;
  recommendedUser: string;
}

const CATEGORY_PROFILE: Record<string, CategoryProfile> = {
  "Mini Excavator": {
    purpose: "Digging, trenching, and precise excavation in confined spaces.",
    bestFor: ["Trenching", "Foundations & footings", "Utility work", "Drainage", "Landscaping", "Residential sites"],
    pros: ["Strong digging depth and precision", "Compact — fits tight access and indoors", "Tracks spread weight for soft/uneven ground", "Boom swing works close to walls and fences", "Huge attachment range (buckets, auger, breaker, thumb)"],
    cons: ["Not built for carrying/loading volume", "Lower lift-and-carry than a loader", "Slower to travel/reposition across a site"],
    maneuverability: "Excellent in confined spaces; tracked and stable.",
    terrain: "Soft, wet, uneven, or tight ground; tracks reduce ground pressure.",
    attachments: "Buckets, augers, breakers/hammers, grapples, rippers, thumbs.",
    maintenance: "Track tension, hydraulic oil & filters, grease pivots.",
    recommendedUser: "Contractors, landscapers, and property owners doing digging-led work.",
  },
  "Towable Excavator": {
    purpose: "Portable excavation you can tow behind a truck between small sites.",
    bestFor: ["Light digging", "Rental fleets", "Properties spread across locations", "Occasional excavation"],
    pros: ["Tows on a standard trailer — easy transport", "Low cost of entry for occasional digging", "Compact footprint"],
    cons: ["Less dig depth/power than a tracked mini excavator", "Not for heavy daily production"],
    maneuverability: "Good once positioned; wheeled/towable setup.",
    terrain: "Firm, accessible ground; best where towing is the priority.",
    attachments: "Digging buckets and basic work tools.",
    maintenance: "Hydraulics, tow hitch/tyres, routine fluids.",
    recommendedUser: "Owners and rental operators who move between small jobs.",
  },
  "Skid Steer Loader": {
    purpose: "Loading, grading, material handling, and quick attachment work.",
    bestFor: ["Loading", "Grading & leveling", "Site cleanup", "Snow clearing", "Landscaping", "Material handling"],
    pros: ["Fast, agile, and productive on firm ground", "Swaps attachments quickly for many tasks", "Great lift-and-carry for its size", "Tight turning radius"],
    cons: ["Limited digging depth vs an excavator", "Can be rougher on soft/wet ground (wheels)", "Less reach than a boom"],
    maneuverability: "Very agile; zero-radius style turning.",
    terrain: "Best on firm, level ground; tracked versions help on soft sites.",
    attachments: "Buckets, forks, grapples, augers, sweepers, breakers.",
    maintenance: "Hydraulics, tyres/tracks, quick-coupler, filters.",
    recommendedUser: "Crews doing loading, grading, and varied attachment tasks.",
  },
  "Wheel Loader": {
    purpose: "Moving bulk material with speed, traction, and bucket volume.",
    bestFor: ["Yard loading", "Aggregate & stockpiles", "Farm material movement", "Snow and debris"],
    pros: ["High bucket volume and throughput", "Fast travel across a yard", "Strong traction for loading cycles"],
    cons: ["Large footprint — needs open space", "No digging below grade", "Less precise than a skid steer in tight spots"],
    maneuverability: "Best in open yards; larger turning circle.",
    terrain: "Firm, open ground and stockpile areas.",
    attachments: "General-purpose and material buckets, forks.",
    maintenance: "Driveline, tyres, hydraulics, bucket edges.",
    recommendedUser: "Yards, farms, and sites with high daily material volume.",
  },
  "Backhoe Loader": {
    purpose: "A front loader and a rear digging arm in one machine.",
    bestFor: ["Dig and load on the same job", "Utility work", "General construction", "Mixed tasks"],
    pros: ["Two machines in one — load up front, dig at the rear", "Versatile for mixed jobs", "Good road mobility"],
    cons: ["Jack-of-all-trades — not as specialized as a dedicated excavator or loader", "Larger than a compact machine"],
    maneuverability: "Good on-road; needs room to set up the backhoe.",
    terrain: "Firm, accessible sites.",
    attachments: "Loader buckets, backhoe buckets, breakers.",
    maintenance: "Hydraulics on both ends, fluids, pins/bushings.",
    recommendedUser: "Crews wanting one machine to both dig and load.",
  },
  Dumper: {
    purpose: "Hauling and dumping bulk material around a site.",
    bestFor: ["Moving spoil", "Aggregate transport", "Muckaway", "Bulk site logistics"],
    pros: ["Carries far more than a loader bucket per trip", "Built for repetitive haul cycles", "Compact site dumpers fit tight access"],
    cons: ["Transport only — it doesn't dig or load itself", "Needs a loader/excavator to fill it"],
    maneuverability: "Compact dumpers handle tight site roads well.",
    terrain: "Site haul routes; check ground for laden weight.",
    attachments: "Skip/bed configurations.",
    maintenance: "Driveline, tipping ram, tyres/tracks.",
    recommendedUser: "Sites moving high volumes of material between points.",
  },
  Trencher: {
    purpose: "Cutting clean, continuous trenches for utilities fast.",
    bestFor: ["Cable & conduit", "Irrigation lines", "Drainage", "Utility runs"],
    pros: ["Far faster and cleaner than bucket digging for long runs", "Consistent trench width/depth", "Less spoil and rework"],
    cons: ["Single-purpose — only cuts trenches", "Not for general excavation or loading"],
    maneuverability: "Walk-behind/ride configurations; good in lines.",
    terrain: "Best in workable soils; rock slows progress.",
    attachments: "Chain/wheel digging booms.",
    maintenance: "Chain/teeth wear, drive, fluids.",
    recommendedUser: "Anyone running long utility or irrigation trenches.",
  },
  "Stone Crusher": {
    purpose: "Reducing stone and rock into usable aggregate on site.",
    bestFor: ["Aggregate reduction", "Recycling material on site", "Reducing haul-off"],
    pros: ["Turns site rock into usable material", "Cuts disposal and import costs"],
    cons: ["Specialized — not a general earthmover", "Throughput depends on feed and material"],
    maneuverability: "Positioned for the crushing task.",
    terrain: "Stable setup area.",
    attachments: "Crushing setup specific to the unit.",
    maintenance: "Wear parts, drive, lubrication.",
    recommendedUser: "Operations processing stone/aggregate on site.",
  },
  Forklift: {
    purpose: "Lifting and moving palletized loads in yards and warehouses.",
    bestFor: ["Pallet handling", "Warehouse logistics", "Yard staging", "Loading/unloading"],
    pros: ["Purpose-built for pallets and stacking", "Efficient repetitive lifting", "Compact turning for aisles"],
    cons: ["Not an earthmover", "Best on firm/level surfaces"],
    maneuverability: "Tight turning for aisles and docks.",
    terrain: "Firm, level surfaces (some rough-terrain variants).",
    attachments: "Forks, and load-specific carriages.",
    maintenance: "Mast, hydraulics, tyres, fluids.",
    recommendedUser: "Warehouses, yards, and logistics operations.",
  },
  "Road Roller": {
    purpose: "Compacting soil and asphalt for a stable, level surface.",
    bestFor: ["Soil compaction", "Asphalt repair", "Driveways", "Base prep"],
    pros: ["Even, repeatable compaction", "Drum + vibration for density", "Compact units fit small sites"],
    cons: ["Single-purpose compaction tool", "Not for digging or loading"],
    maneuverability: "Good for passes; plan turning room.",
    terrain: "Prepared base, soil, or asphalt.",
    attachments: "Drum configurations.",
    maintenance: "Drum, vibration system, hydraulics.",
    recommendedUser: "Roadwork, landscaping base prep, and paving crews.",
  },
  "Scissor Lift": {
    purpose: "Raising workers and tools safely to height on a platform.",
    bestFor: ["Elevated maintenance", "Installation work", "Indoor access", "Warehouse work at height"],
    pros: ["Stable elevated platform", "Good working area up top", "Electric options for indoor use"],
    cons: ["Vertical access only (no horizontal reach like a boom)", "Needs firm, level ground"],
    maneuverability: "Compact base; drive-and-position.",
    terrain: "Firm, level surfaces.",
    attachments: "Platform configurations.",
    maintenance: "Scissor mechanism, hydraulics, battery (electric).",
    recommendedUser: "Trades and facilities teams working at height.",
  },
};

const KNOWN_CATEGORIES = Object.keys(CATEGORY_PROFILE);

// Resolve a product's category label to a profile, tolerating naming
// differences (e.g. Konstructz "Skid Steer" → "Skid Steer Loader").
function profileFor(label: string): CategoryProfile | undefined {
  if (CATEGORY_PROFILE[label]) return CATEGORY_PROFILE[label];
  const l = label.toLowerCase().replace(/s$/, "");
  const key = KNOWN_CATEGORIES.find((k) => {
    const kl = k.toLowerCase();
    return kl.includes(l) || l.includes(kl.replace(/s$/, ""));
  });
  return key ? CATEGORY_PROFILE[key] : undefined;
}

/* ───────────────────── Category / machine detection ────────────────── */
// Specific phrases first so "skid steer loader" never trips the bare "loader".

const CAT_SYNONYMS: [RegExp, string][] = [
  [/towable excavator|towable digger/, "Towable Excavator"],
  [/mini ?excavator|mini ?ex\b|mini ?digger|compact excavator|excavator|digger/, "Mini Excavator"],
  [/skid[ -]?steer( loader)?|skidsteer/, "Skid Steer Loader"],
  [/wheel ?loader/, "Wheel Loader"],
  [/backhoe( loader)?/, "Backhoe Loader"],
  [/dumper|dump truck|site dumper/, "Dumper"],
  [/trencher|trenching machine/, "Trencher"],
  [/stone crusher|rock crusher|crusher/, "Stone Crusher"],
  [/fork ?lift/, "Forklift"],
  [/road ?roller|compactor|\broller\b/, "Road Roller"],
  [/scissor ?lift|scissor/, "Scissor Lift"],
];

/** Categories mentioned, in the order they appear in the text, deduped. */
function detectCategories(text: string): string[] {
  const hits: { cat: string; idx: number }[] = [];
  for (const [re, cat] of CAT_SYNONYMS) {
    const m = re.exec(text);
    if (m) hits.push({ cat, idx: m.index });
  }
  hits.sort((a, b) => a.idx - b.idx);
  const out: string[] = [];
  for (const h of hits) if (!out.includes(h.cat)) out.push(h.cat);
  return out;
}

function refsInCategory(cat: string): ProductRef[] {
  const c = cat.toLowerCase().replace(/s$/, "");
  return PRODUCT_REFS.filter((r) => {
    const a = r.categoryLabel.toLowerCase();
    return a.includes(c) || c.includes(a.replace(/s$/, ""));
  });
}

function representativeRef(cat: string): ProductRef | undefined {
  const inCat = refsInCategory(cat);
  return inCat.find((r) => r.brand === "Konstructz") || inCat[0];
}

function detailOf(ref: ProductRef): ProductDetail | undefined {
  return PRODUCT_DETAIL[ref.href];
}

function findNamed(text: string): ProductRef[] {
  const found: ProductRef[] = [];
  for (const ref of PRODUCT_REFS) {
    const name = ref.name.toLowerCase();
    const token = name.replace(/typhon\s+/g, "").split("(")[0].trim();
    if (
      (text.includes(name) || (token.length >= 4 && text.includes(token))) &&
      !found.some((f) => f.href === ref.href)
    ) {
      found.push(ref);
    }
  }
  return found;
}

/* ───────────────────────── Need → categories ───────────────────────── */

const NEED_MAP: { re: RegExp; categories: string[]; note: string }[] = [
  { re: /\b(trench|trenching|pipe|cable|conduit|irrigation|utilit)/, categories: ["Trencher", "Mini Excavator"], note: "trenching and utility work" },
  { re: /\b(clear|clearing|tree|brush|stump|land clearing|forestry)/, categories: ["Skid Steer Loader", "Mini Excavator"], note: "land and brush clearing" },
  { re: /\b(haul|hauling|transport|dump|carry|move material|spoil|muck)/, categories: ["Dumper"], note: "hauling and bulk transport" },
  { re: /\b(crush|crushing|stone|rock|aggregate|pulveriz)/, categories: ["Stone Crusher"], note: "crushing stone and aggregate" },
  { re: /\b(backhoe|dig and load|dig & load)/, categories: ["Backhoe Loader"], note: "combined digging and loading" },
  { re: /\b(pallet|warehouse|lift truck|jitney|logistics|stack)/, categories: ["Forklift"], note: "pallet and warehouse handling" },
  { re: /\b(compact(ion|ing)?|asphalt|road base|paving)/, categories: ["Road Roller"], note: "soil and asphalt compaction" },
  { re: /\b(aerial|elevated|access platform|overhead|work at height|ceiling)/, categories: ["Scissor Lift"], note: "elevated access work" },
  { re: /\b(load|loading|material handling|gravel|sand|feed|yard|stockpile)/, categories: ["Wheel Loader", "Skid Steer Loader"], note: "loading and material handling" },
  { re: /\b(grade|grading|level|cleanup|clean up|snow|landscap|backfill)/, categories: ["Skid Steer Loader", "Mini Excavator"], note: "grading, cleanup and landscaping" },
  { re: /\b(dig|digging|excavat|foundation|footing|earthwork|drainage|ditch)/, categories: ["Mini Excavator", "Towable Excavator"], note: "digging and excavation" },
  { re: /\b(tight|small site|compact|residential|narrow|indoor|garden|confined)/, categories: ["Mini Excavator", "Skid Steer Loader"], note: "tight or compact jobsites" },
];

function recommend(text: string): { refs: ProductRef[]; note: string; cats: string[] } {
  const cats: string[] = [];
  let note = "";
  for (const need of NEED_MAP) {
    if (need.re.test(text)) {
      for (const c of need.categories) if (!cats.includes(c)) cats.push(c);
      if (!note) note = need.note;
    }
  }
  // Categories the user named directly take priority.
  for (const c of detectCategories(text)) if (!cats.includes(c)) cats.unshift(c);

  const refs: ProductRef[] = [];
  for (const cat of cats) {
    const r = representativeRef(cat);
    if (r && !refs.some((x) => x.href === r.href)) refs.push(r);
    if (refs.length >= 4) break;
  }
  if (!refs.length) {
    // last resort: retrieval
    for (const d of kb.search(text, 4, ["product"])) {
      const r = PRODUCT_REFS.find((x) => x.href === d.href);
      if (r && !refs.some((x) => x.href === r.href)) refs.push(r);
    }
  }
  return { refs: refs.slice(0, 4), note, cats };
}

/* ───────────────────────────── Slots ───────────────────────────────── */

function extractSlots(text: string): Partial<ChatMemory["slots"]> {
  const s: Partial<ChatMemory["slots"]> = {};
  const terrain = text.match(/\b(clay|sand|sandy|rock|rocky|gravel|mud|muddy|wet|soft|hard|frozen|snow|slope|hill|uneven|soil)\b/);
  if (terrain) s.terrain = terrain[1];
  const cap = text.match(/(\d[\d,.]*)\s*(lb|lbs|pound|ton|tonne)/);
  if (cap) s.capacity = `${cap[1]} ${cap[2]}`;
  if (/\b(beginner|first[- ]?time|new to|never operated|no experience)\b/.test(text)) s.experience = "beginner";
  else if (/\b(experienced|operator|pro|years of)\b/.test(text)) s.experience = "experienced";
  if (/\b(budget|cheap|affordable|entry|low ?cost|inexpensive|tight budget)\b/.test(text)) s.budget = "value";
  if (/\b(small|tiny|residential|backyard|home|garden|driveway)\b/.test(text)) s.projectSize = "small";
  else if (/\b(large|commercial|big|heavy duty|high volume|industrial)\b/.test(text)) s.projectSize = "large";
  const att = text.match(/\b(auger|breaker|hammer|grapple|thumb|ripper|pallet fork|fork|trenching bucket|bucket)\b/);
  if (att) s.attachments = att[1];
  const job = text.match(/\b(dig|digging|trench|load|loading|haul|grade|grading|lift|compact|crush|excavat|landscap|clear|clearing|demolition|construction|building|project)\w*/);
  if (job) s.job = job[1];
  return s;
}

/* ─────────────────────── Scored intent detection ───────────────────── */

export type DetectedIntent =
  | "Greeting"
  | "General question"
  | "Machine education"
  | "Product question"
  | "Typhon Machinery question"
  | "Konstructz question"
  | "Warranty/free shipping"
  | "Attachment compatibility"
  | "Machine comparison"
  | "Product recommendation"
  | "Support request"
  | "Unknown question";

// Job/project verbs & tasks that signal a recommendation request. Carefully
// excludes machine NOUNS (excavator, loader, dumper…) via word boundaries so a
// question *about* a machine isn't mistaken for a job description.
const JOB_SIGNAL =
  /\b(dig(ging)?|trench(ing|es)?|load(ing)?|haul(ing)?|grad(e|ing)|level(ling|ing)?|compact(ing|ion)?|crush(ing)?|clear(ing)?)\b|\b(backfill\w*|demolition|landscap\w*|drainage|ditch\w*|foundation|footing|utilit\w*|irrigation|pallets?|warehouses?|stockpiles?|snow|brush|stumps?|earthwork|spoil|material handling|move (soil|dirt|material|gravel|earth|rock|spoil|debris))\b/;

function isGeneralQuestion(m: string): boolean {
  if (/\b(diesel|gasoline|\bgas\b|fuel type|petrol)\b/.test(m)) return true;
  if (/\bwhat (is|does) warranty\b/.test(m)) return true;
  if (/\bwhat does free shipping mean\b/.test(m)) return true;
  if (/\bwhat is free shipping\b/.test(m)) return true;
  if (/\b(at home|home use|backyard|diy|residential use|residential yards?|my house|my property)\b/.test(m)) return true;
  if (/\b(weather|recipe|movie|stock|football|capital of|translate|poem|joke|who won|president|calculate)\b/.test(m)) return true;
  return false;
}

function isMachineEducation(m: string): boolean {
  const cats = detectCategories(m);
  const attachments = /\b(auger|breaker|hammer|grapple|thumb|ripper|pallet fork|fork|bucket|hydraulic attachment)\b/.test(m);
  if ((cats.length > 0 || attachments) && /\b(what (is|are|does|can)|how|explain|hard to use|easy to use|difficult|learn to)\b/.test(m)) {
    return true;
  }
  return false;
}

export function detectIntent(raw: string, memory: ChatMemory): DetectedIntent {
  const m = raw.toLowerCase().trim();
  if (!m) return "Unknown question";
  if (memory.awaiting === "recommend") return "Product recommendation";

  if (
    /^(h(i+|ey+|ello+)|hiya|heya|yo+|howdy|sup|wassup|greetings|g'?day|good (morning|afternoon|evening|day)|morning|afternoon|evening|what'?s up|whats up)\b/.test(m) &&
    m.length < 32
  ) {
    return "Greeting";
  }

  if (/\b(thanks|thank you|appreciate|cheers)\b/.test(m) && m.length < 30) {
    return "Greeting";
  }

  if (/\b(typhon( machinery)?)\b/.test(m)) {
    return "Typhon Machinery question";
  }

  if (/\b(konstructz)\b/.test(m)) {
    return "Konstructz question";
  }

  const cats = detectCategories(m);
  const named = findNamed(m);

  if (
    /\b(compare|comparison|versus|\bvs\b|difference|differ|which is better|better than|pros and cons)\b/.test(m) ||
    (cats.length >= 2 && /\b(or|vs|versus|compare|better|difference)\b/.test(m))
  ) {
    return "Machine comparison";
  }

  if (/\b(attach|work tool|fit.*(machine|excavator|loader)|compatible|coupler|bucket|auger|breaker|grapple|thumb|ripper|pallet ?fork|forks?)/.test(m)) {
    if (/\b(what is|explain)\b/.test(m) && /\b(breaker|hammer|auger|thumb|ripper|pallet fork)\b/.test(m)) {
      return "Machine education";
    }
    return "Attachment compatibility";
  }

  if (
    /\b(recommend|suggest|which machine|right for|best (machine|for)|help me (choose|pick|find)|what should i (get|buy|use)|need (a|something|the right)|looking for|for my (job|project|site)|good for|i'?m (doing|clearing|building|working))\b/.test(m) ||
    (JOB_SIGNAL.test(m) && !/\b(what is|what are|explain|how do|how does)\b/.test(m)) ||
    /\b(buy|buying|purchase|in the market)\b/.test(m)
  ) {
    return "Product recommendation";
  }

  if (named.length > 0) {
    return "Product question";
  }

  if (/\b(spec|specification|weight|engine|horsepower|\bhp\b|capacity|dimensions?|hydraulic|flow|gpm|digging depth|dig depth|reach|lift(ing)? (height|capacity)|fuel|travel speed|how (heavy|big|powerful|deep|tall|wide|fast))/.test(m)) {
    return "Product question";
  }

  if (
    /\bwhat (is|are) (a\s+)?warrant(y|ies)?\b/.test(m) ||
    /\bwhat does free shipping mean\b/.test(m) ||
    /\bwhat is free shipping\b/.test(m)
  ) {
    return "General question";
  }

  if (
    /\b(returns?|refund|send (it|this|the machine)? ?back|money back|cancel( my)? order|exchange it)\b/.test(m) ||
    /\b(warrant|guarantee|coverage|covered|defect|claim)\b/.test(m) ||
    /\b(ship|shipping|deliver|delivery|freight|tracking|customs|international|liftgate)\b/.test(m) ||
    /\b(financ|payment|installment|monthly|lease|pay over time|paramount)\b/.test(m)
  ) {
    return "Warranty/free shipping";
  }

  if (
    /\b(spare ?parts?|parts?|filters?|\boil\b|fluid|service interval|maintenance|maintain|grease|service schedule)\b/.test(m) ||
    /\b(safe|safety|operate safely|operating tips)\b/.test(m) ||
    /\b(won'?t start|not (start|working|moving)|overheat|leak|error|problem|trouble|fault|stuck|smok|warning light|won'?t move)\b/.test(m) ||
    /\b(contact|human|agent|talk to|speak to|call|phone|sales team|customer service|reach you)\b/.test(m) ||
    /\b(categor|what (do you|machines do you|products do you) (sell|have|offer|carry)|product range|catalog|lineup|types of (machine|equipment))\b/.test(m) ||
    /\b(support|help|manual)\b/.test(m)
  ) {
    return "Support request";
  }

  if (isMachineEducation(m)) {
    return "Machine education";
  }

  if (isGeneralQuestion(m)) {
    return "General question";
  }

  if (kb.search(m, 1).length) {
    return "Machine education";
  }

  return "Unknown question";
}

/* ───────────────────────────── Helpers ─────────────────────────────── */

const PROBES = [
  "Could you tell me a bit more about the project?",
  "Are you working on a residential or a commercial site?",
  "Want me to factor in attachments or operating costs too?",
  "Is access tight, or do you have open space to work in?",
  "Happy to compare options if you'd like — just say the word.",
];

function slotSummary(s: ChatMemory["slots"]): string {
  const parts: string[] = [];
  if (s.job) parts.push(`**job:** ${s.job}`);
  if (s.terrain) parts.push(`**ground:** ${s.terrain}`);
  if (s.projectSize) parts.push(`**scale:** ${s.projectSize}`);
  if (s.capacity) parts.push(`**capacity:** ${s.capacity}`);
  if (s.experience) parts.push(`**operator:** ${s.experience}`);
  return parts.join(" · ");
}

function relatedBlog(query: string): { label: string; href: string }[] {
  const b = kb.search(query, 1, ["blog"])[0];
  return b?.href ? [{ label: `Related read: ${b.title}`, href: b.href }] : [];
}

const NA = "_Not published — I'd confirm with support rather than guess._";

export function getWelcomeText(): string {
  return pick([
    "Hi — I'm the **Konstructz assistant**. Think of me as your machinery advisor: I can help you find the right machine for your job, compare models, look up attachments, and answer warranty, shipping, or support questions.\n\nWhat are you working on today? Let me know, or choose a prompt below.",
    "Hello! I'm the **Konstructz assistant**, ready to help you with anything related to our equipment. Ask me to recommend a machine for your site, compare specifications, check attachment fitment, or walk through our 1-Year Warranty and Free Shipping.\n\nWhere would you like to start?",
    "Welcome to Konstructz! I'm your AI product and support consultant. Whether you're trenching, loading, or grading, I can help you choose the best machine, compare models, or explain our support and parts coverage.\n\nTell me a bit about your project or select a topic to begin."
  ]);
}

export function getPurchaseNote(): string {
  return pick([
    "Every machine includes a **1-Year Warranty** and **Free Shipping** where eligible (continental U.S.).",
    "Keep in mind that all machines include a **1-Year Warranty** and qualify for **Free Shipping** to the lower 48 states.",
    "For peace of mind, purchases are backed by a **1-Year Warranty** and eligible models ship with **Free Shipping**."
  ]);
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function rewordFollowup(text: string): string {
  const synonyms: Record<string, string[]> = {
    "Which machine is best for this job?": [
      "Which machine is best for this job?",
      "Recommend a machine for my project",
      "Which model fits my job?",
      "Find the right machine for my work"
    ],
    "Show me related machines": [
      "Show me related machines",
      "Browse similar models",
      "See related equipment",
      "View similar options"
    ],
    "Compare excavator vs skid steer": [
      "Compare excavator vs skid steer",
      "Excavator vs skid steer comparison",
      "Compare mini excavator & skid steer",
      "Excavator or skid steer?"
    ],
    "Show machine specs": [
      "Show machine specs",
      "View equipment specs",
      "Let me see specifications",
      "Show technical specs"
    ],
    "Compare similar models": [
      "Compare similar models",
      "Compare other models",
      "Put similar machines head-to-head",
      "Compare specs with other models"
    ],
    "Check warranty and shipping": [
      "Check warranty and shipping",
      "Warranty & shipping details",
      "Show warranty & delivery info",
      "What are the warranty & shipping terms?"
    ],
    "Find compatible attachments": [
      "Find compatible attachments",
      "Show compatible attachments",
      "What attachments can I use?",
      "Browse matching attachments"
    ],
    "Request a quote": [
      "Request a quote",
      "Get a custom quote",
      "Quote this machine",
      "Ask for pricing/quote"
    ],
    "What attachments fit a mini excavator?": [
      "What attachments fit a mini excavator?",
      "Mini excavator attachment options",
      "Show mini excavator attachments"
    ],
    "What does the warranty cover?": [
      "What does the warranty cover?",
      "Details on warranty coverage",
      "Explain the machine warranty"
    ]
  };

  const options = synonyms[text];
  return options ? pick(options) : text;
}

function generateFollowups(intent: DetectedIntent, query: string, memory: ChatMemory): string[] {
  const followups: string[] = [];
  
  if (intent === "Greeting" || intent === "Unknown question") {
    followups.push("Which machine is right for my job?");
    followups.push("Compare excavator vs skid steer");
    followups.push("What attachments fit a mini excavator?");
    followups.push("What does the warranty cover?");
  } else if (intent === "General question" || intent === "Machine education") {
    followups.push("Which machine is best for this job?");
    followups.push("Show me related machines");
    followups.push("Compare excavator vs skid steer");
  } else if (intent === "Typhon Machinery question" || intent === "Konstructz question" || intent === "Product question") {
    followups.push("Show machine specs");
    followups.push("Compare similar models");
    followups.push("Check warranty and shipping");
    followups.push("Find compatible attachments");
    followups.push("Request a quote");
  } else if (intent === "Machine comparison") {
    followups.push("Which is better for my job?");
    followups.push("Compare similar models");
    followups.push("Check warranty and shipping");
    followups.push("Request a quote");
  } else if (intent === "Product recommendation") {
    followups.push("Compare excavator vs skid steer");
    followups.push("Find compatible attachments");
    followups.push("Check warranty and shipping");
    followups.push("Request a quote");
  } else if (intent === "Attachment compatibility") {
    followups.push("Find compatible attachments");
    followups.push("Check warranty and shipping");
    followups.push("Request a quote");
  } else if (intent === "Warranty/free shipping" || intent === "Support request") {
    followups.push("Check warranty and shipping");
    followups.push("Compare similar models");
    followups.push("Request a quote");
  } else {
    followups.push("Which machine is best for this job?");
    followups.push("Check warranty and shipping");
    followups.push("Compare excavator vs skid steer");
  }

  const shuffled = shuffle(followups).slice(0, 3);
  return shuffled.map(rewordFollowup);
}

function getGeneralAnswer(m: string): { markdown: string; followups: string[] } | null {
  const q = m.toLowerCase();
  
  if (/\b(japan|tokyo)\b/.test(q)) {
    return {
      markdown: "The capital of Japan is Tokyo. If you need help with Konstructz or Typhon machines, attachments, warranty, shipping, or support, I can help with that too.",
      followups: ["Recommend a machine", "Compare excavator vs skid steer", "Check warranty and shipping"]
    };
  }

  if (/\btyphon\b/.test(q) && /\b(what is|who is|about)\b/.test(q)) {
    return {
      markdown: "## Typhon Machinery\n\nTyphon Machinery is an important machinery brand specializing in heavy-duty material handling, access platforms, and compaction equipment. Their lineup adds critical utility to our store, including:\n\n- **Rough-Terrain Forklifts** (1.5 to 3.0 Tons)\n- **Road Rollers / Compactors** (1.0 to 2.0 Tons)\n- **Scissor Lifts** (xFlex electric and rough-terrain series)\n- **Specialty Mini Excavators** (e.g. Terror series ranging from 0.8 ton to larger cab models)\n\nAll Typhon equipment sold through our website qualifies for our standard **1-Year Warranty** (including parts support) and **Free Shipping** to the continental U.S. (lower 48 states).",
      followups: ["Show machine specs", "Compare similar models", "Check warranty and shipping"]
    };
  }

  if (/\bkonstructz\b/.test(q) && /\b(what is|who is|about)\b/.test(q)) {
    return {
      markdown: "## Konstructz Machinery\n\nKonstructz is our primary brand specializing in compact construction equipment designed for contractors, landscapers, farmers, and residential landowners. Our machinery range is built for high reliability, ease of operation, and structural durability, including:\n\n- **Mini & Towable Excavators** (like the zero-tail-swing KUVUO 2.5 and 2.7)\n- **Skid Steer Loaders** (like the STOMP V980 and V950)\n- **Wheel Loaders** (like the heavy-duty SKOOP II)\n- **Backhoe Loaders** (like the SCOOPYDIG)\n- **Site Dumpers** (like the THUNDERDUMP series)\n- **Trenchers & Stone Crushers** for specialty tasks\n\nEvery Konstructz machine includes a **1-Year Warranty** and eligible models qualify for **Free Shipping** directly to your door or nearest freight terminal in the continental U.S.",
      followups: ["Recommend a machine for my job", "Compare excavator vs skid steer", "Check warranty and shipping"]
    };
  }

  if (/\b(difference between a mini excavator and skid steer|difference between mini excavator and skid steer|difference between excavator and skid steer|excavator vs skid steer|skid steer vs excavator)\b/.test(q)) {
    return {
      markdown: "## Mini Excavator vs. Skid Steer Loader\n\nComparing these two machine types comes down to their design and primary application on the job site:\n\n- **Mini Excavators** (e.g., Konstructz KUVUO series) are engineered for **precision digging, trenching, and stationary operations**. They feature a 360-degree rotating cab, boom swing, and a tracked undercarriage, allowing them to work close to walls, dig trenches up to 8+ feet deep, and operate on wet or uneven ground.\n- **Skid Steer Loaders** (e.g., Konstructz STOMP series) are built for **mobility, loading, grading, and material transport**. They turn using zero-radius skid steering and feature front-mounted lift arms that accommodate rapid attachment swaps (pallet forks, sweepers, grading buckets).\n\n**Which is right?** Choose an excavator if your primary task is digging below grade. Choose a skid steer if you need to push dirt, level land, or load material into trucks. Many professional crews run both to handle complete jobsite cycles.",
      followups: ["Which machine is best for landscaping?", "Find compatible attachments", "Check warranty and shipping"]
    };
  }

  if (/\b(difference between gas and diesel|difference between diesel and gas|gas vs diesel|diesel vs gas)\b/.test(q)) {
    return {
      markdown: "## Gasoline vs. Diesel Engines in Machinery\n\nGasoline and diesel engines differ in how they ignite fuel and deliver power, which influences how heavy equipment is built:\n\n- **Gasoline Engines**: Ignite fuel using spark plugs, run at higher RPMs, and are typically lighter and cheaper. They are great for passenger cars and light utility tools (such as lawnmowers and small towable diggers).\n- **Diesel Engines**: Compress air to generate heat that ignites the fuel (no spark plugs needed). They operate at lower RPMs but produce significantly higher **torque** (digging/pulling power) and offer superior fuel efficiency under heavy loads. Because of their structural density, diesel engines last much longer under heavy daily production cycles.\n\nAll primary Konstructz and Typhon excavators and loaders utilize genuine diesel engines (like Kubota or Yanmar) to ensure high torque and long-term durability on the job.",
      followups: ["Which machine is best for this job?", "Compare excavator vs skid steer", "Show me related machines"]
    };
  }

  if (/\b(diesel|petrol)\b/.test(q)) {
    return {
      markdown: "Diesel is a highly efficient fuel used in heavy-duty machinery. It has a higher energy density than gasoline and uses compression-ignition, which provides the low-end torque and durability needed for heavy tasks like excavation and earthmoving.",
      followups: ["What is the difference between gas and diesel?", "Which machine is best for this job?", "Show me related machines"]
    };
  }
  
  if (/\b(warranty|guarantee)\b/.test(q)) {
    return {
      markdown: "## Warranty & Parts Support\n\nAll new Konstructz and Typhon machines sold through our site are backed by a **1-Year Warranty**. Here are the key details:\n\n- **Coverage**: Covers structural, powertrain (engine), and hydraulic system defects under normal operating conditions.\n- **Parts Support**: We ship genuine replacement parts directly to you to minimize jobsite downtime. Our dedicated parts support team is based in the U.S. to ensure fast shipping.\n- **Exclusions**: Normal wear-and-tear items (such as tracks, bucket teeth, filters, oil, seals, and hydraulic attachments) are owner-maintained and excluded from the standard warranty.\n\nFor exact component details or to submit a warranty claim, please contact our support team with your model and order number.",
      followups: ["Check warranty and shipping", "Find compatible attachments", "Request a quote"]
    };
  }

  if (/\b(free shipping|shipping free|is shipping free|shipping mean)\b/.test(q)) {
    return {
      markdown: "## Shipping & Delivery Logistics\n\nYes! We include **Free Ground Shipping** on eligible machines to the continental United States (lower 48 states). Here is what you need to know about delivery:\n\n- **Freight Carriage**: Heavy machinery ships via commercial freight truck lines. The carrier will contact you in advance to schedule a delivery appointment window.\n- **Unloading Requirements**: Standard delivery does **not** include a forklift or liftgate. The customer is responsible for having a loading dock, a forklift, or a tractor with forks to safely unload the machine. Alternatively, you can request pickup at the nearest carrier terminal.\n- **Processing & Delivery**: Orders are processed within ~3 business days. Transit time takes between 5 to 14 business days depending on your distance from our warehouse.\n- **Logistics Notes**: Address changes after dispatch or missed delivery appointments can incur carrier fees (like a redelivery fee). Make sure to inspect the machine on arrival and report transit damage within 48 hours.",
      followups: ["Check warranty and shipping", "Request a quote", "Find compatible attachments"]
    };
  }

  if (/\b(home|house|diy|backyard|residential|property)\b/.test(q)) {
    return {
      markdown: "## Residential & Home Property Use\n\nYes, many of our compact machines are highly popular with residential property owners, hobby farmers, and DIY enthusiasts. Models like the **SPIDER ONE** (towable excavator) or the **KUVUO 2.5** mini excavator are perfect for:\n\n- Grading driveways and spreading gravel/mulch\n- Trenching for home drainage, retaining walls, or utility lines\n- Clearing brush, stumps, and rocks from pastures\n- Digging footings for decks, fences, and outbuildings\n\n**Property Care Tip**: Tracked compact machines use rubber tracks which spread the machine's weight, keeping ground pressure extremely low to minimize damage to lawns and turf. \n\n*Important Safety Note: Always call 811 to locate underground utility lines before digging on your property!*",
      followups: ["Which machine is best for landscaping?", "Compare excavator vs skid steer", "Show me related machines"]
    };
  }

  if (/\b(beginner|first[- ]?time|easy to use|hard to use|difficult|learn to operate)\b/.test(q)) {
    return {
      markdown: "## Operating Machinery as a Beginner\n\nYes! Modern compact machinery is designed to be highly intuitive and user-friendly, even for first-time operators:\n\n- **Controls**: Most machines use dual-joystick pilot controls. The left joystick controls the cab swing and boom arm, while the right controls the boom height and bucket curl. Travel pedals control track movement.\n- **Standard Patterns**: Equipment uses standard ISO or SAE control patterns, which are easy to learn. Basic movements can be learned in a few hours of slow, focused practice.\n- **Safety First**: Beginners must always operate at low engine throttle to reduce speed, read the operator manual thoroughly, wear the seatbelt, keep bystanders clear of the 360-degree swing radius, and operate on level, stable ground. All our machines include operator safety guidance to help you get started safely.",
      followups: ["Which machine is best for this job?", "Compare excavator vs skid steer", "Show me related machines"]
    };
  }

  if (/\b(maintain|maintenance|upkeep|service|filters?)\b/.test(q)) {
    return {
      markdown: "## Routine Maintenance & Upkeep\n\nKeeping your compact machine properly maintained is key to longevity. Standard maintenance guidelines include:\n\n- **Daily Pre-Start Checks**: Inspect engine oil, coolant, and hydraulic fluid levels. Check for active leaks, check track tension, and grease the main pivot pins and loader arm connections.\n- **Greasing**: Pivot pins should be greased every 10 operating hours to prevent friction wear.\n- **50-Hour Break-In Service**: Change engine oil, engine filter, and replace the initial hydraulic system filters to flush out manufacturing particles.\n- **Every 250 Hours**: Change engine oil & filter, replace air and fuel filters, and check battery connections.\n- **Every 1000 Hours**: Perform a full hydraulic fluid flush and track alignment inspection.\n\nGenuine replacement parts and filters are stocked in our parts warehouse and can be ordered directly from our support team.",
      followups: ["How do I request support?", "What is the warranty?", "Show machine specs"]
    };
  }

  if (/\b(support|contact|reach|phone|email|help|agent|human|sales)\b/.test(q)) {
    return {
      markdown: "## Contacting Support & Sales\n\nWe provide direct, expert support based in the U.S. Here is how you can reach our team:\n\n- **Phone**: Call us at **+1 213-214-2203** (available Monday to Friday, 9 AM to 5 PM).\n- **Email**: Send inquiries to **support@konstructz.com** (typical response within 24-48 hours).\n- **WhatsApp**: Click the WhatsApp link in the widget to chat directly.\n- **Online Form**: Submit a message through our Contact page for sales quotes, financing approval, or parts ordering.\n\nOur support team can help with troubleshooting, parts orders, warranty claims, and financing details.",
      followups: ["Check warranty and shipping", "Compare similar models", "Request a quote"]
    };
  }

  if (/\b(who are you|what are you|are you (a )?(human|bot|ai|robot)|your name)\b/.test(q)) {
    return {
      markdown: "I'm the **Konstructz assistant** — an AI product and support consultant for Konstructz and Typhon machinery. I'm here to help you pick the right machine, compare options, and check warranty or shipping details.",
      followups: ["What can you help with?", "Recommend a machine"]
    };
  }

  if (/\b(what can you (do|help)|how can you help|what do you do)\b/.test(q)) {
    return {
      markdown: "## What I can do\n\n- **Recommend** the right machine for your job, site, and budget — with the reasoning\n- **Compare** machines properly (purpose, specs, pros/cons, terrain, a final call)\n- **Attachments & fitment** guidance\n- **Warranty, shipping, financing, parts, maintenance, safety**\n- **Quotes** and a hand-off to sales/support\n\nWhere would you like to start?",
      followups: STARTERS.slice(0, 4)
    };
  }

  if (/\b(weather|recipe|movie|stock|football|capital of|translate|poem|joke|who won|president|calculate)\b/.test(q)) {
    return {
      markdown: `That's a bit outside my lane, but I'll do my best: I'm an AI assistant focused on machinery. If you have any questions about Konstructz or Typhon mini excavators, loaders, attachments, warranty, or shipping, I'd be happy to answer them! What kind of project are you planning?`,
      followups: ["Which machine is best for this job?", "Compare excavator vs skid steer", "Show me related machines"]
    };
  }

  return null;
}

function getMachineEducation(m: string): { markdown: string; followups: string[]; products?: ProductRef[] } | null {
  const q = m.toLowerCase();

  if (/\b(skid steer|skidsteer)\b/.test(q)) {
    const inCat = refsInCategory("Skid Steer Loader").slice(0, 3);
    return {
      markdown: "## Skid Steer Loaders\n\nA skid steer loader is a compact, highly versatile engine-powered machine with lift arms. It gets its name because it turns by skidding its wheels or tracks (zero-radius turning), making it incredibly agile in tight quarters. Unlike excavators, skid steers are designed to work above grade for pushing, loading, lifting, and carrying bulk materials. It is considered the ultimate jobsite utility tool because you can quickly swap attachments like pallet forks, sweepers, grading buckets, and snow blowers. \n\nIn our catalog, models like the **Konstructz STOMP V980** (3.5 Tons) offer massive torque and hydraulic flow for heavy grading, while the **Typhon Stomp V1000** provides premium material handling.",
      products: inCat,
      followups: ["Which machine is best for this job?", "Compare excavator vs skid steer", "Find compatible attachments"]
    };
  }

  if (/\b(mini excavator|excavator|digger|dig)\b/.test(q)) {
    const inCat = refsInCategory("Mini Excavator").slice(0, 3);
    return {
      markdown: "## Mini Excavators\n\nA mini excavator (compact excavator) is a tracked machine designed primarily for stationary digging, trenching, and utility excavation. It consists of a rotating cab (often zero-tail-swing to operate safely near walls), rubber tracks (for low ground pressure), a boom, an arm, and a bucket. They typically weigh under 6 metric tons. Unlike loader machines, they dig below grade with high precision and breakout force. They can be equipped with hydraulic augers, breakers, grapples, or thumbs.\n\nPopular models include the **Konstructz KUVUO 2.5** (2.5 Tons, Yanmar Diesel engine) and the **Typhon Terror XI** (0.8 Ton) for narrow gates and tight backyards.",
      products: inCat,
      followups: ["Which machine is best for this job?", "Compare excavator vs skid steer", "Find compatible attachments"]
    };
  }

  if (/\b(breaker|hydraulic hammer|hammer attachment)\b/.test(q)) {
    return {
      markdown: "## Hydraulic Breakers\n\nA hydraulic breaker (or hammer) is an attachment designed to demolish concrete, brick, stone, asphalt, or frozen ground. It uses the machine's auxiliary hydraulic pressure to strike a piston against a chisel tool. It is commonly paired with mini excavators (like the KUVUO series) for foundation demolition or trenching through rock. Correct fitment requires matching the attachment's operating weight and hydraulic flow (GPM/PSI) to the host machine's specifications.",
      followups: ["Which machine is best for this job?", "Find compatible attachments", "Check warranty and shipping"]
    };
  }

  if (/\b(landscap|gardening|lawn|sod)\b/.test(q)) {
    const refs = [
      PRODUCT_REFS.find(r => r.name === "KUVUO 2.5"),
      PRODUCT_REFS.find(r => r.name === "STOMP V980"),
      PRODUCT_REFS.find(r => r.name === "THUNDERDUMP")
    ].filter(Boolean) as ProductRef[];
    return {
      markdown: "## Landscaping Machine Recommendations\n\nLandscaping projects often require a machine that is compact, highly versatile, and gentle on turf. The ideal choice depends on your primary task:\n\n- **Grading, Leveling, Spreading Sod/Mulch**: A **Skid Steer Loader** (like the **STOMP V980**) is unmatched for moving dirt quickly and leveling terrain. Equipped with rubber tracks (Compact Track Loader configuration), it distributes weight to avoid tearing up lawns.\n- **Trenching, Digging Ponds, Planting Trees**: A **Mini Excavator** (like the **KUVUO 2.5**) is best for below-grade excavation and working close to fences or garden walls using boom-swing.\n- **Hauling Aggregate/Soil**: A compact **Site Dumper** (like the **THUNDERDUMP**) is far more efficient than a bucket loader for hauling bulk material across lawns without tearing turf.\n\nAll our compact landscaping machines include a **1-Year Warranty** and qualify for **Free Shipping** to the continental U.S.",
      products: refs,
      followups: ["What attachments do I need?", "Compare excavator vs skid steer", "Check warranty and shipping"]
    };
  }

  if (/\b(lift|lifting|carrying|forks)\b/.test(q)) {
    const refs = [
      PRODUCT_REFS.find(r => r.name === "STOMP V980"),
      PRODUCT_REFS.find(r => r.name.includes("Forklift")),
      PRODUCT_REFS.find(r => r.name.includes("Roller"))
    ].filter(Boolean) as ProductRef[];
    return {
      markdown: "## Machines for Lifting and Carrying Material\n\nIf your primary work involves lifting, stacking, or moving materials across a yard or jobsite, choose based on the material type:\n\n- **Palletized Material & Sod**: A **Skid Steer Loader** equipped with pallet forks is highly versatile. Alternatively, the **Typhon Forklift** series is the professional choice for warehouse and yard pallet handling.\n- **Bulk Soil, Gravel, stockpiles**: A **Wheel Loader** (like the **SKOOP II**) or **Skid Steer Loader** with a general-purpose bucket will move the highest volume per cycle.\n- **Personnel & Tools**: A **Scissor Lift** (Typhon xFlex series) raises workers safely to elevated heights.\n- **Excavated Material**: While mini excavators can lift (using grapples or thumbs), their lifting capacity is lower compared to front loaders.",
      products: refs,
      followups: ["Which machine is best for this job?", "Compare similar models", "Check warranty and shipping"]
    };
  }

  if (/\b(construction|small construction|utility|contractor)\b/.test(q)) {
    const refs = [
      PRODUCT_REFS.find(r => r.name === "KUVUO 2.5"),
      PRODUCT_REFS.find(r => r.name === "SCOOPYDIG"),
      PRODUCT_REFS.find(r => r.name === "STOMP V980")
    ].filter(Boolean) as ProductRef[];
    return {
      markdown: "## Machines for Small Construction & Utilities\n\nSmall construction sites demand versatility, transportability, and high power-to-size ratios. The standard choices include:\n\n- **Mini Excavators** (like the **KUVUO 2.5**): Essential for digging foundations, footings, plumbing/electrical utility trenches, and concrete demolition.\n- **Skid Steer Loaders** (like the **STOMP V980**): Ideal for site clearing, spreading base rock, loading dump trucks, and cleanup.\n- **Backhoe Loaders** (like the **SCOOPYDIG**): The ultimate multi-tool, combining a front loader bucket and a rear-mounted digging backhoe arm. This allows a single operator to perform both excavation and loading operations on site.\n- **Compaction**: For road base and paving base compaction, a **Typhon Road Roller** is highly effective.\n\nAll our commercial-grade compact construction machines are backed by a **1-Year Warranty** and include **Free Shipping** to eligible jobsites.",
      products: refs,
      followups: ["What attachments do I need?", "Compare excavator vs skid steer", "Check warranty and shipping"]
    };
  }

  return null;
}

// A spec the user is likely asking about → which spec labels answer it.
const SPEC_QUERY: { re: RegExp; labels: RegExp; word: string }[] = [
  { re: /\b(dig|digging|dug)\b.*\bdepth|how deep|max(imum)? depth|reach down/, labels: /digging depth|dig depth|max(imum)? dig|depth/i, word: "digging depth" },
  { re: /\b(weigh|weight|how heavy|operating weight|ton|tonnage)\b/, labels: /operating weight|weight/i, word: "weight" },
  { re: /\b(engine|motor|horsepower|hp|power|diesel|fuel type)\b/, labels: /engine power|engine/i, word: "engine" },
  { re: /\b(lift|lifting|capacity|load|operating capacity|rated)\b/, labels: /operating capacity|load capacity|lift|capacity/i, word: "lift/operating capacity" },
  { re: /\b(hydraulic|flow|gpm|lpm)\b/, labels: /hydraulic/i, word: "hydraulics" },
  { re: /\b(reach|how (tall|high)|height|dump height)\b/, labels: /height|reach|dump/i, word: "reach/height" },
  { re: /\b(width|how wide)\b/, labels: /width/i, word: "width" },
  { re: /\b(speed|how fast|travel)\b/, labels: /speed|travel/i, word: "travel speed" },
  { re: /\b(fuel tank|tank capacity)\b/, labels: /fuel|tank/i, word: "fuel tank" },
];

// Compatible-attachment hint per category (work-tool types, not invented fitment).
function attachmentHint(categoryLabel: string): string | undefined {
  return profileFor(categoryLabel)?.attachments;
}

/* ─────────────────────── Comparison engine ─────────────────────────── */

function compareRow(label: string, vals: string[]): string {
  return `| ${label} | ${vals.map((v) => v || NA).join(" | ")} |\n`;
}

function composeComparison(details: ProductDetail[]): Answer {
  const ds = details.slice(0, 3);
  const names = ds.map((d) => `**${d.name}**`);
  const cols = ds.map((d) => `${d.name}<br/><span>(${d.categoryLabel})</span>`);
  const profs = ds.map((d) => profileFor(d.categoryLabel));

  const differentClasses = new Set(ds.map((d) => d.categoryLabel)).size > 1;
  let md = `## ${names.join(" vs ")}\n\n`;
  md += differentClasses
    ? `${pick(["These are built for different jobs, so it's less about which is “better” and more about which matches your work.", "Good comparison — these sit in different machine classes, so the right pick really depends on the task."])}\n\n`
    : `${pick(["Both are in the same class, so this comes down to size and spec for your job.", "Same class of machine — here's how they line up."])}\n\n`;

  md += `| | ${cols.join(" | ")} |\n|${"---|".repeat(ds.length + 1)}\n`;
  md += compareRow("Purpose", profs.map((p) => p?.purpose || ""));
  md += compareRow("Best for", profs.map((p) => (p ? p.bestFor.slice(0, 3).join(", ") : "")));
  md += compareRow("Operating weight", ds.map((d) => d.weight || specValue(d, /operating weight|weight/i) || ""));
  md += compareRow("Engine", ds.map((d) => specValue(d, /engine power|engine/i) || ""));
  md += compareRow("Hydraulics", ds.map((d) => specValue(d, /hydraulic/i) || ""));
  md += compareRow("Lift / dig capacity", ds.map((d) => specValue(d, /operating capacity|load capacity|lift|digging depth|capacity/i) || ""));
  md += compareRow("Maneuverability", profs.map((p) => p?.maneuverability || ""));
  md += compareRow("Terrain", profs.map((p) => p?.terrain || ""));
  md += compareRow("Attachments", profs.map((p) => p?.attachments || ""));
  md += compareRow("Maintenance", profs.map((p) => p?.maintenance || ""));
  md += compareRow("Best suited to", profs.map((p) => p?.recommendedUser || ""));
  md += "\n";

  // Pros / cons
  ds.forEach((d, i) => {
    const p = profs[i];
    if (!p) return;
    md += `**${d.name} — pros & cons**\n\n`;
    md += p.pros.slice(0, 3).map((x) => `- ✅ ${x}`).join("\n") + "\n";
    md += p.cons.slice(0, 2).map((x) => `- ⚠️ ${x}`).join("\n") + "\n\n";
  });

  // Final recommendation
  if (differentClasses && ds.length >= 2) {
    md += `### My take\n\nGo with the **${ds[0].name}** if your work leans toward ${profs[0]?.bestFor[0].toLowerCase()} and ${profs[0]?.bestFor[1]?.toLowerCase()}. Choose the **${ds[1].name}** if you're mostly ${profs[1]?.bestFor[0].toLowerCase()}. If you'll do **both regularly**, many crews keep one of each — or look at a backhoe loader that blends the two. Tell me your main task and site conditions and I'll call it for you.`;
  } else {
    md += `### My take\n\nThey overlap, so size it to your workload: the heavier machine for higher daily volume, the lighter one for tight access and easier transport. What's the main job and how much will you run it?`;
  }

  return {
    markdown: md,
    products: ds.map((d) => PRODUCT_REFS.find((r) => r.href === d.href)!).filter(Boolean),
    links: relatedBlog(ds.map((d) => d.categoryLabel).join(" ")),
    followups: ["Which fits my project better?", "Compare operating costs", "What attachments do they take?", "Get a quote"],
  };
}

function comparisonTargets(m: string, memory: ChatMemory): ProductDetail[] | null {
  const named = findNamed(m);
  if (named.length >= 2) return named.map(detailOf).filter(Boolean) as ProductDetail[];

  const cats = detectCategories(m);
  if (cats.length >= 2) {
    return cats
      .slice(0, 3)
      .map((c) => representativeRef(c))
      .filter((r): r is ProductRef => !!r)
      .map(detailOf)
      .filter(Boolean) as ProductDetail[];
  }
  if (cats.length === 1) {
    const two = refsInCategory(cats[0]).slice(0, 2);
    if (two.length >= 2) return two.map(detailOf).filter(Boolean) as ProductDetail[];
  }
  if (named.length === 1 && memory.activeMachine && memory.activeMachine.href !== named[0].href) {
    return [named[0], memory.activeMachine].map(detailOf).filter(Boolean) as ProductDetail[];
  }
  if (memory.lastProducts.length >= 2) {
    return memory.lastProducts.map(detailOf).filter(Boolean).slice(0, 3) as ProductDetail[];
  }
  return null;
}

/* ───────────────────────── Recommendation ──────────────────────────── */

function composeRecommend(refs: ProductRef[], note: string, slots: ChatMemory["slots"]): Answer {
  const lead = refs[0];
  const leadProf = profileFor(lead.categoryLabel);
  const ctx = slotSummary(slots);
  const reasonForJob = note ? note : slots.job ? `${slots.job} work` : "your work";

  let md = `${pick(["Here's how I'd approach it.", "Good brief — here's my thinking.", "Let me reason through this with you."])}\n\n`;
  if (ctx) md += `From what you've shared (${ctx}), `;
  md += `I'd lead with a **${lead.categoryLabel}** like the **${lead.name}**`;
  if (leadProf) md += ` — ${leadProf.purpose.toLowerCase().replace(/\.$/, "")}, which suits ${reasonForJob}`;
  md += ".\n\n";

  if (leadProf) {
    md += `**Why it fits:**\n`;
    md += leadProf.pros.slice(0, 3).map((p) => `- ${p}`).join("\n");
    if (slots.terrain) md += `\n- Handles ${slots.terrain} ground in this class of work`;
    md += "\n\n";
  }

  const alt = refs.find((r) => r.categoryLabel !== lead.categoryLabel);
  if (alt) {
    const altProf = profileFor(alt.categoryLabel);
    md += `**Worth considering:** a **${alt.categoryLabel}** such as the **${alt.name}**${altProf ? ` if you'll do more ${altProf.bestFor[0].toLowerCase()}` : ""}.\n\n`;
  }

  md += `Here are the closest options — open any for full specs and a quote. ${getPurchaseNote()}`;

  return {
    markdown: md,
    products: refs,
    links: relatedBlog(refs.map((r) => r.categoryLabel).join(" ")),
    followups: [
      alt ? `Compare the ${lead.categoryLabel} and ${alt.categoryLabel}` : "Compare these machines",
      "What attachments would I need?",
      "Would these handle my budget?",
      "Get a quote",
    ],
  };
}

/* ───────────────────────── Support composers ───────────────────────── */

function supportAnswer(intent: string): Answer {
  const map: Record<string, { href: string; topic: string; followups: string[]; handoff?: boolean }> = {
    warranty: { href: "/support/warranty-returns", topic: "Warranty & Returns", followups: ["Can I return a machine?", "How do I make a claim?", "Talk to support"] },
    returns: { href: "/support/warranty-returns", topic: "Warranty & Returns", followups: ["What's the warranty?", "What can't be returned?", "Talk to support"] },
    shipping: { href: "/support/shipping-delivery", topic: "Shipping & Delivery", followups: ["Can I return a machine?", "Get a delivery estimate", "Do you offer financing?"] },
    financing: { href: "/contact", topic: "Financing & Payment", followups: ["Request a quote", "Recommend a machine for me", "Talk to sales"], handoff: true },
    parts: { href: "/support/machine-guidance", topic: "Parts & Maintenance", followups: ["What does the warranty cover?", "Operation & safety basics", "Talk to support"] },
    safety: { href: "/support/machine-guidance", topic: "Machine Guidance", followups: ["Maintenance basics", "Talk to support"] },
  };
  const e = map[intent];
  // Internal citation so the answer references the support topic it draws from.
  const md = `${formatSupportDoc(intent)}\n\n*Reference — Konstructz Support: ${e.topic}*`;
  return { markdown: md, links: [{ label: `Open: ${e.topic}`, href: e.href }, ...relatedBlog(intent)], followups: e.followups, handoff: e.handoff };
}

function formatSupportDoc(intent: Intent): string {
  switch (intent) {
    case "warranty":
      return `## Warranty\n\nEvery Konstructz machine comes with a **one-year warranty**, and that coverage **includes spare parts** during the warranty period — so genuine replacement parts are provided to keep your machine running.\n\n- **Length:** 1 year from purchase\n- **Includes:** spare parts during the coverage period\n- **Exact coverage** varies by machine and configuration, so the specific terms for your unit are confirmed by our team rather than quoted as a blanket rule\n\nI won't invent component-level details — _the detailed coverage breakdown is best confirmed per model (needs review)._ To make a claim or check what's covered on your machine, contact support.`;
    case "returns":
      return `## Returns & refunds\n\nIf a machine isn't right, you can request a **return within 30 days of delivery** for a **refund to your original payment method**.\n\n- **Return shipping is the customer's responsibility** — we don't cover return logistics\n- The machine must be **unused and in original condition**\n- **Can't be returned:** used or damaged equipment, custom/special-order machines, spare parts, consumables, and hydraulic attachments\n- **Transport damage?** Report it **within 48 hours** of delivery\n\nTo start a return, contact support and we'll send return instructions. _Note: the exact return window/start date and refund timeframe should be confirmed (published sources differ) — needs review._`;
    case "shipping":
      return `## Shipping & delivery\n\nWe ship across the **United States (lower 48 states)** by **freight/trucking**, with **free ground shipping** to the continental U.S. Import duties, EPA certification, and documentation are handled on our side.\n\n- **Processing:** ~3 business days after cleared payment\n- **Delivery:** ~5–14 business days after that, by destination and carrier\n- Heavy machines ship by **truck**; the carrier books a delivery appointment by phone/email\n- **No forklift/liftgate** on standard delivery — **warehouse pickup** is available\n- **Inspect on arrival** and report any transport damage **within 48 hours**\n- Missing a booked slot can add a **~10% redelivery fee**; address changes after dispatch may add carrier charges\n- Online tracking isn't always available for trucked machines, so we keep you posted directly\n- _International shipping is not offered (U.S. only)._\n\nTell me roughly where you are and I'll point you to the team for a delivery estimate.`;
    case "financing":
      return `## Financing\n\nYes — Konstructz offers flexible financing through **Paramount Financial** (lease-to-own).\n\n- **100% financing**, with the option to **bundle equipment, shipping, and taxes**\n- **Soft credit check** — no hard hit to your score\n- **All credit profiles considered**; **startup-friendly** (no minimum time in business)\n- **Instant decisions** on approvals up to **$25,000**\n- Lease payments may be **tax-deductible**; an optional **down payment** lowers the financed balance\n\n**How it works:** apply with Paramount → get a decision by email/phone → choose your machine and get a quote from sales → sign the documents → the order ships once approved. Exact **rates, fees, and early-payoff terms** come from Paramount on approval. Want me to help you pick a machine to quote?`;
    case "parts":
      return `## Parts & maintenance\n\n**Genuine spare parts** can be ordered directly through our parts team, and many machines include **parts support under the one-year warranty**. We also provide **servicing, parts replacement, and technical assistance**, plus **operator training** (safety and best practices) and **user manuals** for our machines.\n\nRoutine upkeep keeps a machine reliable:\n- Change **engine oil & filters**, **hydraulic oil & filters**, **air/fuel filters** on schedule\n- **Grease** pivot points; check **tracks/tyres**\n- Keep **cutting edges and bucket teeth** in good shape (wear items are owner-maintained)\n\nFor the right part, a service interval, training, or a manual for your model, contact support and they'll pull it up.`;
    case "safety":
      return `## Operation & safety basics\n\nAlways start with the machine's operator manual. General good practice:\n\n- **Walk-around inspection** before starting\n- **Seatbelt** where fitted\n- Keep people clear of the **working area and swing radius**\n- Work on **stable ground**; take care on slopes\n- **Lower attachments** before leaving the cab\n- Never exceed the machine's **rated capacity** or published spec\n\nWant model-specific guidance? I can point you to machine guidance or support.`;
    default:
      return "Let me connect you with the team for that.";
  }
}

function composeAttachments(machine?: ProductRef, memorySlots?: ChatMemory["slots"]): Answer {
  if (machine) {
    const prof = profileFor(machine.categoryLabel);
    return {
      markdown: `## Attachments for the ${machine.name}\n\nThe **${machine.name}** is a ${machine.categoryLabel.toLowerCase()}, so the work tools that make sense are the ones for that class: ${prof?.attachments || "model-specific tools"}.\n\nThe catch is **fitment** — coupler type, mounting, and hydraulic flow all have to match, and I won't guess at compatibility for a specific unit. The reliable move is a quick **fitment check** with the team so you only buy tools that actually fit and have the flow to run them.\n\nIf you tell me **which tasks** you want to add (drilling, breaking, grabbing, forks…), I can suggest the right attachment types to ask about.`,
      products: [machine],
      links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Ask a fitment check", href: "/contact" }],
      followups: ["Suggest attachments for digging", "Suggest attachments for material handling", "Request a fitment check"],
      handoff: true,
    };
  }

  // If no machine is selected, but a job context is in memory:
  if (memorySlots) {
    if (memorySlots.job === "landscap") {
      return {
        markdown: `## Attachments for Landscaping\n\nSince you are working on **landscaping**, here are the work tools and attachments that make the most sense for your project:\n\n- **Augers** for drilling post holes (fences, decks) and tree plantings.\n- **Tilting & Grading Buckets** for leveling soil, backfilling, and landscape contouring.\n- **Thumbs & Grapples** for picking up heavy stones, clearing logs, stumps, and brush.\n- **Rippers** for cutting through thick tree roots and pulling hard ground.\n- **Pallet Forks** (for skid steers) to transport heavy sod, nursery stock, and brick pallets.\n\nFitment and auxiliary hydraulic flow (GPM/PSI) must match your specific machine. We recommend completing a quick **fitment check** with our support team before purchasing tools.`,
        links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Ask a fitment check", href: "/contact" }],
        followups: ["Recommend a landscaping machine", "Check warranty and shipping", "Request a fitment check"]
      };
    }
    if (memorySlots.job === "construction" || memorySlots.job === "dig" || memorySlots.job === "trench") {
      return {
        markdown: `## Attachments for Construction & Excavation\n\nFor **construction, digging, and utility jobs**, the following attachments are highly recommended:\n\n- **Trenching Buckets** (narrow width) for laying utility conduits, water lines, or pipes.\n- **Hydraulic Breakers / Hammers** to smash concrete, rocks, and hard ground.\n- **Rippers** to break tough, compacted soil or frost before digging.\n- **Augers** for excavating structural footers and pier holes.\n- **Grapples** for demolition debris handling and loading.\n\nTo ensure compatibility, we check coupler types, pin dimensions, and hydraulic flows. Let us help you verify with a quick **fitment check**!`,
        links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Ask a fitment check", href: "/contact" }],
        followups: ["Recommend a machine first", "Check warranty and shipping", "Request a fitment check"]
      };
    }
  }

  return {
    markdown: `## Attachments & fitment\n\nMany Konstructz and Typhon machines are **attachment-ready** — mini excavators and skid steers especially. Common tools:\n\n- **Buckets** (digging, trenching, tilting, screening)\n- **Augers** for drilling\n- **Breakers / hydraulic hammers** for rock and concrete\n- **Grapples**, **rippers**, **pallet forks**, **hydraulic thumbs**\n\nFitment depends on the model's coupler and hydraulic flow, so I'd confirm with a quick **fitment check** rather than assume. Which machine do you have (or are considering)? I'll tailor the suggestions.`,
    links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Browse equipment", href: "/equipment" }],
    followups: ["I have a mini excavator", "Recommend a machine first", "Request a fitment check"],
  };
}

function composeSpecs(machine: ProductRef | undefined, query: string): Answer {
  if (!machine) {
    return {
      markdown: "Happy to pull up specs — which machine do you mean? Tell me the model (e.g. *KUVUO 2.5*) or let me recommend one for your job.",
      followups: ["Recommend a machine", "Compare machines"],
    };
  }
  const d = detailOf(machine);
  if (!d) return composeFallback();

  // If the user asked about a specific attribute, answer that directly first.
  const asked = SPEC_QUERY.find((s) => s.re.test(query));
  let lead = "";
  if (asked) {
    const hit = d.specs.find((s) => asked.labels.test(s.label));
    lead = hit
      ? `The **${d.name}** has a **${asked.word}** of **${hit.value}** (${hit.label}).\n\n`
      : `I don't have a published **${asked.word}** figure for the **${d.name}** on file, so I won't guess — our team can confirm it. Here's what is published:\n\n`;
  } else {
    lead = `Here are the key specs for the **${d.name}** (${d.categoryLabel}):\n\n`;
  }

  let md = lead + `| Spec | Value |\n|---|---|\n`;
  for (const s of d.specs.slice(0, 8)) md += `| ${s.label} | ${s.value} |\n`;
  md += `\nOpen the machine page for the full sheet and gallery. ${getPurchaseNote()}`;
  return {
    markdown: md,
    products: [machine],
    followups: ["Compare it with another machine", "What attachments fit it?", "Is shipping free?", "Get a quote"],
  };
}

// Full machine profile — the "sales engineer" answer for a named model.
function composeProfile(machine: ProductRef): Answer {
  const d = detailOf(machine);
  if (!d) {
    return {
      markdown: `Here's the **${machine.name}** (${machine.categoryLabel}). Open it for full specs and a quote:`,
      products: [machine],
      followups: ["Show its key specs", "Compare it with another machine", "What attachments fit it?"],
    };
  }
  const prof = profileFor(d.categoryLabel);
  const blurb = (d.tagline || d.description || "").split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
  const keySpecs = d.specs.filter((s) => !/^(category|sku|gtin|current price)$/i.test(s.label)).slice(0, 6);

  let md = `## ${d.name}\n\n`;
  md += `A **${d.categoryLabel}**${d.weight ? ` at ${d.weight}` : ""}. ${blurb}\n\n`;
  if (keySpecs.length) {
    md += `**Key specs**\n\n| Spec | Value |\n|---|---|\n`;
    for (const s of keySpecs) md += `| ${s.label} | ${s.value} |\n`;
    md += "\n";
  }
  if (prof) md += `**Best for:** ${prof.bestFor.slice(0, 4).join(", ")}.\n\n`;
  const apps = d.applications && d.applications.length ? d.applications.slice(0, 5).join(", ") : "";
  if (apps) md += `**Common applications:** ${apps}.\n\n`;
  const att = attachmentHint(d.categoryLabel);
  if (att) md += `**Compatible attachments:** ${att} _(fitment confirmed per unit)._\n\n`;
  md += getPurchaseNote();

  return {
    markdown: md,
    products: [machine],
    links: relatedBlog(`${d.name} ${d.categoryLabel}`),
    followups: ["Compare it with another machine", "What attachments fit it?", "Is it good for my job?", "Get a quote"],
  };
}

function composeEducation(query: string): Answer {
  const cats = detectCategories(query);
  if (cats.length) {
    const cat = cats[0];
    const prof = profileFor(cat);
    const inCat = refsInCategory(cat).slice(0, 3);
    let md = `## ${cat}\n\n${prof?.purpose || ""}\n\n`;
    if (prof) {
      md += `**Where it shines:** ${prof.bestFor.slice(0, 4).join(", ")}.\n\n`;
      md += `**Strengths:**\n${prof.pros.slice(0, 3).map((p) => `- ${p}`).join("\n")}\n\n`;
      md += `**Trade-offs:**\n${prof.cons.slice(0, 2).map((p) => `- ${p}`).join("\n")}\n\n`;
      md += `Typically suits ${prof.recommendedUser.toLowerCase()}`;
    }
    return {
      markdown: md,
      products: inCat,
      links: relatedBlog(cat),
      followups: [`Recommend a ${cat.toLowerCase()} for my job`, `Compare it with another machine type`, "What attachments does it take?"],
    };
  }
  const hits = kb.search(query, 2);
  if (!hits.length) return composeFallback();
  return {
    markdown: `${hits[0].body}`,
    links: hits[0].href ? [{ label: "Learn more", href: hits[0].href }] : undefined,
    followups: ["Recommend a machine", "Compare machines", "Talk to support"],
  };
}

function composeContact(): Answer {
  return {
    markdown: `## Talk to the team\n\nHappy to hand you over — they can help with selection, quotes, financing, and support.\n\n- **Phone:** ${CONTACT.phoneDisplay}\n- **Email:** ${CONTACT.email}\n\nUse the buttons below for **WhatsApp**, **email**, or the **contact form**.`,
    links: [{ label: "Support Center", href: "/support" }, { label: "Contact form", href: "/contact" }],
    followups: ["Recommend a machine first", "What's the warranty?", "How does shipping work?"],
    handoff: true,
  };
}

function composeTroubleshoot(): Answer {
  return {
    markdown: `## Let's narrow it down\n\nI can share **general checks**, but I won't guess at a diagnosis for your specific machine — that's how people end up chasing the wrong fix.\n\n**Worth checking first:**\n- Fuel level and fuel/air filters\n- Battery, connections, and safety interlocks (seat/seatbelt switches)\n- Hydraulic oil level and any visible leaks\n- Warning lights and the manual's troubleshooting section\n\nIf it's **safety-related** or the machine won't operate normally, stop and contact support with your **model and symptoms** — they'll guide you properly. Want me to point you there?`,
    links: [{ label: "Machine guidance", href: "/support/machine-guidance" }, { label: "Contact support", href: "/support/contact-support" }],
    followups: ["Contact support", "Maintenance basics"],
    handoff: true,
  };
}

function composeFallback(): Answer {
  return {
    markdown: `I'd rather be honest than guess — I don't have a reliable answer for that one. ${pick(["Let me get you to someone who does.", "The team can sort it out precisely."])}\n\nIf you can rephrase or tell me the machine/topic, I'll have another go.`,
    links: [{ label: "Contact form", href: "/contact" }, { label: "Support Center", href: "/support" }],
    followups: ["Recommend a machine", "What can you help with?"],
    handoff: true,
  };
}

/* ───────────────────────────── Main reply ──────────────────────────── */

export function getReply(raw: string, prev: ChatMemory): { answer: Answer; memory: ChatMemory } {
  const m = raw.toLowerCase().trim();
  const memory: ChatMemory = { ...prev, slots: { ...prev.slots, ...extractSlots(m) }, turn: prev.turn + 1 };

  // If the user names a new machine/category, that becomes the active focus.
  const namedNow = findNamed(m);
  const catsNow = detectCategories(m);
  if (namedNow.length === 1) {
    memory.activeMachine = namedNow[0];
    memory.activeCategory = namedNow[0].categoryLabel;
  } else if (catsNow.length === 1 && (!memory.activeCategory || memory.activeCategory !== catsNow[0])) {
    memory.activeCategory = catsNow[0];
  }

  const finish = (answer: Answer, patch: Partial<ChatMemory> = {}): { answer: Answer; memory: ChatMemory } => {
    const next: ChatMemory = { ...memory, ...patch };
    if (answer.products && answer.products.length) {
      // Keep a multi-machine set for "compare these" follow-ups; a single
      // product (lookup/attachments/specs) only updates the active machine and
      // must NOT shrink a previously recommended/compared set.
      if (answer.products.length >= 2) next.lastProducts = answer.products;
      if (answer.products.length === 1) {
        next.activeMachine = answer.products[0];
        next.activeCategory = answer.products[0].categoryLabel;
      }
    }
    return { answer, memory: next };
  };

  if (!m) return finish({ markdown: "Ask me anything about Konstructz machines, attachments, or support." });

  const detectedIntent = detectIntent(m, memory);

  // Context-bound follow-ups: "what attachments should I buy?" with an active
  // machine → relate to that machine without the user repeating it.
  const isFollowupRef = /\b(it|this|that|them|these|those|the machine|the one)\b/.test(m) || namedNow.length === 0;

  switch (detectedIntent) {
    case "Greeting": {
      const isThanks = /\b(thanks|thank you|appreciate|cheers)\b/.test(m);
      if (isThanks) {
        const text = pick([
          "Anytime! Want me to recommend a machine, compare a couple, or get you a quote?",
          "Glad to help. I can compare options, suggest attachments, or connect you with the team whenever you're ready.",
          "You're very welcome! Let me know if you need help looking up specs, comparing models, or checking shipping.",
          "No problem at all! Let me know if you have any other questions about our machinery."
        ]);
        const followups = generateFollowups("Greeting", m, memory);
        return finish({ markdown: text, followups }, { lastIntent: "Greeting" });
      }
      const g = composeGreeting(m, memory);
      const followups = generateFollowups("Greeting", m, memory);
      return finish({ ...g.answer, followups }, { lastIntent: "Greeting", greeted: true });
    }

    case "General question": {
      const ans = getGeneralAnswer(m);
      if (ans) {
        return finish({
          markdown: ans.markdown,
          followups: ans.followups
        }, { lastIntent: "General question" });
      }
      const fallbackAns = {
        markdown: "I can help answer general questions, but my main focus is machinery, attachments, and support. If you need help finding the right mini excavator, loader, or checking warranty coverage (1-Year) and free shipping options, just let me know!",
        followups: ["Which machine is best for this job?", "Compare excavator vs skid steer", "Check warranty and shipping"]
      };
      return finish({
        markdown: fallbackAns.markdown,
        followups: fallbackAns.followups.map(rewordFollowup)
      }, { lastIntent: "General question" });
    }

    case "Machine education": {
      const ans = getMachineEducation(m);
      if (ans) {
        return finish({
          markdown: ans.markdown,
          products: ans.products,
          followups: ans.followups
        }, { lastIntent: "Machine education" });
      }
      const ed = composeEducation(m);
      const followups = generateFollowups("Machine education", m, memory);
      return finish({ ...ed, followups }, { lastIntent: "Machine education" });
    }

    case "Product question": {
      const machine = namedNow[0] || (isFollowupRef ? memory.activeMachine : undefined);
      const hasSpecKeywords = /\b(spec|specification|weight|engine|horsepower|\bhp\b|capacity|dimensions?|hydraulic|flow|gpm|digging depth|dig depth|reach|lift(ing)? (height|capacity)|fuel|travel speed|how (heavy|big|powerful|deep|tall|wide|fast))/.test(m);
      
      let ans: Answer;
      if (hasSpecKeywords || SPEC_QUERY.some((s) => s.re.test(m))) {
        ans = composeSpecs(machine, m);
      } else if (machine) {
        ans = composeProfile(machine);
      } else {
        ans = {
          markdown: "Happy to pull up specs or machine details — which machine do you mean? Tell me the model (e.g. *KUVUO 2.5*) or let me recommend one for your job.",
          followups: ["Recommend a machine", "Compare machines"],
        };
      }
      const followups = generateFollowups("Product question", m, memory);
      return finish({ ...ans, followups }, { lastIntent: "Product question" });
    }

    case "Typhon Machinery question": {
      const typhonRefs = PRODUCT_REFS.filter(r => r.brand === "Typhon").slice(0, 3);
      const ans: Answer = {
        markdown: `## Typhon Machinery\n\nTyphon Machinery is an important source of heavy-duty and specialized material handling and access equipment for our catalog. Their lineup includes forklifts, road rollers, scissor lifts, and compact excavators.\n\nAll Typhon machines in our store feature a **1-Year Warranty** and **Free Shipping** where eligible (continental U.S.), with full parts and service support.\n\nWould you like to browse Typhon equipment, compare specs, or check compatibility with attachments?`,
        products: typhonRefs,
        links: [{ label: "Typhon Equipment", href: "/equipment" }],
        followups: generateFollowups("Typhon Machinery question", m, memory)
      };
      return finish(ans, { lastIntent: "Typhon Machinery question" });
    }

    case "Konstructz question": {
      const konstructzRefs = PRODUCT_REFS.filter(r => r.brand === "Konstructz").slice(0, 3);
      const ans: Answer = {
        markdown: `## Konstructz Machines\n\nKonstructz specializes in professional, jobsite-ready compact construction machinery. Our catalog features:\n\n- **Mini & Towable Excavators** for digging and trenching\n- **Skid Steer & Wheel Loaders** for loading and grading\n- **Backhoe Loaders** for mixed applications\n- **Dumpers & Trenchers** for logistics and utilities\n- **Stone Crushers** for on-site aggregate\n\nEvery Konstructz machine comes standard with a **1-Year Warranty** and **Free Shipping** where eligible (lower 48 states). How can I help you pick or configure the right model today?`,
        products: konstructzRefs,
        links: [{ label: "Konstructz Equipment", href: "/equipment" }],
        followups: generateFollowups("Konstructz question", m, memory)
      };
      return finish(ans, { lastIntent: "Konstructz question" });
    }

    case "Warranty/free shipping": {
      let supportIntent: "warranty" | "returns" | "shipping" | "financing" = "warranty";
      if (/\b(returns?|refund|send (it|this|the machine)? ?back|money back|cancel( my)? order|exchange it)\b/.test(m)) supportIntent = "returns";
      else if (/\b(ship|shipping|deliver|delivery|freight|tracking|customs|international|liftgate)\b/.test(m)) supportIntent = "shipping";
      else if (/\b(financ|payment|installment|monthly|lease|pay over time|paramount)\b/.test(m)) supportIntent = "financing";
      
      const ans = supportAnswer(supportIntent);
      const followups = generateFollowups("Warranty/free shipping", m, memory);
      return finish({ ...ans, followups }, { lastIntent: "Warranty/free shipping" });
    }

    case "Support request": {
      let supportIntent: "parts" | "safety" | "contact" | "troubleshoot" = "contact";
      if (/\b(spare ?parts?|parts?|filters?|\boil\b|fluid|service interval|maintenance|maintain|grease|service schedule)\b/.test(m)) supportIntent = "parts";
      else if (/\b(safe|safety|operate safely|operating tips)\b/.test(m)) supportIntent = "safety";
      else if (/\b(won'?t start|not (start|working|moving)|overheat|leak|error|problem|trouble|fault|stuck|smok|warning light|won'?t move)\b/.test(m)) supportIntent = "troubleshoot";
      
      let ans: Answer;
      if (supportIntent === "contact") ans = composeContact();
      else if (supportIntent === "troubleshoot") ans = composeTroubleshoot();
      else ans = supportAnswer(supportIntent);

      const followups = generateFollowups("Support request", m, memory);
      return finish({ ...ans, followups }, { lastIntent: "Support request" });
    }

    case "Machine comparison": {
      const targets = comparisonTargets(m, memory);
      if (targets && targets.length >= 2) {
        const cmp = composeComparison(targets);
        const followups = generateFollowups("Machine comparison", m, memory);
        return finish({ ...cmp, followups }, { lastIntent: "Machine comparison" });
      }
      const ans = {
        markdown: "I'd be glad to compare — and I'll make sure I compare the right machines. Tell me the **two machines or two categories** (for example *“mini excavator vs skid steer”* or *“STOMP V980 vs KUVUO 2.5”*), or describe the job and I'll put two suitable options head-to-head.",
        followups: generateFollowups("Machine comparison", m, memory),
        links: [{ label: "Browse equipment", href: "/equipment" }],
      };
      return finish(ans, { lastIntent: "Machine comparison" });
    }

    case "Product recommendation": {
      const rec = recommend(m);
      const hasSignal = !!(memory.slots.job || memory.slots.terrain || rec.cats.length);
      if (rec.refs.length && (hasSignal || memory.awaiting === "recommend")) {
        const recAns = composeRecommend(rec.refs, rec.note, memory.slots);
        const followups = generateFollowups("Product recommendation", m, memory);
        return finish({
          ...recAns,
          followups
        }, {
          lastIntent: "Product recommendation",
          awaiting: null,
          activeCategory: rec.refs[0].categoryLabel,
          activeMachine: rec.refs[0],
        });
      }
      const ans = {
        markdown: `${pick(["Let's get you the right machine — a few quick things and I'll narrow it down properly:", "Happy to help you choose. To avoid guessing, tell me:"])}\n\n1. **What's the main job?** (digging, trenching, loading, grading, hauling, lifting, compaction…)\n2. **How big is the project, and what's the site like?** (residential/commercial, tight or open, ground type)\n3. **Will you be moving/lifting much**, and any **budget range**?\n\nEven a sentence about the project is enough to start.`,
        followups: ["Clearing trees on a small farm", "Loading gravel in a tight yard", "Trenching for utilities"].map(rewordFollowup),
      };
      return finish(ans, { lastIntent: "Product recommendation", awaiting: "recommend" });
    }

    case "Attachment compatibility": {
      const machine = namedNow[0] || (isFollowupRef ? memory.activeMachine : undefined);
      const att = composeAttachments(machine, memory.slots);
      const followups = generateFollowups("Attachment compatibility", m, memory);
      return finish({ ...att, followups }, { lastIntent: "Attachment compatibility" });
    }

    case "Unknown question":
    default: {
      const fb = composeFallback();
      const followups = generateFollowups("Unknown question", m, memory);
      return finish({ ...fb, followups }, { lastIntent: "Unknown question" });
    }
  }
}
