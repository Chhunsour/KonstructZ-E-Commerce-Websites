import React, { useCallback, useEffect, useRef } from "react";

/**
 * Dependency-free WYSIWYG editor used by the post editor.
 *
 * Edits a contentEditable surface and emits clean HTML through `onChange`.
 * The toolbar covers everything the blog needs: headings, bold/italic/
 * underline, lists, quotes, dividers, links, image URLs, and CTA buttons.
 * Pasted content is forced to plain text so the stored markup stays tidy;
 * the output is allowlist-sanitized again at save/render time.
 */

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type Cmd = { icon: React.ReactNode; title: string; run: () => void };

const Divider = () => <span className="w-px self-stretch bg-theme-border/30 mx-1" />;

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your story…",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  /* Keep the DOM in sync when `value` changes from the outside (e.g. loading
     an existing post) without clobbering the caret while the user types. */
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value && document.activeElement !== el) {
      el.innerHTML = value;
    }
  }, [value]);

  const emit = useCallback(() => {
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const exec = (command: string, arg?: string) => {
    restoreSelection();
    document.execCommand(command, false, arg);
    emit();
  };

  const format = (tag: string) => exec("formatBlock", `<${tag}>`);

  const insertHtml = (html: string) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const addLink = () => {
    const sel = window.getSelection();
    const hasSelection = sel && !sel.isCollapsed && ref.current?.contains(sel.anchorNode);
    const url = window.prompt("Link URL (https://…, mailto:, tel:, or /path)");
    if (!url) return;
    const safe = url.trim();
    if (hasSelection) {
      exec("createLink", safe);
    } else {
      const text = window.prompt("Link text", safe) || safe;
      insertHtml(`<a href="${escapeAttr(safe)}">${escapeHtml(text)}</a>&nbsp;`);
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL (https://…)");
    if (!url) return;
    const alt = window.prompt("Alt text (describe the image)", "") || "";
    insertHtml(
      `<img src="${escapeAttr(url.trim())}" alt="${escapeAttr(alt)}" />`
    );
  };

  const addButton = () => {
    const label = window.prompt("Button label", "Get a quote");
    if (!label) return;
    const url = window.prompt("Button link (https://… or /contact)");
    if (!url) return;
    insertHtml(
      `<p><a class="blog-cta" href="${escapeAttr(url.trim())}">${escapeHtml(
        label
      )}</a></p><p><br/></p>`
    );
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emit();
  };

  const groups: Cmd[][] = [
    [
      { icon: <strong>B</strong>, title: "Bold (Ctrl+B)", run: () => exec("bold") },
      { icon: <em>I</em>, title: "Italic (Ctrl+I)", run: () => exec("italic") },
      { icon: <u>U</u>, title: "Underline (Ctrl+U)", run: () => exec("underline") },
      { icon: <s>S</s>, title: "Strikethrough", run: () => exec("strikeThrough") },
    ],
    [
      { icon: <span className="text-[15px] font-bold">H2</span>, title: "Heading", run: () => format("h2") },
      { icon: <span className="text-[13px] font-bold">H3</span>, title: "Subheading", run: () => format("h3") },
      { icon: <span className="text-xs">¶</span>, title: "Paragraph", run: () => format("p") },
      { icon: <span className="text-base leading-none">❝</span>, title: "Quote", run: () => format("blockquote") },
    ],
    [
      { icon: <span className="text-base leading-none">•≡</span>, title: "Bulleted list", run: () => exec("insertUnorderedList") },
      { icon: <span className="text-base leading-none">1≡</span>, title: "Numbered list", run: () => exec("insertOrderedList") },
    ],
    [
      { icon: <span className="underline">🔗</span>, title: "Insert link", run: addLink },
      { icon: <span>🖼</span>, title: "Insert image URL", run: addImage },
      { icon: <span className="text-[11px] font-bold border border-current px-1 rounded-sm">CTA</span>, title: "Insert button / CTA", run: addButton },
    ],
    [
      { icon: <span className="text-base leading-none">―</span>, title: "Divider", run: () => insertHtml("<hr/>") },
      { icon: <span className="text-base leading-none">↵</span>, title: "Add spacing", run: () => insertHtml("<p><br/></p>") },
    ],
  ];

  return (
    <div className="border border-theme-border/20 rounded overflow-hidden bg-theme-card focus-within:border-theme-accent transition-colors">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-theme-border/20 bg-theme-bg/40 sticky top-16 z-10"
        onMouseDown={(e) => {
          // Keep the editor selection intact when a toolbar button is pressed.
          e.preventDefault();
          saveSelection();
        }}
      >
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <Divider />}
            {group.map((cmd) => (
              <button
                key={cmd.title}
                type="button"
                title={cmd.title}
                aria-label={cmd.title}
                onClick={cmd.run}
                className="min-w-[32px] h-8 px-2 grid place-items-center rounded text-theme-text hover:bg-theme-accent/15 hover:text-theme-accent transition-colors text-sm"
              >
                {cmd.icon}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Editing surface */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Post content"
        spellCheck
        onInput={emit}
        onBlur={() => {
          saveSelection();
          emit();
        }}
        onPaste={onPaste}
        data-placeholder={placeholder}
        className="rte-surface min-h-[420px] px-5 py-4 font-glonimove text-theme-text text-base leading-relaxed focus:outline-none
          [&_h1]:font-clofieBold [&_h1]:text-3xl [&_h1]:text-theme-heading [&_h1]:my-3
          [&_h2]:font-clofieBold [&_h2]:text-2xl [&_h2]:text-theme-heading [&_h2]:my-3
          [&_h3]:font-clofieBold [&_h3]:text-xl [&_h3]:text-theme-heading [&_h3]:my-2
          [&_p]:my-2 [&_a]:text-theme-accent [&_a]:underline
          [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-theme-accent/60 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-theme-muted [&_blockquote]:my-3
          [&_hr]:my-6 [&_hr]:border-theme-border/40
          [&_img]:rounded [&_img]:my-3 [&_img]:max-w-full [&_img]:h-auto
          [&_.blog-cta]:inline-flex [&_.blog-cta]:items-center [&_.blog-cta]:bg-brand-green [&_.blog-cta]:!text-white [&_.blog-cta]:!no-underline [&_.blog-cta]:px-5 [&_.blog-cta]:py-2.5 [&_.blog-cta]:font-semibold"
      />
    </div>
  );
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s: string) => escapeHtml(s).replace(/"/g, "&quot;");

export default RichTextEditor;
