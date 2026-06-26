import React, { useEffect, useRef, useState } from "react";

interface ShareMenuProps {
  /** URL to share. Defaults to the current page. */
  url?: string;
  /** Title/text used by networks that accept it. */
  title?: string;
  /** Class for the trigger button so it matches the surrounding theme. */
  className?: string;
}

type ShareTarget = {
  key: string;
  label: string;
  /** Build the share URL, or return null to handle specially (copy / native). */
  href?: (url: string, title: string) => string;
  icon: React.ReactNode;
};

const TARGETS: ShareTarget[] = [
  {
    key: "facebook",
    label: "Facebook",
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    icon: (
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    ),
  },
  {
    key: "x",
    label: "X",
    href: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    icon: <path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.8l-5.3-7-6.1 7H2l8-9.2L1 2h7l4.8 6.4L18.9 2Zm-2.4 18h1.9L7.6 4H5.6l10.9 16Z" />,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.6-.1 1Z" />
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    icon: (
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.3 18.3H5.7v-8h2.6v8ZM7 9.1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11.3 9.2h-2.6v-3.9c0-1 0-2.2-1.4-2.2-1.4 0-1.6 1-1.6 2.1v4h-2.6v-8h2.5v1.1h.1c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.1 1.7 3.1 4v4.3Z" />
    ),
  },
  {
    key: "email",
    label: "Email",
    href: (u, t) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`,
    icon: (
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4 8 5 8-5V6l-8 5-8-5v2Z" />
    ),
  },
];

const InstagramIcon = (
  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.9.3 2.3.4.6.2 1 .5 1.4 1 .5.4.7.8 1 1.4.1.4.3 1.1.4 2.3 0 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.9-.4 2.3a3.6 3.6 0 0 1-1 1.4c-.4.5-.8.7-1.4 1-.4.1-1.1.3-2.3.4-1.2 0-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.9-.3-2.3-.4a3.6 3.6 0 0 1-1.4-1 3.6 3.6 0 0 1-1-1.4c-.1-.4-.3-1.1-.4-2.3 0-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c0-1.2.3-1.9.4-2.3.2-.6.5-1 1-1.4.4-.5.8-.7 1.4-1 .4-.1 1.1-.3 2.3-.4 1.2-.1 1.6-.1 4.8-.1Zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Zm0 10.5a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2Zm6.5-10.8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
);
const CopyIcon = (
  <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
);

export const ShareMenu: React.FC<ShareMenuProps> = ({ url, title = "", className = "" }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openWindow = (href: string) => {
    if (href.startsWith("mailto:")) window.location.href = href;
    else window.open(href, "_blank", "noopener,noreferrer,width=620,height=560");
    setOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Instagram has no web-share link target; use the native share sheet on
  // mobile (which includes Instagram), otherwise copy the link to paste.
  const shareInstagram = async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title, url: shareUrl });
        setOpen(false);
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copyLink();
  };

  const Item: React.FC<{ onClick: () => void; label: string; icon: React.ReactNode }> = ({
    onClick,
    label,
    icon,
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3 py-2 text-left font-googleSans text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 text-[#d8c79a]">
        {icon}
      </svg>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={className}
      >
        <span className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          Share
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-2 w-56 border border-white/12 bg-[#1c1c1c] py-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
        >
          {TARGETS.map((tgt) => (
            <Item
              key={tgt.key}
              label={tgt.label}
              icon={tgt.icon}
              onClick={() => openWindow(tgt.href!(shareUrl, title))}
            />
          ))}
          <Item label="Instagram" icon={InstagramIcon} onClick={shareInstagram} />
          <div className="my-1 border-t border-white/10" />
          <Item label={copied ? "Link copied!" : "Copy link"} icon={CopyIcon} onClick={copyLink} />
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
