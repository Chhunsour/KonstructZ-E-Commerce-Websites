/**
 * Konstructz equipment categories — single source of truth.
 *
 * Each entry powers:
 *  - The premium category overview at /categories
 *  - The category landing page at /product/:slug (and /equipment/:slug)
 *  - The navbar dropdown
 *
 * Content is buyer-facing and benefit-focused. No invented manufacturer specs.
 */

import { products } from "./products";

export interface UseCard {
  title: string;
  description: string;
}

export interface ReasonCard {
  title: string;
  description: string;
}

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface ProductCategory {
  /** URL slug, e.g. "mini-excavators" — used in /product/:slug. */
  slug: string;
  /** Plural display name, e.g. "Mini Excavators". */
  name: string;
  /** Singular display name used in copy, e.g. "Mini Excavator". */
  singular: string;
  /** Matches Product.category in products.ts — used to filter products. */
  productCategoryKey: string;
  /** Existing icon path (already in /icons/equipment/). */
  iconPath: string;

  /** Short one-line description for category tiles & nav. */
  shortDescription: string;
  /** Hero intro paragraph — appears under H1 on the category page. */
  heroIntro: string;
  /** Hero background / overview tile image — full-bleed machine shot. */
  heroImage: string;

  /** Long-form "About this category" paragraph. */
  aboutBody: string;

  /** 3-5 "Common uses" cards — keystone applications shown as visual cards. */
  commonUses: UseCard[];

  /** 3-5 "Why choose this machine type" reasons. */
  whyChoose: ReasonCard[];

  /** Image/content split — image on one side, paragraph on the other. */
  splitImage: string;
  splitHeading: string;
  splitBody: string;

  /** FAQ items — short, direct answers for AEO/GEO ranking. */
  faqs: CategoryFaq[];
}

const ICON = "/icons/equipment";

