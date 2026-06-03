import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { chapters } from "../data/chapters.js";
import { articlesInChapter } from "../data/articles.js";
import { chapterSlots, TOTAL_ARTICLE_SLOTS } from "../data/articleIndex.js";
import { getEnteredCount } from "../data/articles.js";
import { displayNumber } from "../lib/format.js";

export default function Coverage() {
  const { t, lang } = useI18n();
  const enteredCount = getEnteredCount();
  const pct = Math.round((enteredCount / TOTAL_ARTICLE_SLOTS) * 100);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-8 border-b border-[var(--c-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--fz-4xl)] font-black leading-none">
          {t("coverage_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--fz-base)] text-[var(--c-ink-soft)]">
          {t("coverage_lead")}
        </p>

        <div className="mt-6 flex items-end gap-4">
          <span className="font-display text-[var(--fz-display-xl)] font-black leading-none text-[var(--c-accent)]">
            {displayNumber(pct, lang)}٪
          </span>
          <span className="pb-2 text-[var(--fz-sm)] text-[var(--c-ink-faint)]">
            {displayNumber(enteredCount, lang)} {t("coverage_of")}{" "}
            {displayNumber(TOTAL_ARTICLE_SLOTS, lang)} {t("stat_articles")}
          </span>
        </div>
        <Bar value={enteredCount} total={TOTAL_ARTICLE_SLOTS} />
      </header>

      <ul className="space-y-3">
        {chapters.map((c) => {
          const slots = chapterSlots(c.number);
          const entered = articlesInChapter(c.number);
          const enteredIdsSet = new Set(entered.map((a) => a.id));
          const pending = slots.filter(
            (s) => !enteredIdsSet.has(s.mukarrar ? `${s.n}م` : String(s.n))
          );
          return (
            <li
              key={c.number}
              className="rounded-[var(--rad-md)] border border-[var(--c-rule)] p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  to={`/chapter/${c.number}`}
                  className="font-display text-[var(--fz-base)] text-[var(--c-ink)] hover:text-[var(--c-accent)]"
                >
                  <span className="text-[var(--c-ink-faint)]">
                    {displayNumber(c.number, lang)} ·{" "}
                  </span>
                  {c.title}
                </Link>
                <span className="shrink-0 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
                  {displayNumber(entered.length, lang)}/{displayNumber(slots.length, lang)}
                </span>
              </div>
              <Bar value={entered.length} total={slots.length} />
              {pending.length > 0 && entered.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-[var(--fz-xs)] text-[var(--c-ink-faint)] hover:text-[var(--c-accent)]">
                    {t("coverage_pending")} ({displayNumber(pending.length, lang)})
                  </summary>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pending.map((s) => {
                      const id = s.mukarrar ? `${s.n}م` : String(s.n);
                      return (
                        <Link
                          key={id}
                          to={`/article/${id}`}
                          className="font-display rounded border border-dashed border-[var(--c-rule)] px-2 py-0.5 text-[var(--fz-xs)] text-[var(--c-ink-faint)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]"
                        >
                          {displayNumber(s.n, lang)}
                          {s.mukarrar ? " م" : ""}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Bar({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--c-paper-3)]">
      <div
        className="h-full rounded-full bg-[var(--c-accent)] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
