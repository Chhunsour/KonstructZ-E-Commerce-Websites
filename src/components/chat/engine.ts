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
  getChatbotConfig, logChatbotQuery,
} from "./knowledge";
import { typhonProducts } from "../../data/typhonProducts";
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
  const matches = findMatchesWithScoring(text);
  return matches.map(m => m.ref);
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
  | "Beginner mode explanation"
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

  if (/\b(simply|beginner|simple language|terms simply)\b/.test(m)) {
    return "Beginner mode explanation";
  }

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

  if (/\b(spec|specification|horsepower|hp|power|engine|motor|weight|price|cost|lift|lifting|height|digging depth|dig depth|deep|depth|bucket|hydraulic|flow|gpm|fuel|size|dimensions?|attachments?|fitment|warranty|shipping|travel speed|speed|how (heavy|big|powerful|deep|tall|wide|fast))/.test(m)) {
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
    "Hello! I'm the **Konstructz assistant**, ready to help you with anything related to our equipment. Ask me to recommend a machine for your site, compare specifications, check attachment fitment, or walk through our 1-year warranty + lifetime technical support and Free Shipping.\n\nWhere would you like to start?",
    "Welcome to Konstructz! I'm your AI product and support consultant. Whether you're trenching, loading, or grading, I can help you choose the best machine, compare models, or explain our support and parts coverage.\n\nTell me a bit about your project or select a topic to begin."
  ]);
}

