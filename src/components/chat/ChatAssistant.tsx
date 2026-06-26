import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { listPublicPosts } from "../../lib/blogStore";
import { kb, CONTACT, type ProductRef } from "./knowledge";
import {
  getReply,
  emptyMemory,
  WELCOME,
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

const welcomeMessage = (): ChatMessage => ({ id: "welcome", role: "bot", text: WELCOME, instant: true });

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
  h2: (p: any) => <h2 className="mb-2 mt-1 font-clofieBold text-[15px] font-bold text-white" {...p} />,
  h3: (p: any) => <h3 className="mb-1.5 mt-3.5 font-clofieBold text-[13.5px] font-bold text-[#d8c79a]" {...p} />,
  p: (p: any) => <p className="mb-2.5 leading-[1.65] text-white/85 last:mb-0" {...p} />,
  ul: (p: any) => <ul className="mb-2.5 list-disc space-y-1.5 pl-4 marker:text-[#d8c79a]" {...p} />,
  ol: (p: any) => <ol className="mb-2.5 list-decimal space-y-1.5 pl-4 marker:text-[#d8c79a]/80" {...p} />,
  li: (p: any) => <li className="leading-[1.55] text-white/85" {...p} />,
  strong: (p: any) => <strong className="font-bold text-white" {...p} />,
  em: (p: any) => <em className="text-[12px] not-italic text-white/45" {...p} />,
  a: (p: any) => <a className="text-[#d8c79a] underline underline-offset-2 hover:text-white" {...p} />,
  hr: () => <hr className="my-3 border-white/10" />,
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

const Markdown: React.FC<{ text: string }> = ({ text }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
    {text}
  </ReactMarkdown>
);

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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="14" width="9" height="3.5" rx="1" /><circle cx="5" cy="19.5" r="1.6" /><circle cx="9" cy="19.5" r="1.6" /><path d="M5 14v-3h3.5v3M8.5 11.5l4-2 3 3.5" /><path d="M14.5 13l3 .5 1-2" />
    </svg>
  ),
  compare: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7H3l2-2M8 7l-2 2M16 17h5l-2-2M16 17l2 2" /><path d="M3 7h13M21 17H8" />
    </svg>
  ),
  wrench: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8a1.8 1.8 0 0 0 2.5 2.5l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.3 2.3-2-2z" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

const SUGGESTION_CARDS = [
  { glyph: CardGlyphs.machine, title: "Find the right machine", sub: "Tell me your job & site", q: "Which machine is right for my job?" },
  { glyph: CardGlyphs.compare, title: "Compare machines", sub: "Specs, pros & cons", q: "Compare a mini excavator and a skid steer" },
  { glyph: CardGlyphs.wrench, title: "Attachments & fitment", sub: "What fits your machine", q: "What attachments fit a mini excavator?" },
  { glyph: CardGlyphs.shield, title: "Warranty & support", sub: "Coverage, shipping, parts", q: "What does the warranty cover?" },
];

/* ─────────────────────────── Main widget ───────────────────────────── */

