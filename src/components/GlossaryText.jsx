import { useId, useRef, useState } from "react";
import { glossaryByTerm, glossaryTermsByLength } from "../data/glossary.js";

const BOUNDARY = "\\s،.,:؛()«»\\-–\\[\\]\"'";
const TERM_RE = new RegExp(
  `(^|[${BOUNDARY}])(${glossaryTermsByLength
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?=[${BOUNDARY}]|$)`,
  "g"
);

// يلفّ المصطلحات المعرّفة (المرّة الأولى فقط لكل مصطلح) بتعريف منبثق.
// تطبيق آمن: يطابق المصطلح مستقلاً بحدود واضحة فقط — لا يلمس داخل الكلمات.
export default function GlossaryText({ text, enableTooltips = true }) {
  if (!enableTooltips || !text) return text || null;

  const nodes = [];
  const linked = new Set();
  let last = 0;
  let m;
  TERM_RE.lastIndex = 0;
  while ((m = TERM_RE.exec(text)) !== null) {
    const [, lead, term] = m;
    const start = m.index;
    nodes.push(text.slice(last, start + lead.length)); // النص قبله + حرف الحد
    if (linked.has(term)) {
      nodes.push(term);
    } else {
      linked.add(term);
      const entry = glossaryByTerm.get(term);
      nodes.push(
        <GlossaryTerm key={`${term}-${start}`} label={term} entry={entry} />
      );
    }
    last = start + m[0].length;
  }
  nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function GlossaryTerm({ label, entry }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const tipId = useId();

  const show = (delay = 0) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span className="relative inline">
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => show(450)}
        onMouseLeave={hide}
        onFocus={() => show(0)}
        onBlur={hide}
        onClick={() => setOpen((v) => !v)}
        className="cursor-help border-0 bg-transparent p-0 font-[inherit] text-[inherit] text-[var(--color-accent)] underline decoration-dotted decoration-from-font underline-offset-4"
      >
        {label}
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="reveal absolute bottom-full z-40 mb-2 block w-64 max-w-[80vw] rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-3 text-start text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-soft)] shadow-lg"
          style={{ insetInlineStart: 0 }}
        >
          <span className="font-display mb-1 block text-[var(--text-xs)] font-bold text-[var(--color-accent)]">
            {entry.term} · تعريف نظامي
          </span>
          {entry.short}
        </span>
      )}
    </span>
  );
}