export function getPurchaseNote(): string {
  return pick([
    "Every machine includes a **[1-year warranty + lifetime technical support]** and **[Free Shipping]** where eligible (continental U.S.).",
    "Keep in mind that all machines include a **[1-year warranty + lifetime technical support]** and qualify for **[Free Shipping]** to the lower 48 states.",
    "For peace of mind, purchases are backed by a **[1-year warranty + lifetime technical support]** and eligible models ship with **[Free Shipping]**."
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
}function getCompanyQuestionAnswer(q: string): { markdown: string; followups: string[]; links?: { label: string; href: string }[] } | null {
  const GUIDE_SUGGESTIONS = "\n\n### What would you like to do next?\n- Find the right TYPHON machine\n- Compare TYPHON equipment\n- TYPHON attachments & fitment\n- Contact sales for buying help";
  const GUIDE_LINKS = [
    { label: "Browse TYPHON Equipment", href: "/equipment" },
    { label: "Contact Sales Team", href: "/contact" }
  ];
  const GUIDE_FOLLOWUPS = [
    "Find the right TYPHON machine",
    "Compare TYPHON equipment",
    "TYPHON attachments & fitment",
    "Contact sales for buying help"
  ];

  if (/\bkonstructz\b/.test(q) || /\b(who are you|the company|about the company)\b/.test(q)) {
    return {
      markdown: "### About Konstructz\n\nKonstructz is currently being prepared as a machinery website to help customers explore equipment, compare machines, and get buying/support help. Right now, I can help you with available TYPHON Machinery machines and product details." + GUIDE_SUGGESTIONS,
      links: GUIDE_LINKS,
      followups: GUIDE_FOLLOWUPS
    };
  }

  if (/\btyphon\b/.test(q) && (/\b(are you|is this|about|who is)\b/.test(q) || /\btyphon machinery\b/.test(q))) {
    return {
      markdown: "### TYPHON Machinery Catalog\n\nWe feature available **TYPHON Machinery** products. I can help you find machine pages, compare specifications in simple terms, verify attachment fitment, and explore support details.\n\nAll TYPHON equipment features a **[1-year warranty + lifetime technical support]**.\n\nShipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options." + GUIDE_SUGGESTIONS,
      links: GUIDE_LINKS,
      followups: GUIDE_FOLLOWUPS
    };
  }

  if (/\b(legit|scam|trust|real|reliable|fake|safe to buy)\b/.test(q)) {
    return {
      markdown: "### Legitimacy & Trust\n\nKonstructz is currently being prepared as a machinery catalog platform. We assist customers in exploring authentic **TYPHON Machinery** equipment (mini excavators, skid steers, wheel loaders, forklifts, road rollers, and attachments).\n\nEvery machine comes with a standard **[1-year warranty + lifetime technical support]**.\n\nShipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options." + GUIDE_SUGGESTIONS,
      links: [
        { label: "Official Contact Page", href: "/contact" },
        { label: "Support Center", href: "/support" }
      ],
      followups: GUIDE_FOLLOWUPS
    };
  }

  if (/\b(what do you sell|what is sold|what do you offer|what products|what machines|types of machine|equipment categories)\b/.test(q) || (/\b(sell|offer|have)\b/.test(q) && /\b(machine|product|equipment|cab|attachment|excavator|loader)\b/.test(q))) {
    return {
      markdown: "### Equipment Catalog\n\nWe feature a comprehensive list of **TYPHON Machinery** equipment and attachments designed for heavy tasks:\n- **TYPHON Mini Excavators** (Briggs & Stratton / Kubota / Yanmar engines)\n- **TYPHON Skid Steers & Wheel Loaders**\n- **TYPHON Forklifts & Road Rollers**\n- **TYPHON Specialty Attachments** (Augers, Breakers, Forks, thumbs)\n\nAll equipment features a **[1-year warranty + lifetime technical support]**.\n\nShipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options." + GUIDE_SUGGESTIONS,
      links: GUIDE_LINKS,
      followups: GUIDE_FOLLOWUPS
    };
  }

  if (/\b(why should i buy|why buy here|why choose you|why konstructz|benefits of buying)\b/.test(q)) {
    return {
      markdown: "### Why Choose Us?\n\nWe make exploring and comparing heavy equipment straightforward. Our product overview highlights specifications, pros/cons, and attachments so you can find the perfect match. All featured products are authentic **TYPHON Machinery** models backed by a **[1-year warranty + lifetime technical support]**.\n\nShipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options." + GUIDE_SUGGESTIONS,
      links: GUIDE_LINKS,
      followups: GUIDE_FOLLOWUPS
    };
  }

  return null;
}
function getGeneralAnswer(m: string): { markdown: string; followups: string[]; links?: { label: string; href: string }[] } | null {
  const q = m.toLowerCase();

  const isOverseasQuery = /\b(overseas|international|foreign|export|canada|mexico|europe|asia|outside (us|usa))\b/.test(q);
  if (isOverseasQuery && /\b(ship|shipping|deliver|delivery|post|send|rate|cost|time|duration|speed|transit)\b/.test(q)) {
    return {
      markdown: "## Overseas & International Shipping\n\nShipping is available in the USA. For overseas or international orders, please contact the Konstructz sales team so they can confirm availability, cost, and delivery options.",
      followups: ["Contact sales team", "Compare machines", "Warranty details"],
      links: [{ label: "Contact Sales", href: "/contact" }]
    };
  }

  const companyAns = getCompanyQuestionAnswer(q);
  if (companyAns) return companyAns;
  
  if (/\b(japan|tokyo)\b/.test(q)) {
    return {
      markdown: "The capital of Japan is Tokyo. If you need help with Konstructz or Typhon machines, attachments, warranty, shipping, or support, I can help with that too.",
      followups: ["Recommend a machine", "Compare excavator vs skid steer", "Check warranty and shipping"]
    };
  }

  if (/\btyphon\b/.test(q) && /\b(what is|who is|about)\b/.test(q)) {
    return {
      markdown: "## Typhon Machinery\n\nTyphon Machinery is an important machinery brand specializing in heavy-duty material handling, access platforms, and compaction equipment. Their lineup adds critical utility to our store, including:\n\n- **Rough-Terrain Forklifts** (1.5 to 3.0 Tons)\n- **Road Rollers / Compactors** (1.0 to 2.0 Tons)\n- **Scissor Lifts** (xFlex electric and rough-terrain series)\n- **Specialty Mini Excavators** (e.g. Terror series ranging from 0.8 ton to larger cab models)\n\nAll Typhon equipment sold through our website qualifies for our standard **[1-year warranty + lifetime technical support]** (including parts support during the first year) and **[Free Shipping]** to the continental U.S. (lower 48 states).",
      followups: ["Show machine specs", "Compare similar models", "Check warranty and shipping"]
    };
  }

  if (/\bkonstructz\b/.test(q) && /\b(what is|who is|about)\b/.test(q)) {
    return {
      markdown: "## Konstructz Machinery\n\nKonstructz is our primary brand specializing in compact construction equipment designed for contractors, landscapers, farmers, and residential landowners. Our machinery range is built for high reliability, ease of operation, and structural durability, including:\n\n- **Mini & Towable Excavators** (like the zero-tail-swing KUVUO 2.5 and 2.7)\n- **Skid Steer Loaders** (like the STOMP V980 and V950)\n- **Wheel Loaders** (like the heavy-duty SKOOP II)\n- **Backhoe Loaders** (like the SCOOPYDIG)\n- **Site Dumpers** (like the THUNDERDUMP series)\n- **Trenchers & Stone Crushers** for specialty tasks\n\nEvery Konstructz machine includes a **[1-year warranty + lifetime technical support]** and eligible models qualify for **[Free Shipping]** directly to your door or nearest freight terminal in the continental U.S.",
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
      markdown: "## Warranty & Parts Support\n\nAll new Konstructz and Typhon machines sold through our site are backed by a **1-year warranty + lifetime technical support**. Here are the key details:\n\n- **Coverage**: Covers structural, powertrain (engine), and hydraulic system defects under normal operating conditions.\n- **Parts Support**: We ship genuine replacement parts directly to you to minimize jobsite downtime. Our dedicated parts support team is based in the U.S. to ensure fast shipping.\n- **Lifetime Support**: Includes lifetime technical assistance and operator/maintenance guidance.\n- **Exclusions**: Normal wear-and-tear items (such as tracks, bucket teeth, filters, oil, seals, and hydraulic attachments) are owner-maintained and excluded from the standard warranty.\n\nFor exact component details or to submit a warranty claim, please contact our support team with your model and order number.",
      followups: ["Check warranty and shipping", "Find compatible attachments", "Request a quote"]
    };
  }

  if (/\b(free shipping|shipping free|is shipping free|shipping mean|shipping rules?|delivery)\b/.test(q)) {
    const isOverseas = /\b(overseas|international|foreign|export|canada|mexico|europe|asia|outside (us|usa))\b/.test(q);
    if (isOverseas) {
      return {
        markdown: "## Overseas & International Shipping\n\nShipping is available in the USA. For overseas or international orders, please contact the Konstructz sales team so they can confirm availability, cost, and delivery options.",
        followups: ["Contact sales team", "Compare machines", "Warranty details"]
      };
    }
    return {
      markdown: "## Shipping & Delivery Logistics\n\nShipping is available in the USA. For overseas or international orders, please contact the Konstructz sales team so they can confirm availability, cost, and delivery options.\n\nWe do not promise international shipping, delivery times, shipping costs, or availability.\n\nFor continental U.S. (lower 48 states) orders, we include **Free Ground Shipping** on eligible machines:\n- **Freight Carriage**: Heavy machinery ships via commercial freight truck lines. The carrier will contact you in advance to schedule a delivery appointment window.\n- **Unloading Requirements**: Standard delivery does **not** include a forklift or liftgate. The customer is responsible for having a loading dock, a forklift, or a tractor with forks to safely unload the machine. Alternatively, you can request pickup at the nearest carrier terminal.\n- **Processing & Delivery**: Orders are processed within ~3 business days. Transit time takes between 5 to 14 business days depending on your distance from our warehouse.\n- **Logistics Notes**: Address changes after dispatch or missed delivery appointments can incur carrier fees (like a redelivery fee). Make sure to inspect the machine on arrival and report transit damage within 48 hours.",
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

function compareRow(label: string, vals: (string | null | undefined)[]): string {
  const NA = "Not listed";
  return `| ${label} | ${vals.map((v) => v && v.trim() ? v.trim() : NA).join(" | ")} |\n`;
}

function getComparisonReason(d: ProductDetail): string {
  const hp = d.specs.find(s => /horsepower|hp/i.test(s.label))?.value || d.specs.find(s => /engine/i.test(s.label))?.value?.match(/(\d+)\s*hp/i)?.[0] || "decent power";
  const weight = d.weight || d.specs.find(s => /weight/i.test(s.label))?.value || "compact size";
  
  if (d.categoryLabel.toLowerCase().includes("excavator")) {
    const depth = d.specs.find(s => /digging depth|dig depth/i.test(s.label))?.value || "great depth";
    return `you need a compact excavator with **${weight}** operating weight, **${hp}** engine power, and up to **${depth}** max digging depth for trenching in tight spaces.`;
  }
  if (d.categoryLabel.toLowerCase().includes("skid steer") || d.categoryLabel.toLowerCase().includes("loader")) {
    const cap = d.specs.find(s => /lift capacity|operating capacity|load/i.test(s.label))?.value || "strong lift capacity";
    return `your primary task is moving soil, grading surfaces, or loading materials with **${cap}** rated lift capacity and a reliable **${hp}** engine.`;
  }
  if (d.categoryLabel.toLowerCase().includes("forklift")) {
    const height = d.specs.find(s => /lift height/i.test(s.label))?.value || "warehouse lift height";
    return `you need indoor material handling, pallet lifting up to **${weight}** capacity, and zero-emission electric operations.`;
  }
  return `you need a versatile **${d.categoryLabel}** machine with **${hp}** engine output and **${weight}** chassis weight.`;
}

function composeComparison(details: ProductDetail[]): Answer {
  const ds = details.map(d => {
    const ref = PRODUCT_REFS.find(r => r.href === d.href);
    if (!ref) return d;
    const tyRef = findTyphonEquivalent(ref);
    return detailOf(tyRef) || d;
  }).slice(0, 2);

  const pA = ds[0];
  const pB = ds[1] || ds[0];

  const nameA = `TYPHON 	ext{${pA.name}}`;
  const nameB = `TYPHON 	ext{${pB.name}}`;

  const NO_SPEC = "Not listed";

  const getBestFor = (d: ProductDetail) => {
    const apps = (d as any).applications || d.applications || [];
    if (apps.length > 0) return apps[0];
    const prof = profileFor(d.categoryLabel);
    return prof ? prof.bestFor[0] : "General construction";
  };

  const getStrength = (d: ProductDetail) => {
    const cat = d.categoryLabel.toLowerCase();
    if (cat.includes("excavator")) return "Digging depth & boom swing flexibility";
    if (cat.includes("skid steer")) return "Aggressive bucket loading & attachments";
    if (cat.includes("loader")) return "Telescopic lifting & high capacity bucket";
    if (cat.includes("forklift")) return "Clean electric power & heavy pallet lift";
    if (cat.includes("roller")) return "Compacting soil and asphalt surfaces";
    return "Maneuverability and jobsite versatility";
  };

  const getEngine = (d: ProductDetail) => specValue(d, /engine model|engine/i) || NO_SPEC;
  const getHp = (d: ProductDetail) => {
    let hp = specValue(d, /horsepower|hp/i) || specValue(d, /engine/i)?.match(/(\d+)\s*hp/i)?.[0] || NO_SPEC;
    if (hp !== NO_SPEC && !hp.toLowerCase().includes("hp")) hp = `	ext{${hp}} HP`;
    return hp;
  };
  const getWeight = (d: ProductDetail) => d.weight || specValue(d, /weight/i) || NO_SPEC;
  const getPrice = (d: ProductDetail) => d.price || NO_SPEC;

  let md = `### Product Comparison\n\n`;
  md += `| Detail | ${nameA} | ${nameB} |\n`;
  md += `| ------------- | --------- | --------- |\n`;
  md += `| Best for | ${getBestFor(pA)} | ${getBestFor(pB)} |\n`;
  md += `| Engine | ${getEngine(pA)} | ${getEngine(pB)} |\n`;
  md += `| Horsepower | ${getHp(pA)} | ${getHp(pB)} |\n`;
  md += `| Weight | ${getWeight(pA)} | ${getWeight(pB)} |\n`;
  md += `| Main strength | ${getStrength(pA)} | ${getStrength(pB)} |\n`;
  md += `| Price | ${getPrice(pA)} | ${getPrice(pB)} |\n\n`;

  md += `**Choose ${nameA} if:** ${getComparisonReason(pA)}\n`;
  if (pA.name !== pB.name) {
    md += `**Choose ${nameB} if:** 	ext{${getComparisonReason(pB)}}\n\n`;
  } else {
    md += `\n`;
  }

  md += `**1-year warranty + lifetime technical support** is standard.\n\n`;
  md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**\n\n`;
  md += `Final price and availability should be confirmed with sales.`;

  const finalRefs = ds.map((d) => PRODUCT_REFS.find((r) => r.href === d.href)!).filter(Boolean);

  return {
    markdown: md,
    products: finalRefs,
    links: [{ label: "Browse TYPHON Equipment", href: "/equipment" }],
    followups: [
      `Compare ${pA.name} and another model`,
      `Show key specs for ${pA.name}`,
      `Show key specs for ${pB.name}`,
      `Ask sales about 	ext{${pA.name}}`,
      `Ask sales about 	ext{${pB.name}}`
    ]
  };
}

function comparisonTargets(m: string, memory: ChatMemory): ProductDetail[] | null {
  const clean = m.toLowerCase().replace(/^compare\s+/i, "");
  const parts = clean.split(/\b(?:vs|versus|and)\b/).map(s => s.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const targets: ProductDetail[] = [];
    for (const part of parts) {
      const matches = findMatchesWithScoring(part);
      if (matches.length > 0) {
        const d = detailOf(matches[0].ref);
        if (d) targets.push(d);
      } else {
        const nameFormatted = part.replace(/\b(typhon)\b/gi, "").trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        targets.push({
          name: nameFormatted || "Alternative Model",
          brand: "Typhon",
          categoryLabel: "Alternative Model",
          href: "",
          price: "Not listed",
          weight: "Not listed",
          specs: [],
          description: "Not listed",
          tagline: "Not listed",
          productType: "machine"
        });
      }
    }
    if (targets.length >= 2) return targets;
  }

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
    const d1 = detailOf(named[0]);
    const d2 = detailOf(memory.activeMachine);
    if (d1 && d2) return [d1, d2];
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

  let md = `### Recommended Machine\n\n`;
  md += `**${lead.name}** (${lead.categoryLabel}) is a strong option if you need digging, trenching, grading, or small jobsite work.`;
  if (leadProf) md += ` It is engineered for ${leadProf.purpose.toLowerCase().replace(/\.$/, "")}, which suits ${reasonForJob}.`;
  md += "\n\n";

  if (leadProf) {
    md += `**Why it fits:**\n\n`;
    md += leadProf.pros.slice(0, 3).map((p) => `* ${p}`).join("\n");
    if (slots.terrain) md += `\n* Handles ${slots.terrain} ground in this class of work`;
    md += "\n\n";
  }

  const alt = refs.find((r) => r.categoryLabel !== lead.categoryLabel);
  if (alt) {
    const altProf = profileFor(alt.categoryLabel);
    md += `**Worth considering:** a **${alt.categoryLabel}** such as the **${alt.name}**${altProf ? ` if you'll do more ${altProf.bestFor[0].toLowerCase()}` : ""}.\n\n`;
  }

  md += `**Support included:**\n[1-Year Warranty] [Lifetime Technical Support] [Free Shipping]\n\n`;
  md += `Need help choosing the exact model? Tell me your job type, work area, and budget.`;

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

function formatSupportDoc(intent: string): string {
  const config = getChatbotConfig();
  switch (intent) {
    case "warranty":
      return `## Warranty & Support\n\nEvery Konstructz machine comes standard with a **[1-year warranty + lifetime technical support]**.\n\n- **Coverage details:** ${config.warrantyText}\n- **Lifetime assistance:** ${config.lifetimeSupportText}\n- **Spare parts support:** Genuine parts provided for manufacturing defects during the first year.\n\n_Note: Specific coverage details should be confirmed per model with our team._`;
    case "returns":
      return `## Returns & refunds\n\n- **Policy:** ${config.returnNotes}\n- **Return Window:** Unused machines in original packaging can be returned within 30 days of delivery.\n- **Exclusions:** Consumables and custom-configured items are non-returnable.\n- **Damage in transit:** Must be reported within 48 hours.`;
    case "shipping":
      return `## Shipping & delivery\n\n- **Delivery details:** ${config.shippingNotes}\n- **Lower 48 states:** Eligible machines qualify for **[Free Shipping]**.\n- **Access:** Ensure safe curbside flatbed/step-deck trailer access on site.`;
    case "financing":
      return `## Financing Options\n\n- **Partner:** Paramount Financial (lease-to-own).\n- **Details:** ${config.financingNotes}\n- **Credit review:** Soft credit check options available for qualified business buyers.`;
    case "parts":
      return `## Parts & maintenance\n\n- **Availability:** Genuine replacement teeth, filters, hoses, and fluids shipped directly from our CA depot.\n- **Warranty coverage:** Parts replacement is covered under the standard **[1-year warranty + lifetime technical support]** for eligible claims.\n- **Upkeep:** Change fluids and grease pivots as outlined in the operator manual.`;
    case "safety":
      return `## Operation & safety basics\n\n- **Caution:** ${config.safetyDisclaimer}\n- **Inspection:** Perform daily walk-around checks.\n- **Safe zone:** Keep clear of rotation paths and load lines.`;
    default:
      return "Let me connect you with the team for that.";
  }
}

function composeAttachments(machine?: ProductRef, memorySlots?: ChatMemory["slots"]): Answer {
  const COMPATIBILITY_WARNING = "\n\n**Compatibility Note:** Fitment should be confirmed with the Konstructz team before buying to ensure proper mounting pin layout, coupler size, and hydraulic flow.";

  if (machine) {
    const prof = profileFor(machine.categoryLabel);
    return {
      markdown: `## Attachments for the ${machine.name}\n\nThe **${machine.name}** is a ${machine.categoryLabel.toLowerCase()}, so the work tools that make sense are the ones for that class: ${prof?.attachments || "model-specific tools"}.\n\nThe catch is **fitment** — coupler type, mounting, and hydraulic flow all have to match, and I won't guess at compatibility for a specific unit. The reliable move is a quick **fitment check** with the team so you only buy tools that actually fit and have the flow to run them.\n\nIf you tell me **which tasks** you want to add (drilling, breaking, grabbing, forks…), I can suggest the right attachment types to ask about.` + COMPATIBILITY_WARNING,
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
        markdown: `## Attachments for Landscaping\n\nSince you are working on **landscaping**, here are the work tools and attachments that make the most sense for your project:\n\n- **Augers** for drilling post holes (fences, decks) and tree plantings.\n- **Tilting & Grading Buckets** for leveling soil, backfilling, and landscape contouring.\n- **Thumbs & Grapples** for picking up heavy stones, clearing logs, stumps, and brush.\n- **Rippers** for cutting through thick tree roots and pulling hard ground.\n- **Pallet Forks** (for skid steers) to transport heavy sod, nursery stock, and brick pallets.\n\nFitment and auxiliary hydraulic flow (GPM/PSI) must match your specific machine. We recommend completing a quick **fitment check** with our support team before purchasing tools.` + COMPATIBILITY_WARNING,
        links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Ask a fitment check", href: "/contact" }],
        followups: ["Recommend a landscaping machine", "Check warranty and shipping", "Request a fitment check"]
      };
    }
    if (memorySlots.job === "construction" || memorySlots.job === "dig" || memorySlots.job === "trench") {
      return {
        markdown: `## Attachments for Construction & Excavation\n\nFor **construction, digging, and utility jobs**, the following attachments are highly recommended:\n\n- **Trenching Buckets** (narrow width) for laying utility conduits, water lines, or pipes.\n- **Hydraulic Breakers / Hammers** to smash concrete, rocks, and hard ground.\n- **Rippers** to break tough, compacted soil or frost before digging.\n- **Augers** for excavating structural footers and pier holes.\n- **Grapples** for demolition debris handling and loading.\n\nTo ensure compatibility, we check coupler types, pin dimensions, and hydraulic flows. Let us help you verify with a quick **fitment check**!` + COMPATIBILITY_WARNING,
        links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Ask a fitment check", href: "/contact" }],
        followups: ["Recommend a machine first", "Check warranty and shipping", "Request a fitment check"]
      };
    }
  }

  return {
    markdown: `## Attachments & fitment\n\nMany Konstructz and Typhon machines are **attachment-ready** — mini excavators and skid steers especially. Common tools:\n\n- **Buckets** (digging, trenching, tilting, screening)\n- **Augers** for drilling\n- **Breakers / hydraulic hammers** for rock and concrete\n- **Grapples**, **rippers**, **pallet forks**, **hydraulic thumbs**\n\nFitment depends on the model's coupler and hydraulic flow, so I'd confirm with a quick **fitment check** rather than assume. Which machine do you have (or are considering)? I'll tailor the suggestions.` + COMPATIBILITY_WARNING,
    links: [{ label: "Attachments support", href: "/support/attachments-support" }, { label: "Browse equipment", href: "/equipment" }],
    followups: ["I have a mini excavator", "Recommend a machine first", "Request a fitment check"],
  };
}

function getProductAliases(ref: ProductRef): string[] {
  const config = getChatbotConfig();
  const list = new Set<string>();

  // Parse config productAliases
  if (config.productAliases) {
    const lines = config.productAliases.split(";");
    for (const line of lines) {
      const parts = line.split(":");
      if (parts.length === 2) {
        const prodName = parts[0].trim().toLowerCase();
        if (prodName === ref.name.toLowerCase() || prodName === ref.name.replace(/typhon\s+/i, "").toLowerCase()) {
          const aliasList = parts[1].split(",").map(a => a.trim().toLowerCase()).filter(Boolean);
          for (const a of aliasList) list.add(a);
        }
      }
    }
  }

  // Auto-generate aliases
  const nameLower = ref.name.toLowerCase();
  list.add(nameLower);

  const cleanName = nameLower.replace(/^typhon\s+/g, "");
  list.add(cleanName);

  const numbers = cleanName.match(/\b\d+(\.\d+)?\b/g) || [];
  for (const n of numbers) {
    list.add(n);
  }
  const romans = cleanName.match(/\b(xi|xiii|xv|xviii|xx|xxv|xvii|xix|x|lxv)\b/g) || [];
  for (const r of romans) {
    list.add(r);
  }

  const cat = ref.categoryLabel.toLowerCase();
  list.add(cat);
  if (cat.includes("mini")) {
    list.add(cat.replace(/\bmini\b/g, "").trim());
  }

  const d = PRODUCT_DETAIL[ref.href];
  if (d) {
    const sku = specValue(d, /sku/i)?.toLowerCase();
    if (sku) list.add(sku);
    const gtin = specValue(d, /gtin/i)?.toLowerCase();
    if (gtin) list.add(gtin);
  }

  return Array.from(list);
}

function findMatchesWithScoring(text: string): { ref: ProductRef; score: number }[] {
  const q = text.toLowerCase().trim();
  const normalizedQ = q
    .replace(/\bteror\b/g, "terror")
    .replace(/\bcapony\b/g, "canopy")
    .replace(/\bcanopy\b/g, "capony")
    .replace(/\btyran\b/g, "tyrant");

  const results: { ref: ProductRef; score: number }[] = [];

  for (const ref of PRODUCT_REFS) {
    if (ref.brand !== "Typhon") continue;
    const aliases = getProductAliases(ref);
    
    let highestAliasScore = 0;
    for (const alias of aliases) {
      if (normalizedQ === alias) {
        highestAliasScore = Math.max(highestAliasScore, 100);
      } else if (normalizedQ.includes(alias) || alias.includes(normalizedQ)) {
        highestAliasScore = Math.max(highestAliasScore, 80);
      }
    }
    
    let score = highestAliasScore;
    const nameLower = ref.name.toLowerCase();
    const nameWords = nameLower.replace(/typhon\s+/g, "").split(/[^a-z0-9.]+/).filter(Boolean);
    const queryWords = normalizedQ.split(/[^a-z0-9.]+/).filter(Boolean);
    
    for (const w of nameWords) {
      if (queryWords.includes(w)) {
        score += 25;
      }
    }
    
    const numbers = nameLower.match(/\b\d+(\.\d+)?\b/g) || [];
    const romans = nameLower.match(/\b(xi|xiii|xv|xviii|xx|xxv|xvii|xix|x|lxv)\b/g) || [];
    const ids = [...numbers, ...romans];
    for (const id of ids) {
      if (queryWords.includes(id)) {
        score += 50;
      }
    }

    if (score > 15) {
      results.push({ ref, score });
    }
  }

  const uniqueResults: Record<string, { ref: ProductRef; score: number }> = {};
  for (const r of results) {
    if (!uniqueResults[r.ref.href] || uniqueResults[r.ref.href].score < r.score) {
      uniqueResults[r.ref.href] = r;
    }
  }

  const finalResults = Object.values(uniqueResults);
  finalResults.sort((a, b) => b.score - a.score);
  return finalResults;
}

function resolveMatchedProducts(text: string, mLower: string): { type: "single" | "multi" | "none"; products: ProductRef[]; clarification?: string; followups?: string[] } {
  const matches = findMatchesWithScoring(text);
  if (!matches.length) return { type: "none", products: [] };
  
  const first = matches[0];
  if (matches.length === 1) {
    return { type: "single", products: [first.ref] };
  }
  
  const second = matches[1];
  if (first.score >= 45 && (first.score - second.score) >= 20) {
    return { type: "single", products: [first.ref] };
  }
  
  const topMatches = matches.slice(0, 3).map(m => m.ref);
  const namesList = topMatches.map(p => p.name.replace(/typhon\s+/i, "")).join(", ");
  const clarification = `I found a few similar TYPHON products. Do you mean ${namesList.replace(/,([^,]*)$/, ", or$1")}, or another model?`;

  let specQueryText = "";
  if (mLower.includes("horsepower") || mLower.includes("hp")) specQueryText = "horsepower";
  else if (mLower.includes("weight") || mLower.includes("heavy")) specQueryText = "weight";
  else if (mLower.includes("engine") || mLower.includes("motor")) specQueryText = "engine";
  else if (mLower.includes("lift capacity") || mLower.includes("lift")) specQueryText = "lift capacity";
  else if (mLower.includes("digging depth") || mLower.includes("dig depth") || mLower.includes("deep")) specQueryText = "digging depth";
  else if (mLower.includes("attachment") || mLower.includes("fit")) specQueryText = "attachment fitment";
  
  const followups = topMatches.map(p => {
    if (specQueryText) {
      if (specQueryText === "attachment fitment") {
        const attName = mLower.match(/(pallet fork|auger|breaker|sweeper|snow blower|trencher|grapple)/i)?.[1] || "pallet fork";
        return `Does ${attName} fit ${p.name}?`;
      }
      return `What ${specQueryText} is ${p.name}?`;
    }
    return p.name;
  });

  return {
    type: "multi",
    products: topMatches,
    clarification,
    followups
  };
}

function checkAttachmentCompatibility(query: string, machine: ProductRef): string {
  const q = query.toLowerCase();
  let attTerm = "";
  if (q.includes("pallet fork") || q.includes("fork")) attTerm = "pallet fork";
  else if (q.includes("wood grabber") || q.includes("grabber") || q.includes("grapple")) attTerm = "grabber";
  else if (q.includes("sweeper") || q.includes("broom")) attTerm = "sweeper";
  else if (q.includes("snow blower") || q.includes("snowblower")) attTerm = "snow blower";
  else if (q.includes("trencher") || q.includes("chain trencher")) attTerm = "trencher";
  else if (q.includes("mulcher") || q.includes("forestry mulcher")) attTerm = "mulcher";
  else if (q.includes("breaker") || q.includes("hammer") || q.includes("rock breaker")) attTerm = "breaker";
  else if (q.includes("auger") || q.includes("drill")) attTerm = "auger";
  else if (q.includes("bucket")) attTerm = "bucket";

  if (!attTerm) {
    return "### Attachment Fitment\n\nI do not have confirmed fitment data for this attachment and machine. Please contact sales before buying so they can confirm compatibility.";
  }

  const modelNameClean = machine.name.replace(/typhon\s+/i, "").toLowerCase();
  const d = PRODUCT_DETAIL[machine.href];
  const hasCustomCompat = d && (d as any).attachmentCompatibility && (d as any).attachmentCompatibility.some((a: string) => a.toLowerCase().includes(attTerm) || attTerm.includes(a.toLowerCase()));

  let confirmCompat = false;
  let attachmentName = attTerm.charAt(0).toUpperCase() + attTerm.slice(1);
  let attachmentUrl = "";

  if (hasCustomCompat) {
    confirmCompat = true;
  } else {
    const matchedAttachment = typhonProducts.find(p => {
      if (p.productType !== "attachment") return false;
      const nameLower = p.name.toLowerCase();
      const descLower = (p.description || "").toLowerCase();
      const matchesTerm = nameLower.includes(attTerm);
      if (!matchesTerm) return false;
      return nameLower.includes(modelNameClean) || descLower.includes(modelNameClean);
    });
    if (matchedAttachment) {
      confirmCompat = true;
      attachmentName = matchedAttachment.name;
      attachmentUrl = `/typhon-machinery/${matchedAttachment.id}`;
    }
  }

  if (confirmCompat) {
    let md = `### Attachment Fitment\n\n`;
    md += `**	ext{${attachmentName}}** is listed as compatible with **	ext{${machine.name}}**.\n\n`;
    if (attachmentUrl) {
      md += `[View Attachment Page](${attachmentUrl})\n\n`;
    }
    md += `**1-year warranty + lifetime technical support** is standard. **Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
    logChatbotQuery(query, "Attachment compatibility", machine.name, "attachment compatibility", true, "");
    return md;
  } else {
    logChatbotQuery(query, "Attachment compatibility", machine.name, "attachment compatibility", false, `Verify compatibility of 	ext{${attachmentName}} with 	ext{${machine.name}}`);
    let md = `### Attachment Fitment\n\n`;
    md += `I do not have confirmed fitment data for this attachment and machine.\n\n`;
    md += `Please contact sales before buying so they can confirm compatibility.\n\n`;
    md += `Which machine do you have?\n`;
    return md;
  }
}

function composeDirectSpecAnswer(machine: ProductRef, query: string): Answer {
  const d = detailOf(machine);
  const q = query.toLowerCase();
  
  let specName = "";
  let specValueText: string | undefined = undefined;

  if (/\b(horsepower|hp|power)\b/i.test(q)) {
    specName = "Horsepower";
    specValueText = d ? (specValue(d, /horsepower|hp/i) || specValue(d, /engine/i)?.match(/(\d+)\s*hp/i)?.[0]) : undefined;
    if (specValueText && !specValueText.toLowerCase().includes("hp")) {
      specValueText = `${specValueText} HP`;
    }
  } else if (/\b(engine|motor)\b/i.test(q)) {
    specName = "Engine";
    specValueText = d ? specValue(d, /engine/i) : undefined;
  } else if (/\b(weight|heavy)\b/i.test(q)) {
    specName = "Weight";
    specValueText = d ? (d.weight || specValue(d, /weight/i)) : undefined;
  } else if (/\b(price|cost)\b/i.test(q)) {
    specName = "Price";
    specValueText = d ? d.price : undefined;
    if (specValueText && specValueText !== "Not listed") {
      specValueText = `${specValueText} (Final price and availability should be confirmed with sales.)`;
    }
  } else if (/\b(lift capacity|lift|lifting)\b/i.test(q)) {
    specName = "Lift Capacity";
    specValueText = d ? specValue(d, /lift capacity|operating capacity|load capacity/i) : undefined;
  } else if (/\b(digging depth|dig depth|deep|depth)\b/i.test(q)) {
    specName = "Digging Depth";
    specValueText = d ? specValue(d, /digging depth|dig depth/i) : undefined;
  } else if (/\b(bucket|bucket capacity)\b/i.test(q)) {
    specName = "Bucket Capacity";
    specValueText = d ? specValue(d, /bucket capacity|bucket/i) : undefined;
  } else if (/\b(hydraulic|hydraulic flow|flow|gpm)\b/i.test(q)) {
    specName = "Hydraulic Flow";
    specValueText = d ? specValue(d, /hydraulic flow|hydraulic|flow/i) : undefined;
  } else if (/\b(fuel)\b/i.test(q)) {
    specName = "Fuel Type";
    specValueText = d ? specValue(d, /fuel/i) : undefined;
  } else if (/\b(size|dimensions?)\b/i.test(q)) {
    specName = "Dimensions";
    specValueText = d ? specValue(d, /dimensions|size/i) : undefined;
  } else if (/\b(travel speed|speed)\b/i.test(q)) {
    specName = "Travel Speed";
    specValueText = d ? specValue(d, /travel speed|speed/i) : undefined;
  } else if (/\b(stock|availab)\b/i.test(q)) {
    specName = "Stock";
    specValueText = "Stock should be confirmed with sales.";
  }

  let md = `### ${machine.name} ${specName || "Specification"}\n\n`;
  const isMissing = !specValueText || specValueText === "Not listed";

  if (!isMissing) {
    md += `**${specValueText}**\n`;
    logChatbotQuery(query, "Product question", machine.name, specName || "specification", true, "");
    
    return {
      markdown: md,
      products: [machine],
      links: [{ label: `View TYPHON ${machine.name}`, href: machine.href }],
      followups: [
        `Show key specs for ${machine.name}`,
        `Show full specs for ${machine.name}`,
        `Show full description for 	ext{${machine.name}}`,
        `Compare 	ext{${machine.name}}`,
        `Ask sales about 	ext{${machine.name}}`
      ]
    };
  } else {
    md += `I do not have that exact spec in the current product data.\n`;
    logChatbotQuery(query, "Product question", machine.name, specName || "specification", false, `Add missing 	ext{${specName || "specification"}} to 	ext{${machine.name}}`);
    
    return {
      markdown: md,
      products: [machine],
      links: [{ label: `View TYPHON 	ext{${machine.name}}`, href: machine.href }],
      followups: [
        `View TYPHON 	ext{${machine.name}}`,
        `Ask sales about 	ext{${machine.name}}`,
        `Try another spec for 	ext{${machine.name}}`,
        `Show available specs for 	ext{${machine.name}}`
      ]
    };
  }
}

function composeGeneralOverview(machine: ProductRef): Answer {
  const d = detailOf(machine);
  const NO_SPEC = "Not listed";

  let categoryVal = d?.categoryLabel || "Machine";
  let engineVal = NO_SPEC;
  let hpVal = NO_SPEC;
  let weightVal = NO_SPEC;
  let mainUseVal = NO_SPEC;
  let bestForVal = NO_SPEC;
  let highlights: string[] = [];

  if (d) {
    engineVal = d.specs.find(s => /engine model|engine/i.test(s.label))?.value || NO_SPEC;
    hpVal = d.specs.find(s => /horsepower|hp/i.test(s.label))?.value || d.specs.find(s => /engine/i.test(s.label))?.value?.match(/(\d+)\s*hp/i)?.[0] || NO_SPEC;
    if (hpVal !== NO_SPEC && !hpVal.toLowerCase().includes("hp")) {
      hpVal = `${hpVal} HP`;
    }
    weightVal = d.weight || d.specs.find(s => /weight/i.test(s.label))?.value || NO_SPEC;
    
    const customBestUses = (d as any).applications || [];
    if (customBestUses.length > 0) {
      bestForVal = customBestUses[0];
      mainUseVal = customBestUses.join(", ");
    } else {
      const prof = profileFor(d.categoryLabel);
      if (prof) {
        bestForVal = prof.bestFor[0] || "General construction";
        mainUseVal = prof.bestFor.join(", ");
      } else {
        bestForVal = "General utility work";
        mainUseVal = "Construction, landscaping";
      }
    }

    const customFeatures = (d as any).features || [];
    if (customFeatures.length > 0) {
      highlights = customFeatures.slice(0, 3);
    } else {
      const prof = profileFor(d.categoryLabel);
      if (prof) {
        highlights = prof.pros.slice(0, 3);
      } else {
        highlights = [
          "Compact maneuverability for tight areas",
          "Durable construction for reliable service life",
          "Compatible with multiple attachment options"
        ];
      }
    }
  }

  let md = `### TYPHON ${machine.name}\n\n`;
  md += `**Best for:** 	ext{${bestForVal}}\n\n`;

  md += `| Key Detail | Value |\n`;
  md += `| ------------ | ------- |\n`;
  md += `| Category | 	ext{${categoryVal}} |\n`;
  md += `| Engine | 	ext{${engineVal}} |\n`;
  md += `| Horsepower | 	ext{${hpVal}} |\n`;
  md += `| Weight/Class | 	ext{${weightVal}} |\n`;
  md += `| Main Use | 	ext{${mainUseVal}} |\n\n`;

  md += `**Highlights:**\n\n`;
  for (const h of highlights) {
    md += `* ${h}\n`;
  }
  md += `\n`;

  md += `[1-Year Warranty] [Lifetime Technical Support]\n\n`;
  md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;

  return {
    markdown: md,
    products: [machine],
    links: [{ label: `View TYPHON ${machine.name}`, href: machine.href }],
    followups: [
      `Show key specs for ${machine.name}`,
      `Show full specs for ${machine.name}`,
      `Show full description for ${machine.name}`,
      `Compare ${machine.name}`,
      `Ask sales about ${machine.name}`
    ]
  };
}


function formatTyphonOverview(machine: ProductRef): string {
  const d = detailOf(machine);
  const NO_SPEC = "I do not have that exact spec in the current product data. Please confirm with the sales team before buying.";
  
  if (!d) {
    return `### TYPHON Machine Overview\n\n**TYPHON ${machine.name}** is designed for **compact jobsite work** such as digging, loading, lifting, trenching, grading, hauling, or compact work.\n\n**Best for:**\n* Small construction jobs\n* Property work\n* Landscaping\n* Farm or material handling\n* Tight work areas\n\n**Key details:**\n* Engine: 	ext{${NO_SPEC}}\n* Operating weight: 	ext{${NO_SPEC}}\n* Lift / digging / loading capacity: 	ext{${NO_SPEC}}\n* Attachments: 	ext{${NO_SPEC}}\n\n**1-year warranty + lifetime technical support** is standard. **Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
  }

  let mainJob = "compact jobsite work";
  const cat = d.categoryLabel.toLowerCase();
  if (cat.includes("excavator")) mainJob = "digging, trenching, and excavation";
  else if (cat.includes("skid steer") || cat.includes("loader")) mainJob = "loading, grading, and material handling";
  else if (cat.includes("forklift")) mainJob = "lifting and pallet handling";
  else if (cat.includes("roller")) mainJob = "compaction and road prep";
  else if (cat.includes("dumper")) mainJob = "hauling and bulk material transport";

  let engineVal = d.specs.find(s => /engine/i.test(s.label))?.value;
  if (!engineVal) {
    engineVal = NO_SPEC;
  }

  let weightVal = d.specs.find(s => /weight/i.test(s.label))?.value || d.weight;
  if (!weightVal) {
    weightVal = NO_SPEC;
  }

  let capVal = d.specs.find(s => /capacity|digging force|dig depth|maximum digging/i.test(s.label))?.value;
  if (!capVal) {
    capVal = NO_SPEC;
  }

  let attVal = d.specs.find(s => /attachment/i.test(s.label))?.value;
  if (!attVal && d.description && d.description.toLowerCase().includes("attachment")) {
    const match = d.description.match(/(?:with|includes?)\s+([^.\\n]+attachments?)/i);
    if (match) attVal = match[0];
  }
  if (!attVal) {
    attVal = NO_SPEC;
  }

  return `### TYPHON Machine Overview

**TYPHON ${d.name}** is designed for **${mainJob}** such as digging, loading, lifting, trenching, grading, hauling, or compact jobsite work.

**Best for:**
* Small construction jobs
* Property work
* Landscaping
* Farm or material handling
* Tight work areas

**Key details:**
* Engine: ${engineVal}
* Operating weight: ${weightVal}
* Lift / digging / loading capacity: ${capVal}
* Attachments: ${attVal}

**1-year warranty + lifetime technical support** is standard. **Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;
}

function composeKeySpecs(machine: ProductRef): Answer {
  const d = detailOf(machine);
  const config = getChatbotConfig();
  const keys = config.keySpecs.split(",").map(k => k.trim().toLowerCase());
  const NO_SPEC = "Not listed";

  let md = `### TYPHON ${machine.name} Key Specifications\n\n`;
  md += `| Specification | Value |\n`;
  md += `|---|---|\n`;

  if (d) {
    for (const key of keys) {
      const match = d.specs.find(s => s.label.toLowerCase().includes(key) || key.includes(s.label.toLowerCase()));
      if (match) {
        md += `| ${match.label} | ${match.value} |\n`;
      } else {
        if (key === "weight") {
          const w = d.weight || d.specs.find(s => /weight/i.test(s.label))?.value;
          md += `| Operating Weight | ${w || NO_SPEC} |\n`;
        } else if (key === "horsepower" || key === "hp") {
          const hp = d.specs.find(s => /horsepower|hp/i.test(s.label))?.value || d.specs.find(s => /engine/i.test(s.label))?.value?.match(/(\d+)\s*hp/i)?.[0];
          md += `| Horsepower | ${hp || NO_SPEC} |\n`;
        } else if (key === "engine") {
          const eng = d.specs.find(s => /engine/i.test(s.label))?.value;
          md += `| Engine | ${eng || NO_SPEC} |\n`;
        } else {
          const capKey = key.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          md += `| ${capKey} | ${NO_SPEC} |\n`;
        }
      }
    }
  }

  md += `\n**1-year warranty + lifetime technical support**\n\n`;
  md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;

  return {
    markdown: md,
    products: [machine],
    links: [{ label: `View TYPHON 	ext{${machine.name}}`, href: machine.href }],
    followups: [
      `Show full specs for 	ext{${machine.name}}`,
      `Show full description for 	ext{${machine.name}}`,
      `Compare 	ext{${machine.name}}`,
      `Ask sales about 	ext{${machine.name}}`
    ]
  };
}

function composeFullSpecs(machine: ProductRef): Answer {
  const d = detailOf(machine);
  let md = `### TYPHON ${machine.name} Full Specifications\n\n`;
  md += `| Specification | Value |\n`;
  md += `|---|---|\n`;

  if (d) {
    for (const s of d.specs) {
      if (/category|sku|gtin|price/i.test(s.label)) continue;
      md += `| 	ext{${s.label}} | 	ext{${s.value}} |\n`;
    }
  }

  md += `\n**1-year warranty + lifetime technical support**\n\n`;
  md += `**Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.**`;

  return {
    markdown: md,
    products: [machine],
    links: [{ label: `View TYPHON 	ext{${machine.name}}`, href: machine.href }],
    followups: [
      `Show key specs for 	ext{${machine.name}}`,
      `Show full description for 	ext{${machine.name}}`,
      `Compare 	ext{${machine.name}}`,
      `Ask sales about 	ext{${machine.name}}`
    ]
  };
}

function composeSpecs(machine: ProductRef | undefined, query: string): Answer {
  if (!machine) {
    return {
      markdown: "Happy to pull up specs — which TYPHON machine do you mean? Tell me the model (e.g. *TERROR XI*) or let me recommend one for your job.",
      followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"],
    };
  }
  
  const isPrelaunchNote = machine.brand === "Konstructz";
  const typhonMachine = findTyphonEquivalent(machine);
  
  let prefix = "";
  if (isPrelaunchNote) {
    prefix = `*Note: Konstructz is currently being prepared as a machinery catalog platform. Right now, I can help you with available TYPHON Machinery machines and product details.*\n\nHere are the key specs for the equivalent featured model, the **${typhonMachine.name}**:\n\n`;
  }
  
  const md = prefix + formatTyphonOverview(typhonMachine);
  return {
    markdown: md,
    products: [typhonMachine],
    followups: ["Compare it with another machine", "What attachments fit it?", "Contact sales for buying help"]
  };
}

function composeProfile(machine: ProductRef): Answer {
  const isPrelaunchNote = machine.brand === "Konstructz";
  const typhonMachine = findTyphonEquivalent(machine);

  let prefix = "";
  if (isPrelaunchNote) {
    prefix = `*Note: Konstructz is currently being prepared as a machinery catalog platform. Right now, I can help you with available TYPHON Machinery machines and product details.*\n\nHere is the equivalent featured model, the **${typhonMachine.name}**:\n\n`;
  }

  const md = prefix + formatTyphonOverview(typhonMachine);
  return {
    markdown: md,
    products: [typhonMachine],
    links: [{ label: `View ${typhonMachine.name}`, href: typhonMachine.href }],
    followups: ["Compare it with another machine", "What attachments fit it?", "Contact sales for buying help"]
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

export function getReply(raw: string, prev: ChatMemory, lang: string = "EN", pathname: string = ""): { answer: Answer; memory: ChatMemory } {
  const m = raw.trim();
  const mLower = m.toLowerCase();
  const memory: ChatMemory = { ...prev, slots: { ...prev.slots, ...extractSlots(mLower) }, turn: prev.turn + 1 };

  // If the user names a new machine/category, that becomes the active focus.
  const namedNow = findNamed(mLower);
  const catsNow = detectCategories(mLower);
  if (namedNow.length === 1) {
    memory.activeMachine = namedNow[0];
    memory.activeCategory = namedNow[0].categoryLabel;
  } else if (catsNow.length === 1 && (!memory.activeCategory || memory.activeCategory !== catsNow[0])) {
    memory.activeCategory = catsNow[0];
  }

  // Page-aware setup
  if (pathname) {
    const pageProductRef = PRODUCT_REFS.find(r => r.href === pathname);
    if (pageProductRef) {
      memory.activeMachine = pageProductRef;
      memory.activeCategory = pageProductRef.categoryLabel;
    } else {
      const catMatch = pathname.match(/\/product\/([^/]+)/);
      if (catMatch) {
        const catSlug = catMatch[1];
        const matchedCat = PRODUCT_REFS.find(r => r.categoryLabel.toLowerCase().replace(/\s+/g, "-") === catSlug || r.categoryLabel.toLowerCase().replace(/\s+/g, "-") + "s" === catSlug);
        if (matchedCat) {
          memory.activeCategory = matchedCat.categoryLabel;
        }
      }
    }
  }

  const finish = (answer: Answer, patch: Partial<ChatMemory> = {}): { answer: Answer; memory: ChatMemory } => {
    const next: ChatMemory = { ...memory, ...patch };
    if (answer.products && answer.products.length) {
      if (answer.products.length >= 2) next.lastProducts = answer.products;
      if (answer.products.length === 1) {
        next.activeMachine = answer.products[0];
        next.activeCategory = answer.products[0].categoryLabel;
      }
    }
    
    // Apply dynamic language translations to bot replies and follow-ups
    const translatedAnswer: Answer = {
      ...answer,
      markdown: translateReply(answer.markdown, lang),
      followups: answer.followups?.map(f => translateReply(f, lang))
    };
    return { answer: translatedAnswer, memory: next };
  };

  // Intercept guided machine finder flows
  if (prev.awaiting === "job_finder_1") {
    let jobType = "digging";
    if (/\b(load|loader|spreading|grading)\b/.test(mLower)) jobType = "loading";
    else if (/\b(lift|lifting|fork|forks|pallet|pallets)\b/.test(mLower)) jobType = "lifting";
    else if (/\b(move|moving|haul|dumper|site dumper|transport|hauling)\b/.test(mLower)) jobType = "hauling";
    else if (/\b(crush|crusher|rock|stone|aggregate|crushing)\b/.test(mLower)) jobType = "crushing";

    const nextSlots = { ...prev.slots, job: jobType };
    return finish({
      markdown: `### Job-Based Machine Finder (Step 2/5)\n\nGot it! Next, **what material are you moving or working with?** (e.g., dirt, gravel, rocks, sand, concrete, logs, pallets, or brush?)`,
      followups: ["Dirt and gravel", "Rocks and concrete", "Pallets and logs", "Cancel request"]
    }, { awaiting: "job_finder_2", slots: nextSlots });
  }

  if (prev.awaiting === "job_finder_2") {
    const nextSlots = { ...prev.slots, material: m };
    return finish({
      markdown: `### Job-Based Machine Finder (Step 3/5)\n\n**Is the work area tight or open?**`,
      followups: ["Tight space", "Open space", "Cancel request"]
    }, { awaiting: "job_finder_3", slots: nextSlots });
  }

  if (prev.awaiting === "job_finder_3") {
    const nextSlots = { ...prev.slots, terrain: m };
    return finish({
      markdown: `### Job-Based Machine Finder (Step 4/5)\n\n**Do you need attachments?** (e.g., auger, breaker, grapple, forks, thumb clip, or standard bucket?)`,
      followups: ["Need attachments", "Standard bucket only", "Cancel request"]
    }, { awaiting: "job_finder_4", slots: nextSlots });
  }

  if (prev.awaiting === "job_finder_4") {
    const nextSlots = { ...prev.slots, attachments: m };
    return finish({
      markdown: `### Job-Based Machine Finder (Step 5/5)\n\nFinally, **do you need electric, diesel, or gas if available?**`,
      followups: ["Electric", "Diesel", "Gasoline / Gas", "No preference", "Cancel request"]
    }, { awaiting: "job_finder_5", slots: nextSlots });
  }

  if (prev.awaiting === "job_finder_5") {
    if (mLower.includes("cancel")) {
      return finish({
        markdown: `Cancelled machine finder. How else can I help you today?`,
        followups: ["Compare TYPHON equipment", "Find the right TYPHON machine"]
      }, { awaiting: null, slots: {} });
    }
    
    const fuelPref = mLower;
    const isTight = /\b(tight|narrow|backyard|small|confine)\b/.test((prev.slots.terrain || "").toLowerCase());
    const job = prev.slots.job || "digging";

    let recommendedModel = "TERROR XI";

    if (job === "digging" || job === "trenching") {
      if (isTight) {
        recommendedModel = "TERROR XI";
      } else {
        recommendedModel = "TYPHON Tyrant 17";
      }
    } else if (job === "loading" || job === "grading") {
      if (isTight) {
        recommendedModel = "TYPHON Stomp V1000";
      } else {
        recommendedModel = "TYPHON SKOOP";
      }
    } else if (job === "lifting") {
      if (fuelPref.includes("electric")) {
        recommendedModel = "TYPHON VIGOR 2.0";
      } else {
        recommendedModel = "TYPHON Forklift (2.5 Ton)";
      }
    } else if (job === "hauling") {
      recommendedModel = "TYPHON 0501R";
    } else if (job === "crushing") {
      recommendedModel = "TERROR XI";
    } else {
      recommendedModel = "TERROR XI";
    }

    const ref = PRODUCT_REFS.find(r => r.brand === "Typhon" && r.name.toUpperCase().includes(recommendedModel.toUpperCase())) || PRODUCT_REFS.find(r => r.brand === "Typhon") || PRODUCT_REFS[0];

    const markdown = `### Recommended TYPHON Machine

Based on your project requirements (Job: ${job}, Space: ${isTight ? "Tight" : "Open"}, Material: ${prev.slots.terrain || "General"}):

${formatTyphonOverview(ref)}

Would you like our sales team to confirm this recommendation and contact you with a direct shipping rate, financing options, or quote?`;

    return finish({
      markdown,
      products: [ref],
      followups: ["Yes, contact me", "Compare TYPHON equipment", "TYPHON attachments & fitment", "Restart machine finder"]
    }, { awaiting: "ask_lead_capture" });
  }

  if (prev.awaiting === "ask_lead_capture") {
    if (/\b(yes|contact|confirm|sure|ok|yep|yeah)\b/.test(mLower)) {
      return finish({
        markdown: `### Specialist Quote & Confirmation

Great! I can collect your details and queue them for our sales/support specialists. 

First, **what is your name?**`,
        followups: ["Cancel request"]
      }, { awaiting: "lead_capture_name" });
    } else {
      return finish({
        markdown: `No problem. Let me know if you want to explore other machines, compare specifications, or ask about attachments.`,
        followups: ["Restart machine finder", "Compare machines", "Browse categories"]
      }, { awaiting: null });
    }
  }

  if (prev.awaiting === "lead_capture_name") {
    if (/\b(cancel|stop|nevermind|no)\b/.test(mLower)) {
      return finish({
        markdown: `Cancelled lead capture. How else can I help you today?`,
        followups: ["Compare machines", "Browse categories"]
      }, { awaiting: null });
    }
    const nextSlots = { ...prev.slots, leadName: m };
    return finish({
      markdown: `Thanks, **${m}**! What is **your email or phone number** so a specialist can reach out?`,
      followups: ["Cancel request"]
    }, { awaiting: "lead_capture_contact", slots: nextSlots });
  }

  if (prev.awaiting === "lead_capture_contact") {
    if (/\b(cancel|stop|nevermind|no)\b/.test(mLower)) {
      return finish({
        markdown: `Cancelled lead capture. How else can I help you today?`,
        followups: ["Compare machines", "Browse categories"]
      }, { awaiting: null });
    }
    const nextSlots = { ...prev.slots, leadContact: m };
    return finish({
      markdown: `Got it. Finally, do you have any **additional message, attachments request, or questions** for the team? (If none, just type 'none')`,
      followups: ["None", "Cancel request"]
    }, { awaiting: "lead_capture_message", slots: nextSlots });
  }

  if (prev.awaiting === "lead_capture_message") {
    const leadMsg = mLower === "none" ? "No additional message" : m;
    const name = prev.slots.leadName || "Valued Customer";
    const contact = prev.slots.leadContact || "Not provided";
    const job = prev.slots.job || "Digging";
    const machineInterest = prev.activeMachine?.name || "General Machinery";

    const markdown = `### Request Submitted Successfully!

Thank you, **${name}**! I have captured your inquiry details and queued them for our support specialists:

- **Name**: ${name}
- **Contact**: ${contact}
- **Machine Interest**: ${machineInterest}
- **Job Type**: ${job}
- **Message**: ${leadMsg}

A Konstructz representative will contact you shortly (typically within 1-2 business days).`;

    return finish({
      markdown,
      followups: ["Compare machines", "Explain warranty", "Check attachments"]
    }, { awaiting: null, slots: {} });
  }

  if (!m) return finish({ markdown: "Ask me anything about Konstructz machines, attachments, or support." });

  const detectedIntent = detectIntent(m, memory);

  // Context-bound follow-ups: "what attachments should I buy?" with an active
  // machine → relate to that machine without the user repeating it.
  const isFollowupRef = /\b(it|this|that|them|these|those|the machine|the one)\b/.test(mLower) || namedNow.length === 0;

  switch (detectedIntent) {
    case "Greeting": {
      const isThanks = /\b(thanks|thank you|appreciate|cheers)\b/.test(mLower);
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

      if (pathname) {
        const isProductPage = pathname.startsWith("/equipment/") || pathname.startsWith("/typhon-machinery/");
        const isSupportPage = pathname.startsWith("/support");
        const isBlogPage = pathname.startsWith("/blog") || pathname.startsWith("/media");
        const isAttachmentPage = pathname.startsWith("/attachments");
        const isCategoryPage = pathname.startsWith("/product/");

        if (isProductPage && memory.activeMachine) {
          return finish({
            markdown: `### TYPHON ${memory.activeMachine.name}\n\nI see you are viewing the **TYPHON ${memory.activeMachine.name}**. I can help you with its horsepower, operating weight, price, engine model, or confirmed attachments. What would you like to know?`,
            followups: [
              `${memory.activeMachine.name} horsepower`,
              `${memory.activeMachine.name} weight`,
              `What attachments fit ${memory.activeMachine.name}?`,
              "Compare this machine"
            ]
          }, { lastIntent: "Greeting" });
        }
        if (isAttachmentPage) {
          return finish({
            markdown: `### Attachments & Fitment\n\nI see you are browsing our **attachments** catalog. Please note that fitment depends on your machine's coupler and auxiliary hydraulic flow. What machine model do you currently own, or are you considering? I can check if our attachments are compatible.`,
            followups: ["Does pallet fork fit STOMP 509?", "Check attachment fitment", "Browse loaders"]
          }, { lastIntent: "Greeting" });
        }
        if (isSupportPage) {
          return finish({
            markdown: `### Warranty, Shipping & Support\n\nEvery machine includes a standard **1-year warranty + lifetime technical support**. Shipping is available in the USA (overseas orders must contact sales first). What support details can I help you find today?`,
            followups: ["What does the warranty cover?", "How does shipping work?", "Do you offer financing?", "Contact sales"]
          }, { lastIntent: "Greeting" });
        }
        if (isBlogPage) {
          return finish({
            markdown: `### Machinery Education & Guides\n\nI can help explain compact machinery concepts simply or recommend models for different applications. What project or jobsite tasks are you preparing for?`,
            followups: ["Explain machinery terms simply", "Find the right TYPHON machine", "Compare equipment"]
          }, { lastIntent: "Greeting" });
        }
        if (isCategoryPage && memory.activeCategory) {
          return finish({
            markdown: `### ${memory.activeCategory}\n\nI see you are browsing our **${memory.activeCategory}** category. I can help you compare models in this class, check specifications, or recommend the best match for your work site.`,
            followups: ["Find the right machine", "Compare models in this class", "Show all category specs"]
          }, { lastIntent: "Greeting" });
        }
      }

      const greet = pick([
        "Hi there! I'm the Konstructz machinery helper. I can help you find the right machine, compare specs, check attachments compatibility, or answer support questions.",
        "Hello! Looking for compact construction equipment or attachments? Tell me what job you are doing, or ask me about any model like KUVUO 2.5 or STOMP V980."
      ]);
      const followups = generateFollowups("Greeting", m, memory);
      return finish({ markdown: greet, followups }, { lastIntent: "Greeting" });
    }

    case "General question": {
      const fallbackAns = getGeneralAnswer(m);
      if (!fallbackAns) return composeFallback();
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
      const isTryAnotherSpec = mLower.startsWith("try another spec for");
      const isShowAvailableSpecs = mLower.startsWith("show available specs for");
      
      let targetName = "";
      if (isTryAnotherSpec) {
        targetName = mLower.replace("try another spec for", "").trim();
      } else if (isShowAvailableSpecs) {
        targetName = mLower.replace("show available specs for", "").trim();
      }

      let machine = undefined;
      if (targetName) {
        machine = PRODUCT_REFS.find(r => r.name.toLowerCase() === targetName || r.name.replace(/typhon\s+/i, "").toLowerCase() === targetName);
      }

      const resolved = targetName ? { type: "single" as const, products: machine ? [machine] : [] } : resolveMatchedProducts(mLower, mLower);
      
      if (resolved.type === "multi") {
        return finish({
          markdown: resolved.clarification!,
          followups: resolved.followups || resolved.products.map(p => p.name)
        }, { lastIntent: "Product question" });
      }
      
      if (!machine) {
        machine = resolved.type === "single" ? resolved.products[0] : (isFollowupRef || (pathname && (pathname.startsWith("/equipment/") || pathname.startsWith("/typhon-machinery/"))) ? memory.activeMachine : undefined);
      }

      const hasSpecKeywords = /\b(spec|specification|horsepower|hp|power|engine|motor|weight|price|cost|lift|lifting|height|digging depth|dig depth|deep|depth|bucket|hydraulic|flow|gpm|fuel|size|dimensions?|attachments?|fitment|warranty|shipping|travel speed|speed|how (heavy|big|powerful|deep|tall|wide|fast))/.test(mLower);
      const isKeySpecsRequest = /\b(show key specs|key specs)\b/.test(mLower);
      const isFullSpecsRequest = /\b(show full specs|full specs)\b/.test(mLower);
      const isFullDetailRequest = /\b(show full description|full product description|all details|complete product info|manual style info)\b/.test(mLower);
      
      let ans: Answer;
      if (machine) {
        if (isTryAnotherSpec) {
          ans = {
            markdown: `Sure! What other specification (e.g., engine, weight, lift capacity, digging depth, dimensions, or price) would you like to check for **${machine.name}**?`,
            products: [machine],
            followups: [
              `${machine.name} horsepower`,
              `${machine.name} engine`,
              `${machine.name} weight`,
              `Show available specs for ${machine.name}`
            ]
          };
        } else if (isShowAvailableSpecs) {
          ans = composeKeySpecs(machine);
        } else if (isFullDetailRequest) {
          ans = composeSpecs(machine, m);
        } else if (isFullSpecsRequest) {
          ans = composeFullSpecs(machine);
        } else if (isKeySpecsRequest) {
          ans = composeKeySpecs(machine);
        } else if (hasSpecKeywords || SPEC_QUERY.some((s) => s.re.test(mLower))) {
          ans = composeDirectSpecAnswer(machine, m);
        } else {
          ans = composeGeneralOverview(machine);
        }
      } else {
        logChatbotQuery(m, "Product question", null, null, false, "Define product alias for search query: " + m);
        ans = {
          markdown: "I could not confidently match that product. Try a model name like TYPHON TERROR XXV, TYRANT 17, STOMP 509, STOMP X1300, VIGOR 2.0, or SKOOP.",
          followups: ["Find the right TYPHON machine", "Compare TYPHON equipment"],
        };
      }
      
      const followups = generateFollowups("Product question", m, memory);
      return finish({ ...ans, followups: ans.followups || followups }, { lastIntent: "Product question" });
    }

    case "Typhon Machinery question": {
      const compAns = getCompanyQuestionAnswer(m);
      if (compAns) {
        return finish({
          markdown: compAns.markdown,
          links: compAns.links,
          followups: compAns.followups
        }, { lastIntent: "Typhon Machinery question" });
      }
      const typhonRefs = PRODUCT_REFS.filter(r => r.brand === "Typhon").slice(0, 3);
      const ans: Answer = {
        markdown: `### Typhon Machinery\n\n**Typhon Machinery** is an important source of heavy-duty and specialized material handling and access equipment for our catalog. Their lineup includes forklifts, road rollers, scissor lifts, and compact excavators.\n\nAll Typhon machines in our store feature a **[1-year warranty + lifetime technical support]** and **[Free Shipping]** where eligible (continental U.S.), with full parts and service support.\n\nWould you like to browse Typhon equipment, compare specs, or check compatibility with attachments?`,
        products: typhonRefs,
        links: [{ label: "Typhon Equipment", href: "/equipment" }],
        followups: generateFollowups("Typhon Machinery question", m, memory)
      };
      return finish(ans, { lastIntent: "Typhon Machinery question" });
    }

    case "Konstructz question": {
      const compAns = getCompanyQuestionAnswer(m);
      if (compAns) {
        return finish({
          markdown: compAns.markdown,
          links: compAns.links,
          followups: compAns.followups
        }, { lastIntent: "Konstructz question" });
      }
      const konstructzRefs = PRODUCT_REFS.filter(r => r.brand === "Konstructz").slice(0, 3);
      const ans: Answer = {
        markdown: `### Konstructz Machines\n\n**Konstructz** specializes in professional, jobsite-ready compact construction machinery. Our catalog features:\n\n- **Mini & Towable Excavators** for digging and trenching\n- **Skid Steer & Wheel Loaders** for loading and grading\n- **Backhoe Loaders** for mixed applications\n- **Dumpers & Trenchers** for logistics and utilities\n- **Stone Crushers** for on-site aggregate\n\nEvery Konstructz machine comes standard with a **[1-year warranty + lifetime technical support]** and **[Free Shipping]** where eligible (lower 48 states). How can I help you pick or configure the right model today?`,
        products: konstructzRefs,
        links: [{ label: "Konstructz Equipment", href: "/equipment" }],
        followups: generateFollowups("Konstructz question", m, memory)
      };
      return finish(ans, { lastIntent: "Konstructz question" });
    }

    case "Warranty/free shipping": {
      const isOverseas = /\b(overseas|international|foreign|export|canada|mexico|europe|asia|outside (us|usa))\b/.test(mLower);
      if (isOverseas && /\b(ship|shipping|deliver|delivery|freight|rate|cost|time|duration|speed|transit)\b/.test(mLower)) {
        return finish({
          markdown: "Shipping is available in the USA. For overseas or international orders, please contact the Konstructz sales team so they can confirm availability, cost, and delivery options.",
          followups: ["Contact sales team", "Compare machines", "Warranty details"],
          links: [{ label: "Contact Sales", href: "/contact" }]
        }, { lastIntent: "Warranty/free shipping" });
      }
      let supportIntent: "warranty" | "returns" | "shipping" | "financing" = "warranty";
      if (/\b(returns?|refund|send (it|this|the machine)? ?back|money back|cancel( my)? order|exchange it)\b/.test(mLower)) supportIntent = "returns";
      else if (/\b(ship|shipping|deliver|delivery|freight|tracking|customs|international|liftgate)\b/.test(mLower)) supportIntent = "shipping";
      else if (/\b(financ|payment|installment|monthly|lease|pay over time|paramount)\b/.test(mLower)) supportIntent = "financing";
      
      const ans = supportAnswer(supportIntent);
      const followups = generateFollowups("Warranty/free shipping", m, memory);
      return finish({ ...ans, followups }, { lastIntent: "Warranty/free shipping" });
    }

    case "Support request": {
      let supportIntent: "parts" | "safety" | "contact" | "troubleshoot" = "contact";
      if (/\b(spare ?parts?|parts?|filters?|\boil\b|fluid|service interval|maintenance|maintain|grease|service schedule)\b/.test(mLower)) supportIntent = "parts";
      else if (/\b(safe|safety|operate safely|operating tips)\b/.test(mLower)) supportIntent = "safety";
      else if (/\b(won'?t start|not (start|working|moving)|overheat|leak|error|problem|trouble|fault|stuck|smok|warning light|won'?t move)\b/.test(mLower)) supportIntent = "troubleshoot";
      
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
      // If user is initiating guided finder flow:
      if (mLower.includes("finder") || mLower.includes("find the right machine") || mLower.includes("help me find the right machine") || mLower.includes("choose") || mLower.includes("pick")) {
        return finish({
          markdown: `### Job-Based Machine Finder (Step 1/3)

Let's find the right machine category for your project! First, **what primary job are you doing?**

- **Digging / trenching**
- **Loading dirt, gravel, or pallets**
- **Moving material around a site**
- **Crushing rocks / stone**
- **General farm or property maintenance**

Tell me which job fits best, or describe your task.`,
          followups: ["Digging / trenching", "Loading dirt, gravel, or pallets", "Moving material around a site", "Crushing rocks / stone", "General farm or property maintenance"]
        }, { awaiting: "job_finder_1" });
      }

      const isBuyingQuery = /\b(how do i buy|where can i buy|purchase options|place an order|want to buy|how to order)\b/.test(mLower);
      if (isBuyingQuery) {
        return finish({
          markdown: "To purchase a machine or request a quote, please visit the product page for the machine you are interested in and click the inquiry button. You can also contact our team directly at support@konstructz.com or +1 213-214-2203 to coordinate shipping rates, delivery logistics, and financing approvals. We do not support direct checkout inside this chat window, and we do not invent prices or inventory availability unless it is explicitly listed on the product page.\n\n### What would you like to do next?\n- View equipment categories\n- Compare machines\n- Check attachments\n- Contact support\n- Ask about warranty/shipping",
          links: [
            { label: "Browse Equipment", href: "/equipment" },
            { label: "Contact Support", href: "/contact" }
          ],
          followups: [
            "View equipment categories",
            "Compare machines",
            "Check attachments",
            "Contact support",
            "Ask about warranty/shipping"
          ]
        }, { lastIntent: "Product recommendation" });
      }
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
      const resolved = resolveMatchedProducts(mLower, mLower);
      const machine = resolved.type === "single" ? resolved.products[0] : (isFollowupRef ? memory.activeMachine : undefined);
      
      if (resolved.type === "multi") {
        return finish({
          markdown: resolved.clarification!,
          followups: resolved.followups || resolved.products.map(p => `Does pallet fork fit ${p.name}?`).concat(["TYPHON attachments & fitment"])
        }, { lastIntent: "Attachment compatibility" });
      }

      if (machine) {
        const fitmentText = checkAttachmentCompatibility(mLower, machine);
        return finish({
          markdown: fitmentText,
          products: [machine],
          followups: ["Compare TYPHON machines", "Check another attachment", "Contact sales"]
        }, { lastIntent: "Attachment compatibility" });
      }
      
      const att = composeAttachments(machine, memory.slots);
      const followups = generateFollowups("Attachment compatibility", m, memory);
      return finish({ ...att, followups }, { lastIntent: "Attachment compatibility" });
    }

    case "Beginner mode explanation": {
      return finish({
        markdown: `### Compact Machinery Terms (Explained Simply)

If you are new to heavy equipment, here are the most important terms translated into simple language:

1. **Hydraulic Auxiliary Flow (GPM/PSI)**:
   *~~Simple meaning~~*: This is the fluid power the machine pumps out to run attachments.
   *Example*: If you want to use a post-hole digger (auger) or soil cutter (trencher), the machine pumps oil through hoses to spin the attachment.

2. **Operating Capacity (ROC)**:
   *~~Simple meaning~~*: How much weight the machine can safely lift without tipping over.
   *Example*: A skid steer rated at 950 lbs can safely lift a pallet of sod or gravel up to that weight.

3. **Zero Tail Swing**:
   *~~Simple meaning~~*: When the excavator rotates, the back end doesn't stick out past the tracks.
   *Example*: Perfect for working right next to a fence or house wall without worrying about denting the building.

4. **Articulated Steering**:
   *~~Simple meaning~~*: The machine has a pivot point in the middle, allowing it to fold/bend as it turns.
   *Example*: A wheel loader with articulated steering turns smoothly without tearing up the grass like a skid steer does.

Do you have another spec term or machine you'd like me to explain in simple language?`,
        followups: ["Recommend a machine", "Compare skid steer vs wheel loader", "Check attachments"]
      }, { slots: { ...prev.slots, experience: "beginner" } });
    }

    case "Unknown question":
    default: {
      const isBroad = m.length < 15 || /\b(help|machine|equipment|construction|work|buy|choose|get|need|pick|tell me|advisor|assistant)\b/i.test(mLower);
      if (isBroad) {
        logChatbotQuery(m, "Unknown question", null, null, false, "Too broad query: " + m);
        return finish({
          markdown: "Are you looking for digging, loading, lifting, hauling, compacting, or attachment help?",
          followups: [
            "Digging / trenching",
            "Loading dirt or gravel",
            "Lifting pallets",
            "Moving material",
            "Compacting ground",
            "Landscaping / property work"
          ]
        }, { lastIntent: "Unknown question" });
      }

      logChatbotQuery(m, "Unknown question", null, null, false, "Fallback check: " + m);
      const fb = composeFallback();
      const followups = generateFollowups("Unknown question", m, memory);
      return finish({ ...fb, followups }, { lastIntent: "Unknown question" });
    }
  }
}

/* ───────────────────────── Translation Dictionary ──────────────────── */

function translateReply(md: string, lang: string): string {
  if (!lang || lang === "EN") return md;
  
  const dicts: Record<string, Record<string, string>> = {
    FR: {
      "### Recommended Machine": "### Machine Recommandée",
      "**Why it fits:**": "**Pourquoi elle convient :**",
      "**Support included:**": "**Support inclus :**",
      "### Best Option": "### Meilleure Option",
      "### About Konstructz": "### À propos de Konstructz",
      "### Typhon Machinery Partnership": "### Partenariat Typhon Machinery",
      "### Legitimacy & Trust": "### Légitimité et Confiance",
      "### Equipment Categories": "### Catégories d'Équipement",
      "### Why Choose Konstructz?": "### Pourquoi Choisir Konstructz ?",
      "### The Company": "### L'Entreprise",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "Besoin d'aide pour choisir le modèle exact ? Indiquez-moi votre type de travail, votre zone de travail et votre budget.",
      "What job are you doing?": "Quel travail faites-vous ?",
      "What material are you moving?": "Quel matériau déplacez-vous ?",
      "Is the work area tight or open?": "La zone de travail est-elle étroite ou ouverte ?",
      "What is Konstructz?": "Qu'est-ce que Konstructz ?",
      "Are you Typhon Machinery?": "Êtes-vous Typhon Machinery ?",
      "Is this company legit?": "Cette entreprise est-elle légitime ?",
      "What do you sell?": "Que vendez-vous ?",
      "Why should I buy from here?": "Pourquoi devrais-je acheter ici ?",
      "1-Year Warranty": "Garantie de 1 an",
      "Lifetime Technical Support": "Support technique à vie",
      "Free Shipping": "Livraison gratuite",
      "Attachments": "Accessoires",
      "Compare": "Comparer",
      "Find the right machine": "Trouver la bonne machine",
      "Compare equipment": "Comparer les équipements",
      "Attachments & fitment": "Accessoires et compatibilité",
      "Company & product help": "Aide sur l'entreprise et les produits",
      "Warranty & lifetime support": "Garantie et support à vie",
      "Shipping, financing & returns": "Livraison, financement et retours"
    },
    ES: {
      "### Recommended Machine": "### Máquina Recomendada",
      "**Why it fits:**": "**Por qué se adapta:**",
      "**Support included:**": "**Soporte incluido:**",
      "### Best Option": "### Mejor Opción",
      "### About Konstructz": "### Sobre Konstructz",
      "### Typhon Machinery Partnership": "### Asociación con Typhon Machinery",
      "### Legitimacy & Trust": "### Legitimidad y Confianza",
      "### Equipment Categories": "### Categorías de Equipos",
      "### Why Choose Konstructz?": "### ¿Por qué elegir Konstructz?",
      "### The Company": "### La Empresa",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "¿Necesita ayuda para elegir el modelo exacto? Cuénteme su tipo de trabajo, área de trabajo y presupuesto.",
      "What job are you doing?": "¿Qué trabajo está haciendo?",
      "What material are you moving?": "¿Qué material está moviendo?",
      "Is the work area tight or open?": "¿El área de trabajo es estrecha o abierta?",
      "What is Konstructz?": "¿Qué es Konstructz?",
      "Are you Typhon Machinery?": "¿Es usted Typhon Machinery?",
      "Is this company legit?": "¿Es esta empresa legítima?",
      "What do you sell?": "¿Qué vende?",
      "Why should I buy from here?": "¿Por qué debería comprar aquí?",
      "1-Year Warranty": "Garantía de 1 año",
      "Lifetime Technical Support": "Soporte técnico de por vida",
      "Free Shipping": "Envío gratis",
      "Attachments": "Accesorios",
      "Compare": "Comparar",
      "Find the right machine": "Encontrar la máquina adecuada",
      "Compare equipment": "Comparar equipos",
      "Attachments & fitment": "Accesorios y compatibilidad",
      "Company & product help": "Ayuda de empresa y productos",
      "Warranty & lifetime support": "Garantía y soporte de por vida",
      "Shipping, financing & returns": "Envío, financiación y devoluciones"
    },
    DE: {
      "### Recommended Machine": "### Empfohlene Maschine",
      "**Why it fits:**": "**Warum es passt:**",
      "**Support included:**": "**Inbegriffener Support:**",
      "### Best Option": "### Beste Option",
      "### About Konstructz": "### Über Konstructz",
      "### Typhon Machinery Partnership": "### Typhon Machinery Partnerschaft",
      "### Legitimacy & Trust": "### Legitimität & Vertrauen",
      "### Equipment Categories": "### Gerätekategorien",
      "### Why Choose Konstructz?": "### Warum Konstructz wählen?",
      "### The Company": "### Das Unternehmen",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "Benötigen Sie Hilfe bei der Auswahl des genauen Modells? Teilen Sie mir Ihre Arbeitsart, Ihren Arbeitsbereich und Ihr Budget mit.",
      "What job are you doing?": "Welche Arbeit führen Sie aus?",
      "What material are you moving?": "Welches Material bewegen Sie?",
      "Is the work area tight or open?": "Ist der Arbeitsbereich eng oder offen?",
      "What is Konstructz?": "Was ist Konstructz?",
      "Are you Typhon Machinery?": "Sind Sie Typhon Machinery?",
      "Is this company legit?": "Ist dieses Unternehmen seriös?",
      "What do you sell?": "Was verkaufen Sie?",
      "Why should I buy from here?": "Warum sollte ich hier kaufen?",
      "1-Year Warranty": "1 Jahr Garantie",
      "Lifetime Technical Support": "Lebenslanger technischer Support",
      "Free Shipping": "Kostenloser Versand",
      "Attachments": "Anbaugeräte",
      "Compare": "Vergleichen",
      "Find the right machine": "Die richtige Maschine finden",
      "Compare equipment": "Geräte vergleichen",
      "Attachments & fitment": "Anbaugeräte & Passform",
      "Company & product help": "Hilfe zu Unternehmen & Produkten",
      "Warranty & lifetime support": "Garantie & lebenslanger Support",
      "Shipping, financing & returns": "Versand, Finanzierung & Rückgaben"
    },
    IT: {
      "### Recommended Machine": "### Macchina Consigliata",
      "**Why it fits:**": "**Perché è adatta:**",
      "**Support included:**": "**Supporto incluso:**",
      "### Best Option": "### Migliore Opzione",
      "### About Konstructz": "### Informazioni su Konstructz",
      "### Typhon Machinery Partnership": "### Partnership con Typhon Machinery",
      "### Legitimacy & Trust": "### Legittimità e Fiducia",
      "### Equipment Categories": "### Categorie di Attrezzature",
      "### Why Choose Konstructz?": "### Perché Scegliere Konstructz?",
      "### The Company": "### L'Azienda",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "Hai bisogno di aiuto per scegliere il modello esatto? Dimmi il tipo di lavoro, l'area di lavoro e il budget.",
      "What job are you doing?": "Che lavoro stai fazendo?",
      "What material are you moving?": "Quale materiale stai spostando?",
      "Is the work area tight or open?": "L'area di lavoro è stretta o aperta?",
      "What is Konstructz?": "Cos'è Konstructz?",
      "Are you Typhon Machinery?": "Sei Typhon Machinery?",
      "Is this company legit?": "Questa azienda è affidabile?",
      "What do you sell?": "Cosa vendete?",
      "Why should I buy from here?": "Perché dovrei acquistare qui?",
      "1-Year Warranty": "Garanzia di 1 anno",
      "Lifetime Technical Support": "Supporto tecnico a vita",
      "Free Shipping": "Spedizione gratuita",
      "Attachments": "Accessori",
      "Compare": "Confronta",
      "Find the right machine": "Trova la macchina giusta",
      "Compare equipment": "Confronta attrezzature",
      "Attachments & fitment": "Accessori e compatibilità",
      "Company & product help": "Aiuto su azienda e prodotti",
      "Warranty & lifetime support": "Garanzia e supporto a vita",
      "Shipping, financing & returns": "Spedizione, finanziamento e resi"
    },
    JP: {
      "### Recommended Machine": "### 推奨される機械",
      "**Why it fits:**": "**適合する理由:**",
      "**Support included:**": "**含まれるサポート:**",
      "### Best Option": "### 最良の選択肢",
      "### About Konstructz": "### Konstructzについて",
      "### Typhon Machinery Partnership": "### Typhon Machineryとの提携",
      "### Legitimacy & Trust": "### 信頼性と合法性",
      "### Equipment Categories": "### 機器カテゴリー",
      "### Why Choose Konstructz?": "### Konstructzを選ぶ理由",
      "### The Company": "### 会社概要",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "正確なモデル選びでお困りですか？作業内容、作業エリア、予算を教えてください。",
      "What job are you doing?": "どのような作業を行いますか？",
      "What material are you moving?": "どのような資材を移動しますか？",
      "Is the work area tight or open?": "作業エリアは狭いですか、それとも広いですか？",
      "What is Konstructz?": "Konstructzとは何ですか？",
      "Are you Typhon Machinery?": "Typhon Machineryですか？",
      "Is this company legit?": "この会社は信頼できますか？",
      "What do you sell?": "何を販売していますか？",
      "Why should I buy from here?": "なぜここで購入すべきなのですか？",
      "1-Year Warranty": "1年保証",
      "Lifetime Technical Support": "生涯テクニカルサポート",
      "Free Shipping": "送料無料",
      "Attachments": "アタッチメント",
      "Compare": "比較する",
      "Find the right machine": "最適な機械を見つける",
      "Compare equipment": "機器を比較する",
      "Attachments & fitment": "アタッチメントと適合性",
      "Company & product help": "会社と製品のヘルプ",
      "Warranty & lifetime support": "保証と生涯サポート",
      "Shipping, financing & returns": "配送、融資、返品"
    },
    CN: {
      "### Recommended Machine": "### 推荐机器",
      "**Why it fits:**": "**为什么适合：**",
      "**Support included:**": "**包含的支持：**",
      "### Best Option": "### 最佳选择",
      "### About Konstructz": "### 关于 Konstructz",
      "### Typhon Machinery Partnership": "### Typhon Machinery 合作伙伴",
      "### Legitimacy & Trust": "### 合法性与信任",
      "### Equipment Categories": "### 设备类别",
      "### Why Choose Konstructz?": "### 为什么选择 Konstructz？",
      "### The Company": "### 公司",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "需要帮助选择确切的型号吗？请告诉我您的工作类型、工作区域和预算。",
      "What job are you doing?": "您在做什么工作？",
      "What material are you moving?": "您在移动什么材料？",
      "Is the work area tight or open?": "工作区域是狭窄还是开阔？",
      "What is Konstructz?": "什么是 Konstructz？",
      "Are you Typhon Machinery?": "您是 Typhon Machinery 吗？",
      "Is this company legit?": "这家公司合规吗？",
      "What do you sell?": "你们卖什么？",
      "Why should I buy from here?": "为什么我应该在这里购买？",
      "1-Year Warranty": "1年保修",
      "Lifetime Technical Support": "终身技术支持",
      "Free Shipping": "免运费",
      "Attachments": "附件",
      "Compare": "比较",
      "Find the right machine": "寻找合适的机器",
      "Compare equipment": "比较设备",
      "Attachments & fitment": "附件与适配",
      "Company & product help": "公司与产品帮助",
      "Warranty & lifetime support": "保修与终身支持",
      "Shipping, financing & returns": "运输、融资和退货"
    },
    KR: {
      "### Recommended Machine": "### 추천 장비",
      "**Why it fits:**": "**적합한 이유:**",
      "**Support included:**": "**포함된 지원:**",
      "### Best Option": "### 최선의 선택",
      "### About Konstructz": "### 약 Konstructz",
      "### Typhon Machinery Partnership": "### Typhon Machinery 파트너십",
      "### Legitimacy & Trust": "### 신뢰성 및 안전성",
      "### Equipment Categories": "### 장비 카테고리",
      "### Why Choose Konstructz?": "### Konstructz를 선택해야 하는 이유",
      "### The Company": "### 회사 소개",
      "Need help choosing the exact model? Tell me your job type, work area, and budget.": "정확한 모델을 선택하는 데 도움이 필요하신가요? 작업 유형, 작업 구역, 예산을 말씀해 주세요.",
      "What job are you doing?": "어떤 작업을 하시나요?",
      "What material are you moving?": "어떤 자재를 이동하시나요?",
      "Is the work area tight or open?": "작업 공간이 협소한가요, 아니면 개방되어 있나요?",
      "What is Konstructz?": "Konstructz란 무엇인가요?",
      "Are you Typhon Machinery?": "Typhon Machinery인가요?",
      "Is this company legit?": "이 회사는 믿을 수 있나요?",
      "What do you sell?": "무엇을 판매하나요?",
      "Why should I buy from here?": "왜 여기서 구매해야 하나요?",
      "1-Year Warranty": "1년 보증",
      "Lifetime Technical Support": "평생 기술 지원",
      "Free Shipping": "무료 배송",
      "Attachments": "어태치먼트",
      "Compare": "비교",
      "Find the right machine": "알맞은 장비 찾기",
      "Compare equipment": "장비 비교",
      "Attachments & fitment": "어태치먼트 및 장착",
      "Company & product help": "회사 및 제품 도움말",
      "Warranty & lifetime support": "보증 및 평생 지원",
      "Shipping, financing & returns": "배송, 금융 및 반품"
    }
  };

  let translated = md;
  const d = dicts[lang];
  if (d) {
    for (const [enKey, langVal] of Object.entries(d)) {
      translated = translated.split(enKey).join(langVal);
    }
  }
  return translated;
}
