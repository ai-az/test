import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { chapters } from "../data/chapters.js";
import { getArticle } from "../data/articles.js";
import { chapterSlots } from "../data/articleIndex.js";
import { displayNumber } from "../lib/format.js";

export default function IndexMap() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState(0);
  const shown = filter ? chapters.filter((c) => c.number === filter) : chapters;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-6 border-b border-[var(--color-rule)] pb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--text-4xl)] font-black leading-none">
          {t("index_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-base)] text-[var(--color-ink-soft)]">
          {t("index_lead")}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-[var(--text-xs)] text-[var(--color-ink-faint)]">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)]" />
            {t("index_available")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded border border-dashed border-[var(--color-rule)]" />
            {t("index_pending")}
          </span>
        </div>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={filter === 0} onClick={() => setFilter(0)}>
          {t("filter_all")}
        </Chip>
        {chapters.map((c) => (
          <Chip key={c.number} active={filter === c.number} onClick={() => setFilter(c.number)}>
            {displayNumber(c.number, lang)}
          </Chip>
        ))}
      </div>

      <div className="space-y-8">
        {shown.map((c) => {
          const slots = chapterSlots(c.number);
          return (
            <section key={c.number}>
              <h2 className="flex items-baseline gap-3 border-b border-[var(--color-rule)] pb-2">
                <span className="font-display text-[var(--text-2xl)] font-black text-[var(--color-accent)]">
                  {displayNumber(c.number, lang)}
                </span>
                <Link
                  to={`/chapter/${c.number}`}
                  className="text-[var(--text-lg)] text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                >
                  {c.title}
                </Link>
              </h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {slots.map((s) => {
                  const id = s.mukarrar ? `${s.n}م` : String(s.n);
                  const entered = getArticle(id);
                  return (
                    <Link
                      key={id}
                      to={`/article/${id}`}
                      title={entered ? entered.officialText.slice(0, 80) : t("article_pending_label")}
                      className={`font-display inline-flex items-center gap-1 rounded-[var(--radius-sm)] border px-2.5 py-1 text-[var(--text-sm)] transition-colors ${
                        entered
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-paper)]"
                          : "border-dashed border-[var(--color-rule)] text-[var(--color-ink-faint)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      {displayNumber(s.n, lang)}
                      {s.mukarrar ? " م" : ""}
                      {entered?.isAmended && (
                        <span className="size-1.5 rounded-full bg-[var(--color-amend)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-display rounded-full border px-3.5 py-1.5 text-[var(--text-sm)] transition-colors ${
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
          : "border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}