export const ChatAssistant: React.FC = () => {
  const navigate = useNavigate();
  const initial = loadState();
  const [open, setOpen] = useState(initial?.open ?? false);
  const [messages, setMessages] = useState<ChatMessage[]>(
    initial?.messages?.length ? initial.messages : [welcomeMessage()]
  );
  const [input, setInput] = useState("");
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

    const { answer, memory } = getReply(text, memoryRef.current);
    memoryRef.current = memory;

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
    setMessages([welcomeMessage()]);
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
        aria-label={open ? "Close assistant" : "Open Konstructz assistant"}
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
        aria-label="Konstructz assistant"
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
            <p className="font-clofieBold text-[15px] font-bold leading-none text-white">Konstructz Assistant</p>
            <p className="mt-1.5 flex items-center gap-1.5 font-googleSans text-[11px] font-medium tracking-wide text-[#d8c79a]">
              <SparkIcon /> Powered by Konstructz AI
            </p>
          </div>
          <button type="button" onClick={resetChat} aria-label="Start new chat" title="New chat" className="flex h-8 w-8 items-center justify-center text-white/65 transition hover:bg-white/10 hover:text-white">
            <NewChatIcon />
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="flex h-8 w-8 items-center justify-center text-white/65 transition hover:bg-white/10 hover:text-white">
            <CloseIcon />
          </button>
        </header>

        {/* Body */}
        <div ref={scrollRef} className="kz-chat-scroll flex-1 overflow-y-auto bg-[#161613] px-4 py-4 font-googleSans text-[13.5px] text-white/90">
          {showHero ? (
            <WelcomeHero onPick={send} />
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
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
          <div className="flex items-center gap-2 border border-white/12 bg-[#161613] px-3 py-1.5 transition focus-within:border-[#d8c79a]/50">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about machines, attachments, support…"
              aria-label="Message"
              className="min-w-0 flex-1 bg-transparent py-1.5 font-googleSans text-[14px] text-white placeholder:text-white/35 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || !!phase}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#d8c79a] text-[#153d28] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </div>
          <p className="mt-2 text-center font-googleSans text-[10px] text-white/30">
            Konstructz AI can make mistakes — confirm important details with our team.
          </p>
        </form>
      </div>
    </>
  );
};

/* ─────────────────────────── Welcome hero ──────────────────────────── */

const WelcomeHero: React.FC<{ onPick: (q: string) => void }> = ({ onPick }) => (
  <div className="flex flex-col items-center px-1 pb-2 pt-3 text-center">
    <div className="kz-rise">
      <Avatar size={64} />
    </div>
    <h2 className="kz-rise mt-4 font-clofieBold text-[22px] font-bold leading-tight text-white" style={{ animationDelay: "60ms" }}>
      Konstructz Assistant
    </h2>
    <p className="kz-rise mt-2 max-w-[300px] font-googleSans text-[13px] leading-relaxed text-white/60" style={{ animationDelay: "120ms" }}>
      Your machinery expert. I help you choose the right machine, compare models, check attachments and fitment, and answer warranty, shipping, financing & support questions.
    </p>

    <div className="mt-6 grid w-full grid-cols-2 gap-2.5 text-left">
      {SUGGESTION_CARDS.map((c, i) => (
        <button
          key={c.title}
          type="button"
          onClick={() => onPick(c.q)}
          className="kz-rise group flex flex-col gap-2 border border-white/10 bg-[#1d1e1a] p-3 transition hover:border-[#d8c79a]/50 hover:bg-[#23241f]"
          style={{ animationDelay: `${180 + i * 70}ms` }}
        >
          <span className="flex h-9 w-9 items-center justify-center border border-[#d8c79a]/30 bg-[#d8c79a]/10 text-[#d8c79a] transition group-hover:bg-[#d8c79a]/20">
            {c.glyph}
          </span>
          <span className="font-clofieBold text-[12.5px] font-bold leading-tight text-white">{c.title}</span>
          <span className="font-googleSans text-[10.5px] leading-snug text-white/45">{c.sub}</span>
        </button>
      ))}
    </div>

    <p className="kz-rise mt-5 font-googleSans text-[11px] text-white/35" style={{ animationDelay: "480ms" }}>
      …or just type your question below.
    </p>
  </div>
);

/* ─────────────────────────── Sub-components ────────────────────────── */

const StatusBubble: React.FC<{ phase: "analyzing" | "thinking" }> = ({ phase }) => (
  <div className="flex items-end gap-2.5 kz-rise">
    <Avatar size={30} />
    <div className="flex items-center gap-2 border border-white/10 bg-[#20211d] px-3.5 py-3">
      <span className="font-googleSans text-[12px] text-white/55">
        {phase === "analyzing" ? "Analyzing your question" : "Thinking"}
      </span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#d8c79a] kz-dot" style={{ animationDelay: `${i * 160}ms` }} />
        ))}
      </span>
    </div>
  </div>
);

const MessageBubble: React.FC<{
  msg: ChatMessage;
  done: boolean;
  onStreamTick: () => void;
  onStreamDone: () => void;
  onNavigate: (href: string) => void;
  onFollowup: (q: string) => void;
}> = ({ msg, done, onStreamTick, onStreamDone, onNavigate, onFollowup }) => {
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

  // When the handoff row is shown it already offers a "Contact form" button
  // (→ /contact), so drop any duplicate /contact link from the links row.
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

        {showExtras && msg.products && msg.products.length > 0 && (
          <div className="space-y-2">
            {msg.products.map((p) => (
              <button
                key={p.href}
                type="button"
                onClick={() => onNavigate(p.href)}
                className="group flex w-full items-center gap-3 border border-white/10 bg-[#1d1e1a] p-2 text-left transition hover:border-[#d8c79a]/50 hover:bg-[#23241f]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white">
                  {p.image ? <img src={p.image} alt="" aria-hidden="true" className="h-full w-full object-contain p-1" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-clofieBold text-[13px] font-bold text-white">{p.name}</span>
                    <span className="shrink-0 border border-[#d8c79a]/40 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#d8c79a]">{p.brand}</span>
                  </span>
                  <span className="mt-0.5 block truncate font-googleSans text-[11px] text-white/55">
                    {p.categoryLabel}
                    {p.spec ? ` • ${p.spec}` : ""}
                  </span>
                </span>
                <svg width="7" height="11" viewBox="0 0 6 10" fill="none" className="shrink-0 text-[#d8c79a] transition group-hover:translate-x-0.5">
                  <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {showExtras && msg.handoff && (
          <div className="flex flex-wrap gap-2">
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[#1f5132] px-3 py-1.5 font-googleSans text-[12px] font-bold text-white transition hover:bg-[#256b3f]">WhatsApp</a>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 border border-[#d8c79a]/50 px-3 py-1.5 font-googleSans text-[12px] font-bold text-[#d8c79a] transition hover:bg-[#d8c79a]/10">Email</a>
            <button type="button" onClick={() => onNavigate("/contact")} className="inline-flex items-center gap-1.5 border border-white/20 px-3 py-1.5 font-googleSans text-[12px] font-bold text-white/85 transition hover:border-white hover:text-white">Contact form</button>
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
            <p className="mb-0.5 font-googleSans text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Suggested follow-ups</p>
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
