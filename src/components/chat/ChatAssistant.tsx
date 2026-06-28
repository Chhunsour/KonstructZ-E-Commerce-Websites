import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "../../context/I18nContext";
import { listPublicPosts } from "../../lib/blogStore";
import { kb, CONTACT, getChatbotConfig, PRODUCT_DETAIL, PRODUCT_REFS, type ProductRef, logUserFeedback } from "./knowledge";
import { getCanonicalProducts } from "./matchingEngine";
import {
  getReply,
  emptyMemory,
  getWelcomeText,
  type Answer,
  type ChatMemory,
} from "./engine";

const LOGO = "/img/vector.png"; // Konstructz wolf mark

/* ─────────────────────────── Types & storage ───────────────────────── */

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  products?: ProductRef[];
  links?: { label: string; href: string }[];
  followups?: string[];
  handoff?: boolean;
  instant?: boolean;
}

const STORAGE_KEY = "kz-chat-v3";
const uid = () => Math.random().toString(36).slice(2, 10);

function loadState(): { open: boolean; messages: ChatMessage[]; memory: ChatMemory } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!Array.isArray(p.messages)) return null;
    return {
      open: !!p.open,
      messages: p.messages.map((m: ChatMessage) => ({ ...m, instant: true })),
      memory: p.memory ?? emptyMemory(),
    };
  } catch {
    return null;
  }
}

const welcomeMessage = (lang: string = "en"): ChatMessage => ({ id: "welcome", role: "bot", text: getWelcomeText(lang), instant: true });

/* ─────────────────────────── Brand avatar ──────────────────────────── */

const Avatar: React.FC<{ size?: number; className?: string }> = ({ size = 30, className = "" }) => (
  <span
    className={`flex shrink-0 items-center justify-center border border-[#d8c79a]/45 bg-[#f4f1ea] ${className}`}
    style={{ height: size, width: size }}
  >
    <img src={LOGO} alt="Konstructz" className="object-contain" style={{ height: size * 0.68, width: size * 0.68 }} />
  </span>
);

/* ─────────────────────────── Markdown render ───────────────────────── */

const mdComponents = {
  h1: (p: any) => <h1 className="mb-3.5 mt-1 font-clofieBold text-[16px] font-bold text-white border-b border-[#d8c79a]/15 pb-1" {...p} />,
  h2: (p: any) => <h2 className="mb-2.5 mt-3.5 font-clofieBold text-[14.5px] font-bold text-white" {...p} />,
  h3: (p: any) => <h3 className="mb-2 mt-3 font-clofieBold text-[13.5px] font-bold text-[#d8c79a]" {...p} />,
  h4: (p: any) => <h4 className="mb-1.5 mt-2 font-clofieBold text-[12.5px] font-bold text-white/90" {...p} />,
  p: (p: any) => <p className="mb-2.5 leading-[1.65] text-white/85 last:mb-0" {...p} />,
  ul: (p: any) => <ul className="mb-2.5 list-disc space-y-1.5 pl-4 marker:text-[#d8c79a]" {...p} />,
  ol: (p: any) => <ol className="mb-2.5 list-decimal space-y-1.5 pl-4 marker:text-[#d8c79a]/80" {...p} />,
  li: (p: any) => <li className="leading-[1.55] text-white/85" {...p} />,
  strong: (p: any) => <strong className="font-bold text-white" {...p} />,
  em: (p: any) => <em className="text-[12px] not-italic text-white/45" {...p} />,
  del: (p: any) => <span className="bg-[#d8c79a]/10 text-[#d8c79a] border-b border-[#d8c79a]/35 px-1.5 py-0.5 font-medium select-none" {...p} />,
  a: ({ href, children, ...p }: any) => {
    if (href && href.startsWith("badge:")) {
      const type = href.replace("badge:", "");
      let style = "bg-[#d8c79a]/10 text-[#d8c79a] border border-[#d8c79a]/45";
      if (type === "shipping") {
        style = "bg-[#1f5132]/35 text-[#4ade80] border border-[#4ade80]/30";
      } else if (type === "attachments" || type === "compare") {
        style = "bg-white/5 text-white/80 border border-white/20";
      }
      return (
        <span className={`inline-flex items-center text-[10px] font-clofieBold font-bold uppercase tracking-wider px-2 py-0.5 rounded-none mr-1.5 last:mr-0 select-none ${style}`}>
          {children}
        </span>
      );
    }
    return (
      <a
        href={href}
        className="text-[#d8c79a] underline underline-offset-2 hover:text-white"
        {...p}
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="my-3.5 border-white/10" />,
  table: (p: any) => (
    <div className="my-2.5 overflow-x-auto border border-white/10">
      <table className="w-full border-collapse text-[12px]" {...p} />
    </div>
  ),
  thead: (p: any) => <thead className="bg-[#d8c79a]/10" {...p} />,
  th: (p: any) => <th className="border-b border-white/12 px-2.5 py-1.5 text-left font-bold text-[#d8c79a]" {...p} />,
  td: (p: any) => <td className="border-b border-white/8 px-2.5 py-1.5 align-top text-white/80" {...p} />,
  code: (p: any) => <code className="bg-white/10 px-1 text-[#d8c79a]" {...p} />,
};

function injectBadges(text: string): string {
  if (!text) return text;
  return text
    .replace(/\[1-year warranty \+ lifetime technical support\]/gi, "[1-year warranty + lifetime technical support](badge:warranty)")
    .replace(/\[1-Year Warranty\]/gi, "[1-Year Warranty](badge:warranty)")
    .replace(/\[Lifetime Technical Support\]/gi, "[Lifetime Technical Support](badge:support)")
    .replace(/\[Free Shipping\]/gi, "[Free Shipping](badge:shipping)")
    .replace(/\[Attachments\]/gi, "[Attachments](badge:attachments)")
    .replace(/\[Compare\]/gi, "[Compare](badge:compare)");
}

const Markdown: React.FC<{ text: string }> = ({ text }) => {
  const processedText = injectBadges(text);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {processedText}
    </ReactMarkdown>
  );
};

const StreamingMarkdown: React.FC<{ text: string; instant?: boolean; onTick?: () => void; onDone?: () => void }> = ({
  text,
  instant,
  onTick,
  onDone,
}) => {
  const [shown, setShown] = useState(instant ? text : "");
  useEffect(() => {
    if (instant) {
      onDone?.();
      return;
    }
    const tokens = text.split(/(\s+)/);
    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setShown(tokens.slice(0, i).join(""));
      onTick?.();
      if (i >= tokens.length) {
        window.clearInterval(timer);
        setShown(text);
        onDone?.();
      }
    }, 26);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Markdown text={shown} />;
};

/* ─────────────────────────── Icons ─────────────────────────────────── */

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const NewChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);
const SparkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" />
  </svg>
);

