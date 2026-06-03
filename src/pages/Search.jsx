import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { searchArticles, highlightParts } from "../lib/search.js";
import { displayArticleNumber, displayNumber, ordinalAr } from "../lib/format.js";

export default function Search() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchArticles(query), [query]);
  const active = query.trim().length >= 2;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--text-4xl)] font-black leading-none">
          {t("search_title")}
        </h1>
      </header>

      <div className="relative">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          aria-label={t("search_title")}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-4 text-[var(--text-lg)] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)]"
        />
      </div>

      {!active && (
        <p className="mt-6 text-[var(--text-sm)] text-[var(--color-ink-faint)]">
          {t("search_hint")}
        </p>
      )}

      {active && (
        <p className="mt-6 text-[var(--text-xs)] text-[var(--color-ink-faint)]">
          {displayNumber(results.length, lang)} {t("search_count")}
        </p>
      )}

      <ul className="mt-3 space-y-3">
        {active && results.length === 0 && (
          <li className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-8 text-center text-[var(--text-sm)] text-[var(--color-ink-soft)]">
            {t("search_no_results")}
          </li>
        )}
        {results.map((a) => (
          <li key={a.id}>
            <Link
              to={`/article/${a.id}`}
              className="group block rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-paper-2)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[var(--text-lg)] font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                  {t("article_word")} {displayArticleNumber(a, lang)}
                </span>
                <span className="eyebrow shrink-0">
                  {t("chapter_word")} {ordinalAr(a.chapter.number)} · {a.chapter.title}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-soft)]">
                {highlightParts(a.officialText, query).map((p, i) =>
                  p.hit ? (
                    <mark
                      key={i}
                      className="rounded bg-[var(--color-accent-soft)] px-0.5 text-[var(--color-accent)]"
                    >
                      {p.text}
                    </mark>
                  ) : (
                    <span key={i}>{p.text}</span>
                  )
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