export const productCategories: ProductCategory[] = [
  {
    slug: "mini-excavators",
    name: "Mini Excavators",
    singular: "Mini Excavator",
    productCategoryKey: "mini-excavators",
    iconPath: `${ICON}/mini-excavator.svg`,
    shortDescription: "Compact tracked diggers for tight access, trenching, and precision earthwork.",
    heroIntro:
      "Mini excavators dig clean trenches, set footings, and handle landscape and utility work where a full-size excavator cannot reach. Tracked stability, zero-tail-swing options, and a deep attachment library make one machine cover several roles across the workday.",
    heroImage: "/img/kuvuo 2.5.png",
    aboutBody:
      "A mini excavator is a compact tracked digging machine used for trenching, foundation prep, utility installation, drainage, demolition, and landscaping in tight spaces where a full-size excavator cannot work. With the right attachment it can dig, grade, break, drill, lift and handle materials on the same job.",
    commonUses: [
      {
        title: "Utility trenching",
        description:
          "Cut clean, uniform trenches for water, sewer, gas, fiber and electrical lines with minimal disturbance to surrounding surfaces.",
      },
      {
        title: "Footings & foundations",
        description:
          "Excavate footings, piers and shallow foundations on residential lots and small commercial sites with precise reach control.",
      },
      {
        title: "Landscaping & drainage",
        description:
          "Shape garden beds, install french drains, dig pond and pool lines, and reshape grade lines without tearing up finished areas.",
      },
      {
        title: "Light demolition",
        description:
          "Tear down sheds, walls and small structures with a hydraulic thumb or breaker — controlled removal in tight footprints.",
      },
    ],
    whyChoose: [
      {
        title: "Reaches where bigger machines can't",
        description:
          "Compact footprint and retractable tracks pass through 36-inch gates and work between buildings other excavators have to skip.",
      },
      {
        title: "Stable on uneven ground",
        description:
          "Tracked undercarriage keeps the machine planted on slopes, soft soil and muddy ground that wheeled diggers struggle on.",
      },
      {
        title: "One machine, many jobs",
        description:
          "Quick-coupler attachments — buckets, breakers, augers, thumbs, rippers — let the same machine trench, grade, demolish and drill.",
      },
      {
        title: "Lower operating cost",
        description:
          "Smaller engine and lighter chassis means lower fuel burn, easier transport, and simpler service than a full-size excavator.",
      },
    ],
    splitImage: "/img/kuvuo 2.7.png",
    splitHeading: "Built for tight-access digging",
    splitBody:
      "Konstructz mini excavators are configured for jobs where access, footprint and surface protection matter. Zero-tail-swing geometry protects walls and finished surfaces, retractable tracks slip through narrow gates, and auxiliary hydraulics power a wide library of work tools — so one machine moves from trenching to grading to breaking without leaving the site.",
    faqs: [
      {
        q: "What is a mini excavator used for?",
        a: "Mini excavators are used for utility trenching, foundation work, landscaping, drainage, light demolition, fence-post and pole holes, and any project where access is tight or surface protection matters.",
      },
      {
        q: "Can a mini excavator replace a full-size excavator?",
        a: "For many small to mid-size residential and commercial jobs, yes. For deep digs, heavy lifting, or large-volume earthmoving, a larger excavator may still be the right tool. Many contractors run both for the right job at the right cost.",
      },
      {
        q: "Do I need a special license to operate one?",
        a: "Licensing and towing rules vary by country, state and jobsite. Commercial jobsites usually require operator training and competency sign-off. Check local regulations before transport or operation.",
      },
      {
        q: "What attachments work with a Konstructz mini excavator?",
        a: "Matched digging buckets, grading and ditching buckets, hydraulic breakers, augers, thumbs, rippers and quick couplers can be available depending on the model. Reach out to the Konstructz attachments team to confirm fitment and hydraulic flow.",
      },
      {
        q: "How deep can a mini excavator dig?",
        a: "Most compact mini excavators dig between 7 and 10 feet depending on operating weight class. Check the spec page for the individual model against your deepest planned trench or footing.",
      },
    ],
  },

  {
    slug: "mini-skid-steers",
    name: "Mini Skid Steers",
    singular: "Mini Skid Steer",
    productCategoryKey: "skid-steer-loaders",
    iconPath: `${ICON}/skid-steer.svg`,
    shortDescription: "Tight-turning loaders that swap tools fast and work in confined spaces.",
    heroIntro:
      "Mini skid steer loaders combine zero-radius turning with a deep quick-attach library, so a single operator can load, grade, sweep, dig and break across one workday. Their compact footprint opens up sites where wheel loaders cannot fit.",
    heroImage: "/img/STOMP V980 v1.png",
    aboutBody:
      "A mini skid steer loader is a compact, highly maneuverable loader used for material handling, grading, loading trucks, snow clearing, demolition, landscaping, and running a wide library of work-tool attachments. Its zero-radius turning lets it work in confined spaces where wheel loaders cannot.",
    commonUses: [
      {
        title: "Material loading",
        description:
          "Move soil, mulch, gravel and demolition waste between piles, trucks and the work area at production rhythm.",
      },
      {
        title: "Site grading & prep",
        description:
          "Spread, level and compact base material with grading buckets and laser-graded smoothers for clean prep.",
      },
      {
        title: "Snow & ice work",
        description:
          "Push, plow and stockpile snow on lots and yards with matched snow blades, buckets and pushers.",
      },
      {
        title: "Landscaping & hardscape",
        description:
          "Carry pavers, install retaining walls, plant trees and run augers and trenchers across residential sites.",
      },
    ],
    whyChoose: [
      {
        title: "Turns where bigger loaders can't",
        description:
          "Zero-radius turning keeps the machine productive in tight yards, indoor demolition and crowded urban sites.",
      },
      {
        title: "Fastest attachment library on the jobsite",
        description:
          "Quick-attach plate makes tool changes a one-operator job — buckets, forks, augers, breakers, brooms and grapples.",
      },
      {
        title: "Strong lift for the footprint",
        description:
          "Loader geometry delivers serious operating capacity in a chassis that still fits on a standard trailer.",
      },
      {
        title: "Track or wheel for your ground",
        description:
          "Choose tracked for soft, muddy or sloped ground; choose wheels for fast travel across hard yards and finished pavement.",
      },
    ],
    splitImage: "/img/skoop v950 v1.png",
    splitHeading: "Engineered for high-cycle production",
    splitBody:
      "Konstructz mini skid steers are built for crews that work the machine all day. Ergonomic dual-joystick controls reduce operator fatigue, the quick-attach plate keeps tool-change downtime measured in seconds, and the lift geometry is matched to common pallet, hopper and stockpile heights so cycle times stay tight.",
    faqs: [
      {
        q: "What is a mini skid steer loader used for?",
        a: "Mini skid steers are used for moving and loading materials, grading, snow removal, demolition cleanup, landscaping, and running powered attachments like augers, trenchers, breakers and brooms.",
      },
      {
        q: "Mini skid steer vs compact track loader — what's the difference?",
        a: "Mini skid steers run on wheels and are fast and lower-cost. Compact track loaders run on rubber tracks for better traction and float on soft, wet or sloped ground. Konstructz offers both formats so you can match the surface to the task.",
      },
      {
        q: "Can I run any attachment on a mini skid steer?",
        a: "Many attachments mount through quick-attach couplers, but the key checks are coupler type, hydraulic flow and machine lift class. Tools such as cold planers, mulchers and rock saws need a matching hydraulic setup.",
      },
      {
        q: "How heavy a load can a mini skid steer lift?",
        a: "The STOMP V980 and V950 have operating capacities of 2,090 lbs and 2,160 lbs respectively. Always confirm that the combined weight of your attachment and material load remains within safe operating limits.",
      },
    ],
  },

  {
    slug: "wheel-loaders",
    name: "Wheel Loaders",
    singular: "Wheel Loader",
    productCategoryKey: "wheel-loaders",
    iconPath: `${ICON}/wheel-loader.svg`,
    shortDescription: "Articulated four-wheel-drive loaders for bulk material and high-cycle yards.",
    heroIntro:
      "Wheel loaders move serious volume — aggregate, soil, snow, mulch and demolition waste — between piles, trucks and work areas every cycle. An articulated chassis keeps the bucket level through tight yard turns and predictable cycle times.",
    heroImage: "/img/skoop ii v2.png",
    aboutBody:
      "A wheel loader is an articulated, four-wheel-drive front loader used to scoop, lift and transport bulk material. It is the workhorse for any operation that moves large volumes of loose material between piles, trucks and work areas — the kind of work that defines aggregate yards, recycling sites and snow contracts.",
    commonUses: [
      {
        title: "Truck loading",
        description:
          "Load dump trucks, ready-mix trucks and trailers with matched bucket geometry and dump-height clearance.",
      },
      {
        title: "Aggregate & stockpile work",
        description:
          "Build, manage and feed stockpiles of sand, gravel, crushed stone and recycled aggregate.",
      },
      {
        title: "Snow & ice operations",
        description:
          "Push, stockpile and load snow on commercial lots and yards with snow blades, pushers and high-capacity buckets.",
      },
      {
        title: "Demolition & recycling",
        description:
          "Clear demolition waste, sort recyclable material and feed crushers and screeners with grapples and high-tip buckets.",
      },
    ],
    whyChoose: [
      {
        title: "Articulated chassis for tight yard turns",
        description:
          "Four-wheel articulation keeps the bucket level and the chassis short — productive in yard corners other loaders can't reach.",
      },
      {
        title: "Fast wheeled travel between piles",
        description:
          "Wheels move quickly across yards and paved surfaces, keeping cycle times short on long haul distances.",
      },
      {
        title: "Bucket geometry matched to your loading targets",
        description:
          "Choose bucket size and lift height to match the truck, hopper or stockpile you load most often.",
      },
      {
        title: "Attachment range expands the season",
        description:
          "Quick-couplers let one wheel loader carry forks, snow tools, grapples and light-material buckets across the calendar.",
      },
    ],
    splitImage: "/img/skoop-2-1-1.png",
    splitHeading: "Configured for production yards",
    splitBody:
      "Konstructz wheel loaders are designed around a coupler-based attachment workflow — general-purpose buckets, light-material buckets, pallet forks, grapples, snow plows and snow buckets. Bucket size, coupler type and hydraulic flow are matched to the trucks, hoppers and stockpiles on your site so cycle time and machine strain stay balanced.",
    faqs: [
      {
        q: "What is a wheel loader used for?",
        a: "Wheel loaders are used for loading trucks and hoppers, moving bulk aggregate and recycled material, clearing snow, handling pallets with forks, and moving demolition waste across a yard or site.",
      },
      {
        q: "Wheel loader vs skid steer — which should I buy?",
        a: "Wheel loaders are bigger, lift higher, carry more, and travel faster across long yards. Skid steers are more maneuverable in tight spaces and accept a wider attachment library. Pick based on volume per cycle and yard layout.",
      },
      {
        q: "Can a wheel loader run a snow plow?",
        a: "Yes. With a correctly matched snow blade, snow bucket, or pusher box, a wheel loader can support commercial snow and ice operations on lots, yards and private roads.",
      },
      {
        q: "What bucket capacity do I need?",
        a: "Match bucket size to the truck or hopper you load most often. Oversized buckets slow cycle times and stress the chassis; undersized buckets cost cycles. The Konstructz team can size the bucket to your loading targets.",
      },
    ],
  },

  {
    slug: "backhoe-loaders",
    name: "Backhoe Loaders",
    singular: "Backhoe Loader",
    productCategoryKey: "backhoe-loaders",
    iconPath: `${ICON}/backhoe-loader.svg`,
    shortDescription: "Loader + digger on one chassis — load, trench, backfill and clean up with one operator.",
    heroIntro:
      "Backhoe loaders pair a front loader for hauling and grading with a rear backhoe arm for digging — so one operator can load, trench, backfill and clean up without switching machines. A roadable chassis moves the whole package between nearby jobsites under its own power.",
    heroImage: "/img/scoopydig v1.png",
    aboutBody:
      "A backhoe loader is a dual-purpose machine with a loader bucket on the front and a backhoe digging arm on the back. It is used for excavation, trenching, loading trucks, backfilling, grading and material handling — all from one operator's seat. The wheeled chassis makes it the natural choice when crews move between several sites in a workday.",
    commonUses: [
      {
        title: "Utility digging & trenching",
        description:
          "Set the stabilizers, swing to the trench line, and dig the water, sewer, gas or electrical line — then drop the bucket and backfill from the front.",
      },
      {
        title: "Loading trucks",
        description:
          "Use the loader to clear spoil, load dump trucks and move bulk material across the site between dig cycles.",
      },
      {
        title: "Backfill & grade",
        description:
          "Backfill the trench with the front loader, then grade and level with the bucket edge in the same operator seat.",
      },
      {
        title: "Municipal & repair work",
        description:
          "Snow, pothole repair, sign installation and broken main calls — one machine handles the dig and the cleanup.",
      },
    ],
    whyChoose: [
      {
        title: "Two machines on one chassis",
        description:
          "A loader and an excavator share the same engine, cab and trailer — so the fleet count drops without losing capability.",
      },
      {
        title: "Roadable between sites",
        description:
          "Wheeled chassis travels between nearby jobs under its own power, eliminating trailer time on multi-site days.",
      },
      {
        title: "Stable on the dig",
        description:
          "Stabilizing legs with wide pads hold the machine still for accurate, repeatable digs on any surface.",
      },
      {
        title: "Operator seat swivels to the work",
        description:
          "Swivel seat puts the operator in front of the active end — loader work facing forward, backhoe work facing back.",
      },
    ],
    splitImage: "/img/scoopydigreal.png",
    splitHeading: "One operator, two ends of work",
    splitBody:
      "Konstructz backhoe loaders configure with digging buckets, ditching buckets, hydraulic breakers, augers and thumbs on the backhoe end; and loader buckets, forks and blades on the front. Coupler type and hydraulic flow are matched to the attachments you plan to run, so the machine moves smoothly between digging and loading without a second machine on site.",
    faqs: [
      {
        q: "What is a backhoe loader?",
        a: "A backhoe loader is a wheeled construction machine with a front loader bucket and a rear excavator-style digging arm. It combines the function of a loader and a small excavator in one chassis.",
      },
      {
        q: "Backhoe loader vs excavator — which should I buy?",
        a: "A backhoe loader is better when you need both loading and digging in one machine, especially on jobs that move between sites under their own power. A dedicated excavator is better for heavy or deep digging where loading is a separate task.",
      },
      {
        q: "Can a backhoe loader run on public roads?",
        a: "Some wheeled backhoes can travel between nearby sites when properly equipped. Local rules cover lighting, signage, licensing and road use, so check your jurisdiction before driving between sites.",
      },
      {
        q: "What attachments work with a backhoe?",
        a: "On the backhoe end: digging buckets, ditching buckets, breakers, augers and thumbs. On the loader end: buckets, forks, snow blades and grapples. Always confirm hydraulic flow with the Konstructz attachments team.",
      },
    ],
  },

  {
    slug: "dumpers",
    name: "Compact Dumpers",
    singular: "Compact Dumper",
    productCategoryKey: "dumpers",
    iconPath: `${ICON}/dumper.svg`,
    shortDescription: "Tracked and wheeled site dumpers for moving bulk material across tough ground.",
    heroIntro:
      "Compact dumpers move concrete, soil and aggregate across the toughest sites — including the muddy, steep and tight-access ground that bigger trucks can't reach. Tracked models float on soft soil; wheeled models move fast across hard surfaces.",
    heroImage: "/img/thunder dump lift.png",
    aboutBody:
      "A compact dumper is a small jobsite hauler used on construction, landscaping and farm sites to move bulk material between the staging point and the work area. Tracked dumpers extend that capability onto soft, sloped or muddy ground when configured correctly — covering routes a full-size dump truck cannot safely cross.",
    commonUses: [
      {
        title: "Concrete pours",
        description:
          "Move ready-mix from the truck to the form work even when access prevents the truck from getting close.",
      },
      {
        title: "Hardscape & paver work",
        description:
          "Bring base material, sand and pavers across finished landscaping without tearing up turf.",
      },
      {
        title: "Soil & backfill",
        description:
          "Haul spoil out of an excavation and bring backfill in — keeping the site clean and the crew moving.",
      },
      {
        title: "Demolition cleanup",
        description:
          "Move demolition waste to dumpsters across uneven, debris-strewn ground that wheeled trucks struggle on.",
      },
    ],
    whyChoose: [
      {
        title: "Goes where dump trucks can't",
        description:
          "Tracked undercarriage handles mud, slope and soft ground so material moves without waiting for the ground to dry.",
      },
      {
        title: "Fits through tight access",
        description:
          "Compact footprint slips through gates and side passages where a full-size truck would have to stage at the curb.",
      },
      {
        title: "Hydraulic tip empties fast",
        description:
          "Hydraulic tip — straight, three-way, or swivel — drops the load exactly where you need it in seconds.",
      },
      {
        title: "Protects finished surfaces",
        description:
          "Low ground pressure tracks and rubber options preserve turf, pavers and finished concrete on residential sites.",
      },
    ],
    splitImage: "/img/thunder dump 180.png",
    splitHeading: "Match the dumper to the load and the ground",
    splitBody:
      "Konstructz dumpers ship in tracked and wheeled formats with hydraulic tip and — on select models — hydraulic swivel and self-loading shovel options. The configuration matches the chassis and box to how the material gets in, out and across the site. Hauling class is sized to the most-repeated load, since concrete is much heavier than mulch for the same box volume.",
    faqs: [
      {
        q: "What is a compact dumper used for?",
        a: "Compact dumpers move bulk material around a jobsite — concrete to a pour, aggregate to a base prep, soil out of an excavation, demolition waste to a skip. They cover the ground a full-size dump truck cannot.",
      },
      {
        q: "Tracked vs wheeled dumper — which is better?",
        a: "Tracked dumpers handle mud, snow, slopes and soft ground. Wheeled dumpers are faster and lower-cost on hard surfaces. Choose the one that matches the worst ground you regularly work on.",
      },
      {
        q: "Can I use a dumper on a slope?",
        a: "Tracked compact dumpers can help on uneven or sloped ground when used within the selected model's operating guidance. Keep loads balanced, avoid unsafe side slopes, and follow the operator's manual.",
      },
      {
        q: "How do dumpers compare to wheelbarrows for concrete?",
        a: "A single dumper load typically replaces dozens of wheelbarrow trips, with less labor and faster discharge. For any pour bigger than a small footing, a dumper pays back quickly in time savings.",
      },
    ],
  },

  {
    slug: "stone-crushers",
    name: "Stone Crushers",
    singular: "Stone Crusher",
    productCategoryKey: "stone-crushers",
    iconPath: `${ICON}/stone-crusher.svg`,
    shortDescription: "Crush concrete, brick, asphalt and stone on site — turn debris into usable aggregate.",
    heroIntro:
      "On-site stone and concrete crushers turn demolition rubble, fieldstone and recycled aggregate into usable material right where you work. Eliminates haul-off fees, aggregate delivery costs and dozens of truck movements per project.",
    heroImage: "/img/stone krusher k1.png",
    aboutBody:
      "A stone crusher reduces stone, concrete, brick and asphalt into smaller, uniform pieces that can be reused on site as fill, sub-base or finished aggregate. Crushing in place removes the cost of trucking debris out and aggregate back in — and reduces dust on local roads, project schedule and disposal fees in the same pass.",
    commonUses: [
      {
        title: "Concrete recycling",
        description:
          "Turn demolished slabs, footings and walls into clean recycled aggregate ready for sub-base or fill.",
      },
      {
        title: "Brick & masonry processing",
        description:
          "Reduce demolished masonry walls and brick stacks into reusable material for landscape or drainage projects.",
      },
      {
        title: "Asphalt millings reuse",
        description:
          "Crush milled asphalt for use as cold patch, driveway base or recycled aggregate on the next paving job.",
      },
      {
        title: "Fieldstone reduction",
        description:
          "Process fieldstone on agricultural and rural sites into uniform aggregate for roads and pads.",
      },
    ],
    whyChoose: [
      {
        title: "Eliminates haul-off fees",
        description:
          "On-site crushing typically replaces two truck movements per load — debris out and aggregate in — saving disposal and delivery cost.",
      },
      {
        title: "Adjustable output size",
        description:
          "Wedge or hydraulic jaw adjustment lets you target the exact spec — sub-base, drainage rock, landscape aggregate.",
      },
      {
        title: "Built for abrasive material",
        description:
          "High-manganese steel jaw plates and hardened wear liners handle the toughest demolition input without daily wear.",
      },
      {
        title: "Reduces environmental footprint",
        description:
          "Recycling material at source cuts truck movements, dust on local roads and project carbon footprint at once.",
      },
    ],
    splitImage: "/img/stone krusher k2.png",
    splitHeading: "Sized for the input you actually feed",
    splitBody:
      "Konstructz crushers are sized for site-grade input material. Pair with a loader or excavator to feed the hopper, and a screener or conveyor downstream when you need graded output. Feed opening dimensions are matched against your largest input piece, since undersized intake just shifts the work to pre-breaking by hand.",
    faqs: [
      {
        q: "What can a stone crusher process?",
        a: "Most jaw and impact crushers handle concrete, brick, masonry, asphalt, fieldstone and recycled aggregate. Reinforced concrete is fine as long as a magnetic separator pulls rebar out of the output stream.",
      },
      {
        q: "Why crush on site instead of hauling debris away?",
        a: "On-site crushing typically replaces two truck movements per load — debris out, aggregate in. It cuts disposal fees, fuel, dust on local roads and project schedule.",
      },
      {
        q: "What output sizes can I get?",
        a: "Most Konstructz crushers use an adjustable jaw or wedge system so you can target a specific output size. Check the model spec page for the range supported.",
      },
      {
        q: "Do I need a permit to operate a stone crusher?",
        a: "Local rules vary. Many jurisdictions require dust, noise and air-quality permits for ongoing crushing operations. Check with the local authority before starting a long-running project.",
      },
    ],
  },

  {
    slug: "trenchers",
    name: "Trenchers",
    singular: "Trencher",
    productCategoryKey: "trenchers",
    iconPath: `${ICON}/trencher.svg`,
    shortDescription: "Dedicated channel-cutters for utility, irrigation and drainage installs.",
    heroIntro:
      "Trenchers cut clean, uniform channels through compacted soil, clay and roots — so backfill goes faster, pipe sits straight and the next stage of the install is ready sooner. Purpose-built for any long linear underground run.",
    heroImage: "/img/ground ripper grx.png",
    aboutBody:
      "A trencher is a dedicated digging machine that cuts narrow, uniform channels for buried utilities — water, sewer, gas, fiber, electrical, irrigation and drainage. A trencher delivers a cleaner, faster channel than an excavator bucket for any linear underground install, with much lower spoil volume to clean up.",
    commonUses: [
      {
        title: "Water & sewer lines",
        description:
          "Cut clean channels for buried water and sewer service lines on residential and small commercial properties.",
      },
      {
        title: "Fiber, cable & electrical",
        description:
          "Install fiber, copper, and low-voltage electrical lines with channels tight enough to backfill cleanly.",
      },
      {
        title: "Irrigation & drainage",
        description:
          "Run irrigation laterals, french drains and tile drainage across yards, fields and landscapes.",
      },
      {
        title: "Invisible fence & landscape lighting",
        description:
          "Bury invisible fence wire and landscape lighting lines without tearing up turf or hardscape.",
      },
    ],
    whyChoose: [
      {
        title: "Cleaner channels backfill faster",
        description:
          "Straight, uniform-width cuts let pipe sit flat and backfill compact cleanly the first time.",
      },
      {
        title: "Faster than a bucket for linear runs",
        description:
          "Continuous chain cutting outpaces bucket-digging any time the channel is more than a few feet long.",
      },
      {
        title: "Carbide teeth handle tough soil",
        description:
          "Carbide-tipped chain cuts through packed clay, shale, roots and rocky soil that a bucket would stall in.",
      },
      {
        title: "Compact footprint for residential work",
        description:
          "Small chassis fits through residential gates and works between fences and landscaping with minimal collateral damage.",
      },
    ],
    splitImage: "/img/groundripper-png-4.png",
    splitHeading: "Match chain, tooth pattern and depth to the install",
    splitBody:
      "Konstructz trenchers come matched with digging chains and tooth options sized to common channel widths. Chain length, tooth pattern and chain speed are confirmed for the depth and soil class on your project — so the cut starts strong and stays clean across long runs. Worn teeth are replaced before they start tearing the channel.",
    faqs: [
      {
        q: "What is a trencher used for?",
        a: "Trenchers cut narrow channels in the ground for underground utilities — water and sewer pipes, electrical and fiber cable, gas lines, drainage tile, irrigation lines, landscape lighting and invisible fence.",
      },
      {
        q: "Trencher vs excavator — which is better for utility lines?",
        a: "A trencher is faster and cleaner for any long, narrow, uniform channel. An excavator is better when you need wider trenches, deeper digs, or have obstacles that require a bucket. Many contractors run both.",
      },
      {
        q: "How deep can a Konstructz trencher dig?",
        a: "The GROUP RIPPER GRX is designed to dig trenches up to 48 inches deep and 6 inches wide using a standard heavy-duty chain. Confirm your required depth and chain width with Konstructz to select the best setup.",
      },
      {
        q: "What soils does a trencher handle?",
        a: "With the correct tooth pattern, a trencher cuts through topsoil, clay, packed dirt, shale and roots. Solid rock and large boulders are not a trencher application — those need a rock saw or breaker.",
      },
    ],
  },

  {
    slug: "towable-excavators",
    name: "Towable Excavators",
    singular: "Towable Excavator",
    productCategoryKey: "towable-excavators",
    iconPath: `${ICON}/towable-excavator.svg`,
    shortDescription: "Tow-behind diggers that travel with a pickup and set up on outriggers.",
    heroIntro:
      "Towable excavators pull behind a pickup or utility vehicle, set up on outriggers, and dig where access keeps a full-size excavator off the property. Built for remote, off-grid and rural jobsites where transport simplicity matters.",
    heroImage: "/img/spider one v1.png",
    aboutBody:
      "A towable excavator is a small excavator on a tow-behind chassis that can be moved with a suitable pickup or utility vehicle where local towing rules allow. Once on site, outriggers deploy and the boom and bucket handle light excavation tasks. It is built for remote, rural and access-limited work where a tracked machine on a trailer is too much rig for the job.",
    commonUses: [
      {
        title: "Rural utility installs",
        description:
          "Run a service line to a barn, outbuilding or remote pump house without scheduling a full excavation crew.",
      },
      {
        title: "Fence posts & pole holes",
        description:
          "Dig post holes for fencing, signage, lighting and gate hardware across acreage in a single pass.",
      },
      {
        title: "Septic, drainage & well work",
        description:
          "Open up septic lines, drainage paths and well-head excavations on rural property without rented mid-size iron.",
      },
      {
        title: "Garden, pond & off-grid work",
        description:
          "Dig ponds, plant trees and prep gardens on remote property where access prevents tracked machines from reaching.",
      },
    ],
    whyChoose: [
      {
        title: "Tow behind a pickup",
        description:
          "Roll the machine to site on its own trailer chassis — no separate lowboy or hot-shot scheduling.",
      },
      {
        title: "Outriggers stabilize on slopes",
        description:
          "Deployable outriggers lock the machine onto uneven or sloped ground that would defeat a wheeled chassis.",
      },
      {
        title: "Lower total cost than tracked + trailer",
        description:
          "One purchase covers transport and digging, removing the cost and storage footprint of a dedicated trailer.",
      },
      {
        title: "Compact storage between jobs",
        description:
          "Folded-up footprint stores in a shop bay or under a carport between jobs — no trailer parking needed.",
      },
    ],
    splitImage: "/img/spider-one.png",
    splitHeading: "Configure for the haul and the hole",
    splitBody:
      "Konstructz towable excavators can be configured with digging and trenching buckets and thumb options for material handling. Coupler pin size and hydraulic flow are matched against the attachments you plan to run, while towing weight, hitch class and brake spec are aligned with the vehicle that will pull it most often.",
    faqs: [
      {
        q: "What is a towable excavator?",
        a: "A towable excavator is a small excavator mounted on a tow-behind chassis. You move it with a suitable vehicle, lower the outriggers on site, and operate the boom and bucket for light digging and property work.",
      },
      {
        q: "Do I need a CDL to tow one?",
        a: "Towing requirements depend on combined vehicle weight, hitch class, brake equipment and local law. Always verify your vehicle, route and regional rules before towing.",
      },
      {
        q: "Towable vs tracked mini excavator — which should I buy?",
        a: "A towable saves the cost of a dedicated trailer and is easier to move between many small remote jobs. A tracked mini gives more digging force and faster on-site mobility for a single longer project. Many owners run both.",
      },
      {
        q: "How deep can a towable excavator dig?",
        a: "The SPIDER ONE is designed for a digging depth of 7.0 feet using a standard 12-inch digging bucket. Confirm your required digging depth and soil conditions with the engineering team for best performance.",
      },
    ],
  },
];

/** Look up a category by URL slug. */
export const getCategoryBySlug = (slug: string): ProductCategory | undefined =>
  productCategories.find((c) => c.slug === slug);

/** Look up a category by the product-side key (Product.category). */
export const getCategoryByProductKey = (key: string): ProductCategory | undefined =>
  productCategories.find((c) => c.productCategoryKey === key);

/** Count products in a given category. */
export const getCategoryProductCount = (category: ProductCategory): number =>
  products.filter((p) => p.category === category.productCategoryKey).length;

/** Get the related categories (3 others). */
export const getRelatedCategories = (slug: string): ProductCategory[] => {
  const others = productCategories.filter((c) => c.slug !== slug);
  return others.slice(0, 3);
};