const CardGlyphs = {
  machine: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="14" width="9" height="3.5" rx="1" /><circle cx="5" cy="19.5" r="1.6" /><circle cx="9" cy="19.5" r="1.6" /><path d="M5 14v-3h3.5v3M8.5 11.5l4-2 3 3.5" /><path d="M14.5 13l3 .5 1-2" />
    </svg>
  ),
  compare: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7H3l2-2M8 7l-2 2M16 17h5l-2-2M16 17l2 2" /><path d="M3 7h13M21 17H8" />
    </svg>
  ),
  wrench: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8a1.8 1.8 0 0 0 2.5 2.5l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.3 2.3-2-2z" />
    </svg>
  ),
  company: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="15" y1="22" x2="15" y2="16" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M8 6h2M8 10h2M14 6h2M14 10h2" />
    </svg>
  ),
  support: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 11l2 2 4-4" />
    </svg>
  ),
  truck: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
};

// SUGGESTION_CARDS is now dynamically computed inside ChatAssistant.FC

/* ─────────────────────────── Main widget ───────────────────────────── */

export const ChatAssistant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useI18n();
  const path = location.pathname;

  useEffect(() => {
    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length >= 2 && (pathParts[0] === "typhon-machinery" || pathParts[0] === "equipment" || pathParts[0] === "product")) {
      const prodId = pathParts[1];
      try {
        const raw = localStorage.getItem("kz-recently-viewed") || "[]";
        const list: string[] = JSON.parse(raw);
        const updated = [prodId, ...list.filter(id => id !== prodId)].slice(0, 3);
        localStorage.setItem("kz-recently-viewed", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update recently viewed", e);
      }
    }
  }, [path]);

  const currentSuggestionCards = React.useMemo(() => {
    const config = getChatbotConfig();
    const isProductPage = (path.startsWith("/equipment/") || path.startsWith("/typhon-machinery/")) && path !== "/equipment" && path !== "/typhon-machinery";
    const isSkidSteerCategory = path.includes("skid-steer") || path.includes("stomp");
    const isSupportPage = path.startsWith("/support");
    const isBlogPage = path.startsWith("/blog") || path.startsWith("/post");

    let list: { glyph: React.ReactNode; title: string; sub: string; q: string }[] = [];

    let recentlyViewed: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("kz-recently-viewed") || "[]";
        recentlyViewed = JSON.parse(raw);
      } catch {}
    }

    if (recentlyViewed.length >= 2) {
      list.push({
        glyph: CardGlyphs.compare,
        title: t("chatbot.suggest.compareRecentlyViewedTitle"),
        sub: t("chatbot.suggest.compareRecentlyViewedSub"),
        q: t("chatbot.suggest.compareRecentlyViewedQ")
      });
    }

    if (isProductPage) {
      list.push(
        {
          glyph: CardGlyphs.machine,
          title: t("chatbot.suggest.viewSpecsTitle"),
          sub: t("chatbot.suggest.viewSpecsSub"),
          q: t("chatbot.suggest.viewSpecsQ")
        },
        {
          glyph: CardGlyphs.compare,
          title: t("chatbot.suggest.compareThisTitle"),
          sub: t("chatbot.suggest.compareThisSub"),
          q: t("chatbot.suggest.compareThisQ")
        },
        {
          glyph: CardGlyphs.wrench,
          title: t("chatbot.suggest.attachmentsTitle"),
          sub: t("chatbot.suggest.attachmentsSub"),
          q: t("chatbot.suggest.attachmentsQ")
        },
        {
          glyph: CardGlyphs.support,
          title: t("chatbot.suggest.buyingHelpTitle"),
          sub: t("chatbot.suggest.buyingHelpSub"),
          q: t("chatbot.suggest.buyingHelpQ")
        }
      );
    } else if (isSkidSteerCategory) {
      list.push(
        {
          glyph: CardGlyphs.wrench,
          title: t("chatbot.suggest.skidSteerAttachmentsTitle"),
          sub: t("chatbot.suggest.skidSteerAttachmentsSub"),
          q: t("chatbot.suggest.skidSteerAttachmentsQ")
        },
        {
          glyph: CardGlyphs.compare,
          title: t("chatbot.suggest.compareSkidSteerTitle"),
          sub: t("chatbot.suggest.compareSkidSteerSub"),
          q: t("chatbot.suggest.compareSkidSteerQ")
        },
        {
          glyph: CardGlyphs.machine,
          title: t("chatbot.suggest.findLoaderTitle"),
          sub: t("chatbot.suggest.findLoaderSub"),
          q: t("chatbot.suggest.findLoaderQ")
        },
        {
          glyph: CardGlyphs.support,
          title: t("chatbot.suggest.askWarrantyTitle"),
          sub: t("chatbot.suggest.askWarrantySub"),
          q: t("chatbot.suggest.askWarrantyQ")
        }
      );
    } else if (isSupportPage) {
      list.push(
        {
          glyph: CardGlyphs.support,
          title: t("chatbot.suggest.warrantySupportTitle"),
          sub: t("chatbot.suggest.warrantySupportSub"),
          q: t("chatbot.suggest.warrantySupportQ")
        },
        {
          glyph: CardGlyphs.truck,
          title: t("chatbot.suggest.shippingDeliveryTitle"),
          sub: t("chatbot.suggest.shippingDeliverySub"),
          q: t("chatbot.suggest.shippingDeliveryQ")
        },
        {
          glyph: CardGlyphs.compare,
          title: t("chatbot.suggest.financingOptionsTitle"),
          sub: t("chatbot.suggest.financingOptionsSub"),
          q: t("chatbot.suggest.financingOptionsQ")
        },
        {
          glyph: CardGlyphs.wrench,
          title: t("chatbot.suggest.returnsRefundsTitle"),
          sub: t("chatbot.suggest.returnsRefundsSub"),
          q: t("chatbot.suggest.returnsRefundsQ")
        }
      );
    } else if (isBlogPage) {
      list.push(
        {
          glyph: CardGlyphs.machine,
          title: t("chatbot.suggest.blog.machinesTitle", { fallback: "Related machines" }),
          sub: t("chatbot.suggest.blog.machinesSub", { fallback: "Match what you read to jobsite equipment" }),
          q: t("chatbot.suggest.blog.machinesQ", { fallback: "Recommend a machine based on my project." })
        },
        {
          glyph: CardGlyphs.compare,
          title: t("chatbot.suggest.blog.beginnerTitle", { fallback: "Beginner explanation" }),
          sub: t("chatbot.suggest.blog.beginnerSub", { fallback: "Learn machine terms in simple language" }),
          q: t("chatbot.suggest.blog.beginnerQ", { fallback: "Explain compact machinery terms simply." })
        },
        {
          glyph: CardGlyphs.wrench,
          title: t("chatbot.suggest.blog.attachmentsTitle", { fallback: "Attachments & fitment" }),
          sub: t("chatbot.suggest.blog.attachmentsSub", { fallback: "See what fits your machine" }),
          q: t("chatbot.suggest.blog.attachmentsQ", { fallback: "What attachments fit my machine?" })
        },
        {
          glyph: CardGlyphs.company,
          title: t("chatbot.suggest.blog.whoTitle", { fallback: "Who is Konstructz?" }),
          sub: t("chatbot.suggest.blog.whoSub", { fallback: "Learn what we sell and if we are legit" }),
          q: t("chatbot.suggest.blog.whoQ", { fallback: "Tell me about Konstructz and what you sell." })
        }
      );
    } else {
      list.push(
        {
          glyph: CardGlyphs.machine,
          title: t("chatbot.suggest.default.findTitle", { fallback: "Find the right TYPHON machine" }),
          sub: t("chatbot.suggest.default.findSub", { fallback: "Excavators, skid steers, loaders & more" }),
          q: t("chatbot.suggest.default.findQ", { fallback: "Find the right TYPHON machine" })
        },
        {
          glyph: CardGlyphs.machine,
          title: t("chatbot.suggest.default.specsTitle", { fallback: "Ask for TYPHON horsepower/specs" }),
          sub: t("chatbot.suggest.default.specsSub", { fallback: "Check engine power, weight & capacities" }),
          q: t("chatbot.suggest.default.specsQ", { fallback: "Ask for TYPHON horsepower/specs" })
        },
        {
          glyph: CardGlyphs.compare,
          title: t("chatbot.suggest.default.compareTitle", { fallback: "Compare TYPHON machines" }),
          sub: t("chatbot.suggest.default.compareSub", { fallback: "Put two models side-by-side" }),
          q: t("chatbot.suggest.default.compareQ", { fallback: "Compare TYPHON machines" })
        },
        {
          glyph: CardGlyphs.wrench,
          title: t("chatbot.suggest.default.fitmentTitle", { fallback: "Check attachment fitment" }),
          sub: t("chatbot.suggest.default.fitmentSub", { fallback: "See what tools fit which model" }),
          q: t("chatbot.suggest.default.fitmentQ", { fallback: "Check attachment fitment" })
        },
        {
          glyph: CardGlyphs.support,
          title: t("chatbot.suggest.default.warrantyTitle", { fallback: "Ask about warranty/support" }),
          sub: t("chatbot.suggest.default.warrantySub", { fallback: "1-year warranty + lifetime technical support" }),
          q: t("chatbot.suggest.default.warrantyQ", { fallback: "Ask about warranty/support" })
        },
        {
          glyph: CardGlyphs.company,
          title: t("chatbot.suggest.default.salesTitle", { fallback: "Contact sales" }),
          sub: t("chatbot.suggest.default.salesSub", { fallback: "Reach out for pricing and quotes" }),
          q: t("chatbot.suggest.default.salesQ", { fallback: "Contact sales" })
        }
      );
    }

    return list.slice(0, 6);
  }, [path, t]);

  const initial = loadState();
  const [open, setOpen] = useState(initial?.open ?? false);
  const [messages, setMessages] = useState<ChatMessage[]>(
    initial?.messages?.length ? initial.messages : [welcomeMessage(language)]
  );
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const val = input.toLowerCase().trim();
    if (!val || val.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const list: string[] = [];
    
    if ("shipping".startsWith(val) || val.includes("shipping")) {
      list.push("shipping", "ship overseas");
    }
    if ("warranty".startsWith(val) || val.includes("warranty")) {
      list.push("warranty");
    }
    
    try {
      const canonicals = getCanonicalProducts();
      const matches = canonicals.filter(p => 
        p.name.toLowerCase().includes(val) || 
        p.category.toLowerCase().includes(val) ||
        p.aliases.some(a => a.includes(val)) ||
        p.misspellings.some(m => m.includes(val))
      );

      for (const p of matches.slice(0, 2)) {
        const nameShort = p.name.replace(/typhon\s+/i, "");
        if (p.category.toLowerCase().includes("excavator")) {
          list.push(
            `${nameShort} horsepower`,
            `${nameShort} engine`,
            `${nameShort} digging depth`,
            `Compare ${nameShort}`
          );
        } else if (p.category.toLowerCase().includes("skid steer")) {
          list.push(
            `${nameShort} lift capacity`,
            `${nameShort} engine`,
            `Compare ${nameShort}`
          );
        } else if (p.category.toLowerCase().includes("forklift") || p.name.toLowerCase().includes("vigor")) {
          list.push(
            `${nameShort} lift capacity`,
            `${nameShort} lift height`,
            `Compare ${nameShort}`
          );
        } else {
          list.push(
            `${nameShort} specs`,
            `${nameShort} engine`,
            `Compare ${nameShort}`
          );
        }
      }
    } catch (e) {
      console.error("Autocomplete match error", e);
    }

    const uniqueList = Array.from(new Set(list)).slice(0, 5);
    setSuggestions(uniqueList);
  }, [input]);

  const [phase, setPhase] = useState<null | "analyzing" | "thinking">(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(
    () => new Set((initial?.messages ?? []).map((m) => m.id).concat("welcome"))
  );
  const memoryRef = useRef<ChatMemory>(initial?.memory ?? emptyMemory());

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let active = true;
    listPublicPosts()
      .then((rows) => {
        if (active && rows.length) kb.setBlogDocs(rows);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ open, messages, memory: memoryRef.current }));
    } catch {
      /* ignore */
    }
  }, [open, messages]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, phase, open]);
  useEffect(() => {
    if (open) timers.current.push(window.setTimeout(() => inputRef.current?.focus(), 280));
  }, [open]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const markDone = (id: string) => setDoneIds((prev) => new Set(prev).add(id));

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || phase) return;
    setMessages((prev) => [...prev, { id: uid(), role: "user", text, instant: true }]);
    setInput("");

    let recentlyViewed: string[] = [];
    try {
      const rawRV = localStorage.getItem("kz-recently-viewed") || "[]";
      recentlyViewed = JSON.parse(rawRV);
    } catch {}

    const memoryWithViews = {
      ...memoryRef.current,
      recentlyViewedIds: recentlyViewed
    };

    const { answer, memory } = getReply(text, memoryWithViews, language, path);
    memoryRef.current = memory;

    try {
      const stored = localStorage.getItem("kz-chatbot-analytics");
      const data = stored ? JSON.parse(stored) : {
        queries: [],
        products: {},
        specs: {},
        failed: [],
        contacts: 0
      };
      
      data.queries.push(text);
      
      const matchedRef = PRODUCT_REFS.find(r => 
        text.toLowerCase().includes(r.name.toLowerCase().replace(/typhon\s+/i, "")) || 
        r.name.toLowerCase().replace(/typhon\s+/i, "").includes(text.toLowerCase())
      );
      if (matchedRef) {
        data.products[matchedRef.name] = (data.products[matchedRef.name] || 0) + 1;
      }
      
      const hasSpecKeywords = /\b(spec|specification|horsepower|hp|power|engine|motor|weight|price|cost|lift|lifting|height|digging depth|dig depth|deep|depth|bucket|hydraulic|flow|gpm|fuel|size|dimensions?|attachments?|fitment|warranty|shipping|travel speed|speed|how (heavy|big|powerful|deep|tall|wide|fast))/.test(text.toLowerCase());
      if (hasSpecKeywords) {
        const specMatch = text.toLowerCase().match(/\b(horsepower|hp|power|engine|motor|weight|price|cost|lift|lifting|height|digging depth|dig depth|deep|depth|bucket|hydraulic|flow|gpm|fuel|size|dimensions?|attachments?|fitment|warranty|shipping|travel speed|speed)\b/);
        if (specMatch) {
          const specName = specMatch[1];
          data.specs[specName] = (data.specs[specName] || 0) + 1;
        }
      }
      
      if (answer.handoff) {
        data.contacts += 1;
      }
      if (answer.markdown.toLowerCase().includes("i do not have") || answer.markdown.toLowerCase().includes("could not find") || answer.markdown.toLowerCase().includes("not listed")) {
        data.failed.push(text);
      }
      
      localStorage.setItem("kz-chatbot-analytics", JSON.stringify(data));
    } catch (e) {
      // ignore
    }

    setPhase("analyzing");
    const complexity = Math.min(1, answer.markdown.length / 700);
    const analyzeMs = 500 + complexity * 500 + Math.random() * 250;
    const thinkMs = 450 + complexity * 950 + Math.random() * 300;
    timers.current.push(window.setTimeout(() => setPhase("thinking"), analyzeMs));
    timers.current.push(
      window.setTimeout(() => {
        setPhase(null);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            text: answer.markdown,
            products: answer.products,
            links: answer.links,
            followups: answer.followups,
            handoff: answer.handoff,
          },
        ]);
      }, analyzeMs + thinkMs)
    );
  };

  const goTo = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const resetChat = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    memoryRef.current = emptyMemory();
    setMessages([welcomeMessage(language)]);
    setDoneIds(new Set(["welcome"]));
    setPhase(null);
  };

  const showHero = messages.length === 1 && messages[0].id === "welcome" && !phase;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("chatbot.launcher.close") : t("chatbot.launcher.open")}
        aria-expanded={open}
        className="group fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center border border-[#d8c79a]/45 bg-[#f4f1ea] shadow-[0_14px_34px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(21,61,40,0.45)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153d28]"
      >
        {open ? (
          <span className="text-[#153d28]">
            <CloseIcon />
          </span>
        ) : (
          <img src={LOGO} alt="Konstructz" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105" />
        )}
        {!open && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center"
            aria-hidden="true"
          >
            {/* radar ping */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            {/* online core dot */}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#f4f1ea] shadow-[0_0_8px_2px_rgba(52,211,153,0.85)]" />
          </span>
        )}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label={t("chatbot.launcher.open")}
        aria-hidden={!open}
        className={`fixed z-[80] flex flex-col overflow-hidden border border-[#d8c79a]/20 bg-[#161613] shadow-[0_40px_90px_-24px_rgba(0,0,0,0.9)] transition-all duration-300 ease-out
          inset-x-3 bottom-3 max-h-[calc(100dvh-1.5rem)] h-[82dvh]
          sm:inset-x-auto sm:right-5 sm:bottom-[86px] sm:left-auto sm:w-[412px] sm:h-[640px] sm:max-h-[calc(100dvh-7rem)]
          ${open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-5 scale-[0.97] opacity-0"}`}
      >
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-[#d8c79a]/15 bg-gradient-to-r from-[#10301f] via-[#153d28] to-[#1b4a31] px-4 py-3.5">
          <Avatar size={38} />
          <div className="min-w-0 flex-1">
            <p className="font-clofieBold text-[15px] font-bold leading-none text-white">{t("chatbot.title", { fallback: "Konstructz Assistant" })}</p>
            <p className="mt-1.5 flex items-center gap-1.5 font-googleSans text-[11px] font-medium tracking-wide text-[#d8c79a]">
              <SparkIcon /> {t("chatbot.header.poweredBy")}
            </p>
          </div>
          <button type="button" onClick={resetChat} aria-label={t("chatbot.header.startNew")} title={t("chatbot.header.newChat")} className="flex h-8 w-8 items-center justify-center text-white/65 transition hover:bg-white/10 hover:text-white">
            <NewChatIcon />
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label={t("chatbot.header.close")} className="flex h-8 w-8 items-center justify-center text-white/65 transition hover:bg-white/10 hover:text-white">
            <CloseIcon />
          </button>
        </header>

        {/* Body */}
        <div ref={scrollRef} className="kz-chat-scroll flex-1 overflow-y-auto bg-[#161613] px-4 py-4 font-googleSans text-[13.5px] text-white/90">
          {showHero ? (
            <WelcomeHero onPick={send} cards={currentSuggestionCards} />
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg.id === "welcome" ? { ...msg, text: getWelcomeText(language) } : msg}
                  done={doneIds.has(msg.id)}
                  onStreamTick={scrollToBottom}
                  onStreamDone={() => {
                    markDone(msg.id);
                    scrollToBottom();
                  }}
                  onNavigate={goTo}
                  onFollowup={send}
                />
              ))}
              {phase && <StatusBubble phase={phase} />}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-[#d8c79a]/15 bg-[#1c1c18] px-3 py-3"
        >
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    send(s);
                    setSuggestions([]);
                  }}
                  className="inline-flex items-center text-[11px] font-googleSans px-2.5 py-1 bg-white/5 border border-white/10 hover:border-[#d8c79a] text-white/80 transition hover:text-[#d8c79a] rounded-none"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 border border-white/12 bg-[#161613] px-3 py-1.5 transition focus-within:border-[#d8c79a]/50">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.input.placeholder")}
              aria-label={t("chatbot.input.placeholder")}
              className="min-w-0 flex-1 bg-transparent py-1.5 font-googleSans text-[14px] text-white placeholder:text-white/35 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || !!phase}
              aria-label={t("chatbot.input.send")}
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#d8c79a] text-[#153d28] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </div>
          <p className="mt-2 text-center font-googleSans text-[10px] text-white/30">
            {t("chatbot.input.disclaimer")}
          </p>
        </form>
      </div>
    </>
  );
};

/* ─────────────────────────── Welcome hero ──────────────────────────── */

const WelcomeHero: React.FC<{
  onPick: (q: string) => void;
  cards: { glyph: React.ReactNode; title: string; sub: string; q: string }[];
}> = ({ onPick, cards }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center px-1 pb-2 pt-3 text-center">
      <div className="kz-rise">
        <Avatar size={64} />
      </div>
      <h2 className="kz-rise mt-4 font-clofieBold text-[22px] font-bold leading-tight text-white" style={{ animationDelay: "60ms" }}>
        {t("chatbot.title", { fallback: "Konstructz Assistant" })}
      </h2>
      <p className="kz-rise mt-2 max-w-[320px] font-googleSans text-[13px] leading-relaxed text-white/60" style={{ animationDelay: "120ms" }}>
        {t("chatbot.welcome.expert")}
      </p>

      <div className="mt-6 flex flex-col gap-2.5 w-full text-left">
        {cards.map((c, i) => (
          <button
            key={c.title + i}
            type="button"
            onClick={() => onPick(c.q)}
            className="kz-rise group flex items-center gap-3.5 border border-white/10 bg-[#1d1e1a] px-4 py-3 transition hover:border-[#d8c79a]/50 hover:bg-[#23241f] active:bg-[#1a1b17] rounded-none"
            style={{ animationDelay: `${180 + i * 50}ms` }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d8c79a]/30 bg-[#d8c79a]/10 text-[#d8c79a] transition group-hover:bg-[#d8c79a]/20 rounded-none">
              {c.glyph}
            </span>
            <div className="flex-1 min-w-0">
              <span className="block font-clofieBold text-[13px] font-bold leading-tight text-white">{c.title}</span>
              <span className="block mt-1 font-googleSans text-[10.5px] leading-snug text-white/45 truncate">{c.sub}</span>
            </div>
            <svg width="7" height="11" viewBox="0 0 6 10" fill="none" className="shrink-0 text-[#d8c79a] transition group-hover:translate-x-0.5 duration-200">
              <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <p className="kz-rise mt-5 font-googleSans text-[11px] text-white/35" style={{ animationDelay: "500ms" }}>
        {t("chatbot.welcome.orType")}
      </p>
    </div>
  );
};

/* ─────────────────────────── Sub-components ────────────────────────── */

const StatusBubble: React.FC<{ phase: "analyzing" | "thinking" }> = ({ phase }) => {
  const { t } = useI18n();
  return (
    <div className="flex items-end gap-2.5 kz-rise">
      <Avatar size={30} />
      <div className="flex items-center gap-2 border border-white/10 bg-[#20211d] px-3.5 py-3">
        <span className="font-googleSans text-[12px] text-white/55">
          {phase === "analyzing" ? t("chatbot.status.analyzing") : t("chatbot.status.thinking")}
        </span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#d8c79a] kz-dot" style={{ animationDelay: `${i * 160}ms` }} />
          ))}
        </span>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{
  product: ProductRef;
  onNavigate: (href: string) => void;
  onFollowup: (q: string) => void;
}> = ({ product, onNavigate, onFollowup }) => {
  const { t } = useI18n();

  let bestFor = t("chatbot.bestFor.default", { fallback: "Excavation, grading & site preparation" });
  let reason = t("chatbot.reason.default", { fallback: "High reliability with professional compact design." });

  if (/KUVUO/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.kuvuo", { fallback: "Digging foundations, footings, and utility trenches" });
    reason = t("chatbot.reason.kuvuo", { fallback: "Features zero-tail-swing maneuverability, proportional hydraulics, and dual-duty excavator capabilities." });
  } else if (/STOMP/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.stomp", { fallback: "Surface grading, landscaping, and bulk material loading" });
    reason = t("chatbot.reason.stomp", { fallback: "Tough, high-torque skid steer designed for continuous site-prep work and fast attachment swaps." });
  } else if (/SKOOP/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.skoop", { fallback: "Loading dirt, stockpiling aggregate, and heavy site hauling" });
    reason = t("chatbot.reason.skoop", { fallback: "High-traction wheel loader featuring robust bucket capacities and simple mechanical durability." });
  } else if (/SCOOPYDIG/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.scoopydig", { fallback: "Tight residential digging, utility service, and trenching" });
    reason = t("chatbot.reason.scoopydig", { fallback: "Agile compact backhoe loader ideal for narrow backyard work and property owners." });
  } else if (/SPIDER/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.spider", { fallback: "All-terrain compact landscaping and utility digging" });
    reason = t("chatbot.reason.spider", { fallback: "Towable, lightweight excavating unit built for minimal ground damage and narrow access sites." });
  } else if (/THUNDERDUMP/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.thunderdump", { fallback: "Hauling rock, concrete, dirt, and heavy materials on site" });
    reason = t("chatbot.reason.thunderdump", { fallback: "High-payload site dumper designed to transport bulk loads safely across uneven terrain." });
  } else if (/STONEKRUSHER/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.stonekrusher", { fallback: "On-site concrete recycling, rock crushing, and aggregates" });
    reason = t("chatbot.reason.stonekrusher", { fallback: "Industrial mobile jaw crusher designed to process demolition debris into reusable fill." });
  } else if (/RIPPER|AUGER/i.test(product.name)) {
    bestFor = t("chatbot.bestFor.attachments", { fallback: "Utility boring, fence posts, and hard soil breaking" });
    reason = t("chatbot.reason.attachments", { fallback: "High-torque auxiliary hydraulic attachment engineered to expand machine capabilities." });
  }
  const detail = PRODUCT_DETAIL[product.href];
  const specsToShow = detail ? detail.specs.filter(s => !/category|sku|gtin|price/i.test(s.label)).slice(0, 3) : [];

  return (
    <div className="border border-white/10 bg-[#1d1e1a] p-4 text-left space-y-3 shadow-[0_4px_12px_rgba(0,0,0,0.35)] rounded-none">
      <div className="flex gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" />
          ) : (
            <div className="h-full w-full bg-[#153d28]/25 flex items-center justify-center text-[#d8c79a] font-bold">K</div>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 flex-wrap">
            <span className="font-clofieBold text-[13.5px] font-bold text-white leading-tight">{product.name}</span>
            <span className="border border-[#d8c79a]/40 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#d8c79a] leading-none">{product.brand}</span>
          </span>
          <span className="mt-1 block font-googleSans text-[10.5px] text-[#d8c79a]/90">{product.categoryLabel}</span>
        </div>
      </div>

      <div className="space-y-1.5 font-googleSans text-[11.5px] leading-relaxed text-white/70 border-t border-white/5 pt-2">
        <div>
          <span className="font-bold text-white/90">{t("chatbot.bestFor")}:</span> {bestFor}
        </div>
        
        {specsToShow.length > 0 && (
          <div className="space-y-0.5 border-t border-white/5 pt-1 text-white/50 text-[11px]">
            <span className="font-bold text-white/75 block">{t("chatbot.keySpecs")}:</span>
            {specsToShow.map((s, i) => (
              <div key={i}>• {s.label}: <span className="text-white/80 font-bold">{s.value}</span></div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <span className="inline-flex items-center text-[9px] font-clofieBold font-bold uppercase tracking-wider px-2 py-0.5 bg-[#d8c79a]/10 text-[#d8c79a] border border-[#d8c79a]/45 select-none">
          {t("chatbot.badge.warranty")}
        </span>
        <span className="inline-flex items-center text-[9px] font-clofieBold font-bold uppercase tracking-wider px-2 py-0.5 bg-[#d8c79a]/10 text-[#d8c79a] border border-[#d8c79a]/45 select-none">
          {t("chatbot.badge.support")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
        <button
          type="button"
          onClick={() => onNavigate(product.href)}
          className="flex items-center justify-center py-2 text-center font-googleSans font-bold text-[10.5px] uppercase tracking-wider bg-[#d8c79a] text-[#153d28] transition hover:bg-white active:bg-[#a99c75] rounded-none"
        >
          {t("chatbot.action.viewProduct")}
        </button>
        <button
          type="button"
          onClick={() => onFollowup(`Compare ${product.name} with similar model`)}
          className="flex items-center justify-center py-2 text-center font-googleSans font-bold text-[10px] uppercase tracking-wider border border-white/20 text-white/80 transition hover:border-[#d8c79a] hover:text-[#d8c79a] active:bg-white/5 rounded-none"
        >
          {t("chatbot.action.compare")}
        </button>
        <button
          type="button"
          onClick={() => onFollowup(`Contact sales for the ${product.name}`)}
          className="flex items-center justify-center py-2 text-center font-googleSans font-bold text-[10px] uppercase tracking-wider border border-white/20 text-white/80 transition hover:border-[#d8c79a] hover:text-[#d8c79a] active:bg-white/5 rounded-none"
        >
          {t("chatbot.action.askSales")}
        </button>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{
  msg: ChatMessage;
  done: boolean;
  onStreamTick: () => void;
  onStreamDone: () => void;
  onNavigate: (href: string) => void;
  onFollowup: (q: string) => void;
}> = ({ msg, done, onStreamTick, onStreamDone, onNavigate, onFollowup }) => {
  const { t } = useI18n();
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | "missing_info" | null>(null);
  const [missingSpecInput, setMissingSpecInput] = useState("");
  const [showMissingForm, setShowMissingForm] = useState(false);

  if (msg.role === "user") {
    return (
      <div className="flex justify-end kz-rise">
        <div className="max-w-[82%] bg-[#d8c79a] px-3.5 py-2.5 font-googleSans text-[13.5px] leading-relaxed text-[#14271c] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          {msg.text}
        </div>
      </div>
    );
  }

  const showExtras = done || msg.instant;

  const visibleLinks = (msg.links ?? []).filter(
    (l) => !(msg.handoff && l.href === "/contact")
  );

  return (
    <div className="flex items-start gap-2.5 kz-rise">
      <Avatar size={30} className="mt-0.5" />
      <div className="min-w-0 max-w-[90%] space-y-2.5">
        <div className="border border-white/10 bg-[#20211d] px-3.5 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
          <StreamingMarkdown text={msg.text} instant={msg.instant} onTick={onStreamTick} onDone={onStreamDone} />
        </div>

        {msg.role === "bot" && showExtras && (
          <div className="flex items-center gap-3 text-[11px] text-white/50 pt-0.5">
            <span>{t("chatbot.feedback.wasHelpful", { fallback: "Was this helpful?" })}</span>
            {!feedback ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeedback("helpful");
                    logUserFeedback(msg.text, msg.text, "helpful", "User marked helpful");
                  }}
                  className="hover:text-[#4ade80] transition underline"
                >
                  {t("chatbot.feedback.helpful", { fallback: "Helpful" })}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback("not_helpful");
                    logUserFeedback(msg.text, msg.text, "not_helpful", "User marked not helpful");
                  }}
                  className="hover:text-red-400 transition underline"
                >
                  {t("chatbot.feedback.notHelpful", { fallback: "Not helpful" })}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback("missing_info");
                    setShowMissingForm(true);
                  }}
                  className="hover:text-amber-400 transition underline"
                >
                  {t("chatbot.feedback.missingInfo", { fallback: "Missing info" })}
                </button>
              </div>
            ) : (
              <span className="text-[#d8c79a] font-medium">{t("chatbot.feedback.thankYou", { fallback: "Thank you for your feedback!" })}</span>
            )}
          </div>
        )}

        {showMissingForm && (
          <div className="bg-[#1f201b] border border-[#d8c79a]/20 p-2.5 space-y-2">
            <span className="text-[11px] text-white/70 block">{t("chatbot.feedback.missingQuestion", { fallback: "What product specification or detail was missing?" })}</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={missingSpecInput}
                onChange={(e) => setMissingSpecInput(e.target.value)}
                placeholder={t("chatbot.feedback.missingPlaceholder", { fallback: "e.g. engine, track width, lift capacity" })}
                className="bg-black/40 border border-white/10 px-2 py-1 text-xs text-white min-w-0 flex-1 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  logUserFeedback(msg.text, msg.text, "missing_info", `Missing: ${missingSpecInput}`);
                  setShowMissingForm(false);
                  setFeedback("missing_info");
                }}
                className="bg-[#d8c79a] text-[#153d28] px-2.5 py-1 text-[11px] font-bold uppercase transition hover:bg-white"
              >
                {t("chatbot.feedback.send", { fallback: "Send" })}
              </button>
            </div>
          </div>
        )}

        {showExtras && msg.products && msg.products.length > 0 && (
          <div className="space-y-3">
            {msg.products.map((p) => (
              <ProductCard key={p.href} product={p} onNavigate={onNavigate} onFollowup={onFollowup} />
            ))}
          </div>
        )}

        {showExtras && msg.handoff && (
          <div className="flex flex-wrap gap-2">
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[#1f5132] px-3 py-1.5 font-googleSans text-[12px] font-bold text-white transition hover:bg-[#256b3f]">WhatsApp</a>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 border border-[#d8c79a]/50 px-3 py-1.5 font-googleSans text-[12px] font-bold text-[#d8c79a] transition hover:bg-[#d8c79a]/10">
              {t("chatbot.action.email", { fallback: "Email" })}
            </a>
            <button type="button" onClick={() => onNavigate("/contact")} className="inline-flex items-center gap-1.5 border border-white/20 px-3 py-1.5 font-googleSans text-[12px] font-bold text-white/85 transition hover:border-white hover:text-white">
              {t("chatbot.action.contactForm", { fallback: "Contact form" })}
            </button>
          </div>
        )}

        {showExtras && visibleLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleLinks.map((l) => (
              <button key={l.href + l.label} type="button" onClick={() => onNavigate(l.href)} className="inline-flex items-center gap-1 border border-white/12 bg-[#1d1e1a] px-3 py-1.5 font-googleSans text-[12px] text-white/85 transition hover:border-[#d8c79a]/50 hover:text-white">
                {l.label}
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="text-[#d8c79a]">
                  <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {showExtras && msg.followups && msg.followups.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-white/8 pt-2.5">
            <p className="mb-0.5 font-googleSans text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              {t("chatbot.suggestedFollowups", { fallback: "Suggested follow-ups" })}
            </p>
            {msg.followups.map((f) => (
              <button key={f} type="button" onClick={() => onFollowup(f)} className="group flex items-center gap-2 py-1 text-left font-googleSans text-[12.5px] text-[#d8c79a]/90 transition hover:text-[#d8c79a]">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="shrink-0 -translate-x-0.5 opacity-50 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{f}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAssistant;
